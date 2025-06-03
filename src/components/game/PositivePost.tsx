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
  
  // Definir mensagens predefinidas - inclui tanto positivas quanto negativas agora
  const presetMessages = [
    "Adorei seu estilo único! É ótimo ver alguém com personalidade!",
    "Você está incrível! Continue sendo autêntico.",
    "Eu realmente admiro sua coragem de expressar seu próprio estilo.",
    "Seu visual é inspirador! Não ligue para comentários negativos.",
    // Comentários negativos adicionados
    "Essa moda é tão estranha, você deveria tentar algo mais normal.",
    "Não sei se esse visual combina com você... talvez algo mais tradicional?",
    "Honestamente, eu não teria coragem de usar isso em público.",
    "É uma escolha... interessante. Mas não é para todos, né?"
  ];
  
  const getMessageType = (message: string): boolean => {
    // Os primeiros 4 são positivos, os últimos 4 são negativos
    const positiveMessages = presetMessages.slice(0, 4);
    return positiveMessages.includes(message);
  };
  
  // Handle message submission
  const handleSubmitMessage = () => {
    const message = selectedMessage || customMessage;
    
    if (!message.trim()) return; // Don't proceed if no message
    
    // Verifique se a mensagem é positiva ou negativa
    const isPositive = selectedMessage ? getMessageType(selectedMessage) : true; // Assume customMessage como positiva
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
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {t('gameTitle')}
        </h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-lg text-blue-800 mb-3">
            {t('instructions.title')}
          </h3>
          <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
            <li>{t('instructions.point1')}</li>
            <li>{t('instructions.point2')}</li>
            <li>{t('instructions.point3')}</li>
          </ul>
          <p className="text-gray-700 italic mt-4">{t('instructions.remember')}</p>
        </div>
        
        <button
          onClick={() => setShowInstructions(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition w-full"
        >
          {t('startGame')}
        </button>
      </div>
    );
  }
  
  if (showGameOver) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {t('gameOver.title')}
        </h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
          <p className="text-gray-700 mb-4">
            {t('gameOver.description')}
          </p>
          <div className="text-xl font-bold text-blue-600 mb-2">
            {t('gameOver.finalScore')}: {score}
          </div>
        </div>
      </div>
    );
  }
  
  if (showImpact) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {isPositiveMessage ? t('impact.title') : "Impacto Negativo"}
        </h2>
        
        <div className={`${isPositiveMessage ? "bg-green-50" : "bg-red-50"} p-6 rounded-lg mb-6`}>
          <div className="flex flex-col items-center mb-6">
            <div className={`w-20 h-20 ${isPositiveMessage ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center mb-3`}>
              <span className="text-3xl">{isPositiveMessage ? "😊" : "😔"}</span>
            </div>
            <p className="text-gray-700 text-center">
              {isPositiveMessage 
                ? t('impact.description') 
                : "Sua mensagem negativa pode ter piorado ainda mais a situação. Comentários negativos têm um impacto forte nas pessoas."
              }
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg mb-6 border border-green-200">
            <p className="text-gray-700 italic">
              <span className="font-medium">{t(`${scenarioKey}.victim`)}:</span> 
              {isPositiveMessage 
                ? t('impact.victimResponse') 
                : "Eu já estava me sentindo mal... isso só piorou tudo. 😢"
              }
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">{t('impact.stats.title')}</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {isPositiveMessage ? (
                <>
                  <li>{t('impact.stats.fact1')}</li>
                  <li>{t('impact.stats.fact2')}</li>
                  <li>{t('impact.stats.fact3')}</li>
                </>
              ) : (
                <>
                  <li>71% dos jovens já sofreram cyberbullying e relataram problemas de ansiedade e depressão</li>
                  <li>Comentários negativos podem ter um impacto psicológico 5x maior que comentários positivos</li>
                  <li>41% de adolescentes que sofreram bullying online relataram pensamentos de autoagressão</li>
                  <li>Comentários negativos podem permanecer na memória da pessoa por anos, mesmo após uma simples interação</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between gap-4">
          <button
            onClick={handleContinue}
            className={`${isPositiveMessage ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} text-white px-6 py-3 rounded-lg transition flex-1`}
          >
            {scenarios.filter(s => !s.completed).length > 0 ? t('tryAnother') : t('finishGame')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t('gameTitle')}
        </h2>
        <div>
          <span className="text-gray-700 font-semibold">
            {t('score')}: {score}
          </span>
        </div>
      </div>
      
      {/* Scenario */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-1">
          {t(`${scenarioKey}.title`)}
        </h3>
        <p className="text-gray-700 mb-4">
          {t(`${scenarioKey}.context`)}
        </p>
      </div>
      
      {/* Social Media Post */}
      <div className="border rounded-lg overflow-hidden mb-6">
        {/* Post Header */}
        <div className="flex items-center p-3 border-b bg-white">
          <div className="h-10 w-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs font-bold">
              {t(`${scenarioKey}.victim`).charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">{t(`${scenarioKey}.victim`)}</h3>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="p-4 bg-white">
          <p className="text-gray-800 mb-4">{t(`${scenarioKey}.victimMessage`)}</p>
          {/* Comentários negativos agora com texto preto */}
          <div className="bg-gray-100 p-3 rounded-lg mb-2 text-black font-medium">
            {t(`${scenarioKey}.negativeComments.0`)}
          </div>
          <div className="bg-gray-100 p-3 rounded-lg mb-2 text-black font-medium">
            {t(`${scenarioKey}.negativeComments.1`)}
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-black font-medium">
            {t(`${scenarioKey}.negativeComments.2`)}
          </div>
        </div>
      </div>
      
      {/* Response Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-700 mb-3">
          {t('writeYourOwn')}
        </h3>
        <textarea
          className="w-full border rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={customMessage}
          onChange={(e) => {
            setCustomMessage(e.target.value);
            setSelectedMessage(null); // Clear any selected preset message
          }}
          placeholder="Type your supportive message here..."
        />
      </div>
      
      {/* Preset Messages */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-700 mb-3">
          {t('orChooseOne')}
        </h3>
        <div className="space-y-2">
          {presetMessages.map((message, index) => {
            const isPositive = index < 4; // Os primeiros 4 são mensagens positivas
            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedMessage(message);
                  setCustomMessage(''); // Clear custom message
                }}
                className={`p-3 rounded-lg border cursor-pointer ${
                  selectedMessage === message 
                    ? 'bg-blue-50 border-blue-500' // Agora todas as mensagens selecionadas têm a mesma borda
                    : 'border-gray-200 hover:bg-gray-50'
                } text-black font-medium`}
              >
                {message}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleSubmitMessage}
        disabled={!customMessage && !selectedMessage}
        className={`w-full py-3 px-6 rounded-lg ${
          !customMessage && !selectedMessage
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {t('submitMessage')}
      </button>
    </div>
  );
}