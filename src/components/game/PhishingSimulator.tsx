'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface PhishingExample {
  id: string;
  type: 'email' | 'popup' | 'website';
  title: string;
  content: string;
  sender?: string;
  url?: string;
  isPhishing: boolean;
  explanation: string;
  image?: string;
}

export default function PhishingSimulator({ onComplete }: { onComplete: (score: number) => void }) {
  const t = useTranslations('phishingSimulator');
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Exemplos de phishing e e-mails/sites seguros
  const examples: PhishingExample[] = [
    {
      id: 'email1',
      type: 'email',
      title: t('examples.email1.title'),
      content: t('examples.email1.content'),
      sender: 'ganhaste-premios@oferta.biz',
      isPhishing: true,
      explanation: t('examples.email1.explanation')
    },
    {
      id: 'email2',
      type: 'email',
      title: t('examples.email2.title'),
      content: t('examples.email2.content'),
      sender: 'noreply@escola.gov.pt',
      isPhishing: false,
      explanation: t('examples.email2.explanation')
    },
    {
      id: 'popup1',
      type: 'popup',
      title: t('examples.popup1.title'),
      content: t('examples.popup1.content'),
      isPhishing: true,
      explanation: t('examples.popup1.explanation')
    },
    {
      id: 'website1',
      type: 'website',
      title: t('examples.website1.title'),
      content: t('examples.website1.content'),
      url: 'https://faceb00k-login.com/recover',
      isPhishing: true,
      explanation: t('examples.website1.explanation')
    },
    {
      id: 'email3',
      type: 'email',
      title: t('examples.email3.title'),
      content: t('examples.email3.content'),
      sender: 'support@microsoft.com',
      isPhishing: false,
      explanation: t('examples.email3.explanation')
    }
  ];

  const handleChoice = (isPhishingChoice: boolean) => {
    const currentExample = examples[currentIndex];
    const isAnswerCorrect = isPhishingChoice === currentExample.isPhishing;
    
    // Atualizar pontuação
    const pointsEarned = isAnswerCorrect ? 5 : 0;
    setScore(prev => prev + pointsEarned);
    
    // Mostrar resultado com explicação
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
  };

  const handleContinue = () => {
    setShowResult(false);
    
    if (currentIndex < examples.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      // Jogo completado - bônus de conclusão
      const finalScore = score + 10; // bônus de conclusão
      setScore(finalScore);
      setGameCompleted(true);
      
      // Notificar componente pai após um curto delay
      setTimeout(() => {
        onComplete(finalScore);
      }, 2000);
    }
  };

  // Renderizar instruções iniciais
  if (showInstructions) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('gameTitle')}</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-lg text-blue-800 mb-3">{t('instructions.title')}</h3>
          <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
            <li>{t('instructions.point1')}</li>
            <li>{t('instructions.point2')}</li>
            <li>{t('instructions.point3')}</li>
          </ul>
          <p className="text-gray-700 italic mt-4">{t('instructions.remember')}</p>
        </div>
        
        <button 
          onClick={() => setShowInstructions(false)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition w-full">
          {t('startGame')}
        </button>
      </div>
    );
  }

  // Tela de jogo concluído
  if (gameCompleted) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('gameOver.title')}</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span role="img" aria-label="shield" className="text-2xl">🛡️</span>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{t('gameOver.message')}</p>
          <div className="text-xl font-bold text-blue-600 mb-2">
            {t('gameOver.finalScore')}: {score}
          </div>
        </div>
      </div>
    );
  }

  const currentExample = examples[currentIndex];
  
  // Mostrar resultado da escolha
  if (showResult) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {isCorrect ? t('feedback.correctTitle') : t('feedback.incorrectTitle')}
        </h2>
        
        <div className={`${isCorrect ? 'bg-green-50' : 'bg-red-50'} p-6 rounded-lg mb-6`}>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${isCorrect ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              <span className="text-2xl">{isCorrect ? '✓' : '✗'}</span>
            </div>
          </div>
          
          <h3 className="text-center font-medium text-lg mb-3">
            {currentExample.isPhishing ? t('feedback.isPhishing') : t('feedback.isSafe')}
          </h3>
          
          <p className="text-center text-gray-700 mb-4">{currentExample.explanation}</p>
          
          <div className={`bg-white p-4 rounded-lg mb-2 ${currentExample.isPhishing ? 'border border-red-200' : 'border border-green-200'}`}>
            <h4 className="font-medium mb-1">
              {currentExample.isPhishing ? t('tips.phishingSignsTitle') : t('tips.safeSignsTitle')}
            </h4>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              {currentExample.isPhishing ? (
                <>
                  <li>{t('tips.phishingSigns.1')}</li>
                  <li>{t('tips.phishingSigns.2')}</li>
                  <li>{t('tips.phishingSigns.3')}</li>
                </>
              ) : (
                <>
                  <li>{t('tips.safeSigns.1')}</li>
                  <li>{t('tips.safeSigns.2')}</li>
                  <li>{t('tips.safeSigns.3')}</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <button 
          onClick={handleContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition w-full">
          {currentIndex < examples.length - 1 ? t('nextExample') : t('finishGame')}
        </button>
      </div>
    );
  }

  // Renderizar exemplo atual
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{t('gameTitle')}</h2>
        <div className="text-gray-700 font-semibold">{t('score')}: {score}</div>
      </div>
      
      <div className="bg-gray-50 p-1 rounded-lg mb-4">
        <div className="flex justify-between text-sm text-gray-500 px-2">
          <span>{t('progress')}: {currentIndex + 1}/{examples.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentIndex + 1) / examples.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* E-mail simulado */}
      {currentExample.type === 'email' && (
        <div className="border rounded-lg overflow-hidden mb-6 bg-white">
          <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
            <div>
              <p className="font-medium text-black">De: {currentExample.sender}</p>
              <p className="text-sm text-gray-500">Assunto: {currentExample.title}</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-gray-800 whitespace-pre-wrap">
              {currentExample.content}
            </div>
          </div>
        </div>
      )}

      {/* Website simulado */}
      {currentExample.type === 'website' && (
        <div className="border rounded-lg overflow-hidden mb-6 bg-white">
          <div className="bg-gray-100 border-b px-4 py-2 flex items-center">
            <span className="text-xs bg-gray-200 px-1 rounded mr-2">🔒</span>
            <span className="text-sm text-gray-800 truncate flex-1">{currentExample.url}</span>
          </div>
          
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">{currentExample.title}</h3>
            <div className="text-gray-800 whitespace-pre-wrap">
              {currentExample.content}
            </div>
          </div>
        </div>
      )}

      {/* Pop-up simulado */}
      {currentExample.type === 'popup' && (
        <div className="border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden mb-6 bg-white mx-auto max-w-md">
          <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
            <div className="text-lg font-bold">{currentExample.title}</div>
            <div>✕</div>
          </div>
          
          <div className="p-4 text-center">
            <div className="text-gray-800 mb-4 whitespace-pre-wrap">
              {currentExample.content}
            </div>
            <div className="flex justify-center gap-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded">OK</button>
              <button className="border border-gray-300 px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-medium mb-3 text-gray-800">{t('question')}</h3>
      </div>

      {/* Botões de resposta */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleChoice(false)}
          className="py-4 px-6 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg transition flex items-center justify-center"
        >
          <span className="text-2xl mr-2">✅</span> {t('buttons.safe')}
        </button>
        <button 
          onClick={() => handleChoice(true)}
          className="py-4 px-6 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-lg transition flex items-center justify-center"
        >
          <span className="text-2xl mr-2">🚫</span> {t('buttons.phishing')}
        </button>
      </div>
    </div>
  );
}