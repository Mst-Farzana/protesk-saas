import { defineEventHandler } from 'h3'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const [users, products, orders, transactions, categoryRecords] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.transaction.count(),
    prisma.product.findMany({
      distinct: ['category'],
      where: { category: { not: null } },
      select: { category: true },
    }),
  ])

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    counts: {
      users,
      products,
      categories: categoryRecords.length,
      orders,
      transactions,
    },
  }
})
