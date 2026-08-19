const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'OPTION',
  'CODE',
  'PRE',
  'SVG',
  'NOSCRIPT',
]);

export default defineNuxtPlugin(() => {
  onNuxtReady(async () => {
    const lang = localStorage.getItem('site_lang');
    console.log('🔍 [auto-translate] Current language:', lang);

    if (lang !== 'bn') {
      console.log('⏸️  Skipping translation (not Bengali mode)');
      return;
    }

    console.log('🌐 Starting Bengali auto-translate...');

    // ===== Cache load =====
    const cache = new Map<string, string>();
    try {
      const saved = JSON.parse(localStorage.getItem('tr_cache_bn') || '{}');
      Object.entries(saved).forEach(([k, v]) => cache.set(k, v as string));
      console.log('📦 Loaded', cache.size, 'cached translations');
    } catch {
      console.warn('⚠️  Cache load failed, starting fresh');
    }

    const pending = new Set<string>();
    let timer: any = null;

    const isTranslatable = (node: Node): boolean => {
      if (node.nodeType !== Node.TEXT_NODE) return false;
      const text = (node.textContent || '').trim();
      if (!text || text.length < 2) return false;
      // ✅ Numbers, symbols, prices skip
      if (/^[\d\s.,$€%©\-–—|•·→/+×=()#]+$/.test(text)) return false;
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return false;
      if (parent.closest('[data-no-translate]')) return false;
      return true;
    };

    // ===== Apply cached translations (instant) =====
    const applyAll = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      let applied = 0;

      while ((n = walker.nextNode())) {
        if (!isTranslatable(n)) continue;
        const original = (n.textContent || '').trim();
        const translated = cache.get(original);

        if (translated && n.textContent !== translated) {
          // ✅ Replace ALL occurrences (not just first)
          n.textContent = (n.textContent || '').split(original).join(translated);
          applied++;
        }
      }

      if (applied > 0) {
        console.log('✅ Applied', applied, 'cached translations');
      }
    };

    const saveCache = () => {
      try {
        const obj: Record<string, string> = {};
        cache.forEach((v, k) => (obj[k] = v));
        localStorage.setItem('tr_cache_bn', JSON.stringify(obj));
      } catch (e) {
        console.warn('⚠️  Cache save failed:', e);
      }
    };

    // ===== Fetch new translations from AI =====
    const flush = async () => {
      const missing = new Set<string>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n: Node | null;

      while ((n = walker.nextNode())) {
        if (isTranslatable(n)) {
          const t = (n.textContent || '').trim();
          if (!cache.has(t) && !pending.has(t)) missing.add(t);
        }
      }

      if (!missing.size) {
        console.log('✅ All text already translated');
        return;
      }

      const batch = [...missing].slice(0, 40);
      batch.forEach(b => pending.add(b));

      console.log('🔄 Fetching', batch.length, 'new translations from AI...');

      try {
        const { translations } = await $fetch<{ translations: string[] }>('/api/translate', {
          method: 'POST',
          body: { texts: batch, target: 'Bengali' },
        });

        let successCount = 0;
        batch.forEach((text, i) => {
          const tr = translations[i];
          if (tr && tr !== text) {
            cache.set(text, tr);
            successCount++;
          }
          pending.delete(text);
        });

        console.log('✅ Translated', successCount, 'new strings');
        saveCache();
        applyAll();

        // ✅ Retry if some text still untranslated
        const untranslated = [...missing].filter(m => !cache.has(m));
        if (untranslated.length > 0 && untranslated.length < batch.length) {
          console.log('⏳ Retrying', untranslated.length, 'failed translations...');
          setTimeout(flush, 500);
        }
      } catch (err) {
        console.error('❌ Translation API failed:', err);
        batch.forEach(b => pending.delete(b));
      }
    };

    // ===== Watch DOM changes =====
    const observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        applyAll();
        await flush();
      }, 400);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // ===== Initial run =====
    applyAll();
    await flush();

    console.log('🎉 Auto-translate initialized');
  });
});
