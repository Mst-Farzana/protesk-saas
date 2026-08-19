// server/api/products/index.ts
import { defineEventHandler } from 'h3';
import { prisma } from '../../utils/prisma';

// ✅ Helper: Prisma Decimal/String ke Number e convert
const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default defineEventHandler(async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // ✅ Frontend-friendly format with Decimal conversion
  return products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: toNumber(product.price), // ✅ Convert Decimal to Number
    stock: product.stock,
    imageUrl: product.imageUrl,
    category: product.category?.name || 'Uncategorized',
    categoryId: product.categoryId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
});
