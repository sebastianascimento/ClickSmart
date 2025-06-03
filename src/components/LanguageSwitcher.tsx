// src/components/LanguageSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname() || '';

  // Função para forçar navegação com hard reload completo
  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Extrair caminho sem o prefixo de locale atual
    let path = pathname;
    const supportedLocales = ['pt', 'en'];
    for (const loc of supportedLocales) {
      if (path.startsWith(`/${loc}/`)) {
        path = path.substring(`/${loc}`.length);
        break;
      } else if (path === `/${loc}`) {
        path = '/';
        break;
      }
    }
    
    // Garantir que o caminho comece com / se não estiver vazio
    if (path !== '/' && !path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Hard reload usando location.href
    console.log(`Switching to ${newLocale}, path: ${path}`);
    window.location.href = `/${newLocale}${path === '/' ? '' : path}`;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg flex overflow-hidden border border-gray-200">
      <button
        onClick={() => switchLanguage("pt")}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          locale === "pt"
            ? "bg-green-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        PT
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          locale === "en"
            ? "bg-green-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        EN
      </button>
    </div>
  );
}