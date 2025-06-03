'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

enum ReportStep {
  INITIAL = 'initial',
  OPTIONS = 'options',
  REASON = 'reason',
  DETAILS = 'details',
  CONFIRMATION = 'confirmation',
  COMPLETED = 'completed',
  WRONG_ACTION = 'wrong_action'
}

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

export default function ReportSimulator({ onComplete }: { onComplete: (score: number) => void }) {
  const t = useTranslations('reportSimulator');
  const [currentStep, setCurrentStep] = useState<ReportStep>(ReportStep.INITIAL);
  const [score, setScore] = useState(0);
  const [selectedReason, setSelectedReason] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [mistake, setMistake] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [completedPosts, setCompletedPosts] = useState<string[]>([]);
  const [wrongAction, setWrongAction] = useState<string>('');

  // Exemplo de posts ofensivos para reportar
  const posts: Post[] = [
    {
      id: 'post1',
      author: 'anonymous_user42',
      content: t('posts.post1.content'),
      likes: 15,
      comments: 3,
      timeAgo: '2h',
    },
    {
      id: 'post2',
      author: 'troll_account99',
      content: t('posts.post2.content'),
      likes: 8,
      comments: 12,
      timeAgo: '35m',
    },
    {
      id: 'post3',
      author: 'fake_profile21',
      content: t('posts.post3.content'),
      likes: 27,
      comments: 6,
      timeAgo: '1h',
    }
  ];

  const handleShowOptions = () => {
    setCurrentStep(ReportStep.OPTIONS);
  };

  const handleSelectReport = () => {
    setCurrentStep(ReportStep.REASON);
  };

  const handleSelectReason = (reason: string) => {
    setSelectedReason(reason);
    setCurrentStep(ReportStep.DETAILS);
  };

  const handleConfirmReport = () => {
    setCurrentStep(ReportStep.CONFIRMATION);
  };

  // Função modificada para lidar com ações incorretas com feedback específico
  const handleWrongAction = (action: string) => {
    setWrongAction(action);
    setCurrentStep(ReportStep.WRONG_ACTION);
  };

  // Função original para erros genéricos
  const handleMistake = () => {
    setMistake(true);
    setTimeout(() => {
      setMistake(false);
      setCurrentStep(ReportStep.INITIAL);
    }, 2000);
  };

  const handleContinueAfterWrongAction = () => {
    setCurrentStep(ReportStep.INITIAL);
    setWrongAction('');
  };

  const handleCompleteReport = () => {
    // Adicione pontuação
    const newScore = 10;
    setScore(prevScore => prevScore + newScore);
    
    // Marque o post como concluído
    setCompletedPosts(prev => [...prev, posts[currentPostIndex].id]);
    
    // Mostrar tela de conclusão
    setCurrentStep(ReportStep.COMPLETED);
  };

  const handleNextPost = () => {
    // Se há mais posts para processar
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(prevIndex => prevIndex + 1);
      setCurrentStep(ReportStep.INITIAL);
    } else {
      // Adicionar bônus de conclusão
      const completionBonus = 15;
      const finalScore = score + completionBonus;
      setScore(finalScore);
      
      // Notificar o componente pai que o jogo está concluído
      setTimeout(() => {
        onComplete(finalScore);
      }, 2000);
    }
  };

  // Renderização das instruções iniciais
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
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
        >
          {t('startGame')}
        </button>
      </div>
    );
  }

  // Post atual para interagir
  const currentPost = posts[currentPostIndex];
  const isPostCompleted = completedPosts.includes(currentPost.id);

  // Se o post atual já foi reportado com sucesso
  if (isPostCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {t('postCompleted.title')}
        </h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-6 text-center border border-green-200">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              ✓
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            {t('postCompleted.message')}
          </p>
          <p className="font-medium text-gray-800 mt-4">
            {t('score')}: {score}
          </p>
        </div>

        {currentPostIndex < posts.length - 1 ? (
          <button 
            onClick={handleNextPost} 
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5">
            {t('nextPost')}
          </button>
        ) : (
          <div className="bg-gradient-to-b from-green-50 to-green-50/30 rounded-lg p-6 mb-6 text-center border border-green-100">
            <h3 className="font-bold text-lg text-green-600 mb-3">
              {t('gameOver.title')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('gameOver.message')}
            </p>
            <div className="text-xl font-bold text-green-600 mb-2">
              {t('gameOver.finalScore')}: {score}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Tela de feedback para ação incorreta
  if (currentStep === ReportStep.WRONG_ACTION) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          Ação Inadequada
        </h2>
        
        <div className="bg-amber-50 p-6 rounded-lg mb-6 border border-amber-200">
          <div className="flex mb-4 text-amber-800">
            <div className="mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">
                {wrongAction === 'save' && 'Esta não é uma publicação que deveria ser salva'}
                {wrongAction === 'share' && 'Compartilhar este conteúdo é problemático'}
                {wrongAction === 'cancel' && 'Ignorar este tipo de conteúdo não é a melhor ação'}
              </h3>
              
              <div className="text-gray-700">
                {wrongAction === 'save' && (
                  <p>Salvar uma publicação como esta normaliza conteúdo discriminatório. Este post contém discurso de ódio contra imigrantes, o que viola as diretrizes da maioria das redes sociais e pode causar danos reais a grupos marginalizados.</p>
                )}
                
                {wrongAction === 'share' && (
                  <p>Compartilhar este tipo de conteúdo aumenta seu alcance e pode amplificar o discurso de ódio. Mesmo se você compartilhar para criticar, a mensagem prejudicial continua sendo distribuída e pode inspirar outros a publicarem conteúdo semelhante.</p>
                )}
                
                {wrongAction === 'cancel' && (
                  <p>Ignorar o conteúdo prejudicial permite que ele permaneça na plataforma. Quando vemos conteúdo que viola as diretrizes da comunidade, denunciar é importante para ajudar a manter as redes sociais mais seguras para todos.</p>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg border border-amber-100">
                <p className="font-medium mb-1">O que você deveria fazer:</p>
                <p className="text-gray-700">Denunciar publicações como esta ajuda as plataformas a identificarem e removerem conteúdo prejudicial, criando um ambiente online mais seguro e respeitoso para todos os usuários.</p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleContinueAfterWrongAction}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
        >
          Entendi, vou tentar novamente
        </button>
      </div>
    );
  }

  // Renderização do post e opções de denúncia
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

      {mistake && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
        >
          {t('wrongOption')}
        </motion.div>
      )}

      {/* Simulação de post de rede social */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm">
        {/* Cabeçalho do post */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-white">
          <div className="h-10 w-10 bg-green-400 rounded-full mr-3 flex items-center justify-center text-white font-semibold text-lg">
            {currentPost.author.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{currentPost.author}</h3>
            <p className="text-xs text-gray-500">{currentPost.timeAgo}</p>
          </div>
          
          {/* Botão de opções (3 pontinhos) */}
          {currentStep === ReportStep.INITIAL && (
            <button 
              onClick={handleShowOptions}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <span className="font-bold">⋮</span>
            </button>
          )}
        </div>
        
        {/* Conteúdo do post */}
        <div className="p-4 bg-white">
          <p className="text-gray-800 mb-4 leading-relaxed">{currentPost.content}</p>
          
          {/* Footer do post */}
          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-3">❤️ {currentPost.likes}</span>
            <span>💬 {currentPost.comments}</span>
          </div>
        </div>
      </div>

      {/* Menu de opções */}
      {currentStep === ReportStep.OPTIONS && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 bg-white">
          <button 
            onClick={() => handleWrongAction('save')}
            className="w-full p-3 text-left border-b hover:bg-gray-50 text-gray-800 transition"
          >
            {t('options.save')}
          </button>
          <button 
            onClick={() => handleWrongAction('share')}
            className="w-full p-3 text-left border-b hover:bg-gray-50 text-gray-800 transition"
          >
            {t('options.share')}
          </button>
          <button 
            onClick={handleSelectReport}
            className="w-full p-3 text-left border-b hover:bg-gray-50 text-gray-800 transition"
          >
            {t('options.report')}
          </button>
          <button 
            onClick={() => handleWrongAction('cancel')}
            className="w-full p-3 text-left hover:bg-gray-50 text-gray-800 transition"
          >
            {t('options.cancel')}
          </button>
        </div>
      )}

      {/* Razões para denúncia */}
      {currentStep === ReportStep.REASON && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 bg-white">
          <h3 className="p-3 border-b font-medium text-gray-900">
            {t('reportReasons.title')}
          </h3>
          <button 
            onClick={() => handleSelectReason('hate')}
            className="w-full p-3 text-left border-b hover:bg-gray-50 text-gray-800 font-medium transition"
          >
            {t('reportReasons.hate')}
          </button>
          <button 
            onClick={() => handleSelectReason('harassment')}
            className="w-full p-3 text-left border-b hover:bg-gray-50 text-gray-800 font-medium transition"
          >
            {t('reportReasons.harassment')}
          </button>
          <button 
            onClick={() => handleSelectReason('violence')}
            className="w-full p-3 text-left border-b hover:bg-gray-50 text-gray-800 font-medium transition"
          >
            {t('reportReasons.violence')}
          </button>
          <button 
            onClick={() => handleSelectReason('falseInfo')}
            className="w-full p-3 text-left border-b hover:bg-gray-50 text-gray-800 font-medium transition"
          >
            {t('reportReasons.falseInfo')}
          </button>
          <button 
            onClick={() => handleWrongAction('cancel')}
            className="w-full p-3 text-left hover:bg-gray-50 text-gray-800 transition"
          >
            {t('options.cancel')}
          </button>
        </div>
      )}

      {/* Detalhes adicionais */}
      {currentStep === ReportStep.DETAILS && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 bg-white">
          <h3 className="p-3 border-b font-medium text-gray-900">
            {t('reportDetails.title')}
          </h3>
          <div className="p-4">
            <p className="text-gray-800 mb-3">
              {t('reportDetails.description')}
            </p>
            <textarea 
              className="w-full border border-gray-300 rounded p-3 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder={t('reportDetails.placeholder')}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleWrongAction('cancel')}
                className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition"
              >
                {t('options.cancel')}
              </button>
              <button 
                onClick={handleConfirmReport}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                {t('reportDetails.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmação final */}
      {currentStep === ReportStep.CONFIRMATION && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 bg-white">
          <div className="p-4">
            <h3 className="font-medium mb-2 text-gray-900">
              {t('reportConfirmation.title')}
            </h3>
            <p className="text-gray-800 mb-4">
              {t('reportConfirmation.description')}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleWrongAction('cancel')}
                className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition"
              >
                {t('options.cancel')}
              </button>
              <button 
                onClick={handleCompleteReport}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                {t('reportConfirmation.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conclusão da denúncia */}
      {currentStep === ReportStep.COMPLETED && (
        <div className="bg-green-50 p-6 rounded-lg mb-6 text-center border border-green-200">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              ✓
            </div>
          </div>
          <h3 className="text-xl font-medium text-center mb-2">
            {t('reportSuccess.title')}
          </h3>
          <p className="text-center text-gray-700">
            {t('reportSuccess.message')}
          </p>
          <div className="mt-6 flex justify-center">
            <button 
              onClick={handleNextPost}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm hover:shadow"
            >
              {currentPostIndex < posts.length - 1 ? t('nextPost') : t('finishGame')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}