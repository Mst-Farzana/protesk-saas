// server/api/ai/recommendations.post.ts
import { createError, defineEventHandler, readBody } from 'h3';
import { getAiProductRecommendations } from '../../utils/ai';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const query = String(body?.query ?? '').trim();

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A shopping query is required.',
    });
  }

  // ✅ Query length validation (prevent abuse)
  if (query.length > 500) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query is too long. Please keep it under 500 characters.',
    });
  }

  try {
    // ✅ শুধু in-stock products fetch করব (AI-কে খালি stock দেওয়ার দরকার নেই)
    const products = await prisma.product.findMany({
      where: {
        stock: {
          gt: 0, // শুধু যাদের stock > 0
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30, // ✅ 50 থেকে কমিয়ে 30 করলাম (AI prompt ছোট হবে, দ্রুত response আসবে)
    });

    // ✅ যদি কোনো product না থাকে
    if (!products.length) {
      return {
        query,
        recommendations: [],
        message: 'No products available in the catalog right now.',
      };
    }

    const recommendations = await getAiProductRecommendations(products, query, 8, event);

    return {
      query,
      recommendations,
    };
  } catch (error: any) {
    // ✅ Unexpected errors handle করা
    console.error('[AI Recommendations API Error]:', {
      query,
      status: error?.statusCode,
      message: error?.statusMessage || error?.message,
    });

    // যদি createError থেকে আসে, সেটি পাস করে দিই
    if (error?.statusCode) {
      throw error;
    }

    // অন্যথায় generic error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate recommendations. Please try again.',
    });
  }
});
