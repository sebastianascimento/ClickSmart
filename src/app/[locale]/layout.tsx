// src/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

// Importações diretas
import ptMessages from '@/lib/i18n/messages/pt.json';
import enMessages from '@/lib/i18n/messages/en.json';

const messagesMap = {
  pt: ptMessages,
  en: enMessages,
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;  // Definir como Promise!
}

export default async function LocaleLayout({ children, params }: RootLayoutProps) {
  // CORREÇÃO AQUI: Aguardar a Promise params
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  
  // Verificar se o locale é válido
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = messagesMap[locale as keyof typeof messagesMap] || {};

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}