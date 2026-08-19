// server/api/orders/track.get.ts
import { createError, defineEventHandler, getQuery } from 'h3';
import { prisma } from '../../utils/prisma';

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default defineEventHandler(async event => {
  const { orderId } = getQuery(event);

  if (!orderId || typeof orderId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order ID is required',
    });
  }

  try {
    // ✅ 1) Age exact match try korbo (UUID e LIKE query er problem avoid korbe)
    let order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { imageUrl: true, name: true },
            },
          },
        },
        transactions: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // ✅ 2) Exact match fail hole, partial match (short ID)
    if (!order) {
      order = await prisma.order.findFirst({
        where: { id: { contains: orderId, mode: 'insensitive' } },
        include: {
          items: {
            include: {
              product: {
                select: { imageUrl: true, name: true },
              },
            },
          },
          transactions: true,
          user: {
            select: { name: true, email: true },
          },
        },
      });
    }

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: `Order "${orderId}" not found`,
      });
    }

    return {
      data: {
        ...order,
        totalAmount: toNumber(order.totalAmount),
        items: order.items.map((item: any) => ({
          id: item.id,
          name: item.product?.name || item.name || 'Unknown Product',
          imageUrl: item.product?.imageUrl || item.imageUrl || null,
          price: toNumber(item.price),
          quantity: toNumber(item.quantity),
        })),
        transactions: order.transactions.map((tx: any) => ({
          ...tx,
          amount: toNumber(tx.amount),
        })),
      },
    };
  } catch (error: any) {
    // ✅ Jodi amader createError hoy (404/400), pass korbo
    if (error?.statusCode) throw error;

    // ✅ Asol error terminal e dekhao — debugging er jonno
    console.error('🔥 [Track Order API Error]:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load order details. Please try again.',
    });
  }
});
