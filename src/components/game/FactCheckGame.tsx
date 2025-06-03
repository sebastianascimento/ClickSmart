'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  isFake: boolean;
  explanation: string;
}

export default function FactCheckGame({ onComplete }: { onComplete: (score: number) => void }) {
  const factcheckT = useTranslations('factcheck');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // Load news items from translations
  const newsItems: NewsItem[] = [
    {
      id: 'news1',
      title: factcheckT('news.news1.title'),
      content: factcheckT('news.news1.content'),
      isFake: true,
      explanation: factcheckT('news.news1.explanation')
    },
    {
      id: 'news2',
      title: factcheckT('news.news2.title'),
      content: factcheckT('news.news2.content'),
      isFake: false,
      explanation: factcheckT('news.news2.explanation')
    },
    {
      id: 'news3',
      title: factcheckT('news.news3.title'),
      content: factcheckT('news.news3.content'),
      isFake: true,
      explanation: factcheckT('news.news3.explanation')
    },
    {
      id: 'news4',
      title: factcheckT('news.news4.title'),
      content: factcheckT('news.news4.content'),
      isFake: false,
      explanation: factcheckT('news.news4.explanation')
    },
    {
      id: 'news5',
      title: factcheckT('news.news5.title'),
      content: factcheckT('news.news5.content'),
      isFake: true,
      explanation: factcheckT('news.news5.explanation')
    }
  ];

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || showFeedback) return;
    
    const touchEnd = e.targetTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Determine swipe direction for visual feedback
    if (diff > 50) {
      setSwipeDirection('left'); // Swipe left (fake)
    } else if (diff < -50) {
      setSwipeDirection('right'); // Swipe right (real)
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || showFeedback) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Only count as swipe if moved more than 100px
    if (Math.abs(diff) > 100) {
      // Swipe left is "fake", swipe right is "real"
      handleDecision(diff > 0);
    }
    
    setSwipeDirection(null);
    setTouchStart(null);
  };

  // Handle decision (from button click or swipe)
  const handleDecision = (userSaysFake: boolean) => {
    if (showFeedback) return;
    
    const currentNews = newsItems[currentNewsIndex];
    const correct = userSaysFake === currentNews.isFake;
    
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 10);
    }
    
    setShowFeedback(true);
  };

  // Move to next news item
  const handleNext = () => {
    if (currentNewsIndex === newsItems.length - 1) {
      // Game complete
      onComplete(score);
    } else {
      setCurrentNewsIndex(currentNewsIndex + 1);
      setShowFeedback(false);
    }
  };

  // Current news item
  const currentNews = newsItems[currentNewsIndex];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        {factcheckT('gameTitle')}
      </h2>
      
      <div className="mb-4 text-center">
        <p className="text-gray-700">{factcheckT('instructions')}</p>
        {!showFeedback && (
          <p className="mt-2 text-sm text-gray-500">
            {factcheckT('swipeInstructions')}
          </p>
        )}
      </div>
      
      {/* News Card with Swipe Capability */}
      <div 
        className={`relative border rounded-lg overflow-hidden transition-transform duration-300 
          ${swipeDirection === 'left' ? 'transform -translate-x-12' : ''}
          ${swipeDirection === 'right' ? 'transform translate-x-12' : ''}
          ${showFeedback && isCorrect ? 'border-green-500' : ''}
          ${showFeedback && !isCorrect ? 'border-red-500' : ''}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* News content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{currentNews.title}</h3>
          <p className="text-gray-700">{currentNews.content}</p>
        </div>
        
        {/* Swipe indicators (visible during swipe) */}
        {swipeDirection === 'left' && (
          <div className="absolute top-0 bottom-0 left-0 w-12 bg-red-500 flex items-center justify-center">
            <span className="text-white text-3xl">👎</span>
          </div>
        )}
        {swipeDirection === 'right' && (
          <div className="absolute top-0 bottom-0 right-0 w-12 bg-green-500 flex items-center justify-center">
            <span className="text-white text-3xl">👍</span>
          </div>
        )}
        
        {/* Feedback overlay */}
        {showFeedback && (
          <div className={`absolute inset-0 p-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'} bg-opacity-95`}>
            <h3 className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? factcheckT('correctAnswer') : factcheckT('wrongAnswer')}
            </h3>
            <p className="text-gray-700 mb-4">{currentNews.explanation}</p>
            <p className="text-gray-800 font-semibold">
              {currentNews.isFake ? factcheckT('thisFake') : factcheckT('thisReal')}
            </p>
            <button
              onClick={handleNext}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              {currentNewsIndex === newsItems.length - 1 ? factcheckT('finishGame') : factcheckT('nextNews')}
            </button>
          </div>
        )}
      </div>
      
      {/* Decision buttons (alternative to swiping) */}
      {!showFeedback && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleDecision(true)}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-lg mr-2 transition"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl">👎</span>
              <span className="font-medium mt-1">{factcheckT('fakeBtnText')}</span>
            </div>
          </button>
          <button
            onClick={() => handleDecision(false)}
            className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-lg ml-2 transition"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl">👍</span>
              <span className="font-medium mt-1">{factcheckT('realBtnText')}</span>
            </div>
          </button>
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-green-700">
            {factcheckT('progress')}: {currentNewsIndex + 1}/{newsItems.length}
          </span>
          <span className="text-sm font-medium text-green-700">
            {factcheckT('score')}: {score}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: `${((currentNewsIndex + (showFeedback ? 1 : 0)) / newsItems.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}