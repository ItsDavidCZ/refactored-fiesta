import React from 'react';
import { Zap, Target, BookOpen, PlayCircle, Brain, TrendingUp, Lock, CheckCircle } from 'lucide-react';
import { User, ViewState, ExamConfig } from '../types';
import { calculateLevel, getLevelProgress } from '../services/mockDb';

interface HomeProps {
    user: User;
    setView: (v: ViewState) => void;
    startQuickExam: (cfg: ExamConfig) => void;
}

const DonutChart = ({ percentage, color, label, count }: { percentage: number, color: string, label: string, count: string }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 group">
                {/* Background Circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                    <circle 
                        cx="35" cy="35" r={radius} 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round" 
                        className={`${color} transition-all duration-1000 ease-out`} 
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-white">{percentage}%</span>
                </div>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{label}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{count}</span>
        </div>
    );
};

export const Home: React.FC<HomeProps> = ({ user, setView, startQuickExam }) => {
    const level = user.level;
    const progress = getLevelProgress(user.xp);
    
    // Check Daily Challenge
    const today = new Date().toISOString().split('T')[0];
    const isDailyDone = user.dailyChallengeLastCompleted?.startsWith(today);

    // Stats Calculation
    const mathStats = user.stats?.math || { correct: 0, total: 0 };
    const czechStats = user.stats?.czech || { correct: 0, total: 0 };

    const getPercent = (correct: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((correct / total) * 100);
    };

    const mathPercent = getPercent(mathStats.correct, mathStats.total);
    const czechPercent = getPercent(czechStats.correct, czechStats.total);

    return (
        <div className="p-6 space-y-8 pb-32 pt-8 animate-in fade-in duration-500">
            {/* Header & Level Bar */}
            <header>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Na Jistotu.</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Vítej zpět, {user.displayName.split(' ')[0]}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 shadow-sm px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                        <Zap size={16} className="text-yellow-500" fill="currentColor" />
                        <span className="font-bold text-gray-800 dark:text-white">{user.pocetDniStreak}</span>
                    </div>
                </div>
                
                {/* XP Bar */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-indigo-600 dark:text-indigo-400">Level {level}</span>
                        <span className="text-gray-400">{Math.round(progress)}% do Lvl {level + 1}</span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl -mr-5 -mt-5"></div>
                </div>
            </header>

            {/* Stats / Charts */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-around items-center">
                 <DonutChart 
                    percentage={mathPercent} 
                    color="text-blue-500" 
                    label="Matematika" 
                    count={`${mathStats.correct}/${mathStats.total}`}
                 />
                 <div className="h-12 w-px bg-gray-100 dark:bg-gray-700"></div>
                 <DonutChart 
                    percentage={czechPercent} 
                    color="text-red-500" 
                    label="Čeština"
                    count={`${czechStats.correct}/${czechStats.total}`}
                 />
            </div>

            {/* Daily Challenge */}
            <div 
                onClick={() => !isDailyDone && startQuickExam({ mode: 'daily_challenge' })}
                className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg cursor-pointer transition-transform active:scale-[0.98] ${isDailyDone ? 'bg-gray-800 dark:bg-gray-800 grayscale' : 'bg-gradient-to-r from-orange-500 to-pink-600 shadow-orange-200 dark:shadow-none'}`}
            >
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <Target className="text-white/90" size={20} />
                             <span className="font-bold text-sm uppercase tracking-wider opacity-90">Denní Výzva</span>
                        </div>
                        <h3 className="text-2xl font-bold">{isDailyDone ? 'Splněno!' : '+200 XP'}</h3>
                        <p className="text-white/80 text-sm mt-1 font-medium">{isDailyDone ? 'Přijď zase zítra.' : '5 otázek. Dvojnásobek XP.'}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        {isDailyDone ? <CheckCircle size={32} /> : <PlayCircle size={32} />}
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Rychlá akce</h2>
                <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => startQuickExam({ mode: 'practice' })} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:border-green-200 dark:hover:border-green-900 transition-colors">
                        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 mb-2">
                            <BookOpen size={24} />
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-100">Rychlé procvičování</span>
                     </button>

                     <button onClick={() => startQuickExam({ mode: 'review' })} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:border-purple-200 dark:hover:border-purple-900 transition-colors">
                        <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400 mb-2">
                            <Brain size={24} />
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-100">Opravit chyby</span>
                     </button>
                </div>
            </div>
            
            {/* AI Promo */}
            <div onClick={() => setView('ai_tutor')} className="bg-gray-900 dark:bg-indigo-950 rounded-2xl p-5 flex items-center justify-between cursor-pointer">
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2"><Brain size={16} className="text-purple-400"/> AI Doučování</h3>
                    <p className="text-gray-400 text-xs mt-1">Zeptej se na cokoliv k učivu</p>
                </div>
                <span className="text-white bg-white/10 px-3 py-1 rounded-lg text-xs font-bold">Otevřít</span>
            </div>
        </div>
    );
};