import React, { useState, useEffect } from 'react';
import { db } from './services/mockDb';
import { User, ViewState, ExamConfig } from './types';
import BottomNav from './components/BottomNav';
import { Home } from './pages/Home';
import { Exam } from './pages/Exam';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Flashcards } from './pages/Flashcards';
import { geminiService } from './services/geminiService';
import { ArrowRight, Save, User as UserIcon } from 'lucide-react';

// Keeping AITutor inline for simplicity as it wasn't requested to be split, 
// but ideally would be in pages/AITutor.tsx
const AITutor = () => {
    const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
        {role: 'model', text: 'Ahoj! Jsem tvůj AI učitel. S čím potřebuješ pomoct?'}
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const send = async () => {
        if (!input.trim()) return;
        const newHistory = [...messages, {role: 'user' as const, text: input}];
        setMessages(newHistory);
        setInput('');
        setLoading(true);
        const apiHistory = newHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
        const response = await geminiService.chatWithTutor(input, apiHistory.slice(0, -1) as any);
        setMessages(prev => [...prev, {role: 'model', text: response}]);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-screen pb-20 bg-gray-50 dark:bg-gray-900">
             <div className="p-4 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                 <h1 className="font-bold text-lg text-gray-900 dark:text-white">AI Doučování</h1>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {messages.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}`}>
                             {m.text}
                         </div>
                     </div>
                 ))}
                 {loading && <div className="text-center text-xs text-gray-400">AI píše...</div>}
             </div>
             <div className="p-4 bg-white dark:bg-gray-800 flex gap-2">
                 <input value={input} onChange={e => setInput(e.target.value)} placeholder="Zeptej se..." className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full px-4 py-3 outline-none" onKeyDown={e => e.key === 'Enter' && send()} />
                 <button onClick={send} className="bg-indigo-600 text-white p-3 rounded-full"><ArrowRight size={20}/></button>
             </div>
        </div>
    );
};

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<User | null>(null);
  const [examConfig, setExamConfig] = useState<ExamConfig | undefined>(undefined);
  
  // Initialize theme: Default to Dark (true) if not explicitly set to 'light'
  const [darkMode, setDarkMode] = useState<boolean>(() => {
      const saved = localStorage.getItem('theme');
      return saved !== 'light';
  });

  const refreshUser = () => {
      const u = db.checkStreak(); // Also refreshes user data
      setUser(u);
  };

  useEffect(() => {
    refreshUser();
  }, [view]);

  useEffect(() => {
      if (darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
      }
  }, [darkMode]);

  const handleStartExam = (config?: ExamConfig) => {
      setExamConfig(config);
      setView('exam_session');
  };

  if (!user) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className={darkMode ? 'dark' : ''}>
        <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen shadow-2xl overflow-hidden relative transition-colors duration-300">
        
            {view === 'home' && <Home user={user} setView={setView} startQuickExam={handleStartExam} />}
            
            {view === 'exam_select' && <Exam onBack={() => setView('home')} onExamStart={handleStartExam} />}
            
            {view === 'exam_session' && <Exam config={examConfig} onBack={() => { setView('home'); refreshUser(); }} />}
            
            {view === 'leaderboard' && <Leaderboard />}
            
            {view === 'flashcards' && <Flashcards />}
            
            {view === 'profile' && <Profile user={user} isDark={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />}

            {view === 'ai_tutor' && <AITutor />}

            {view !== 'exam_session' && view !== 'ai_tutor' && (
                <BottomNav currentView={view} setView={setView} />
            )}
        </div>
    </div>
  );
}