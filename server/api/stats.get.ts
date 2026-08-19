export default defineEventHandler(async event => {
  const days = Math.min(Math.max(Number(getQuery(event).days) || 14, 2), 60);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const rangeStart = new Date(startOfToday);
  rangeStart.setDate(rangeStart.getDate() - (days - 1));

  const prevEnd = new Date(rangeStart);
  prevEnd.setDate(prevEnd.getDate() - 1);
  prevEnd.setHours(23, 59, 59, 999);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (days - 1));
  prevStart.setHours(0, 0, 0, 0);

  const [orders, prevOrders, productsCount] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: rangeStart } } }),
    prisma.order.findMany({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
    prisma.product.count(),
  ]);

  const sum = (list: any[]) => list.reduce((a, o) => a + Number(o.totalAmount || 0), 0);

  const revenue = sum(orders);
  const prevRevenue = sum(prevOrders);
  const ordersCount = orders.length;
  const prevOrdersCount = prevOrders.length;
  const aov = ordersCount ? revenue / ordersCount : 0;
  const prevAov = prevOrdersCount ? prevRevenue / prevOrdersCount : 0;

  // ✅ Increase / Decrease percentage
  const pct = (cur: number, prev: number) =>
    prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100);

  // ✅ Daily series (graph এর জন্য)
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(rangeStart);
    d.setDate(d.getDate() + i);
    const key = d.toDateString();
    const dayOrders = orders.filter((o: any) => new Date(o.createdAt).toDateString() === key);
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: sum(dayOrders),
      orders: dayOrders.length,
    };
  });

  return {
    success: true,
    data: {
      revenue,
      orders: ordersCount,
      avgOrderValue: aov,
      products: productsCount,
      revenueChange: pct(revenue, prevRevenue),
      ordersChange: pct(ordersCount, prevOrdersCount),
      aovChange: pct(aov, prevAov),
      series,
    },
  };
});
