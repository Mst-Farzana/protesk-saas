export const useSiteLang = () => {
  const lang = useState<string>('site-lang', () =>
    import.meta.client ? localStorage.getItem('site_lang') || 'en' : 'en'
  );

  const setLang = (l: string) => {
    if (import.meta.client) {
      localStorage.setItem('site_lang', l);
      window.location.reload(); // ✅ Clean re-translate
    }
  };

  return { lang, setLang };
};
