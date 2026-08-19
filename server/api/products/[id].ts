// server/api/products/[id].get.ts
import { Prisma } from '@prisma/client';
import { createError, defineEventHandler, getRouterParam } from 'h3';
import { prisma } from '../../utils/prisma';

// ✅ Helper: Prisma Decimal/String ke Number e convert
const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product id is required',
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: `Product with id "${id}" not found`,
      });
    }

    // ✅ Frontend-friendly format with Decimal conversion
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: toNumber(product.price), // ✅ Number e convert
      stock: product.stock,
      imageUrl: product.imageUrl,
      category: product.category?.name || 'Uncategorized',
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found',
        });
      }
    }

    console.error('Error fetching product:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
