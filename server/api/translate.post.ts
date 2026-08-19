import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const { texts, target } = await readBody<{ texts: string[]; target: string }>(event);

  if (!texts?.length) {
    console.log('📭 [translate] No texts provided');
    return { translations: texts || [] };
  }

  console.log(`🤖 [translate] Received ${texts.length} strings to translate to ${target}`);

  const apiKey = config.geminiApiKey;
  if (!apiKey) {
    console.error('❌ [translate] GEMINI_API_KEY missing in runtimeConfig!');
    console.error('   Check: .env file has GEMINI_API_KEY=xxx');
    console.error('   Check: nuxt.config.ts has geminiApiKey in runtimeConfig');
    return { translations: texts };
  }

  const model = config.geminiModel || 'gemini-2.0-flash';
  console.log(`📡 [translate] Using model: ${model}`);

  try {
    const prompt =
      `Translate this JSON array of strings to ${target}. ` +
      `Keep same order and same length. Return ONLY a valid JSON array.\n` +
      JSON.stringify(texts);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ [translate] API returned ${res.status}:`, errorText);
      return { translations: texts };
    }

    const data: any = await res.json();

    if (data?.error) {
      console.error('❌ [translate] Gemini API error:', data.error.message);
      return { translations: texts };
    }

    const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!raw) {
      console.error('❌ [translate] Empty response from Gemini');
      console.log('   Full response:', JSON.stringify(data, null, 2));
      return { translations: texts };
    }

    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      console.error('❌ [translate] No JSON array found in response');
      console.log('   Raw response:', raw.substring(0, 200));
      return { translations: texts };
    }

    const arr = JSON.parse(match[0]);

    if (!Array.isArray(arr)) {
      console.error('❌ [translate] Response is not an array');
      return { translations: texts };
    }

    if (arr.length !== texts.length) {
      console.error(`❌ [translate] Length mismatch: sent ${texts.length}, got ${arr.length}`);
      console.log('   Sent:', texts.slice(0, 3), '...');
      console.log('   Received:', arr.slice(0, 3), '...');
      return { translations: texts };
    }

    console.log(`✅ [translate] Successfully translated ${arr.length} strings`);
    return { translations: arr };
  } catch (e: any) {
    console.error('❌ [translate] Network/fetch error:', e.message || e);
    return { translations: texts };
  }
});
