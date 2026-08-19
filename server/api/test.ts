import { defineEventHandler } from 'h3'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const [users, products, orders, transactions] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.transaction.count(),
    ])

    return {
      success: true,
      message: 'Prisma connection successful!',
      data: {
        users,
        products,
        orders,
        transactions,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: 'Prisma connection failed!',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
