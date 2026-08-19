// server/api/support/chat.post.ts

import { createError, defineEventHandler, getRequestIP, readBody } from 'h3';

import { prisma } from '../../utils/prisma';
import { generateSupportAiResponse } from '../../utils/support-ai';

/* ================================================================
   Rate Limiter
================================================================ */

const rateLimitMap = new Map<
  string,
  {
    count: number;
    resetTime: number;
  }
>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

/*
 * Cleanup expired entries periodically.
 *
 * This is useful for long-running Node servers.
 * On serverless platforms each instance has its own map,
 * so this should NOT be considered a complete production
 * rate-limiting solution.
 */
function cleanupRateLimits() {
  const now = Date.now();

  for (const [key, value] of rateLimitMap.entries()) {
    if (now >= value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

/* ================================================================
   Input Sanitization
================================================================ */

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim().slice(0, 2000);
}

/* ================================================================
   Main API
================================================================ */

export default defineEventHandler(async event => {
  const userIP =
    getRequestIP(event, {
      xForwardedFor: true,
    }) || 'unknown';

  /* --------------------------------------------------------------
     Read body safely
  -------------------------------------------------------------- */

  const body = await readBody(event);

  const message = sanitizeInput(String(body?.message ?? ''));

  const conversationId = body?.conversationId ? String(body.conversationId).trim() : null;

  /* --------------------------------------------------------------
     Rate Limit
  -------------------------------------------------------------- */

  cleanupRateLimits();

  const now = Date.now();

  const currentLimit = rateLimitMap.get(userIP);

  if (currentLimit && now < currentLimit.resetTime) {
    if (currentLimit.count >= MAX_REQUESTS_PER_WINDOW) {
      throw createError({
        statusCode: 429,

        statusMessage: 'Too many requests. Please wait a minute before sending another message.',
      });
    }

    currentLimit.count += 1;
  } else {
    rateLimitMap.set(userIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  }

  /* --------------------------------------------------------------
     Input Validation
  -------------------------------------------------------------- */

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
    /* ============================================================
       Conversation
    ============================================================ */

    let conversationIdValue: string;

    if (conversationId) {
      /* ----------------------------------------------------------
         Existing conversation
      ---------------------------------------------------------- */

      const conversation = await prisma.supportConversation.findUnique({
        where: {
          id: conversationId,
        },

        select: {
          id: true,
          status: true,
        },
      });

      if (!conversation) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Support conversation not found.',
        });
      }

      /* ----------------------------------------------------------
         Closed conversation protection
      ---------------------------------------------------------- */

      if (conversation.status === 'CLOSED') {
        throw createError({
          statusCode: 400,
          statusMessage: 'This conversation is closed. Please start a new one.',
        });
      }

      conversationIdValue = conversation.id;
    } else {
      /* ----------------------------------------------------------
         Create new conversation
      ---------------------------------------------------------- */

      const conversation = await prisma.supportConversation.create({
        data: {
          status: 'OPEN',
          priority: 'NORMAL',
        },

        select: {
          id: true,
        },
      });

      conversationIdValue = conversation.id;
    }

    /* ============================================================
       Save User Message
    ============================================================ */

    await prisma.supportMessage.create({
      data: {
        conversationId: conversationIdValue,

        role: 'USER',

        content: message,
      },
    });

    /* ============================================================
       Load Conversation History
    ============================================================ */

    const history = await prisma.supportMessage.findMany({
      where: {
        conversationId: conversationIdValue,
      },

      select: {
        role: true,
        content: true,
      },

      orderBy: {
        createdAt: 'asc',
      },

      take: 20,
    });

    /*
     * IMPORTANT:
     *
     * The current USER message is already included
     * in `history` because we saved it above.
     *
     * Therefore we do NOT need to pass `message`
     * separately as a second copy.
     */

    const aiHistory = history.map(item => ({
      role: item.role as 'USER' | 'AI' | 'ADMIN',

      content: item.content,
    }));

    /* ============================================================
       Generate AI Response
    ============================================================ */

    let answer: string;
    let aiFailed = false;

    try {
      /*
       * Pass the latest user message separately,
       * but remove it from history to avoid duplication.
       *
       * Example:
       *
       * history:
       *   USER: hello
       *   AI: hello!
       *   USER: what is the price?
       *
       * userMessage:
       *   what is the price?
       *
       * AI receives the current question only once.
       */

      const previousHistory = aiHistory.slice(0, -1);

      answer = await generateSupportAiResponse(previousHistory, message, event);

      answer = String(answer || '').trim();

      if (!answer) {
        throw new Error('AI returned an empty response.');
      }
    } catch (aiError: any) {
      aiFailed = true;

      console.error('[Support AI Generation Error]:', {
        conversationId: conversationIdValue,

        message: message.slice(0, 100),

        error: aiError?.message || String(aiError),
      });

      answer =
        "I'm sorry, I'm having trouble processing your request right now. A support agent will assist you shortly. Is there anything else I can help you with in the meantime?";
    }

    /* ============================================================
       Save AI Message
    ============================================================ */

    await prisma.supportMessage.create({
      data: {
        conversationId: conversationIdValue,

        role: 'AI',

        content: answer,
      },
    });

    /* ============================================================
       Return Response
    ============================================================ */

    return {
      success: true,

      conversationId: conversationIdValue,

      message: answer,

      aiFailed,
    };
  } catch (error: any) {
    /* ============================================================
       Error Handling
    ============================================================ */

    console.error('[Support Chat API Error]:', {
      conversationId,

      userIP,

      message: message.slice(0, 100),

      status: error?.statusCode,

      errorMessage: error?.statusMessage || error?.message,
    });

    /* ------------------------------------------------------------
       Preserve known H3 errors
    ------------------------------------------------------------ */

    if (error?.statusCode) {
      throw error;
    }

    /* ------------------------------------------------------------
       Generic server error
    ------------------------------------------------------------ */

    throw createError({
      statusCode: 500,

      statusMessage: 'Failed to process support message. Please try again.',
    });
  }
});
