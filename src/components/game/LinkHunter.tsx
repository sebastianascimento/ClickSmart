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

  // Game completion screen
  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('gameOver.title')}
        </h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-6 text-center border border-green-100">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🔗
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            {t('gameOver.message')}
          </p>
          <div className="flex items-center justify-center gap-2 font-bold text-green-600 text-xl before:content-['🏆']">
            {t('gameOver.finalScore')}: {score}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-100 text-left mt-4">
            <h4 className="font-medium mb-2 text-gray-800">
              {t('linkTips.title')}
            </h4>
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
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {feedbackForLink.isSafe ? t('feedback.safeTitle') : t('feedback.dangerTitle')}
        </h2>
        
        <div className={`p-6 rounded-lg mb-6 border ${feedbackForLink.isSafe ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${feedbackForLink.isSafe ? 'bg-green-100' : 'bg-red-100'}`}>
              {feedbackForLink.isSafe ? '✓' : '✕'}
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-white rounded-lg border shadow-sm">
            <p className="font-mono text-sm break-all text-black">{feedbackForLink.url}</p>
          </div>
          
          <p className="text-center mb-4 text-gray-700">
            {feedbackForLink.isSafe ? 
              t('feedback.safeMessage') : 
              t('feedback.dangerMessage')}
          </p>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2 text-gray-800">
              {t('feedback.explanation')}
            </h4>
            <p className="text-gray-700">{feedbackForLink.explanation}</p>
          </div>
        </div>
        
        <button 
          onClick={closeAndCheckLevelCompletion}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5">
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
    <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
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
      
      <div className="bg-gray-50 p-2 rounded-lg mb-6 border border-gray-100">
        <div className="flex justify-between text-sm text-gray-500 px-2 mb-1">
          <span>{t('level')}: {currentLevelIndex + 1}/{levels.length}</span>
          <span>{t('status.safeLinks')}: {safeLinksFoundCount}/{safeLinksCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentLevelIndex) / levels.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2 text-gray-800">
          {currentLevel.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {currentLevel.description}
        </p>
        
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
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                link.clicked ? 
                  (link.isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 
                  'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
                  <p className="font-mono text-sm break-all text-black">{link.url}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h4 className="font-medium mb-2 text-gray-800">
          {t('securityTips.title')}
        </h4>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>{t('securityTips.tip1')}</li>
          <li>{t('securityTips.tip2')}</li>
        </ul>
      </div>
    </div>
  );
}