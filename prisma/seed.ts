import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// 🚨 শুধু একটাই PrismaClient instance
// Seed এর জন্য DIRECT_URL better (direct connection, no pooler issues)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DIRECT_URL বা DATABASE_URL environment variable missing');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Cleaning old data...');

  // ✅ Cleanup (child first, then parent)
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating users...');
  await prisma.user.createMany({
    data: [
      { email: 'admin@protesk.com', name: 'Admin', role: 'ADMIN' },
      { email: 'customer@test.com', name: 'Test Customer', role: 'USER' },
    ],
  });

  console.log('📚 Creating categories...');
  const categoriesData = [
    { name: 'Audio', slug: 'audio' },
    { name: 'Wearables', slug: 'wearables' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Cameras', slug: 'cameras' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.name] = created.id;
  }

  console.log('📦 Creating products...');
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
      price: 79.99,
      stock: 12,
      categoryId: categoryMap['Audio'],
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&h=600&auto=format&fit=crop',
    },
    {
      name: 'Smart Watch Pro',
      description: 'AMOLED display, heart-rate tracking, 7-day battery.',
      price: 129.0,
      stock: 8,
      categoryId: categoryMap['Wearables'],
      imageUrl:
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&h=600&auto=format&fit=crop',
    },
    {
      name: 'Bluetooth Speaker',
      description: '360° sound, IPX7 waterproof, 12h playtime.',
      price: 49.5,
      stock: 20,
      categoryId: categoryMap['Audio'],
      imageUrl:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&h=600&auto=format&fit=crop',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB backlit, hot-swappable switches, USB-C.',
      price: 95.0,
      stock: 5,
      categoryId: categoryMap['Accessories'],
      imageUrl:
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&h=600&auto=format&fit=crop',
    },
    {
      name: '4K Action Camera',
      description: '4K60 video, waterproof case, gyro stabilization.',
      price: 199.99,
      stock: 0,
      categoryId: categoryMap['Cameras'],
      imageUrl:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&h=600&auto=format&fit=crop',
    },
    {
      name: 'USB-C Fast Charger',
      description: '65W GaN charger, dual port, foldable plug.',
      price: 24.99,
      stock: 30,
      categoryId: categoryMap['Accessories'],
      imageUrl:
        'https://images.pexels.com/photos/3921630/pexels-photo-3921630.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    },
  ];
  await prisma.product.createMany({ data: products });

  console.log('🛒 Creating demo order...');
  const customer = await prisma.user.findFirst({ where: { role: 'USER' } });
  const headphones = await prisma.product.findFirst({
    where: { name: 'Wireless Headphones' },
  });
  const speaker = await prisma.product.findFirst({
    where: { name: 'Bluetooth Speaker' },
  });

  if (customer && headphones && speaker) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: 129.49,
        status: 'PAID',
        items: {
          create: [
            {
              productId: headphones.id,
              name: headphones.name,
              price: 79.99,
              quantity: 1,
              imageUrl: headphones.imageUrl,
            },
            {
              productId: speaker.id,
              name: speaker.name,
              price: 49.5,
              quantity: 1,
              imageUrl: speaker.imageUrl,
            },
          ],
        },
        transactions: {
          create: {
            amount: 129.49,
            status: 'SUCCESS',
            paymentMethod: 'STRIPE',
          },
        },
      },
    });
  }

  const count = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const orderCount = await prisma.order.count();
  console.log(
    `\n✅ Seed complete! ${count} products, ${categoryCount} categories, ${orderCount} orders.`
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
