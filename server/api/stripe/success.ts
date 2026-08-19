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

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    console.log('✅ Session found:', session.id);
    console.log('💰 Amount:', session.amount_total);
    console.log('👤 User:', session.metadata?.userId);

    const userId = session.metadata?.userId || 'guest';
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

    // ✅ CREATE ORDER
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: amount,
        status: 'PAID',
        stripeSessionId: session.id,
      },
    });

    console.log('✅ Order created:', order.id);

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
    };
  } catch (error: any) {
    console.error('❌ Success handler error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed: ' + error.message,
    });
  }
});
