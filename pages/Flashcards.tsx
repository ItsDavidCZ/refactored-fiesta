
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { RefreshCw, ThumbsUp, ThumbsDown, Layers } from 'lucide-react';

export const Flashcards = () => {
    const cards = db.getFlashcards();
    const [flippedId, setFlippedId] = useState<string | null>(null);

    const handleStatusUpdate = (id: string, status: 'learning' | 'mastered', e: React.MouseEvent) => {
        e.stopPropagation();
        db.updateFlashcardStatus(id, status);
        setFlippedId(null); // Reset flip
        // Force re-render would typically be handled by state/context here, 
        // for mock we assume standard React update cycle via parent or layout shift
    };

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-full mb-6">
                    <Layers size={48} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Žádné kartičky</h2>
                <p className="text-gray-500 dark:text-gray-400">Dokonči test a vytvoř si kartičky z chyb.</p>
            </div>
        );
    }

    return (
         <div className="p-6 pt-10 pb-32 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="text-indigo-600" /> Moje Kartičky
            </h1>
            
            <div className="space-y-6">
                {cards.map(card => {
                    const isFlipped = flippedId === card.id;
                    return (
                        <div key={card.id} className="group perspective-1000 h-56 w-full cursor-pointer" onClick={() => setFlippedId(isFlipped ? null : card.id)}>
                            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                
                                {/* FRONT */}
                                <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
                                     <div className="text-xs font-bold uppercase text-indigo-500 tracking-wider mb-4">{card.category}</div>
                                     <p className="font-serif text-xl font-medium text-gray-800 dark:text-gray-100">{card.front}</p>
                                     <div className="absolute bottom-4 text-xs text-gray-400 flex items-center gap-1">
                                        <RefreshCw size={12} /> Klikni pro otočení
                                     </div>
                                </div>

                                {/* BACK */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 dark:bg-indigo-900 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center text-center text-white">
                                    <p className="text-lg font-medium mb-6 leading-relaxed">{card.back}</p>
                                    
                                    <div className="flex gap-4 mt-auto w-full px-4">
                                        <button 
                                            onClick={(e) => handleStatusUpdate(card.id, 'learning', e)}
                                            className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 backdrop-blur-sm transition-colors"
                                        >
                                            <ThumbsDown size={16}/> Neumím
                                        </button>
                                        <button 
                                            onClick={(e) => handleStatusUpdate(card.id, 'mastered', e)}
                                            className="flex-1 py-2 bg-white text-indigo-600 hover:bg-gray-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ThumbsUp size={16}/> Umím
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
         </div>
    );
};
