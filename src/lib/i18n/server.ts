// src/lib/i18n/server.ts
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './config';

export default getRequestConfig(async ({locale}) => {
  // Validar e garantir que o locale é uma string válida
  const safeLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;
  
  // Carregar mensagens simplificadamente
  let messages;
  
  try {
    // Importação direta com caminho relativo exato
    messages = (await import('./messages/' + safeLocale + '.json')).default;
  } catch (error) {
    console.error(`Failed to load messages for ${safeLocale}:`, error);
    
    // Fallback apenas se necessário
    if (safeLocale !== defaultLocale) {
      try {
        messages = (await import('./messages/' + defaultLocale + '.json')).default;
      } catch (fallbackError) {
        messages = {}; // Último recurso
      }
    } else {
      messages = {}; // Último recurso
    }
  }

  return {
    locale: safeLocale,
    messages
  };
});