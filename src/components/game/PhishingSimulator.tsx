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
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('gameTitle')}
        </h2>
        
        <div className="bg-gradient-to-b from-green-50 to-green-50/30 rounded-lg p-8 mb-8 border border-green-100">
          <h3 className="font-bold text-lg text-green-600 mb-4">
            {t('instructions.title')}
          </h3>
          <ul className="space-y-3 mb-6">
            <li className="pl-7 text-gray-700 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {t('instructions.point1')}
            </li>
            <li className="pl-7 text-gray-700 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {t('instructions.point2')}
            </li>
            <li className="pl-7 text-gray-700 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {t('instructions.point3')}
            </li>
          </ul>
          <p className="text-gray-700 italic mt-4">
            {t('instructions.remember')}
          </p>
        </div>
        
        <button 
          onClick={() => setShowInstructions(false)} 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5">
          {t('startGame')}
        </button>
      </div>
    );
  }

  // Tela de jogo concluído
  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('gameOver.title')}
        </h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-6 text-center border border-green-100">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🛡️
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            {t('gameOver.message')}
          </p>
          <div className="flex items-center justify-center gap-2 font-bold text-green-600 text-xl before:content-['🏆']">
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
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {isCorrect ? t('feedback.correctTitle') : t('feedback.incorrectTitle')}
        </h2>
        
        <div className={`${isCorrect ? 'bg-green-50' : 'bg-red-50'} p-6 rounded-lg mb-6 border ${isCorrect ? 'border-green-100' : 'border-red-100'}`}>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${isCorrect ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center text-2xl`}>
              {isCorrect ? '✓' : '✗'}
            </div>
          </div>
          
          <h3 className="text-center font-medium text-lg mb-3 text-gray-800">
            {currentExample.isPhishing ? t('feedback.isPhishing') : t('feedback.isSafe')}
          </h3>
          
          <p className="text-center text-gray-700 mb-4">
            {currentExample.explanation}
          </p>
          
          <div className={`bg-white p-4 rounded-lg mb-2 ${currentExample.isPhishing ? 'border border-red-200' : 'border border-green-200'}`}>
            <h4 className="font-medium mb-1 text-gray-800">
              {currentExample.isPhishing ? t('tips.phishingSignsTitle') : t('tips.safeSignsTitle')}
            </h4>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
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
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5">
          {currentIndex < examples.length - 1 ? t('nextExample') : t('finishGame')}
        </button>
      </div>
    );
  }

  // Renderizar exemplo atual
  return (
    <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('gameTitle')}
        </h2>
        <div className="text-green-600 font-bold text-lg">
          {t('score')}: {score}
        </div>
      </div>
      
      <div className="bg-gray-50 p-2 rounded-lg mb-6 border border-gray-100">
        <div className="flex justify-between text-sm text-gray-500 px-2 mb-1">
          <span>{t('progress')}: {currentIndex + 1}/{examples.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / examples.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* E-mail simulado */}
      {currentExample.type === 'email' && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 bg-white shadow-sm">
          <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">De: {currentExample.sender}</p>
              <p className="text-sm text-gray-500">Assunto: {currentExample.title}</p>
            </div>
          </div>
          
          <div className="p-5">
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {currentExample.content}
            </div>
          </div>
        </div>
      )}

      {/* Website simulado */}
      {currentExample.type === 'website' && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 bg-white shadow-sm">
          <div className="bg-gray-100 border-b px-4 py-2 flex items-center">
            <span className="text-xs bg-gray-200 px-1 rounded mr-2">🔒</span>
            <span className="text-sm text-gray-800 truncate flex-1">{currentExample.url}</span>
          </div>
          
          <div className="p-5">
            <h3 className="text-xl font-medium mb-3 text-gray-800">{currentExample.title}</h3>
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {currentExample.content}
            </div>
          </div>
        </div>
      )}

      {/* Pop-up simulado */}
      {currentExample.type === 'popup' && (
        <div className="border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden mb-6 bg-white mx-auto max-w-md">
          <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
            <div className="text-lg font-bold text-gray-800">{currentExample.title}</div>
            <div className="text-gray-600 cursor-pointer">✕</div>
          </div>
          
          <div className="p-5 text-center">
            <div className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">
              {currentExample.content}
            </div>
            <div className="flex justify-center gap-3">
              <button className="bg-green-500 text-white px-4 py-2 rounded">OK</button>
              <button className="border border-gray-300 px-4 py-2 rounded text-gray-700">Cancelar</button>
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
          className="py-4 px-6 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg transition flex items-center justify-center shadow-sm hover:shadow"
        >
          <span className="text-2xl mr-2">✅</span> {t('buttons.safe')}
        </button>
        <button 
          onClick={() => handleChoice(true)}
          className="py-4 px-6 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-lg transition flex items-center justify-center shadow-sm hover:shadow"
        >
          <span className="text-2xl mr-2">🚫</span> {t('buttons.phishing')}
        </button>
      </div>
    </div>
  );
}