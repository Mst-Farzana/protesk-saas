import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async event => {
  // ✅ Pass event to useRuntimeConfig for better context isolation
  const config = useRuntimeConfig(event);
  const { texts, target } = await readBody<{ texts: string[]; target: string }>(event);

  if (!texts?.length) {
    console.log('📭 [translate] No texts provided');
    return { translations: texts || [] };
  }

  console.log(`🤖 [translate] Received ${texts.length} strings to translate to ${target}`);

  const apiKey = config.geminiApiKey;
  if (!apiKey) {
    console.error('❌ [translate] GEMINI_API_KEY missing in runtimeConfig!');
    return { translations: texts };
  }

  // ✅ ফলব্যাক মডেল gemini-1.5-flash করা হলো (সবচেয়ে স্থিতিশীল)
  const model = config.geminiModel || 'gemini-1.5-flash';
  console.log(`📡 [translate] Using model: ${model}`);

  const prompt =
    `Translate this JSON array of strings to ${target}. ` +
    `Keep the exact same order and length. ` +
    `Return ONLY a valid JSON array of strings, with no markdown formatting or explanations.\n` +
    JSON.stringify(texts);

  try {
    // ✅ Timeout setup (e.g., 15 seconds) to prevent serverless function hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          // ✅ Native JSON mode ensures the output is always parseable JSON
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    clearTimeout(timeoutId);

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
      return { translations: texts };
    }

    // ✅ With responseMimeType: 'application/json', parsing is now much safer
    // We still keep a fallback regex just in case the model adds minor text
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('❌ [translate] No JSON array found in response. Raw:', raw);
      return { translations: texts };
    }

    const arr = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(arr)) {
      console.error('❌ [translate] Response is not an array');
      return { translations: texts };
    }

    if (arr.length !== texts.length) {
      console.error(`❌ [translate] Length mismatch: sent ${texts.length}, got ${arr.length}`);
      return { translations: texts };
    }

    console.log(`✅ [translate] Successfully translated ${arr.length} strings`);
    return { translations: arr };
  } catch (e: any) {
    if (e.name === 'AbortError') {
      console.error('❌ [translate] Request timed out');
    } else {
      console.error('❌ [translate] Network/fetch error:', e.message || e);
    }
    return { translations: texts };
  }
});
