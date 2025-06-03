"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, ReactNode } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Interface para as props do AnimatedElement
interface AnimatedElementProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Interface para as props do GameCard
interface GameCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

// Componente para elementos que aparecem com animação quando visíveis
const AnimatedElement = ({ children, delay = 0, className = "" }: AnimatedElementProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Componente para os cards de jogos
const GameCard = ({ icon, title, description, delay = 0 }: GameCardProps) => (
  <AnimatedElement delay={delay}>
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-green-100 hover:border-green-300">
      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </AnimatedElement>
);

// Componente para o seletor de idioma
const LanguageSelector = () => {
  const locale = useLocale();
  
  return (
    <div className="fixed top-4 right-4 z-50 flex space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
      <Link
        href="/pt"
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          locale === 'pt' 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        PT
      </Link>
      <Link
        href="/en"
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          locale === 'en' 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </Link>
    </div>
  );
};

export default function Home() {
  const t = useTranslations('landing');
  const locale = useLocale();
  
  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">
      {/* Language Selector */}
      <LanguageSelector />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute w-full h-full">
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-green-100 opacity-30"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }} 
            transition={{ 
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-green-200 opacity-20"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }} 
            transition={{ 
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-green-600">{t('heroTitle')}</h1>
              <p className="text-xl md:text-2xl mb-12">{t('heroSubtitle')}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link 
                href={`/${locale}/game`}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                {t('startButton')}
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6">
          <AnimatedElement>
            <h2 className="text-4xl font-bold text-center mb-16 text-green-800">{t('howItWorks')}</h2>
          </AnimatedElement>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <AnimatedElement delay={0.2}>
              <div className="text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-green-200">
                  <span className="text-3xl">🎮</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{t('interactiveGames')}</h3>
                <p className="text-gray-600">{t('interactiveGamesDesc')}</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={0.4}>
              <div className="text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-green-200">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{t('learnByDoing')}</h3>
                <p className="text-gray-600">{t('learnByDoingDesc')}</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={0.6}>
              <div className="text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-green-200">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{t('acquireSkills')}</h3>
                <p className="text-gray-600">{t('acquireSkillsDesc')}</p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* Jogos Educativos */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <AnimatedElement>
            <h2 className="text-4xl font-bold text-center mb-16 text-green-800">{t('educationalGames')}</h2>
          </AnimatedElement>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameCard 
              icon="🔍" 
              title={t('digitalDetective')}
              description={t('digitalDetectiveDesc')}
              delay={0.2}
            />
            
            <GameCard 
              icon="🛡️" 
              title={t('detectBullying')}
              description={t('detectBullyingDesc')}
              delay={0.3}
            />
            
            <GameCard 
              icon="📱" 
              title={t('chooseResponse')}
              description={t('chooseResponseDesc')}
              delay={0.4}
            />
            
            <GameCard 
              icon="🔒" 
              title={t('createStrongPassword')}
              description={t('createStrongPasswordDesc')}
              delay={0.5}
            />
            
            <GameCard 
              icon="📰" 
              title={t('createNews')}
              description={t('createNewsDesc')}
              delay={0.6}
            />
            
            <GameCard 
              icon="🔗" 
              title={t('secureLink')}
              description={t('secureLinkDesc')}
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Estatísticas e Impacto */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6">
          <AnimatedElement>
            <h2 className="text-4xl font-bold text-center mb-16">{t('impactTitle')}</h2>
          </AnimatedElement>
          
          <div className="grid md:grid-cols-4 gap-10 text-center max-w-5xl mx-auto">
            <AnimatedElement delay={0.2}>
              <div>
                <div className="text-5xl font-bold mb-2">70%</div>
                <p className="text-green-100">{t('stat1')}</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={0.3}>
              <div>
                <div className="text-5xl font-bold mb-2">60%</div>
                <p className="text-green-100">{t('stat2')}</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={0.4}>
              <div>
                <div className="text-5xl font-bold mb-2">85%</div>
                <p className="text-green-100">{t('stat3')}</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={0.5}>
              <div>
                <div className="text-5xl font-bold mb-2">90%</div>
                <p className="text-green-100">{t('stat4')}</p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <AnimatedElement>
            <h2 className="text-4xl font-bold text-center mb-16 text-green-800">{t('testimonials')}</h2>
          </AnimatedElement>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedElement delay={0.2}>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-400">
                <p className="italic text-gray-600 mb-4">{t('testimonial1')}</p>
                <p className="font-bold">{t('testimonial1Author')}</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={0.3}>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-400">
                <p className="italic text-gray-600 mb-4">{t('testimonial2')}</p>
                <p className="font-bold">{t('testimonial2Author')}</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={0.4}>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-400">
                <p className="italic text-gray-600 mb-4">{t('testimonial3')}</p>
                <p className="font-bold">{t('testimonial3Author')}</p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <AnimatedElement>
            <h2 className="text-4xl font-bold mb-8">{t('ctaTitle')}</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">{t('ctaDesc')}</p>
            
            <Link 
              href={`/${locale}/game`}
              className="bg-white text-green-600 hover:bg-green-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              {t('startButton')}
            </Link>
          </AnimatedElement>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-green-600">{t('heroTitle')}</h3>
              <p className="text-gray-600">{t('footerTagline')}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} ClickSmart. {t('rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 