import { createError, defineEventHandler, getQuery } from 'h3';
import Stripe from 'stripe';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const stripeSecretKey = config.stripeSecretKey;

  if (!stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe key missing',
    });
  }

  const stripe = new Stripe(stripeSecretKey);
  const query = getQuery(event);
  const sessionId = query.session_id as string;

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing session_id',
    });
  }

  try {
    console.log('🔍 Fetching session:', sessionId);

    // ✅ line_items expand করা হয়েছে যাতে আমরা জানতে পারি কোন প্রোডাক্টগুলো অর্ডার হয়েছে
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    console.log('✅ Session found:', session.id);
    console.log('💰 Amount:', session.amount_total);
    console.log('👤 User:', session.metadata?.userId);

    const userId = session.metadata?.userId === 'guest' ? null : session.metadata?.userId || null;
    const amount = session.amount_total ? session.amount_total / 100 : 0;

    // ✅ Check if order already exists (duplicate prevention)
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: session.id },
    });

    if (existingOrder) {
      console.log('⚠️ Order already exists:', existingOrder.id);
      return {
        success: true,
        orderId: existingOrder.id,
        amount,
        duplicate: true,
      };
    }

    // ✅ প্রোডাক্টের লিস্ট তৈরি করা (Prisma OrderItem এর জন্য)
    // ⚠️ নোট: আপনার prisma schema অনুযায়ী 'items', 'productId', 'name' ফিল্ডের নাম পরিবর্তন হতে পারে
    const orderItems = (session.line_items?.data || []).map((item: any) => ({
      productId: item.price?.product?.metadata?.productId || null,
      name: item.description || 'Unknown Product',
      price: (item.amount_total || 0) / (item.quantity || 1) / 100, // প্রতি ইউনিটের দাম
      quantity: item.quantity || 1,
    }));

    // ✅ CREATE ORDER (with nested items creation)
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: amount,
        status: 'PAID',
        stripeSessionId: session.id,
        // ✅ অর্ডারের সাথে প্রোডাক্টগুলোও সেভ করা হচ্ছে
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true, // রেসপন্সে আইটেমগুলোও পাঠানো হচ্ছে
      },
    });

    console.log('✅ Order created with items:', order.id);

    // ✅ CREATE TRANSACTION
    const transaction = await prisma.transaction.create({
      data: {
        orderId: order.id,
        amount,
        status: 'SUCCESS',
        paymentMethod: 'STRIPE',
      },
    });

    console.log('✅ Transaction created:', transaction.id);

    return {
      success: true,
      orderId: order.id,
      amount,
      items: order.items,
    };
  } catch (error: any) {
    console.error('❌ Success handler error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed: ' + error.message,
    });
  }
});
