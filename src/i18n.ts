import { useSyncExternalStore } from 'react';
import { translations } from './translations';

export type Language = 'en' | 'fr' | 'ar';
const listeners = new Set<() => void>();
let language: Language = 'en';
try {
  const saved = localStorage.getItem('portfolio-language');
  if (saved === 'fr' || saved === 'ar') language = saved;
} catch { /* Storage may be unavailable in private browsing. */ }

function syncDocument() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
}
syncDocument();

export function setLanguage(next: Language) {
  language = next;
  try { localStorage.setItem('portfolio-language', next); } catch { /* Keep the in-memory selection. */ }
  syncDocument();
  listeners.forEach(listener => listener());
}

export function useLanguage() {
  return useSyncExternalStore(listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, () => language, () => 'en' as Language);
}

// Preserve surrounding spaces between text and inline icons or links.
export function t<T>(value: T): T {
  if (typeof value !== 'string' || language === 'en') return value;
  const key = value.trim();
  const translated = translations[key]?.[language === 'fr' ? 0 : 1];
  if (translated) return (value.slice(0, value.length - value.trimStart().length) + translated + value.slice(value.trimEnd().length)) as T;
  const dynamic = [
    [/^Jump to section (\d+)$/, 'Aller à la section $1', 'الانتقال إلى القسم $1'],
    [/^Go to slide (\d+)$/, 'Aller à la diapositive $1', 'الانتقال إلى الشريحة $1'],
    [/^The Modern Journal - Platform View (\d+)$/, 'The Modern Journal - Vue $1', 'The Modern Journal - الواجهة $1'],
  ] as const;
  for (const [pattern, fr, ar] of dynamic) {
    if (pattern.test(key)) return key.replace(pattern, language === 'fr' ? fr : ar) as T;
  }
  return value;
}
