'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  from: string;
  text: string;
  isOffensive: boolean;
  time: string;
  userReaction?: 'report' | 'defend' | 'ignore' | 'join';
  type?: 'message' | 'info' | 'consequence';
  consequenceText?: string;
}

interface Scenario {
  id: string;
  name: string;
  context: string;
  messages: Message[];
  finalFeedback: {
    good: string;
    medium: string;
    bad: string;
  }
}

export default function ChatGame({ onComplete }: { onComplete: (score: number) => void }) {
  const chatT = useTranslations('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [nextMessageIndex, setNextMessageIndex] = useState(0);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Load chat scenarios from translations
  const scenarios: Scenario[] = [
    {
      id: 'classroom',
      name: chatT('scenarios.classroom.name'),
      context: chatT('scenarios.classroom.context'),
      messages: [
        {
          id: 'm1',
          from: 'Ana',
          text: chatT('scenarios.classroom.messages.m1'),
          isOffensive: false,
          time: '14:30',
          type: 'message'
        },
        {
          id: 'm2',
          from: 'Tomás',
          text: chatT('scenarios.classroom.messages.m2'),
          isOffensive: false,
          time: '14:31',
          type: 'message'
        },
        {
          id: 'm3',
          from: 'Pedro',
          text: chatT('scenarios.classroom.messages.m3'),
          isOffensive: true,
          time: '14:33',
          type: 'message'
        },
        {
          id: 'm4',
          from: 'Sofia',
          text: chatT('scenarios.classroom.messages.m4'),
          isOffensive: true,
          time: '14:33',
          type: 'message'
        },
        {
          id: 'm5',
          from: 'João',
          text: chatT('scenarios.classroom.messages.m5'),
          isOffensive: false,
          time: '14:34',
          type: 'message'
        },
        {
          id: 'm6',
          from: 'Pedro',
          text: chatT('scenarios.classroom.messages.m6'),
          isOffensive: true,
          time: '14:35',
          type: 'message'
        },
        {
          id: 'm7',
          from: 'Sara',
          text: chatT('scenarios.classroom.messages.m7'),
          isOffensive: true,
          time: '14:35',
          type: 'message'
        }
      ],
      finalFeedback: {
        good: chatT('scenarios.classroom.feedback.good'),
        medium: chatT('scenarios.classroom.feedback.medium'),
        bad: chatT('scenarios.classroom.feedback.bad')
      }
    }
  ];
  
  // Opções de resposta predefinidas
  const responseOptions = {
    defend1: "Parem com isso! O João não merece esse tipo de comentário. Vamos respeitar todos, por favor.",
    defend2: "Isso não é legal. João, não liga para esses comentários, eles não te definem.",
    join: "Hahaha, realmente estranho esse projecto! Não sei como conseguiste fazer isso...",
    ignore: "✓✓ Visualizado"
  };
  
  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Add new messages periodically
  useEffect(() => {
    if (gameOver) return;
    
    const currentScenario = scenarios[currentScenarioIndex];
    
    if (!currentScenario) {
      setGameOver(true);
      return;
    }
    
    // If we have shown all messages or waiting for response, don't add more
    if (nextMessageIndex >= currentScenario.messages.length || waitingForResponse) {
      return;
    }
    
    // Add initial messages faster, then slow down
    const delay = nextMessageIndex < 3 ? 1000 : 2500;
    
    const timer = setTimeout(() => {
      const nextMessage = currentScenario.messages[nextMessageIndex];
      setDisplayedMessages(prev => [...prev, nextMessage]);
      
      // If this is an offensive message, wait for user reaction
      if (nextMessage.isOffensive) {
        setWaitingForResponse(true);
      } else {
        setNextMessageIndex(nextMessageIndex + 1);
      }
      
      scrollToBottom();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [nextMessageIndex, waitingForResponse, currentScenarioIndex, gameOver, scenarios]);
  
  // Handle user reaction to offensive message
  const handleReaction = (reaction: 'report' | 'defend' | 'ignore' | 'join', customText: string) => {
    if (!waitingForResponse) return;
    
    // Find the current offensive message
    const currentMessage = displayedMessages[displayedMessages.length - 1];
    
    // Update the message with user's reaction
    setDisplayedMessages(prev => 
      prev.map(msg => 
        msg.id === currentMessage.id ? { ...msg, userReaction: reaction } : msg
      )
    );
    
    // Add user's message (except for ignore)
    if (reaction !== 'ignore' || customText !== responseOptions.ignore) {
      const currentTime = new Date();
      const timeString = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      setDisplayedMessages(prev => [
        ...prev, 
        {
          id: `response-${currentMessage.id}`,
          from: 'Você',
          text: customText,
          isOffensive: false,
          time: timeString,
          type: 'message'
        }
      ]);
    } else {
      // Para "visualizado", adicionar uma mensagem de info
      setDisplayedMessages(prev => [
        ...prev, 
        {
          id: `response-${currentMessage.id}`,
          from: 'System',
          text: customText,
          isOffensive: false,
          time: '',
          type: 'info'
        }
      ]);
    }
    
    // Calculate points based on reaction
    let points = 0;
    let consequenceText = '';
    
    switch (reaction) {
      case 'report':
        points = 10;
        consequenceText = chatT('reactions.report.consequence');
        break;
      case 'defend':
        points = 8;
        consequenceText = chatT('reactions.defend.consequence');
        break;
      case 'ignore':
        points = 3;
        consequenceText = chatT('reactions.ignore.consequence');
        break;
      case 'join':
        points = -5;
        consequenceText = chatT('reactions.join.consequence');
        break;
    }
    
    setScore(prev => prev + points);
    
    // Add a consequence message
    setDisplayedMessages(prev => [
      ...prev,
      {
        id: `consequence-${currentMessage.id}`,
        from: 'System',
        text: '',
        consequenceText: consequenceText,
        isOffensive: false,
        time: '',
        type: 'consequence'
      }
    ]);
    
    setWaitingForResponse(false);
    setNextMessageIndex(nextMessageIndex + 1);
    
    // Check if this was the last message in the scenario
    const currentScenario = scenarios[currentScenarioIndex];
    if (nextMessageIndex + 1 >= currentScenario.messages.length) {
      // End the scenario after the consequence is shown
      setTimeout(() => {
        // If this was the last scenario, end the game
        if (currentScenarioIndex === scenarios.length - 1) {
          endGame();
        } else {
          // Otherwise go to next scenario
          setCurrentScenarioIndex(currentScenarioIndex + 1);
          setNextMessageIndex(0);
          setDisplayedMessages([]);
        }
      }, 3000);
    }
  };
  
  // End the game and calculate final feedback
  const endGame = () => {
    setGameOver(true);
    
    // Calculate feedback based on score
    const currentScenario = scenarios[currentScenarioIndex];
    
    // Get the appropriate feedback based on score
    // Assuming max possible points is ~30 for this scenario
    const maxPossiblePoints = 30; 
    const scorePercentage = (score / maxPossiblePoints) * 100;
    
    if (scorePercentage >= 70) {
      setFeedback(currentScenario.finalFeedback.good);
    } else if (scorePercentage >= 40) {
      setFeedback(currentScenario.finalFeedback.medium);
    } else {
      setFeedback(currentScenario.finalFeedback.bad);
    }
    
    // Complete the game after showing feedback
    setTimeout(() => {
      onComplete(score);
    }, 5000);
  };
  
  // Format message bubble class based on sender and type
  const getMessageClass = (message: Message) => {
    if (message.type === 'info') {
      return 'bg-gray-200 mx-auto max-w-sm text-center';
    }
    
    if (message.type === 'consequence') {
      return 'bg-indigo-100 mx-auto max-w-sm text-center';
    }
    
    // Regular messages
    return message.from === 'Você' 
      ? 'bg-green-100 ml-auto' 
      : 'bg-white mr-auto';
  };
  
  // Format message border based on whether offensive and reaction
  const getMessageBorder = (message: Message) => {
    if (!message.isOffensive) return '';
    
    if (message.userReaction === 'report' || message.userReaction === 'defend') {
      return 'border-2 border-green-400';
    }
    
    if (message.userReaction === 'join') {
      return 'border-2 border-red-400';
    }
    
    if (message.userReaction === 'ignore') {
      return 'border-2 border-yellow-400';
    }
    
    // Offensive message with no reaction yet
    return 'border-2 border-orange-300';
  };
  
  // Current scenario
  const currentScenario = scenarios[currentScenarioIndex];
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-2 text-gray-900">
        {chatT('gameTitle')}
      </h2>
      
      {/* Context */}
      <div className="mb-4">
        <p className="text-gray-700">{currentScenario.context}</p>
      </div>
      
      {/* Layout com dois painéis: chat e respostas */}
      <div className="flex flex-col h-[600px]">
        {/* Chat Window */}
        <div className="border rounded-t-lg flex-1 flex flex-col bg-gray-50 relative overflow-hidden">
          {/* Chat Header */}
          <div className="bg-green-500 text-white px-4 py-3 flex items-center">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-green-500 font-bold">👥</span>
            </div>
            <div>
              <h3 className="font-semibold">{currentScenario.name}</h3>
              <p className="text-xs">{chatT('participants')}: 8</p>
            </div>
            
            {/* Pontuação no cabeçalho */}
            <div className="ml-auto">
              <span className="text-white text-sm font-semibold">
                {chatT('score')}: {score}
              </span>
            </div>
          </div>
          
          {/* Messages Area - Espaço maior para as mensagens */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              <AnimatePresence>
                {displayedMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.type === 'consequence' ? (
                      <div className="bg-green-100 py-2 px-4 rounded-lg mt-2 mb-4 text-center">
                        <p className="text-green-800 text-sm">{message.consequenceText}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col max-w-[75%]">
                        {message.from !== 'Você' && message.type !== 'info' && (
                          <span className="text-xs text-gray-500 font-semibold ml-2 mb-1">
                            {message.from}
                          </span>
                        )}
                        <div 
                          className={`rounded-lg py-2 px-4 ${getMessageClass(message)} ${getMessageBorder(message)}`}
                        >
                          <p className="text-gray-800">{message.text}</p>
                          <div className="text-right">
                            <span className="text-gray-500 text-xs">{message.time}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        
        {/* Painel de instruções e respostas - Separado do chat */}
        <div className="border-t-0 border rounded-b-lg bg-white">
          {/* Instruções */}
          <div className="bg-green-50 p-3 border-b border-green-100">
            <p className="text-sm text-green-800 text-center">
              Responda às mensagens de cyberbullying no chat. Suas escolhas fazem diferença!
            </p>
          </div>
          
          {/* Opções de resposta como mensagens */}
          {waitingForResponse ? (
            <div className="p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Escolha uma mensagem:</p>
              <div className="space-y-3">
                {/* Defender João (opção 1) */}
                <div 
                  onClick={() => handleReaction('defend', responseOptions.defend1)}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg flex items-center cursor-pointer"
                >
                  <span className="text-sm">{responseOptions.defend1}</span>
                </div>
                
                {/* Defender João (opção 2) */}
                <div 
                  onClick={() => handleReaction('defend', responseOptions.defend2)}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg flex items-center cursor-pointer"
                >
                  <span className="text-sm">{responseOptions.defend2}</span>
                </div>
                
                {/* Juntar aos comentários */}
                <div 
                  onClick={() => handleReaction('join', responseOptions.join)}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg flex items-center cursor-pointer"
                >
                  <span className="text-sm">{responseOptions.join}</span>
                </div>
                
                {/* Visualizar/Ignorar */}
                <div 
                  onClick={() => handleReaction('ignore', responseOptions.ignore)}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <span className="text-sm font-medium">{responseOptions.ignore}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 flex justify-center items-center h-40">
              <p className="text-gray-500 italic">Aguardando novas mensagens no chat...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Game Over Feedback */}
      {gameOver && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-lg text-green-800 mb-2">
            {chatT('scenarioComplete')}
          </h3>
          <p className="text-gray-700">{feedback}</p>
        </div>
      )}
    </div>
  );
}