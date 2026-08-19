// server/api/support/chat.post.ts
import { createError, defineEventHandler, getRequestIP, readBody } from 'h3';
import { prisma } from '../../utils/prisma';
import { generateSupportAiResponse } from '../../utils/support-ai';

// ✅ Simple in-memory rate limiter (production e Redis use korun)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute

// ✅ Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Basic XSS protection
    .trim()
    .slice(0, 2000); // Enforce max length
};

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const userIP = getRequestIP(event, { xForwardedFor: true }) || 'unknown';

  const message = sanitizeInput(String(body?.message ?? ''));
  const conversationId = body?.conversationId ? String(body.conversationId) : null;

  // ---------------------------------------------------------
  // Rate Limiting
  // ---------------------------------------------------------

  const now = Date.now();
  const rateLimit = rateLimitMap.get(userIP);

  if (rateLimit) {
    if (now < rateLimit.resetTime) {
      if (rateLimit.count >= MAX_REQUESTS_PER_WINDOW) {
        throw createError({
          statusCode: 429,
          statusMessage: 'Too many requests. Please wait a minute before sending another message.',
        });
      }
      rateLimit.count++;
    } else {
      rateLimitMap.set(userIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }
  } else {
    rateLimitMap.set(userIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }

  // ---------------------------------------------------------
  // Input Validation
  // ---------------------------------------------------------

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Support message is required.',
    });
  }

  if (message.length < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message is too short. Please provide more details.',
    });
  }

  try {
    // ---------------------------------------------------------
    // Load or create conversation
    // ---------------------------------------------------------

    let conversationIdValue: string;

    if (conversationId) {
      const conversation = await prisma.supportConversation.findUnique({
        where: { id: conversationId },
        select: { id: true, status: true },
      });

      if (!conversation) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Support conversation not found.',
        });
      }

      // ✅ Closed conversation e message allow korben na
      if (conversation.status === 'CLOSED') {
        throw createError({
          statusCode: 400,
          statusMessage: 'This conversation is closed. Please start a new one.',
        });
      }

      conversationIdValue = conversation.id;
    } else {
      // ✅ নতুন conversation তৈরি with metadata
      const conversation = await prisma.supportConversation.create({
        data: {
          status: 'OPEN',
          priority: 'NORMAL',
          // Optional: user email, IP, user agent store korun
          // userEmail: body?.email || null,
          // userIp: userIP,
          // userAgent: getRequestHeader(event, 'user-agent') || null,
        },
        select: { id: true },
      });

      conversationIdValue = conversation.id;
    }

    // ---------------------------------------------------------
    // Save USER message
    // ---------------------------------------------------------

    await prisma.supportMessage.create({
      data: {
        conversationId: conversationIdValue,
        role: 'USER',
        content: message,
      },
    });

    // ---------------------------------------------------------
    // Load conversation history
    // ---------------------------------------------------------

    const history = await prisma.supportMessage.findMany({
      where: { conversationId: conversationIdValue },
      select: { role: true, content: true },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // ---------------------------------------------------------
    // Generate AI response
    // ---------------------------------------------------------

    let answer: string;
    let aiFailed = false;

    try {
      answer = await generateSupportAiResponse(
        history.map(m => ({
          role: m.role as 'USER' | 'AI' | 'ADMIN',
          content: m.content,
        })),
        message
      );
    } catch (aiError: any) {
      aiFailed = true;
      console.error('[Support AI Generation Error]:', {
        conversationId: conversationIdValue,
        message: message.slice(0, 100),
        error: aiError?.message,
      });

      // ✅ Fallback message
      answer =
        "I'm sorry, I'm having trouble processing your request right now. A support agent will assist you shortly. Is there anything else I can help you with in the meantime?";

      // ✅ Optional: Admin notification (Resend/Slack/etc.)
      // await notifyAdminAboutAIFailure({
      //   conversationId: conversationIdValue,
      //   userMessage: message,
      //   error: aiError?.message,
      // });
    }

    // ---------------------------------------------------------
    // Save AI message
    // ---------------------------------------------------------

    await prisma.supportMessage.create({
      data: {
        conversationId: conversationIdValue,
        role: 'AI',
        content: answer,
      },
    });

    // ---------------------------------------------------------
    // Return
    // ---------------------------------------------------------

    return {
      conversationId: conversationIdValue,
      message: answer,
      aiFailed, // ✅ Frontend ke janaben AI fail koreche (optional warning dekhate)
    };
  } catch (error: any) {
    console.error('[Support Chat API Error]:', {
      conversationId,
      userIP,
      message: message.slice(0, 100),
      status: error?.statusCode,
      errorMessage: error?.statusMessage || error?.message,
    });

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process support message. Please try again.',
    });
  }
});
