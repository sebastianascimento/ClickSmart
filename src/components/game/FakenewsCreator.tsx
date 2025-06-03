'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface FakenewsCreatorProps {
  onComplete: (score: number) => void;
}

const FakenewsCreator: React.FC<FakenewsCreatorProps> = ({ onComplete }) => {
  const t = useTranslations('fakenewsCreator');
  const [gameStage, setGameStage] = useState<'create' | 'preview' | 'reaction' | 'lesson'>('create');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Fake news content state
  const [headline, setHeadline] = useState('');
  const [selectedImage, setSelectedImage] = useState(1);
  const [date, setDate] = useState('today');
  const [content, setContent] = useState('');
  
  const imagePaths = [
    '/images/fakenews/news1.jpg',
    '/images/fakenews/news2.jpg',
    '/images/fakenews/news3.jpg',
    '/images/fakenews/news4.jpg',
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePublish = () => {
    if (headline && content && date) {
      setGameStage('preview');
      // Add some points for creating the news
      setScore(prevScore => prevScore + 5);
    } else {
      alert('Por favor preencha todos os campos para criar a notícia.');
    }
  };

  const handleShowReactions = () => {
    setGameStage('reaction');
    // Add more points for proceeding to see reactions
    setScore(prevScore => prevScore + 10);
  };

  const handleShowLesson = () => {
    setGameStage('lesson');
    // Add more points for learning the lesson
    setScore(prevScore => prevScore + 15);
  };

  const handleFinishGame = () => {
    onComplete(score);
  };

  const handleCreateNew = () => {
    setHeadline('');
    setSelectedImage(1);
    setDate('today');
    setContent('');
    setGameStage('create');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center animate-fadeIn">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-[3px] after:bg-green-600 after:rounded-md">
          {/* Usar o gameTitle como fallback para loading se não existir */}
          {t('loading', { defaultValue: t('gameTitle') })}
        </h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  // Create stage - where users create the fake news
  if (gameStage === 'create') {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('createSection.title')}
        </h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">{t('createSection.headlineLabel')}</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          >
            <option value="" className="text-gray-800">Selecione um título</option>
            <option value={t('createSection.headlineOptions.option1')} className="text-gray-800">
              {t('createSection.headlineOptions.option1')}
            </option>
            <option value={t('createSection.headlineOptions.option2')} className="text-gray-800">
              {t('createSection.headlineOptions.option2')}
            </option>
            <option value={t('createSection.headlineOptions.option3')} className="text-gray-800">
              {t('createSection.headlineOptions.option3')}
            </option>
            <option value={t('createSection.headlineOptions.option4')} className="text-gray-800">
              {t('createSection.headlineOptions.option4')}
            </option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">{t('createSection.imageLabel')}</label>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index} 
                className={`border-2 rounded-lg overflow-hidden cursor-pointer ${selectedImage === index ? 'border-green-500' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="aspect-video relative bg-gray-100">
                  {/* Replace with your actual images */}
                  <div className="h-full flex items-center justify-center text-gray-500">Imagem {index+1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">{t('createSection.dateLabel')}</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="today" className="text-gray-800">{t('createSection.dateOptions.today')}</option>
            <option value="yesterday" className="text-gray-800">{t('createSection.dateOptions.yesterday')}</option>
            <option value="lastWeek" className="text-gray-800">{t('createSection.dateOptions.lastWeek')}</option>
            <option value="madeUp" className="text-gray-800">{t('createSection.dateOptions.madeUp')}</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">{t('createSection.contentLabel')}</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          >
            <option value="" className="text-gray-800">Selecione o conteúdo</option>
            <option value={t('createSection.contentOptions.option1')} className="text-gray-800">
              {t('createSection.contentOptions.option1').substring(0, 50)}...
            </option>
            <option value={t('createSection.contentOptions.option2')} className="text-gray-800">
              {t('createSection.contentOptions.option2').substring(0, 50)}...
            </option>
            <option value={t('createSection.contentOptions.option3')} className="text-gray-800">
              {t('createSection.contentOptions.option3').substring(0, 50)}...
            </option>
            <option value={t('createSection.contentOptions.option4')} className="text-gray-800">
              {t('createSection.contentOptions.option4').substring(0, 50)}...
            </option>
          </select>
        </div>
        
        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
          onClick={handlePublish}
        >
          {t('createSection.publish')}
        </button>
      </div>
    );
  }

  // Preview stage - where users see their created fake news
  if (gameStage === 'preview') {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('previewSection.title')}
        </h2>
        
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6 shadow-sm">
          {/* Fake news preview */}
          <div className="bg-gray-100 p-2 border-b border-gray-300 flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('previewSection.source')}</span>
            <span className="text-sm text-gray-600">
              {date === 'today' ? t('createSection.dateOptions.today') : 
               date === 'yesterday' ? t('createSection.dateOptions.yesterday') : 
               date === 'lastWeek' ? t('createSection.dateOptions.lastWeek') : 
               '15 de Janeiro, 2025'}
            </span>
          </div>
          
          <div className="p-4">
            <h3 className="text-xl font-bold mb-3 text-gray-900">{headline}</h3>
            
            <div className="aspect-video bg-gray-200 mb-3 rounded">
              {/* Replace with actual image */}
              <div className="h-full flex items-center justify-center text-gray-500">Imagem {selectedImage+1}</div>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">{content}</p>
            
            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm text-gray-500">
              <span>👍 423 Gostos</span>
              <span>💬 98 {t('previewSection.comments')}</span>
              <span>↗️ 215 {t('previewSection.shares')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-all hover:shadow-sm"
            onClick={handleCreateNew}
          >
            {t('previewSection.edit')}
          </button>
          <button 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
            onClick={handleShowReactions}
          >
            {t('previewSection.publish')}
          </button>
        </div>
      </div>
    );
  }

  // Reactions stage - where users see the impact of fake news
  if (gameStage === 'reaction') {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('reactionSection.title')}
        </h2>
        
        <div className="p-5 mb-6 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-gray-800">{headline}</span>
            <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">Viral</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
              <div className="text-lg font-bold text-green-600">1,240</div>
              <div className="text-sm text-gray-600">{t('reactionSection.shareCount')}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
              <div className="text-lg font-bold text-orange-600">312</div>
              <div className="text-sm text-gray-600">{t('previewSection.comments')}</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2 text-gray-800">Reações populares:</h3>
            <div className="flex space-x-2">
              <span className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">😱 {t('reactionSection.reactionTypes.fear')} 86</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">😡 {t('reactionSection.reactionTypes.anger')} 64</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">😲 {t('reactionSection.reactionTypes.confusion')} 58</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">🤔 {t('reactionSection.reactionTypes.excitement')} 31</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">{t('previewSection.comments')}:</h3>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded border border-gray-100">
                <div className="text-xs text-gray-500">Maria123</div>
                <div>{t('reactionSection.exampleComments.comment1')}</div>
              </div>
              <div className="bg-white p-2 rounded border border-gray-100">
                <div className="text-xs text-gray-500">Pedro87</div>
                <div>{t('reactionSection.exampleComments.comment2')}</div>
              </div>
              <div className="bg-white p-2 rounded border border-gray-100">
                <div className="text-xs text-gray-500">Ana_Racional</div>
                <div>{t('reactionSection.exampleComments.comment3')}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-5 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-xl font-bold mb-3 text-orange-600">{t('reactionSection.impact.title')}</h3>
          <p className="mb-4 text-gray-700 leading-relaxed">{t('reactionSection.impact.description')}</p>
          <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
            <li>{t('reactionSection.impact.effect1')}</li>
            <li>{t('reactionSection.impact.effect2')}</li>
            <li>{t('reactionSection.impact.effect3')}</li>
            <li>{t('reactionSection.impact.effect4')}</li>
          </ul>
          <div className="text-xl font-bold text-center text-orange-600 mt-4">
            {t('reactionSection.impact.message')}
          </div>
        </div>
        
        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
          onClick={handleShowLesson}
        >
          {t('continue')}
        </button>
      </div>
    );
  }

  // Lesson stage - where users learn about the dangers of fake news
  return (
    <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
        {t('lessonSection.title')}
      </h2>
      
      <div className="p-5 mb-6 bg-green-50 rounded-lg border border-green-100">
        <p className="text-lg mb-4 text-gray-700 leading-relaxed">
          {t('lessonSection.message')}
        </p>
        
        <h3 className="text-lg font-bold mb-2 text-gray-800">{t('lessonSection.factTitle')}</h3>
        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
          <li>{t('lessonSection.fact1')}</li>
          <li>{t('lessonSection.fact2')}</li>
          <li>{t('lessonSection.fact3')}</li>
        </ul>
        
        <h3 className="text-lg font-bold mb-2 text-gray-800">{t('lessonSection.whatToDo')}</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>{t('lessonSection.tip1')}</li>
          <li>{t('lessonSection.tip2')}</li>
          <li>{t('lessonSection.tip3')}</li>
          <li>{t('lessonSection.tip4')}</li>
        </ul>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-all hover:shadow-sm"
          onClick={handleCreateNew}
        >
          {t('createNew')}
        </button>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
          onClick={handleFinishGame}
        >
          {t('finishGame')}
        </button>
      </div>
      
      <div className="mt-4 text-center text-green-600 font-bold">
        {t('score')}: {score}
      </div>
    </div>
  );
};

export default FakenewsCreator;