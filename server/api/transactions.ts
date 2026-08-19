import { defineEventHandler } from 'h3';
import Stripe from 'stripe';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);

  try {
    // Stripe থেকে সব payment intents নিন
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
    });

    // আমাদের format এ convert করুন
    const transactions = paymentIntents.data.map(intent => ({
      id: intent.id,
      orderId: intent.metadata?.orderId || 'N/A',
      amount: intent.amount / 100, // cents to dollars
      status: intent.status.toUpperCase(),
      paymentMethod: intent.payment_method_types?.[0] || 'card',
      createdAt: new Date(intent.created * 1000), // Unix timestamp to Date
    }));

    return transactions;
  } catch (error: any) {
    console.error('Stripe fetch error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch transactions from Stripe',
    });
  }
});
