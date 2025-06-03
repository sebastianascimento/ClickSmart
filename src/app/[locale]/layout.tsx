// src/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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

// Correção explícita para tratar params como Promise
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> | { locale: string } }): Promise<Metadata> {
  // Fazer await explicitamente para resolver a Promise
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  // Verificar se o locale é válido
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = messagesMap[locale as keyof typeof messagesMap] || {};
  
  // Pegar traduções para os metadados se estiverem disponíveis
  const title = messages.app?.title || 'ClickSmart';
  const description = messages.app?.tagline || 'Aprenda a navegar com segurança no mundo digital através de jogos interativos.';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clicksmart.vercel.app'; 

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    keywords: ['literacia digital', 'jogos educativos', 'segurança online', 'cibersegurança', 'fake news', 'privacidade', 'verificação de factos', 'educação digital'],
    authors: [{ name: 'ClickSmart Team' }],
    creator: 'ClickSmart',
    metadataBase: new URL(baseUrl),
    
    // Open Graph
    openGraph: {
      type: 'website',
      locale: locale,
      url: `${baseUrl}/${locale}`,
      siteName: title,
      title,
      description,
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'ClickSmart - Literacia Digital',
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/twitter-image.jpg'],
    },
    
    // Alternativas para idiomas diferentes
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'pt': `${baseUrl}/pt`,
      },
    },
    
    // Configuração de robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    verification: {
      // google: 'SUA_VERIFICAÇÃO_GOOGLE_AQUI',
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}

export default async function LocaleLayout({ children, params }: RootLayoutProps) {
  // Fazer await explicitamente para resolver a Promise
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  // Verificar se o locale é válido
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = messagesMap[locale as keyof typeof messagesMap] || {};

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              'name': messages.app?.title || 'ClickSmart',
              'description': messages.app?.tagline,
              'url': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://clicksmart.vercel.app'}/${locale}`,
              'potentialAction': {
                '@type': 'SearchAction',
                'target': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://clicksmart.vercel.app'}/${locale}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </body>
    </html>
  );
}