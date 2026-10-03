export type ActiveTab = 'study' | 'launch-kit' | 'modules' | 'compliance' | 'monetization' | 'architecture' | 'chatbot' | 'interactive' | 'full-dossier';

export type UserRoleView = 'all' | 'cto' | 'ux' | 'legal';

export type AgeProfile = 'junior' | 'academic' | 'adult';

export type ChatbotRole = 'tutor' | 'examiner' | 'legal' | 'cto';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  isStreaming?: boolean;
}

export interface SM2State {
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
  nextReviewDate: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  sm2: SM2State;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  aiConfidence: number;
  citationSource: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  features: { text: string; included: boolean; highlight?: boolean }[];
  cta: string;
}
