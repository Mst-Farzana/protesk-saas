import { createError, defineEventHandler, getMethod, readBody } from 'h3'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event).toUpperCase()

  if (method === 'GET') {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return orders
  }

  if (method === 'POST') {
    const body = (await readBody(event)) as {
      userId?: string
      totalAmount?: number
      status?: string
    }

    if (!body.userId || typeof body.totalAmount !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId and totalAmount are required',
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        totalAmount: body.totalAmount,
        status: body.status ?? 'PENDING',
      },
    })

    await prisma.transaction.create({
      data: {
        orderId: order.id,
        amount: body.totalAmount,
        currency: 'USD',
        status: 'PENDING',
        paymentMethod: 'manual',
      },
    })

    return order
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
