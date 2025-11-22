
import React from 'react';
import { db } from '../services/mockDb';
import { Crown, Medal } from 'lucide-react';

export const Leaderboard = () => {
    const currentUser = db.getCurrentUser();
    // Simulated leaderboard data with generated avatars/colors
    const users = [
        currentUser,
        { displayName: 'Anna K.', xp: 12500, celkoveSkore: 4500, username: 'annak' },
        { displayName: 'Tomáš M.', xp: 9800, celkoveSkore: 3200, username: 'tomm' },
        { displayName: 'Jakub P.', xp: 15400, celkoveSkore: 5100, username: 'kubap' },
        { displayName: 'Lucie N.', xp: 8000, celkoveSkore: 2900, username: 'lucn' }
    ];

    // Sort by XP for leaderboard
    const sortedUsers = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));

    return (
        <div className="p-6 pt-10 pb-32 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Žebříček 🏆</h1>
                <p className="text-gray-500 dark:text-gray-400">Soutěž se spolužáky</p>
            </div>

            <div className="space-y-4">
                {sortedUsers.map((u, i) => {
                    const isMe = u.username === currentUser.username;
                    let rankColor = 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
                    let Icon = null;

                    if (i === 0) { rankColor = 'bg-yellow-100 text-yellow-600 border border-yellow-200'; Icon = Crown; }
                    if (i === 1) { rankColor = 'bg-gray-200 text-gray-600 border border-gray-300'; Icon = Medal; }
                    if (i === 2) { rankColor = 'bg-orange-100 text-orange-600 border border-orange-200'; Icon = Medal; }

                    return (
                        <div key={i} className={`relative p-4 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02] ${isMe ? 'bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${rankColor}`}>
                                {Icon ? <Icon size={18} /> : i + 1}
                            </div>
                            
                            <div className="flex-1">
                                <div className={`font-bold ${isMe ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{u.displayName}</div>
                                <div className={`text-xs ${isMe ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>@{u.username}</div>
                            </div>

                            <div className={`text-right ${isMe ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                <div className="font-bold text-lg">{u.xp?.toLocaleString() || 0}</div>
                                <div className={`text-[10px] uppercase font-bold ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>XP</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
