// server/api/categories.get.ts
import { createError, defineEventHandler } from 'h3';
import { prisma } from '../utils/prisma';

export default defineEventHandler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return categories;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to load categories: ${error.message}`,
    });
  }
});
