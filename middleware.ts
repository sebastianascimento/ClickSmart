// middleware.ts (na raiz do projeto)
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/lib/i18n/config';

export default createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localeDetection: false  // Desativar detecção automática
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};