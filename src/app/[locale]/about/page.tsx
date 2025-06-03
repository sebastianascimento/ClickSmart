'use client';

import Link from "next/link";
import { useEffect, useRef, ReactNode } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useTranslations, useLocale } from 'next-intl';
import GameLayout from '@/components/game/GameLayout'; // Caminho correto baseado na sua estrutura

// Interface para as props do AnimatedElement
interface AnimatedElementProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Interface para as props do ThemeCard
interface ThemeCardProps {
  icon: string;
  title: string;
  description: string;
  bgColor?: string;
  borderColor?: string;
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

// Componente para os cards de temas
const ThemeCard = ({ icon, title, description, bgColor = "bg-blue-50", borderColor = "border-blue-100" }: ThemeCardProps) => (
  <AnimatedElement delay={0.2}>
    <div className={`rounded-lg p-6 border ${borderColor} hover:shadow-md transition-shadow ${bgColor}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
    </div>
  </AnimatedElement>
);

// Componente para os cards de jogos
const GameCard = ({ icon, title, description, delay = 0 }: GameCardProps) => (
  <AnimatedElement delay={delay}>
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  </AnimatedElement>
);

// Conteúdo da página About
const AboutContent = () => {
  const t = useTranslations('about');
  const locale = useLocale();
  
  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white">
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
            className="absolute bottom-10 left-20 w-80 h-80 rounded-full bg-green-200 opacity-20"
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4 text-green-600">{t('title')}</h1>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Project Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimatedElement>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-center mb-10 text-green-700">{t('project.title')}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">{t('project.description1')}</p>
                  <p className="text-gray-700 text-lg leading-relaxed">{t('project.description2')}</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-100">
                  <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center">
                    <span className="text-2xl mr-2">🎯</span>
                    {t('howItWorks.title')}
                  </h3>
                  <p className="text-gray-700">{t('howItWorks.description')}</p>
                </div>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Digital Citizenship Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimatedElement>
            <h2 className="text-4xl font-bold text-center mb-12 text-green-700">{t('digitalCitizenship.title')}</h2>
          </AnimatedElement>
          
          <AnimatedElement delay={0.2}>
            <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-gray-700">{t('digitalCitizenship.description')}</p>
          </AnimatedElement>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.raw('digitalCitizenship.skills').map((skill: string, i: number) => (
                <AnimatedElement key={i} delay={0.1 * (i + 1)}>
                  <div className="flex items-start p-4 rounded-lg border border-green-100 bg-white hover:shadow-md transition-all">
                    <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Game Themes Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimatedElement>
            <h2 className="text-4xl font-bold text-center mb-12 text-green-700">{t('howItWorks.title')}</h2>
          </AnimatedElement>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <ThemeCard 
              icon="🔍" 
              title={t('howItWorks.levels.misinformation.title')}
              description={t('howItWorks.levels.misinformation.description')}
              bgColor="bg-blue-50"
              borderColor="border-blue-100"
            />
            
            <ThemeCard 
              icon="🛡️" 
              title={t('howItWorks.levels.cyberbullying.title')}
              description={t('howItWorks.levels.cyberbullying.description')}
              bgColor="bg-purple-50"
              borderColor="border-purple-100"
            />
            
            <ThemeCard 
              icon="🔒" 
              title={t('howItWorks.levels.security.title')}
              description={t('howItWorks.levels.security.description')}
              bgColor="bg-yellow-50"
              borderColor="border-yellow-100"
            />
          </div>
          
          <AnimatedElement>
            <div className="text-center my-8 text-lg font-medium text-gray-700">
              {t('howItWorks.conclusion')}
            </div>
          </AnimatedElement>
        </div>
      </section>
      
      {/* Educational Games Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimatedElement>
            <h2 className="text-4xl font-bold text-center mb-12 text-green-700">Educational Games</h2>
          </AnimatedElement>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {Object.keys(t.raw('howItWorks.levels')).slice(3, 9).map((game: string, index: number) => (
              <GameCard 
                key={index}
                icon={
                  game === 'detective' ? '🔎' :
                  game === 'factcheck' ? '✓' :
                  game === 'chat' ? '💬' :
                  game === 'bullying' ? '👁️' :
                  game === 'positive' ? '❤️' :
                  game === 'report' ? '🚩' : '🎮'
                }
                title={t(`howItWorks.levels.${game}.title`)}
                description={t(`howItWorks.levels.${game}.description`)}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.keys(t.raw('howItWorks.levels')).slice(9, 15).map((game: string, index: number) => (
              <GameCard 
                key={index}
                icon={
                  game === 'phishing' ? '🎣' :
                  game === 'password' ? '🔑' :
                  game === 'link' ? '🔗' :
                  game === 'simulator' ? '🧪' :
                  game === 'fakenews' ? '📰' : '🎮'
                }
                title={t(`howItWorks.levels.${game}.title`)}
                description={t(`howItWorks.levels.${game}.description`)}
                delay={0.1 * (index + 7)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Componente principal com GameLayout
export default function AboutPage() {
  return (
    <GameLayout >
      <AboutContent />
    </GameLayout>
  );
}