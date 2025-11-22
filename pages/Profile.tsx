
import React from 'react';
import { User } from '../types';
import { Moon, Sun, Award, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { BADGES, calculateLevel, getLevelProgress } from '../services/mockDb';

interface ProfileProps {
    user: User;
    isDark: boolean;
    toggleTheme: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, isDark, toggleTheme }) => {
    const level = calculateLevel(user.xp);
    // Helper to avoid NaN in display
    const getSuccessRate = (correct: number, total: number) => {
        if (!total || total === 0) return 0;
        return Math.round((correct / total) * 100);
    };

    return (
        <div className="p-6 pt-10 pb-32 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center mb-8 relative">
                <div className="w-28 h-28 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 p-1 shadow-xl">
                     <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full border-4 border-transparent flex items-center justify-center text-3xl font-bold text-gray-700 dark:text-white">
                         {user.displayName.charAt(0)}
                     </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName}</h1>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">Level {level} • {user.xp.toLocaleString()} XP</p>
                
                <div className="absolute top-0 right-0">
                    <button onClick={toggleTheme} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                        {isDark ? <Moon size={20}/> : <Sun size={20}/>}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-bold uppercase">
                        <TrendingUp size={14} /> Celkové Skóre
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.celkoveSkore}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-bold uppercase">
                        <Calendar size={14} /> Streak
                    </div>
                    <div className="text-2xl font-bold text-orange-500">{user.pocetDniStreak} dní 🔥</div>
                </div>
            </div>

            {/* Subject Statistics Breakdown */}
            {user.stats && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen size={16}/> Statistiky předmětů
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-blue-600">Matematika</span>
                                <span className="text-xs text-gray-500">{user.stats.math.correct} / {user.stats.math.total} správně</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${getSuccessRate(user.stats.math.correct, user.stats.math.total)}%` }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-red-600">Český Jazyk</span>
                                <span className="text-xs text-gray-500">{user.stats.czech.correct} / {user.stats.czech.total} správně</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full rounded-full" style={{ width: `${getSuccessRate(user.stats.czech.correct, user.stats.czech.total)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Badges Section */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="text-yellow-500" /> Odznaky
                </h2>
                <div className="grid grid-cols-4 gap-3">
                    {BADGES.map(badge => {
                        const isUnlocked = user.badges.includes(badge.id);
                        return (
                            <div key={badge.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${isUnlocked ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-gray-100 dark:bg-gray-800 opacity-50 grayscale'}`}>
                                <div className="text-2xl mb-1">{badge.icon}</div>
                                <div className="text-[9px] font-bold text-gray-700 dark:text-gray-300 leading-tight">{badge.name}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <div className="text-center text-gray-400 text-xs mt-10">
                Verze 2.0 • Na Jistotu
            </div>
        </div>
    );
};
