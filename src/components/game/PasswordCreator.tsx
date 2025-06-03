'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface PasswordRule {
  id: string;
  satisfied: boolean;
  description: string;
}

export default function PasswordCreator({ onComplete }: { onComplete: (score: number) => void }) {
  const t = useTranslations('passwordCreator');
  const [password, setPassword] = useState<string>('');
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [score, setScore] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');

  const characterSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/'
  };

  // Password rules
  const [rules, setRules] = useState<PasswordRule[]>([
    { id: 'length', satisfied: false, description: t('rules.length') },
    { id: 'uppercase', satisfied: false, description: t('rules.uppercase') },
    { id: 'lowercase', satisfied: false, description: t('rules.lowercase') },
    { id: 'number', satisfied: false, description: t('rules.number') },
    { id: 'symbol', satisfied: false, description: t('rules.symbol') },
    { id: 'noCommon', satisfied: true, description: t('rules.noCommon') }
  ]);

  const challenges = [
    { 
      name: t('challenges.social.name'),
      description: t('challenges.social.description'),
      tip: t('challenges.social.tip')
    },
    { 
      name: t('challenges.bank.name'),
      description: t('challenges.bank.description'),
      tip: t('challenges.bank.tip')
    },
    { 
      name: t('challenges.email.name'),
      description: t('challenges.email.description'),
      tip: t('challenges.email.tip')
    }
  ];

  // Check if contains common patterns
  const containsCommonPattern = (pwd: string): boolean => {
    const commonPatterns = ['123456', 'password', 'qwerty', 'abc123', 'admin', '111111', 'letmein', '12345678', '123123'];
    return commonPatterns.some(pattern => pwd.toLowerCase().includes(pattern));
  };

  // Check rules satisfaction
  const checkRuleSatisfaction = (pwd: string) => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
    const isLongEnough = pwd.length >= 8;
    const noCommonPatterns = !containsCommonPattern(pwd);

    setRules([
      { id: 'length', satisfied: isLongEnough, description: t('rules.length') },
      { id: 'uppercase', satisfied: hasUpperCase, description: t('rules.uppercase') },
      { id: 'lowercase', satisfied: hasLowerCase, description: t('rules.lowercase') },
      { id: 'number', satisfied: hasNumber, description: t('rules.number') },
      { id: 'symbol', satisfied: hasSymbol, description: t('rules.symbol') },
      { id: 'noCommon', satisfied: noCommonPatterns, description: t('rules.noCommon') }
    ]);

    // Determine password strength
    const satisfiedCount = [isLongEnough, hasUpperCase, hasLowerCase, hasNumber, hasSymbol, noCommonPatterns]
      .filter(Boolean).length;
    
    if (satisfiedCount <= 2) {
      setStrength('weak');
    } else if (satisfiedCount <= 4) {
      setStrength('medium');
    } else {
      setStrength('strong');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    checkRuleSatisfaction(value);
  };

  const handleAddCharacter = (char: string) => {
    const newPassword = password + char;
    handlePasswordChange(newPassword);
  };

  const handleRemoveLastCharacter = () => {
    const newPassword = password.slice(0, -1);
    handlePasswordChange(newPassword);
  };

  const handleClearPassword = () => {
    setPassword('');
    checkRuleSatisfaction('');
  };

  const handleShowTip = () => {
    setCurrentTip(challenges[challengeIndex].tip);
    setShowTip(true);
  };

  const handleSubmitPassword = () => {
    const satisfiedRules = rules.filter(rule => rule.satisfied);
    const pointsPerRule = 5;
    const challengeScore = satisfiedRules.length * pointsPerRule;
    
    setScore(prevScore => prevScore + challengeScore);
    
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex(challengeIndex + 1);
      setPassword('');
      setShowTip(false);
    } else {
      // Game completed
      const finalScore = score + challengeScore;
      setScore(finalScore);
      setGameCompleted(true);
      
      // Report back to parent component
      setTimeout(() => {
        onComplete(finalScore);
      }, 2000);
    }
  };

  // Render instructions screen
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

  // Game complete screen
  if (gameCompleted) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('gameOver.title')}</h2>
        <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span role="img" aria-label="key" className="text-2xl">🔑</span>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{t('gameOver.message')}</p>
          <div className="text-xl font-bold text-blue-600 mb-2">
            {t('gameOver.finalScore')}: {score}
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-100 text-left">
            <h4 className="font-medium mb-2">{t('passwordTips.title')}</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>{t('passwordTips.tip1')}</li>
              <li>{t('passwordTips.tip2')}</li>
              <li>{t('passwordTips.tip3')}</li>
              <li>{t('passwordTips.tip4')}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const currentChallenge = challenges[challengeIndex];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{t('gameTitle')}</h2>
        <div>
          <span className="text-gray-700 font-semibold">{t('score')}: {score}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-1 rounded-lg mb-4">
        <div className="flex justify-between text-sm text-gray-500 px-2">
          <span>{t('challenge')}: {challengeIndex + 1}/{challenges.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((challengeIndex + 1) / challenges.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2 text-gray-900">{currentChallenge.name}</h3>
        <p className="text-gray-600 mb-4">{currentChallenge.description}</p>
        
        {showTip && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2">💡</span>
              <p className="text-gray-700">{currentTip}</p>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('createPassword')}
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={password} 
              readOnly
              className="w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none"
            />
            {password && (
              <button 
                onClick={handleClearPassword}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="h-2 flex-grow rounded-full bg-gray-200 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  strength === 'weak' ? 'bg-red-500 w-1/3' : 
                  strength === 'medium' ? 'bg-yellow-500 w-2/3' : 
                  'bg-green-500 w-full'
                }`}
              ></div>
            </div>
            <span className={`ml-2 text-sm font-medium ${
              strength === 'weak' ? 'text-red-600' : 
              strength === 'medium' ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {strength === 'weak' ? t('strength.weak') : 
               strength === 'medium' ? t('strength.medium') : 
               t('strength.strong')}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-2 text-gray-700">{t('passwordRules')}</h4>
          <ul className="space-y-1">
            {rules.map(rule => (
              <li 
                key={rule.id}
                className={`text-sm flex items-center ${rule.satisfied ? 'text-green-600' : 'text-gray-500'}`}
              >
                <span className="mr-2">{rule.satisfied ? '✓' : '○'}</span>
                {rule.description}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              onClick={() => !showTip && handleShowTip()}
              disabled={showTip}
              className={`py-2 px-4 rounded-lg border ${showTip ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'}`}
            >
              {t('showTip')}
            </button>
            <button 
              onClick={handleSubmitPassword}
              disabled={strength !== 'strong'}
              className={`py-2 px-4 rounded-lg ${strength === 'strong' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'}`}
            >
              {t('submit')}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-2 text-gray-700">{t('characterSets.title')}</h4>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">{t('characterSets.lowercase')}</p>
            <div className="flex flex-wrap gap-1">
              {characterSets.lowercase.split('').map(char => (
                <button 
                  key={`lower-${char}`}
                  onClick={() => handleAddCharacter(char)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">{t('characterSets.uppercase')}</p>
            <div className="flex flex-wrap gap-1">
              {characterSets.uppercase.split('').map(char => (
                <button 
                  key={`upper-${char}`}
                  onClick={() => handleAddCharacter(char)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">{t('characterSets.numbers')}</p>
            <div className="flex flex-wrap gap-1">
              {characterSets.numbers.split('').map(char => (
                <button 
                  key={`num-${char}`}
                  onClick={() => handleAddCharacter(char)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">{t('characterSets.symbols')}</p>
            <div className="flex flex-wrap gap-1">
              {characterSets.symbols.split('').map(char => (
                <button 
                  key={`sym-${char}`}
                  onClick={() => handleAddCharacter(char)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleRemoveLastCharacter}
              disabled={!password}
              className={`flex-1 py-2 rounded-lg border ${password ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
            >
              {t('backspace')}
            </button>
            <button 
              onClick={handleClearPassword}
              disabled={!password}
              className={`flex-1 py-2 rounded-lg border ${password ? 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
            >
              {t('clear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}