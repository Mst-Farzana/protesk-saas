// server/utils/ai.ts
import { createError } from 'h3';
import { OpenAI } from 'openai';

type ProductInput = {
  id: string;
  name: string;
  description?: string | null;
  price: number | { toString(): string } | null;
  category?: string | null;
  stock?: number | null;
  imageUrl?: string | null;
};

type AIRecommendation = {
  id: string;
  name: string;
  price: number;
  category: string | null;
  reason: string;
};

type CatalogItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | null;
  stock: number;
};

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'best',
  'top',
  'cheap',
  'good',
  'great',
  'value',
  'under',
  'below',
  'buy',
  'want',
  'need',
  'show',
  'give',
  'please',
  'budget',
  'gear',
  'setup',
  'around',
  'about',
  'less',
  'than',
  'max',
  'upto',
  'up',
  'to',
]);

const SYNONYMS: Record<string, string[]> = {
  audio: ['headphone', 'earbud', 'speaker', 'audio', 'sound', 'microphone', 'mic'],
  wearables: ['watch', 'band', 'fitness', 'wearable', 'tracker', 'smartwatch'],
  cameras: ['camera', 'lens', 'cam', 'dslr', 'mirrorless'],
  accessories: ['case', 'charger', 'cable', 'hub', 'stand', 'sleeve', 'adapter', 'dongle'],
  work: ['laptop', 'monitor', 'keyboard', 'mouse', 'desk', 'office'],
  gaming: ['console', 'controller', 'gaming', 'keyboard', 'mouse'],
};

export async function getAiProductRecommendations(
  products: ProductInput[],
  query: string,
  limit = 6
): Promise<AIRecommendation[]> {
  if (!products.length) return [];

  const config = useRuntimeConfig() as any;

  const availableProducts = products
    .filter(p => Number(p.stock ?? 0) > 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      price: Number(p.price ?? 0),
      category: p.category ?? null,
      stock: Number(p.stock ?? 0),
      imageUrl: p.imageUrl ?? null,
    }));

  if (!availableProducts.length) return [];

  const catalog: CatalogItem[] = availableProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    stock: p.stock,
  }));

  // ---------- ১) Try OpenAI ----------
  const openaiKey = String(config?.openaiApiKey || '').trim();
  if (openaiKey) {
    try {
      return await openAiRecommendations(openaiKey, catalog, query, limit);
    } catch (err: any) {
      if (err?.statusCode === 429) {
        console.warn('[AI] OpenAI quota exceeded, falling back to Gemini...');
      } else {
        console.warn('[AI] OpenAI failed, falling back:', err?.message);
      }
    }
  }

  // ---------- ২) Try Gemini ----------
  const geminiKey = String(config?.geminiApiKey || config?.public?.geminiApiKey || '').trim();

  if (geminiKey) {
    const geminiModel = String(config?.geminiModel || 'gemini-2.0-flash').trim();
    try {
      return await geminiRecommendations(catalog, query, limit, geminiKey, geminiModel);
    } catch (err: any) {
      console.warn('[AI] Gemini failed, falling back to local matching:', err?.message);
    }
  }

  // ---------- ৩) Local smart matching ----------
  return localRecommendations(catalog, query, limit);
}

/* ================================================================
   OpenAI (gpt-5-mini)
================================================================ */
async function openAiRecommendations(
  apiKey: string,
  catalog: CatalogItem[],
  query: string,
  limit: number
): Promise<AIRecommendation[]> {
  const openai = new OpenAI({ apiKey });
  const catalogJson = JSON.stringify(catalog);

  const systemPrompt = `
You are the AI shopping assistant for an e-commerce store.

Recommend products only from the supplied catalog.

Rules:
1. Only recommend products that exist in the catalog.
2. Never invent product IDs.
3. Never invent prices.
4. Never recommend products with stock <= 0.
5. Respect the customer's budget.
6. Consider name, description, category, price, stock and use case.
7. Return at most ${limit} products.
8. Give a short reason for every recommendation.
9. If nothing matches, return an empty recommendations array.

Return ONLY valid JSON.

Format:
{
  "recommendations": [
    { "id": "product-id", "reason": "Short explanation" }
  ]
}
`;

  let response;
  try {
    response = await openai.responses.create({
      model: 'gpt-5-mini',
      input: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Customer request:\n${query}\n\nProduct catalog:\n${catalogJson}`,
        },
      ],
    });
  } catch (error: any) {
    console.error('OpenAI recommendation error:', {
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });

    if (error?.status === 429) {
      throw createError({
        statusCode: 429,
        statusMessage: 'AI service is temporarily unavailable. Please try again in a moment.',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'AI recommendation service failed.',
    });
  }

  const text = response.output_text?.trim();
  if (!text) return [];

  return parseAndMap(catalog, text, limit);
}

/* ================================================================
   Google Gemini
================================================================ */
async function geminiRecommendations(
  catalog: CatalogItem[],
  query: string,
  limit: number,
  apiKey: string,
  model: string
): Promise<AIRecommendation[]> {
  const catalogJson = JSON.stringify(catalog);

  const prompt = `You are the AI shopping assistant for an e-commerce store.

Recommend products only from the supplied catalog.

Rules:
1. Only recommend products that exist in the catalog.
2. Never invent product IDs or prices.
3. Never recommend products with stock <= 0.
4. Respect the customer's budget.
5. Return at most ${limit} products.
6. Give a short reason for every recommendation.
7. If nothing matches, return an empty recommendations array.

Customer request: "${query}"

Product catalog:
${catalogJson}

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    { "id": "product-id", "reason": "Short explanation" }
  ]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) return [];

  return parseAndMap(catalog, text, limit);
}

/* ================================================================
   Local Smart Matching
================================================================ */
function localRecommendations(
  catalog: CatalogItem[],
  query: string,
  limit: number
): AIRecommendation[] {
  const q = query.toLowerCase();
  const tokens = q.split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
  const budget = extractBudget(q);

  const scored = catalog
    .map(p => {
      let score = 0;
      const name = p.name.toLowerCase();
      const category = (p.category ?? '').toLowerCase();
      const description = p.description.toLowerCase();
      const haystack = `${name} ${category} ${description}`;

      for (const t of tokens) {
        if (name.includes(t)) score += 4;
        if (category.includes(t)) score += 3;
        if (description.includes(t)) score += 1;
      }

      for (const [key, words] of Object.entries(SYNONYMS)) {
        if (q.includes(key) && words.some(w => haystack.includes(w))) score += 3;
      }

      if (budget !== null) {
        if (p.price <= budget) score += 2;
        else score -= 10;
      }

      if (/value|cheap|budget|under|below/.test(q)) {
        score += (1000 - Math.min(p.price, 1000)) / 100;
      }

      return { p, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const finalList = scored.length ? scored : catalog.slice(0, limit).map(p => ({ p, score: 0 }));

  return finalList.map(({ p }) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    reason:
      budget !== null && p.price <= budget
        ? `Great match for "${query}" — fits your budget at $${p.price}.`
        : `Strong match for "${query}" based on category and features.`,
  }));
}

/* ================================================================
   Helpers
================================================================ */
function extractBudget(q: string): number | null {
  const m =
    q.match(/(?:under|below|less than|max)\s*\$?\s*(\d+(?:\.\d+)?)/) ||
    q.match(/\$\s*(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

function parseAndMap(catalog: CatalogItem[], text: string, limit: number): AIRecommendation[] {
  const candidates: string[] = [text];

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced && fenced[1]) candidates.push(fenced[1]);

  const brace = text.match(/\{[\s\S]*\}/);
  if (brace && brace[0]) candidates.push(brace[0]);

  let parsed: { recommendations?: Array<{ id?: string; reason?: string }> } | null = null;

  for (const candidate of candidates) {
    try {
      parsed = JSON.parse(candidate);
      break;
    } catch {
      // continue to next candidate
    }
  }

  if (!parsed) {
    console.error('[AI] Invalid JSON:', text.slice(0, 200));
    return [];
  }

  const recs = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  const productMap = new Map(catalog.map(p => [p.id, p]));
  const seenIds = new Set<string>();

  return recs
    .slice(0, limit)
    .map(item => {
      if (!item.id || seenIds.has(item.id)) return null;
      const product = productMap.get(item.id);
      if (!product) return null;
      seenIds.add(item.id);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        reason: item.reason || 'This product matches your shopping requirements.',
      };
    })
    .filter((item): item is AIRecommendation => item !== null);
}
