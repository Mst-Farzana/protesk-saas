// server/api/orders/[id].put.ts
import { createError, defineEventHandler, getRouterParam, readBody } from 'h3';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order ID is required',
    });
  }

  const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!body.status || !validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });

    return { success: true, order };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Order not found',
    });
  }
});
