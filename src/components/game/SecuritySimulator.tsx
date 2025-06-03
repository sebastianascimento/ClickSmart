'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface SecuritySimulatorProps {
  onComplete: (score: number) => void;
}

interface Choice {
  id: string;
  text: string;
  isGood: boolean;
  consequence: string;
  lesson: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
}

const SecuritySimulator: React.FC<SecuritySimulatorProps> = ({ onComplete }) => {
  const t = useTranslations('securitySimulator');
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showConsequence, setShowConsequence] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Adaptar para usar a estrutura de tradução existente
  const getScenarios = (): Scenario[] => [
    {
      id: 'phishing',
      title: t('scenarios.phishing.title'),
      description: t('scenarios.phishing.description'),
      choices: [
        {
          id: 'fill',
          text: t('scenarios.phishing.choices.fill'),
          isGood: false,
          consequence: t('scenarios.phishing.consequences.fill'),
          lesson: t('scenarios.phishing.lessons.fill')
        },
        {
          id: 'check',
          text: t('scenarios.phishing.choices.check'),
          isGood: true,
          consequence: t('scenarios.phishing.consequences.check'),
          lesson: t('scenarios.phishing.lessons.check')
        },
        {
          id: 'close',
          text: t('scenarios.phishing.choices.close'),
          isGood: true,
          consequence: t('scenarios.phishing.consequences.close'),
          lesson: t('scenarios.phishing.lessons.close')
        }
      ]
    },
    {
      id: 'password',
      title: t('scenarios.password.title'),
      description: t('scenarios.password.description'),
      choices: [
        {
          id: 'simple',
          text: t('scenarios.password.choices.simple'),
          isGood: false,
          consequence: t('scenarios.password.consequences.simple'),
          lesson: t('scenarios.password.lessons.simple')
        },
        {
          id: 'strong',
          text: t('scenarios.password.choices.strong'),
          isGood: true,
          consequence: t('scenarios.password.consequences.strong'),
          lesson: t('scenarios.password.lessons.strong')
        },
        {
          id: 'reuse',
          text: t('scenarios.password.choices.reuse'),
          isGood: false,
          consequence: t('scenarios.password.consequences.reuse'),
          lesson: t('scenarios.password.lessons.reuse')
        }
      ]
    },
    {
      id: 'publicWifi',
      title: t('scenarios.publicWifi.title'),
      description: t('scenarios.publicWifi.description'),
      choices: [
        {
          id: 'useVPN',
          text: t('scenarios.publicWifi.choices.useVPN'),
          isGood: true,
          consequence: t('scenarios.publicWifi.consequences.useVPN'),
          lesson: t('scenarios.publicWifi.lessons.useVPN')
        },
        {
          id: 'login',
          text: t('scenarios.publicWifi.choices.login'),
          isGood: false,
          consequence: t('scenarios.publicWifi.consequences.login'),
          lesson: t('scenarios.publicWifi.lessons.login')
        },
        {
          id: 'wait',
          text: t('scenarios.publicWifi.choices.wait'),
          isGood: true,
          consequence: t('scenarios.publicWifi.consequences.wait'),
          lesson: t('scenarios.publicWifi.lessons.wait')
        }
      ]
    }
  ];
  
  const scenarios = getScenarios();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoiceSelect = (choiceId: string) => {
    const currentScenarioData = scenarios[currentScenario];
    const choice = currentScenarioData.choices.find(c => c.id === choiceId);
    
    if (choice) {
      setSelectedChoice(choiceId);
      // Add points if it's a good choice
      if (choice.isGood) {
        setScore(prevScore => prevScore + 10);
      }
      
      // Show consequence
      setShowConsequence(true);
    }
  };

  const handleNextScenario = () => {
    setShowConsequence(false);
    setSelectedChoice(null);
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prevScenario => prevScenario + 1);
    } else {
      // Game completed
      onComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center animate-fadeIn">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-[3px] after:bg-green-600 after:rounded-md">
          {/* Removido o segundo parâmetro para corrigir erro de tipagem */}
          {t('loading')}
        </h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  const currentScenarioData = scenarios[currentScenario];
  const selectedChoiceData = selectedChoice 
    ? currentScenarioData.choices.find(c => c.id === selectedChoice) 
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
            {t('gameTitle')}
          </h2>
          <div className="text-green-600 font-bold text-lg">
            {t('score')}: {score}
          </div>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-100 text-green-600 w-7 h-7 rounded-full flex items-center justify-center font-bold">
              {currentScenario + 1}
            </div>
            <h3 className="text-xl font-medium text-gray-800">
              {currentScenarioData.title}
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {currentScenarioData.description}
          </p>
        </div>
        
        {!showConsequence ? (
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-800">
              {t('whatWouldYouDo')}
            </h4>
            <div className="space-y-3">
              {currentScenarioData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice.id)}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-left p-4 rounded-lg transition-all border border-gray-200 hover:border-green-200 hover:shadow-sm text-gray-800 font-medium"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`p-5 rounded-lg border ${
            selectedChoiceData?.isGood 
              ? 'bg-green-50 border-green-100' 
              : 'bg-red-50 border-red-100'
          }`}>
            <div className={`text-lg font-semibold mb-3 ${
              selectedChoiceData?.isGood ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedChoiceData?.isGood ? t('goodChoice') : t('riskyChoice')}
            </div>
            
            <div className="mb-4">
              <h5 className="font-medium mb-2 text-gray-800">{t('consequence')}:</h5>
              <p className="text-gray-700 leading-relaxed">{selectedChoiceData?.consequence}</p>
            </div>
            
            <div className="mb-6">
              <h5 className="font-medium mb-2 text-gray-800">{t('securityLesson')}:</h5>
              <p className="text-gray-700 leading-relaxed">{selectedChoiceData?.lesson}</p>
            </div>
            
            <button 
              onClick={handleNextScenario} 
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
            >
              {currentScenario < scenarios.length - 1 ? t('nextScenario') : t('finishGame')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySimulator;