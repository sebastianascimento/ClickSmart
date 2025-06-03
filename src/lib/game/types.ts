export interface Choice {
    id: string;
    text: string;
    impact: 'positive' | 'negative' | 'neutral' | 'slightly_positive';
    feedback: string;
    points: number;
  }
  
  export interface QuizOption {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface Quiz {
    question: string;
    options: QuizOption[];
    explanation: string;
  }
  
  export interface Scenario {
    id: number;
    title: string;
    description: string;
    image: string;
    choices: Choice[];
    quiz: Quiz;
  }
  
  export interface GameState {
    currentLevel: number;
    showingScenario: boolean;
    showingFeedback: boolean;
    showingQuiz: boolean;
    selectedChoice: Choice | null;
    sessionId: string | null;
    scenarios: Scenario[];
    score: number;
    loading: boolean;
    error: string | null;
    locale: string;
  }