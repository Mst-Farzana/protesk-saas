import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async event => {
  // ✅ কনটেক্সট আইসোলেশনের জন্য event পাস করা হয়েছে
  const config = useRuntimeConfig(event);
  const { texts, target } = await readBody<{ texts: string[]; target: string }>(event);

  if (!texts?.length) {
    console.log('📭 [translate] No texts provided');
    return { translations: [] };
  }

  console.log(`🤖 [translate] Received ${texts.length} strings to translate to ${target}`);

  const apiKey = config.geminiApiKey;
  if (!apiKey) {
    console.error('❌ [translate] GEMINI_API_KEY missing in runtimeConfig!');
    return { translations: texts };
  }

  // ✅ ফলব্যাক মডেল আপডেট করে gemini-3.7-flash করা হলো (সবচেয়ে নতুন ও শক্তিশালী)
  const model = config.geminiModel || 'gemini-3.7-flash';
  console.log(`📡 [translate] Using model: ${model}`);

  const prompt =
    `Translate this JSON array of strings to ${target}. ` +
    `Keep the exact same order and length. ` +
    `Return ONLY a valid JSON array of strings, with no markdown formatting, no code blocks, and no explanations.\n` +
    JSON.stringify(texts);

  try {
    // ✅ টাইমআউট ৩০ সেকেন্ড করা হলো (বড় অ্যারে অনুবাদের জন্য ১৫ সেকেন্ড কম হতে পারে)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          // ✅ নেটিভ JSON মোড যাতে আউটপুট সবসময় পার্সযোগ্য JSON হয়
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

    // ✅ JSON পার্সিং আরও নিরাপদ করা হলো
    let arr: any[] = [];
    try {
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      // মাঝে মাঝে LLM JSON-এর শেষে কমা (,) দিয়ে দেয়, যা পরিষ্কার করা
      const cleanedJson = jsonMatch[0].replace(/,\s*\]/g, ']');
      arr = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('❌ [translate] JSON Parse Error:', parseError, 'Raw:', raw);
      return { translations: texts };
    }

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
      console.error('❌ [translate] Request timed out after 30s');
    } else {
      console.error('❌ [translate] Network/fetch error:', e.message || e);
    }
    return { translations: texts };
  }
});
