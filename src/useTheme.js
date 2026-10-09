import { useEffect, useState } from 'react';

const storageKey = 'blog-theme';

function savedPreference() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // The theme still works when browser storage is unavailable.
  }
  return 'auto';
}

function resolveTheme(preference) {
  if (preference !== 'auto') return preference;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function useTheme() {
  const [preference, setPreference] = useState(savedPreference);
  const [activeTheme, setActiveTheme] = useState(() => resolveTheme(preference));

  useEffect(() => {
    function applyTheme() {
      const theme = resolveTheme(preference);
      setActiveTheme(theme);
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.documentElement.style.backgroundColor = theme === 'dark' ? '#141917' : '#f8f7f2';
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        'content', theme === 'dark' ? '#141917' : '#f8f7f2'
      );
    }
    applyTheme();
    if (preference !== 'auto' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: light)');
    if (media.addEventListener) {
      media.addEventListener('change', applyTheme);
      return () => media.removeEventListener('change', applyTheme);
    }
    // Older mobile browsers use the legacy MediaQueryList API.
    media.addListener?.(applyTheme);
    return () => media.removeListener?.(applyTheme);
  }, [preference]);

  function changePreference(value) {
    setPreference(value);
    try {
      if (value === 'auto') localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, value);
    } catch {
      // Keep the choice for this visit even if it cannot be persisted.
    }
  }

  return [preference, changePreference, activeTheme];
}
