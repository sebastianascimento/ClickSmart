'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface Link {
  id: string;
  url: string;
  isSafe: boolean;
  clicked: boolean;
  explanation: string;
}

interface Level {
  id: string;
  title: string;
  description: string;
  links: Link[];
  completed: boolean;
}

export default function LinkHunter({ onComplete }: { onComplete: (score: number) => void }) {
  const t = useTranslations('linkHunter');
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackForLink, setFeedbackForLink] = useState<Link | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Initialize levels
  const [levels, setLevels] = useState<Level[]>([
    {
      id: 'level1',
      title: t('levels.banking.title'),
      description: t('levels.banking.description'),
      links: [
        { 
          id: 'bank1', 
          url: 'https://www.mybank.com/login', 
          isSafe: true, 
          clicked: false, 
          explanation: t('links.bank1')
        },
        { 
          id: 'bank2', 
          url: 'http://mybank-secure.com/login', 
          isSafe: false, 
          clicked: false, 
          explanation: t('links.bank2')
        },
        { 
          id: 'bank3', 
          url: 'https://mybank.loginportal.net/account', 
          isSafe: false, 
          clicked: false, 
          explanation: t('links.bank3')
        },
        { 
          id: 'bank4', 
          url: 'https://online.mybank.com/auth', 
          isSafe: true, 
          clicked: false, 
          explanation: t('links.bank4')
        }
      ],
      completed: false
    },
    {
      id: 'level2',
      title: t('levels.shopping.title'),
      description: t('levels.shopping.description'),
      links: [
        { 
          id: 'shop1', 
          url: 'https://amazonshopping.co/discount-offer', 
          isSafe: false, 
          clicked: false, 
          explanation: t('links.shop1')
        },
        { 
          id: 'shop2', 
          url: 'https://www.amazon.com/product/12345', 
          isSafe: true, 
          clicked: false, 
          explanation: t('links.shop2')
        },
        { 
          id: 'shop3', 
          url: 'http://best-deals-amazon.com/sale', 
          isSafe: false, 
          clicked: false, 
          explanation: t('links.shop3')
        },
        { 
          id: 'shop4', 
          url: 'https://store.samsung.com/smartphones', 
          isSafe: true, 
          clicked: false, 
          explanation: t('links.shop4')
        }
      ],
      completed: false
    },
    {
      id: 'level3',
      title: t('levels.email.title'),
      description: t('levels.email.description'),
      links: [
        { 
          id: 'email1', 
          url: 'https://mail.google.com/password-reset', 
          isSafe: true, 
          clicked: false,
          explanation: t('links.email1')
        },
        { 
          id: 'email2', 
          url: 'http://google-mail-service.com/reset', 
          isSafe: false, 
          clicked: false,
          explanation: t('links.email2')
        },
        { 
          id: 'email3', 
          url: 'https://accounts.google.com/signin/recovery', 
          isSafe: true, 
          clicked: false,
          explanation: t('links.email3')
        },
        { 
          id: 'email4', 
          url: 'https://mail-google.com.password.reset.php', 
          isSafe: false, 
          clicked: false,
          explanation: t('links.email4')
        }
      ],
      completed: false
    }
  ]);

  const handleLinkClick = (linkId: string) => {
    // Find the current level
    const currentLevel = levels[currentLevelIndex];
    
    // Find the clicked link
    const clickedLink = currentLevel.links.find(link => link.id === linkId);
    
    if (!clickedLink || clickedLink.clicked) {
      return;
    }
    
    // Check if the answer is correct and update score
    const pointsPerCorrectAnswer = 5;
    
    // Determine if the user's choice was correct
    // A correct choice is either selecting a safe link or avoiding a dangerous one
    let newScore = score;
    
    if (clickedLink.isSafe) {
      // User correctly identified a safe link
      newScore += pointsPerCorrectAnswer;
    } else {
      // User clicked on a dangerous link (wrong choice)
      newScore = Math.max(0, newScore - pointsPerCorrectAnswer);
    }
    
    setScore(newScore);
    
    // Update the link to mark it as clicked
    const updatedLevels = [...levels];
    const updatedLinks = currentLevel.links.map(link => 
      link.id === linkId ? { ...link, clicked: true } : link
    );
    
    updatedLevels[currentLevelIndex] = {
      ...currentLevel,
      links: updatedLinks
    };
    
    // Show feedback for the clicked link
    setFeedbackForLink(clickedLink);
    setShowFeedback(true);
    
    // Update the state
    setLevels(updatedLevels);
  };

  const closeAndCheckLevelCompletion = () => {
    setShowFeedback(false);
    
    // Check if all safe links have been clicked (level completed)
    const currentLevel = levels[currentLevelIndex];
    const allSafeLinksClicked = currentLevel.links
      .filter(link => link.isSafe)
      .every(link => link.clicked);
    
    if (allSafeLinksClicked) {
      // Mark the level as completed
      const updatedLevels = [...levels];
      updatedLevels[currentLevelIndex] = {
        ...currentLevel,
        completed: true
      };
      setLevels(updatedLevels);
      
      // Add bonus for completing the level
      const levelCompletionBonus = 10;
      setScore(prevScore => prevScore + levelCompletionBonus);
      
      // Check if all levels are completed
      if (currentLevelIndex === levels.length - 1) {
        // Game completed
        setGameCompleted(true);
        
        // Report final score back to parent
        setTimeout(() => {
          onComplete(score + levelCompletionBonus);
        }, 1000);
      } else {
        // Move to next level
        setCurrentLevelIndex(prevIndex => prevIndex + 1);
      }
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

  // Game completion screen
  if (gameCompleted) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('gameOver.title')}</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span role="img" aria-label="link" className="text-2xl">🔗</span>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{t('gameOver.message')}</p>
          <div className="text-xl font-bold text-blue-600 mb-2">
            {t('gameOver.finalScore')}: {score}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-100 text-left mt-4">
            <h4 className="font-medium mb-2">{t('linkTips.title')}</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>{t('linkTips.tip1')}</li>
              <li>{t('linkTips.tip2')}</li>
              <li>{t('linkTips.tip3')}</li>
              <li>{t('linkTips.tip4')}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show feedback for clicked link
  if (showFeedback && feedbackForLink) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {feedbackForLink.isSafe ? t('feedback.safeTitle') : t('feedback.dangerTitle')}
        </h2>
        
        <div className={`p-6 rounded-lg mb-6 ${feedbackForLink.isSafe ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${feedbackForLink.isSafe ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="text-2xl">{feedbackForLink.isSafe ? '✓' : '✕'}</span>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-white rounded-lg border shadow-sm">
            <p className="font-mono text-sm break-all">{feedbackForLink.url}</p>
          </div>
          
          <p className="text-center mb-4">
            {feedbackForLink.isSafe ? 
              t('feedback.safeMessage') : 
              t('feedback.dangerMessage')}
          </p>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">{t('feedback.explanation')}</h4>
            <p className="text-gray-700">{feedbackForLink.explanation}</p>
          </div>
        </div>
        
        <button 
          onClick={closeAndCheckLevelCompletion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition w-full">
          {t('continue')}
        </button>
      </div>
    );
  }

  // Main game screen
  const currentLevel = levels[currentLevelIndex];
  const safeLinksCount = currentLevel.links.filter(link => link.isSafe).length;
  const safeLinksFoundCount = currentLevel.links.filter(link => link.isSafe && link.clicked).length;
  
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
          <span>{t('level')}: {currentLevelIndex + 1}/{levels.length}</span>
          <span>{t('status.safeLinks')}: {safeLinksFoundCount}/{safeLinksCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentLevelIndex) / levels.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2 text-gray-900">{currentLevel.title}</h3>
        <p className="text-gray-600 mb-4">{currentLevel.description}</p>
        
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-4">
          <div className="flex">
            <span className="text-yellow-500 mr-2">💡</span>
            <p className="text-gray-700">{t('findSafeLinks')}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {currentLevel.links.map(link => (
            <div 
              key={link.id}
              onClick={() => !link.clicked && handleLinkClick(link.id)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                link.clicked ? 
                  (link.isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 
                  'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                {link.clicked && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    link.isSafe ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {link.isSafe ? '✓' : '✕'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-mono text-sm break-all">{link.url}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium mb-2 text-gray-900">{t('securityTips.title')}</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>{t('securityTips.tip1')}</li>
          <li>{t('securityTips.tip2')}</li>
        </ul>
      </div>
    </div>
  );
}