'use client';

import { useState, useCallback } from 'react';
import { GameState, Choice, Scenario } from '@/lib/game/types';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    showingScenario: true,
    showingFeedback: false,
    showingQuiz: false,
    selectedChoice: null,
    sessionId: null,
    scenarios: [],
    score: 0,
    loading: true,
    error: null,
    locale: 'pt'
  });

  // Inicializa o jogo com o idioma selecionado
  const initGame = useCallback(async (locale: string) => {
    try {
      // Fetch scenarios from the API with locale
      const response = await fetch(`/api/game/start?locale=${locale}`);
      if (!response.ok) {
        throw new Error('Failed to load game data');
      }
      
      const data = await response.json();
      
      setGameState({
        ...gameState,
        scenarios: data.levels,
        sessionId: data.sessionId,
        loading: false,
        locale
      });
    } catch (error) {
      setGameState({
        ...gameState,
        error: 'Falha ao carregar dados do jogo. Por favor, tente novamente.',
        loading: false,
      });
      console.error('Game initialization error:', error);
    }
  }, [gameState]);

  const handleChoiceSelected = async (choice: Choice) => {
    try {
      // Record the choice via API
      const response = await fetch('/api/game/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: gameState.sessionId,
          level: gameState.currentLevel + 1,
          scenarioId: String(gameState.scenarios[gameState.currentLevel]?.id),
          choiceId: choice.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record choice');
      }

      // Update score and state
      const newScore = gameState.score + choice.points;
      
      setGameState({
        ...gameState,
        selectedChoice: choice,
        showingScenario: false,
        showingFeedback: true,
        score: newScore,
      });
    } catch (error) {
      console.error('Error recording choice:', error);
      // Still update the UI even if backend fails
      const newScore = gameState.score + choice.points;
      
      setGameState({
        ...gameState,
        selectedChoice: choice,
        showingScenario: false,
        showingFeedback: true,
        score: newScore,
      });
    }
  };

  const handleFeedbackContinue = () => {
    setGameState({
      ...gameState,
      showingFeedback: false,
      showingQuiz: true,
    });
  };

  const handleQuizSubmit = async (isCorrect: boolean, optionId: string, shouldContinue?: boolean) => {
    try {
      if (shouldContinue) {
        const response = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: gameState.sessionId,
            questionId: gameState.scenarios[gameState.currentLevel]?.quiz.question,
            answerId: optionId,
            isCorrect: isCorrect
          })
        });

        if (!response.ok) {
          throw new Error('Failed to record quiz response');
        }
        
        const quizScore = isCorrect ? 10 : 0;
        const newScore = gameState.score + quizScore;
        
        const isLastLevel = gameState.currentLevel >= gameState.scenarios.length - 1;
        
        // Update session via API
        await fetch('/api/game/update-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: gameState.sessionId,
            score: newScore,
            currentLevel: gameState.currentLevel + 2,
            completed: isLastLevel
          })
        });
        
        if (!isLastLevel) {
          setGameState({
            ...gameState,
            currentLevel: gameState.currentLevel + 1,
            showingScenario: true,
            showingQuiz: false,
            selectedChoice: null,
            score: newScore,
          });
        } else {
          setGameState({
            ...gameState,
            showingQuiz: false,
            score: newScore,
          });
        }
      }
    } catch (error) {
      console.error('Error handling quiz:', error);
      if (shouldContinue) {
        const quizScore = isCorrect ? 10 : 0;
        const newScore = gameState.score + quizScore;
        const isLastLevel = gameState.currentLevel >= gameState.scenarios.length - 1;
        
        if (!isLastLevel) {
          setGameState({
            ...gameState,
            currentLevel: gameState.currentLevel + 1,
            showingScenario: true,
            showingQuiz: false,
            selectedChoice: null,
            score: newScore,
          });
        } else {
          setGameState({
            ...gameState,
            showingQuiz: false,
            score: newScore,
          });
        }
      }
    }
  };

  return {
    gameState,
    handleChoiceSelected,
    handleFeedbackContinue,
    handleQuizSubmit,
    initGame
  };
}