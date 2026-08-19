// server/api/stripe/checkout.post.ts
import { createError, defineEventHandler, getRequestURL, readBody } from 'h3'; // ✅ getRequestURL ইম্পোর্ট করুন
import Stripe from 'stripe';
import { prisma } from '../../utils/prisma';

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number | string;
  imageUrl?: string;
  productId?: string;
}

interface CheckoutBody {
  items: CartItem[];
  userId?: string;
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const stripeSecretKey = config.stripeSecretKey;

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY is not set in .env file!');
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe configuration error',
    });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await readBody<CheckoutBody>(event);
  const { items, userId } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cart is empty or invalid',
    });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const price = Number(item.price);

    if (!item.name || !Number.isFinite(price) || price <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid item: ${item.name || 'unknown'} (price received: ${item.price})`,
      });
    }

    const productId = item.productId || item.id || '';
    const quantity = Math.max(1, Number(item.quantity) || 1);

    let finalPrice = price;
    if (productId) {
      const dbProduct = await prisma.product
        .findUnique({ where: { id: productId } })
        .catch(() => null);

      if (dbProduct) {
        finalPrice = Number(dbProduct.price);
      }
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl && item.imageUrl.startsWith('http') ? [item.imageUrl] : [],
          metadata: {
            productId: productId,
          },
        },
        unit_amount: Math.round(finalPrice * 100),
      },
      quantity,
    });
  }

  if (!lineItems.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid items in cart',
    });
  }

  // ✅ ডাইনামিক বেস URL তৈরি (Localhost এবং Vercel দুটোতেই অটোমেটিক কাজ করবে)
  const url = getRequestURL(event);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      // ✅ সঠিক পেজে (/checkout) রিডাইরেক্ট করা হচ্ছে যাতে ফ্রন্টএন্ডের লজিক কাজ করে
      success_url: `${baseUrl}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=true`,
      metadata: {
        userId: userId && userId !== 'guest-user' ? userId : 'guest',
      },
    });

    console.log('✅ Stripe session created:', session.id);
    return { url: session.url };
  } catch (error: any) {
    console.error('❌ Stripe Error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Payment failed: ${error.message}`,
    });
  }
});
