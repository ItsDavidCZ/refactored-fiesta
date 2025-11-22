
export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  celkoveSkore: number; // Legacy score (total points)
  xp: number; // Experience points for leveling
  level: number;
  badges: string[]; // IDs of unlocked badges
  pocetDniStreak: number;
  posledniPrihlaseni: string; // ISO Date string
  dailyChallengeLastCompleted?: string; // ISO Date
  stats: {
    math: { total: number; correct: number };
    czech: { total: number; correct: number };
  };
}

export interface Question {
  id: string;
  predmet: 'Matematika' | 'Čeština';
  tema: string;
  otazka: string;
  odpovedA: string;
  odpovedB: string;
  odpovedC: string;
  spravnaOdpoved: 'A' | 'B' | 'C';
  vysvetleniChyby: string;
  isCritical: boolean;
  examSection?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Badge {
  id: string;
  icon: string; // Lucide icon name or emoji
  name: string;
  description: string;
  condition: (user: User) => boolean;
}

export interface Progress {
  userId: string;
  tema: string;
  spravneOdpovediPocet: number;
  celkemOdpovediPocet: number;
}

export interface ErrorLog {
  id: string;
  userId: string;
  questionId: string;
  timestamp: string;
  isCorrected: boolean;
}

export interface Flashcard {
  id: string;
  userId: string;
  category: string;
  front: string;
  back: string;
  status: 'new' | 'learning' | 'mastered';
}

export interface AINote {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

// App Navigation Types
export type ViewState = 'home' | 'leaderboard' | 'exam_select' | 'exam_session' | 'flashcards' | 'profile' | 'ai_tutor';

export interface ExamConfig {
  mode: 'simulation' | 'panic' | 'review' | 'daily_challenge' | 'practice';
  subject?: 'Matematika' | 'Čeština';
  duration?: number; // in seconds
  questionCount?: number;
}
