import React from 'react';
import { Home, Award, FileText, Layers, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'home', label: 'Domů', icon: Home },
    { id: 'leaderboard', label: 'Žebříček', icon: Award },
    { id: 'exam_select', label: 'Zkouška', icon: FileText },
    { id: 'flashcards', label: 'Kartičky', icon: Layers },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full glass-panel z-50 pb-safe pt-2 px-4 border-t border-white/40 dark:border-white/10 rounded-t-3xl transition-all duration-300 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-end max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'exam_select' && currentView === 'exam_session');
          
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`group flex flex-col items-center justify-center w-14 relative transition-all duration-300 ${
                isActive ? '-translate-y-3' : 'pb-4'
              }`}
            >
              {/* Icon Container */}
              <div 
                className={`p-3 rounded-2xl transition-all duration-300 ease-out flex items-center justify-center relative z-10
                ${isActive 
                    ? 'bg-indigo-600 text-white scale-110 shadow-[0_0_20px_rgba(79,70,229,0.5)] ring-2 ring-indigo-400/50 dark:ring-indigo-400/30' 
                    : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95'
                }`}
              >
                <item.icon 
                  size={isActive ? 22 : 24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-transform duration-300 ${isActive ? 'scale-100' : 'group-hover:scale-110'}`}
                />
                
                {/* Intense Glow Effect Layer */}
                {isActive && (
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-indigo-500 blur-xl opacity-50 animate-pulse"></div>
                )}
              </div>
              
              {/* Label Animation */}
              <span className={`absolute -bottom-3 text-[10px] font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 opacity-100 translate-y-0 scale-110' 
                    : 'opacity-0 translate-y-2 pointer-events-none scale-90'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;