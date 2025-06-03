'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import DetectiveGame from '@/components/game/DetectiveGame';
import FactCheckGame from '@/components/game/FactCheckGame';
import ChatGame from '@/components/game/ChatGame';
import BullyingDetector from '@/components/game/BullyingDetector';
import PositivePost from '@/components/game/PositivePost';
import ReportSimulator from '@/components/game/ReportSimulator';
import PasswordCreator from '@/components/game/PasswordCreator';
import LinkHunter from '@/components/game/LinkHunter';
import PhishingSimulator from '@/components/game/PhishingSimulator';
import SecuritySimulator from '@/components/game/SecuritySimulator';
import FakenewsCreator from '@/components/game/FakenewsCreator';
import GameLayout from '@/components/game/GameLayout';

interface Game {
  id: string;
  icon: string;
  backgroundClass: string;
  component: React.ComponentType<{onComplete: (score: number) => void}>;
}

export default function GamePage() {
  const t = useTranslations();
  const gameT = useTranslations('game');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  
  // Obter o tipo de jogo da URL
  const gameTypeFromUrl = searchParams.get('type') as string | null;
  
  // Helper function para construir o URL para troca de idioma
  const getLocalePath = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    return `/${newLocale}${pathWithoutLocale}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  };
  
  // Lista de jogos disponíveis com seus componentes correspondentes
  const games: Game[] = [
    { 
      id: 'detective', 
      icon: '🔍', 
      backgroundClass: 'from-green-200 to-green-100',
      component: DetectiveGame
    },
    { 
      id: 'factcheck', 
      icon: '🧐', 
      backgroundClass: 'from-teal-200 to-teal-100',
      component: FactCheckGame
    },
    { 
      id: 'chat', 
      icon: '📱', 
      backgroundClass: 'from-blue-200 to-blue-100',
      component: ChatGame
    },
    { 
      id: 'bullying', 
      icon: '🛡️', 
      backgroundClass: 'from-indigo-200 to-indigo-100',
      component: BullyingDetector
    },
    { 
      id: 'positive', 
      icon: '😊', 
      backgroundClass: 'from-purple-200 to-purple-100',
      component: PositivePost
    },
    { 
      id: 'report', 
      icon: '🚨', 
      backgroundClass: 'from-red-200 to-red-100',
      component: ReportSimulator
    },
    { 
      id: 'phishing', 
      icon: '🎣', 
      backgroundClass: 'from-orange-200 to-orange-100',
      component: PhishingSimulator
    },
    { 
      id: 'password', 
      icon: '🔒', 
      backgroundClass: 'from-yellow-200 to-yellow-100',
      component: PasswordCreator
    },
    { 
      id: 'link', 
      icon: '🔗', 
      backgroundClass: 'from-lime-200 to-lime-100',
      component: LinkHunter
    },
    { 
      id: 'simulator', 
      icon: '🔮', 
      backgroundClass: 'from-emerald-200 to-emerald-100',
      component: SecuritySimulator
    },
    { 
      id: 'fakenews', 
      icon: '📰', 
      backgroundClass: 'from-cyan-200 to-cyan-100',
      component: FakenewsCreator
    }
  ];
  
  // Função para obter descrições dos jogos
  const getGameDescription = (gameId: string) => {
    if (!gameId || gameId.trim() === '') {
      return '';
    }
    
    try {
      return t(`about.howItWorks.levels.${gameId}.description`);
    } catch (error) {
      console.log(`Description not found for ${gameId}`);
      return '';
    }
  };
  
  // Obter o label para o tipo de jogo
  const getGameTypeLabel = (type: string) => {
    // Verificação para evitar erros com valores vazios ou nulos
    if (!type || type.trim() === '') {
      return ''; // Retorna string vazia ou um texto padrão
    }
    
    try {
      return gameT(`gameTypes.${type}`);
    } catch (error) {
      console.log(`Translation error for game type ${type}:`, error);
      return type;
    }
  };
  
  // Função para iniciar um jogo
  const startGame = () => {
    if (selectedGame) {
      // Redirecionar para a página principal de jogos com o parâmetro de tipo de jogo
      router.push(`/${locale}/game?type=${selectedGame}`);
    } else {
      // Se nenhum jogo estiver selecionado, redirecionar para o primeiro jogo
      router.push(`/${locale}/game?type=detective`);
    }
  };

  // Função para lidar com a conclusão do jogo
  const handleGameComplete = (score: number) => {
    setGameScore(score);
    setGameCompleted(true);
  };
  
  // Função para resetar o estado do jogo
  const resetGameState = () => {
    setGameCompleted(false);
    setGameScore(0);
  };
  
  // Função para escolher outro jogo (com reset de estado)
  const chooseAnotherGame = () => {
    resetGameState();
    router.push(`/${locale}/game`);
  };
  
  // Obter o componente do jogo atual com base no tipo de URL
  const getCurrentGameComponent = () => {
    if (!gameTypeFromUrl) return null;
    
    const game = games.find(g => g.id === gameTypeFromUrl);
    if (!game) return null;
    
    // Crie uma nova instância do componente para cada renderização com uma key única
    const GameComponent = game.component;
    return <GameComponent key={gameTypeFromUrl} onComplete={handleGameComplete} />;
  };
  
  useEffect(() => {
    // Se um tipo de jogo for especificado na URL, defina-o como selecionado
    if (gameTypeFromUrl) {
      setSelectedGame(gameTypeFromUrl);
    }
    
    // Resetar o estado do jogo quando o tipo de jogo muda
    resetGameState();
    
    // Simulate loading game resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [gameTypeFromUrl]);
  
  // Verificar se estamos exibindo um jogo específico
  const isShowingSpecificGame = !!gameTypeFromUrl;
  
  // Conteúdo para jogo específico
  const specificGameContent = (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {gameTypeFromUrl ? getGameTypeLabel(gameTypeFromUrl) : ''}
        </h1>
        <Link 
          href={`/${locale}/game`}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          onClick={resetGameState}
        >
          {locale === 'pt' ? 'Voltar' : 'Back'}
        </Link>
      </div>
      
      {gameCompleted ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            {gameT('gameCompleted')}
          </h2>
          <p className="text-gray-700 mb-6">
            {gameT('finalScore')}: {gameScore}
          </p>
          <div className="flex justify-center">
            <button 
              onClick={chooseAnotherGame}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
            >
              {gameT('chooseAnotherGame') || (locale === 'pt' ? 'Escolher outro jogo' : 'Choose another game')}
            </button>
          </div>
        </div>
      ) : (
        getCurrentGameComponent()
      )}
    </div>
  );

  // Conteúdo para lista de jogos
  const gameListContent = (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2 text-green-600 text-center">{t('app.title')}</h1>
          <p className="text-xl text-center text-gray-600 mb-10">{t('app.tagline')}</p>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
              <p className="ml-4 text-green-600 text-lg">{t('game.loading')}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-10"
            >
              {/* Featured Game Section */}
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-green-700 mb-6">{t('game.whatWouldYouDo')}</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-gray-700 mb-6 text-lg">
                        {t('home.description')}
                      </p>
                      
                      <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500 mb-6">
                        <h3 className="font-semibold text-green-800">{t('home.sections.scenarios.title')}</h3>
                        <p className="text-sm text-gray-700">{t('home.sections.scenarios.description')}</p>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
                        onClick={startGame}
                      >
                        {selectedGame ? t('game.continue') : t('home.startGame')}
                      </motion.button>
                    </div>
                    
                    <div className="relative">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl h-full flex items-center justify-center p-8 text-white text-center"
                      >
                        <div>
                          <div className="text-6xl mb-4">🎮</div>
                          <h3 className="text-2xl font-bold mb-2">{t('game.whatWouldYouDo')}</h3>
                          <p>{t('game.whatWouldYouDo')}</p>
                          <p className="mt-4 text-sm opacity-90">
                            {selectedGame ? (
                              <>Jogo selecionado: {getGameTypeLabel(selectedGame)}</>
                            ) : (
                              <>Selecione um jogo abaixo para começar ou clique em "Começar Jogo" para iniciar</>
                            )}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Games Grid */}
              <div>
                <h2 className="text-2xl font-bold text-green-700 mb-6">
                  {gameT('gameTypes.choice')}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {games.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      whileHover={{ scale: 1.03 }}
                      className={`h-full cursor-pointer`}
                      onClick={() => setSelectedGame(game.id)}
                    >
                      <div className={`bg-gradient-to-br ${game.backgroundClass} p-6 rounded-xl shadow-md h-full
                                      ${selectedGame === game.id ? 'ring-4 ring-green-500' : 'hover:shadow-lg'}`}>
                        <div className="flex flex-col h-full">
                          <div className="flex items-center mb-4">
                            <span className="text-3xl mr-3">{game.icon}</span>
                            <h3 className="text-xl font-bold">
                              {getGameTypeLabel(game.id)}
                            </h3>
                          </div>
                          
                          <p className="text-gray-700 mb-6 flex-grow text-sm">
                            {getGameDescription(game.id)}
                          </p>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow transition self-start"
                            onClick={(e) => {
                              e.stopPropagation();
                              resetGameState(); // Resetar estado antes de navegar
                              router.push(`/${locale}/game?type=${game.id}`);
                            }}
                          >
                            {t('game.continue')} →
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white shadow-lg rounded-xl p-8 border border-green-100"
              >
                <h3 className="text-xl font-bold mb-4 text-green-700">{t('game.progress')}</h3>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                  <div className="bg-green-600 h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">{t('game.score')}: <span className="font-bold">0</span></p>
                  </div>
                  <Link 
                    href={`/${locale}`}
                    className="text-green-600 hover:text-green-700 hover:underline"
                  >
                    {t('navigation.home')}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );

  // Renderizar com o GameLayout
  return (
    <GameLayout>
      {isShowingSpecificGame && !loading ? specificGameContent : gameListContent}
    </GameLayout>
  );
}