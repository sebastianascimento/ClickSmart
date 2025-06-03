"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
// REMOVIDO: import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para trocar o idioma mantendo o usuário na mesma página
  const switchLanguage = (newLocale: string) => {
    // Extrai o caminho sem o prefixo de locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    // Redireciona para o mesmo caminho com o novo locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className={`sticky top-0 z-10 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'
      }`}>
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link 
            href={`/${locale}`} 
            className="text-xl font-bold text-green-600 hover:text-green-700 transition flex items-center gap-2"
          >
            <span className="text-2xl"></span>
            {t("app.title")}
          </Link>
          
          <div className="flex items-center gap-6">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="text-gray-700 hover:text-green-600 transition px-3 py-2 rounded-lg hover:bg-green-50"
                  >
                    {t("navigation.home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-gray-700 hover:text-green-600 transition px-3 py-2 rounded-lg hover:bg-green-50"
                  >
                    {locale === "pt" ? "Sobre" : "About"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/game`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
                  >
                    {locale === "pt" ? "Jogos" : "Games"}
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* APENAS ESTE SELETOR DE IDIOMA - O COMPONENTE LANGUAGE SWITCHER FOI REMOVIDO */}
            <div className="bg-white shadow-sm rounded-lg flex overflow-hidden border border-gray-200">
              <button
                onClick={() => switchLanguage('pt')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === 'pt' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                PT
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === 'en' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
            </div>
            
            {/* REMOVIDO: <LanguageSwitcher /> */}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-white border-t border-green-100 mt-auto">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌱</span>
              <span className="text-green-600 font-bold">{t("app.title")}</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                {t("footer.copyright", { year: 2025 })}
              </p>
              <div className="mt-2 flex gap-3 justify-center md:justify-end">
                <span className="text-gray-400 hover:text-green-600 cursor-pointer transition">📱</span>
                <span className="text-gray-400 hover:text-green-600 cursor-pointer transition">📧</span>
                <span className="text-gray-400 hover:text-green-600 cursor-pointer transition">🌐</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}