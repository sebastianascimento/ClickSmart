'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface Scenario {
  id: string;
  completed?: boolean;
}

export default function PositivePost({ onComplete }: { onComplete: (score: number) => void }) {
  const t = useTranslations('positivePost');
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string>('fashion');
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'fashion' },
    { id: 'hobby' },
    { id: 'grade' }
  ]);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showImpact, setShowImpact] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPositiveMessage, setIsPositiveMessage] = useState(true);
  
  // Current scenario translation keys
  const scenarioKey = `scenarios.${currentScenario}`;
  
  // Definir mensagens predefinidas usando o sistema de tradução
  const presetMessages = [
    t('presetMessages.positive1'),
    t('presetMessages.negative1'),
    t('presetMessages.positive2'),
    t('presetMessages.negative2'),
    t('presetMessages.positive3'),
    t('presetMessages.negative3'),
    t('presetMessages.positive4'),
    t('presetMessages.negative4')
  ];
  
  // Array que define quais mensagens são positivas (true) ou negativas (false)
  // Corresponde à ordem de presetMessages acima
  const isPositiveArray = [true, false, true, false, true, false, true, false];
  
  const getMessageType = (message: string): boolean => {
    // Encontrar índice da mensagem e retornar se é positiva ou não
    const index = presetMessages.indexOf(message);
    if (index !== -1) {
      return isPositiveArray[index];
    }
    return true; // Assume que mensagens personalizadas são positivas
  };
  
  // Handle message submission
  const handleSubmitMessage = () => {
    const message = selectedMessage || customMessage;
    
    if (!message.trim()) return; // Don't proceed if no message
    
    // Verifique se a mensagem é positiva ou negativa
    const isPositive = selectedMessage ? getMessageType(selectedMessage) : true; 
    setIsPositiveMessage(isPositive);
    
    // Update score - pontos diferentes baseados no tipo de mensagem
    const pointValue = isPositive ? (selectedMessage ? 5 : 10) : -5; // Comentários negativos reduzem pontos
    setScore(prev => prev + pointValue);
    
    // Mark scenario as completed
    setScenarios(prev => 
      prev.map(s => s.id === currentScenario ? { ...s, completed: true } : s)
    );
    
    // Show the impact screen
    setShowImpact(true);
  };
  
  // Go to next scenario or finish game
  const handleContinue = () => {
    setShowImpact(false);
    setCustomMessage('');
    setSelectedMessage(null);
    
    // Check if there are any uncompleted scenarios
    const uncompletedScenarios = scenarios.filter(s => !s.completed);
    
    if (uncompletedScenarios.length > 0) {
      // Go to next uncompleted scenario
      setCurrentScenario(uncompletedScenarios[0].id);
    } else {
      // All scenarios completed - finish the game
      setShowGameOver(true);
      
      // Add completion bonus only if score is positive
      const completionBonus = score > 0 ? 15 : 0;
      setScore(prev => prev + completionBonus);
      
      // Wait a bit before completing the game
      setTimeout(() => {
        onComplete(score + completionBonus);
      }, 3000);
    }
  };
  
  if (showInstructions) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('gameTitle')}
        </h2>
        
        <div className="bg-gradient-to-b from-green-50 to-green-50/30 rounded-lg p-8 mb-8 border border-green-100">
          <h3 className="font-bold text-lg text-green-600 mb-4">
            {t('instructions.title')}
          </h3>
          <ul className="space-y-3 mb-6">
            <li className="pl-7 text-gray-800 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {t('instructions.point1')}
            </li>
            <li className="pl-7 text-gray-800 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {t('instructions.point2')}
            </li>
            <li className="pl-7 text-gray-800 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {t('instructions.point3')}
            </li>
          </ul>
          <p className="text-gray-700 italic mt-4">{t('instructions.remember')}</p>
        </div>
        
        <button
          onClick={() => setShowInstructions(false)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
        >
          {t('startGame')}
        </button>
      </div>
    );
  }
  
  if (showGameOver) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('gameOver.title')}
        </h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-6 text-center">
          <p className="text-gray-700 mb-4">
            {t('gameOver.description')}
          </p>
          <div className="flex items-center justify-center gap-2 font-bold text-green-600 text-xl before:content-['🏆']">
            {t('gameOver.finalScore')}: {score}
          </div>
        </div>
      </div>
    );
  }
  
  if (showImpact) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {isPositiveMessage ? t('impact.title') : t('impact.titleNegative')}
        </h2>
        
        {/* Uniformizar para verde independente do tipo de mensagem */}
        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl">{isPositiveMessage ? "😊" : "😔"}</span>
            </div>
            <p className="text-gray-700 text-center">
              {isPositiveMessage 
                ? t('impact.description') 
                : t('impact.descriptionNegative')
              }
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200">
            <p className="text-gray-700 italic">
              <span className="font-medium">{t(`${scenarioKey}.victim`)}:</span> 
              {isPositiveMessage 
                ? t('impact.victimResponse') 
                : t('impact.victimResponseNegative')
              }
            </p>
          </div>
          
          <div className="bg-green-50/70 p-4 rounded-lg border border-green-100">
            <h4 className="font-semibold mb-2 text-green-600">
              {t('impact.stats.title')}
            </h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {isPositiveMessage ? (
                <>
                  <li>{t('impact.stats.fact1')}</li>
                  <li>{t('impact.stats.fact2')}</li>
                  <li>{t('impact.stats.fact3')}</li>
                </>
              ) : (
                <>
                  <li>{t('impact.stats.negFact1')}</li>
                  <li>{t('impact.stats.negFact2')}</li>
                  <li>{t('impact.stats.negFact3')}</li>
                  <li>{t('impact.stats.negFact4')}</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between gap-4">
          <button
            onClick={handleContinue}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5 flex-1"
          >
            {scenarios.filter(s => !s.completed).length > 0 ? t('tryAnother') : t('finishGame')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('gameTitle')}
        </h2>
        <div>
          <span className="text-green-600 font-bold text-lg">
            {t('score')}: {score}
          </span>
        </div>
      </div>
      
      {/* Scenario */}
      <div className="bg-green-50 p-5 rounded-lg mb-6 border border-green-100">
        <h3 className="font-bold text-lg text-green-600 mb-2">
          {t(`${scenarioKey}.title`)}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {t(`${scenarioKey}.context`)}
        </p>
      </div>
      
      {/* Social Media Post */}
      <div className="border rounded-lg overflow-hidden mb-6 shadow-sm">
        {/* Post Header */}
        <div className="flex items-center p-4 border-b bg-white">
          <div className="h-10 w-10 bg-green-400 rounded-full mr-4 flex items-center justify-center text-white font-semibold text-lg">
            {t(`${scenarioKey}.victim`).charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t(`${scenarioKey}.victim`)}</h3>
            <p className="text-xs text-gray-500">{t('postedTime')}</p>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="p-5 bg-white">
          <p className="text-gray-800 mb-4 leading-relaxed">{t(`${scenarioKey}.victimMessage`)}</p>
          {/* Comentários negativos */}
          <div className="bg-gray-100 p-3 rounded-lg mb-2 text-gray-800">
            {t(`${scenarioKey}.negativeComments.0`)}
          </div>
          <div className="bg-gray-100 p-3 rounded-lg mb-2 text-gray-800">
            {t(`${scenarioKey}.negativeComments.1`)}
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-gray-800">
            {t(`${scenarioKey}.negativeComments.2`)}
          </div>
        </div>
      </div>
      
      {/* Response Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-3">
          {t('writeYourOwn')}
        </h3>
        <textarea
          className="w-full border rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={3}
          value={customMessage}
          onChange={(e) => {
            setCustomMessage(e.target.value);
            setSelectedMessage(null); // Clear any selected preset message
          }}
          placeholder={t('messagePlaceholder') || "Write your comment here..."}
        />
      </div>
      
      {/* Preset Messages - Todas com o mesmo estilo */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-3">
          {t('orChooseOne')}
        </h3>
        <div className="space-y-2">
          {presetMessages.map((message, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedMessage(message);
                setCustomMessage(''); // Clear custom message
              }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedMessage === message 
                  ? 'bg-green-50 border-green-500' 
                  : 'border-gray-200 hover:bg-gray-50'
              } text-gray-800`}
            >
              {message}
            </div>
          ))}
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleSubmitMessage}
        disabled={!customMessage && !selectedMessage}
        className={`w-full py-3 px-6 rounded-lg transition-all ${
          !customMessage && !selectedMessage
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white font-semibold hover:shadow-lg active:translate-y-0.5'
        }`}
      >
        {t('submitMessage')}
      </button>
    </div>
  );
}