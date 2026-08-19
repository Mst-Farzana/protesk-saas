// server/api/orders/index.get.ts
import { defineEventHandler, getQuery } from 'h3';
import { prisma } from '../../utils/prisma';

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default defineEventHandler(async event => {
  const { status, page = '1', limit = '50' } = getQuery(event);

  // ✅ Optional: Filter by status
  const where: any = {};
  if (status && typeof status === 'string') {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
        },
      },
      _count: {
        select: { items: true },
      },
    },
  });

  const total = await prisma.order.count({ where });

  return {
    data: orders.map(order => ({
      id: order.id,
      userId: order.userId,
      totalAmount: toNumber(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt,
      user: order.user,
      itemCount: order._count.items,
      firstItemName: order.items[0]?.name || 'N/A',
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
});
