// server/api/stripe/webhook.post.ts
import { createError, defineEventHandler, getRequestHeader, readRawBody } from 'h3';
import Stripe from 'stripe';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const stripeSecretKey = config.stripeSecretKey;
  const webhookSecret = config.stripeWebhookSecret;

  if (!stripeSecretKey || !webhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe configuration error',
    });
  }

  const stripe = new Stripe(stripeSecretKey);

  // ✅ H3 এর সঠিক API ব্যবহার করুন
  const sig = getRequestHeader(event, 'stripe-signature');
  const rawBody = await readRawBody(event, false);

  if (!sig || !rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing signature or body',
    });
  }

  let stripeEvent: Stripe.Event;

  try {
    // ✅ Buffer কে string এ convert করুন
    const bodyString =
      typeof rawBody === 'string' ? rawBody : Buffer.from(rawBody).toString('utf8');

    stripeEvent = stripe.webhooks.constructEvent(bodyString, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    throw createError({
      statusCode: 400,
      statusMessage: `Webhook signature verification failed: ${err.message}`,
    });
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        // ✅ Line items সহ session retrieve করুন
        const session = await stripe.checkout.sessions.retrieve(stripeEvent.data.object.id, {
          expand: ['line_items.data.price.product'],
        });

        console.log('✅ Payment successful:', session.id);

        // ✅ Idempotency check - duplicate order prevention
        const existingOrder = await prisma.order.findFirst({
          where: { stripeSessionId: session.id },
        });

        if (existingOrder) {
          console.log('ℹ️ Order already exists:', existingOrder.id);
          break;
        }

        // ✅ userId handling: 'guest' → null (UUID expect করে)
        const rawUserId = session.metadata?.userId;
        const userId =
          rawUserId && rawUserId !== 'guest' && rawUserId !== 'guest-user' ? rawUserId : null;

        const lineItems = session.line_items?.data ?? [];
        const totalAmount = (session.amount_total ?? 0) / 100;

        // ✅ Order + OrderItems + Transaction একসাথে create
        const order = await prisma.order.create({
          data: {
            userId,
            customerName: session.customer_details?.name || null,
            customerEmail: session.customer_details?.email || null,
            totalAmount,
            status: 'PAID',
            stripeSessionId: session.id,
            items: {
              create: lineItems.map(li => {
                const rawProduct = li.price?.product;

                // ✅ DeletedProduct বাদ দিয়ে শুধু আসল Stripe.Product নিই
                const stripeProduct =
                  rawProduct && typeof rawProduct === 'object' && 'metadata' in rawProduct
                    ? (rawProduct as Stripe.Product)
                    : null;

                return {
                  productId: stripeProduct?.metadata?.productId || null,
                  name: li.description || 'Product',
                  price: (li.price?.unit_amount ?? 0) / 100,
                  quantity: li.quantity ?? 1,
                  imageUrl: stripeProduct?.images?.[0] || null,
                };
              }),
            },

            transactions: {
              create: {
                amount: totalAmount,
                status: 'SUCCESS',
                paymentMethod: 'STRIPE',
              },
            },
          },
          include: { items: true },
        });

        console.log(`✅ Order created: ${order.id}`);
        console.log(`✅ Order items: ${order.items.length}`);
        console.log(`✅ Total amount: $${totalAmount}`);

        // ✅ Stock decrement
        for (const item of order.items) {
          if (item.productId) {
            try {
              await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
              });
              console.log(`✅ Stock decremented for product ${item.productId}`);
            } catch (err) {
              console.error(`❌ Failed to decrement stock for ${item.productId}:`, err);
            }
          }
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        console.log('⏰ Checkout session expired:', session.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.error('❌ Payment failed:', paymentIntent.id);
        console.error('❌ Error:', paymentIntent.last_payment_error?.message);
        break;
      }

      case 'charge.refunded': {
        const charge = stripeEvent.data.object as Stripe.Charge;
        console.log('💰 Refund processed:', charge.id);

        // ✅ Order status update করুন
        if (charge.payment_intent) {
          await prisma.order.updateMany({
            where: { stripeSessionId: String(charge.payment_intent) },
            data: { status: 'REFUNDED' },
          });
          console.log('✅ Order status updated to REFUNDED');
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${stripeEvent.type}`);
    }
  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Webhook processing failed',
    });
  }

  return { received: true };
});
