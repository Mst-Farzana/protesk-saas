export default defineEventHandler(async event => {
  const { name, email, subject, message } = await readBody(event);

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, message: 'Please fill all required fields' });
  }

  const config = useRuntimeConfig();

  // ✅ Resend key থাকলে email যাবে, না থাকলে skip করে success দেবে
  if (config.resendApiKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(config.resendApiKey);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'support@protesk.com',
        subject: `Contact: ${subject || 'New message'} — ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
      });
    } catch (e) {
      console.error('Contact email failed:', e);
    }
  }

  return { success: true, message: 'Message received' };
});
