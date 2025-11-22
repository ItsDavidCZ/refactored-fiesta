import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Brain, CheckCircle, XCircle, Loader2, Check, BookOpen, BarChart2, AlertTriangle } from 'lucide-react';
import { db } from '../services/mockDb';
import { geminiService } from '../services/geminiService';
import { Question, ExamConfig } from '../types';

interface ExamProps {
  onBack: () => void;
  config?: ExamConfig;
  onExamStart?: (cfg: ExamConfig) => void; // New prop to handle view switching
}

export const Exam: React.FC<ExamProps> = ({ onBack, config: initialConfig, onExamStart }) => {
  const [mode, setMode] = useState<'select' | 'active' | 'result'>('select');
  const [examConfig, setExamConfig] = useState<ExamConfig>(initialConfig || { mode: 'simulation' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // UX/AI State
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [cachedExplanations, setCachedExplanations] = useState<Record<string, string>>({}); // Cache for AI responses
  const [currentWrongQ, setCurrentWrongQ] = useState<Question | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Result Screen Animations
  const [earnedXp, setEarnedXp] = useState(0);
  const [displayedXp, setDisplayedXp] = useState(0); 
  const [flashcardSaveStatus, setFlashcardSaveStatus] = useState<'idle' | 'creating' | 'saved'>('idle');
  const [customCategory, setCustomCategory] = useState('Můj poslední test');

  // Interaction State
  const [processingAnswer, setProcessingAnswer] = useState(false); 
  const [smartReviewMessage, setSmartReviewMessage] = useState<string | null>(null);

  // Helper to check if we should hide feedback (Simulation mode)
  const isSimulation = examConfig.mode === 'simulation';
  const isPractice = examConfig.mode === 'practice';

  useEffect(() => {
    if (initialConfig) startExam(initialConfig);
  }, [initialConfig]);

  // XP Counting Animation
  useEffect(() => {
    if (mode === 'result' && earnedXp > 0) {
        let start = 0;
        const end = earnedXp;
        const duration = 2000; 
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            setDisplayedXp(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
  }, [mode, earnedXp]);

  const handleSafeBack = () => {
      if (mode === 'active') {
          if (window.confirm("Opravdu chceš odejít? Postup bude ztracen.")) {
              onBack();
          }
      } else {
          onBack();
      }
  };

  const startExam = (cfg: ExamConfig) => {
    let filteredQ: Question[] = [];
    const allQ = db.getQuestions();

    if (cfg.mode === 'daily_challenge') {
        filteredQ = db.getDailyChallengeQuestions();
        setTimeLeft(300); // 5 mins for challenge
    } else if (cfg.mode === 'panic') {
        filteredQ = allQ.filter(q => q.isCritical).slice(0, 10);
        setTimeLeft(600);
    } else if (cfg.mode === 'review') {
        const errors = db.getErrors();
        const errorQIds = new Set(errors.filter(e => !e.isCorrected).map(e => e.questionId));
        filteredQ = allQ.filter(q => errorQIds.has(q.id)).slice(0, 10);
        if (filteredQ.length === 0) {
             alert("Skvělé! Nemáš žádné chyby k opravě.");
             onBack();
             return;
        }
        setTimeLeft(0); // No timer for review
    } else if (cfg.mode === 'practice') {
        filteredQ = allQ.sort(() => 0.5 - Math.random()).slice(0, 15);
        setTimeLeft(0); // No timer for practice
    } else {
        // Simulation
        const subjectQ = cfg.subject ? allQ.filter(q => q.predmet === cfg.subject) : allQ;
        filteredQ = subjectQ.sort(() => 0.5 - Math.random()).slice(0, 15);
        
        // Set Timer based on subject
        if (cfg.subject === 'Matematika') setTimeLeft(75 * 60);
        else if (cfg.subject === 'Čeština') setTimeLeft(60 * 60);
        else setTimeLeft(45 * 60); // Default
    }

    setQuestions(filteredQ);
    setExamConfig(cfg);
    setMode('active');
    setCurrentQIndex(0);
    setAnswers({});
    setEarnedXp(0);
    setDisplayedXp(0);
    setShowConfetti(false);
    setFlashcardSaveStatus('idle');
    setCachedExplanations({});
    setCustomCategory('Můj poslední test');
  };

  useEffect(() => {
    let interval: number;
    // Only run timer if timeLeft > 0 and NOT in a no-timer mode that was initialized to 0
    // However, we initialize practice to 0.
    if (mode === 'active' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) { finishExam(); return 0; }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, timeLeft]);

  const handleAnswer = (answer: string) => {
    if (processingAnswer) return;

    const currentQ = questions[currentQIndex];
    const isCorrect = answer === currentQ.spravnaOdpoved;
    
    setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));

    // --- SIMULATION MODE: NO FEEDBACK ---
    if (isSimulation) {
        setProcessingAnswer(true);
        setTimeout(() => {
            proceedToNext();
            setProcessingAnswer(false);
        }, 300);
        return;
    }

    // --- PRACTICE/REVIEW MODE: FEEDBACK ---
    if (isCorrect) {
      setProcessingAnswer(true);
      
      if (examConfig.mode === 'review') {
        db.markErrorCorrected(currentQ.id);
        setSmartReviewMessage("Skvělá práce! Chyba odstraněna.");
        setTimeout(() => setSmartReviewMessage(null), 2000);
      }

      setTimeout(() => {
          proceedToNext();
          setProcessingAnswer(false);
      }, 1000);

    } else {
      db.logError(currentQ.id);
      setCurrentWrongQ(currentQ);
      setTimeout(() => setShowErrorPopup(true), 400);
    }
  };

  const proceedToNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setMode('result');
    
    let correctCount = 0;
    let mathCorrect = 0;
    let mathTotal = 0;
    let czechCorrect = 0;
    let czechTotal = 0;

    questions.forEach(q => {
        const isCorrect = answers[q.id] === q.spravnaOdpoved;
        
        // General Score
        if (isCorrect) correctCount++;

        // Subject Stats
        if (q.predmet === 'Matematika') {
            mathTotal++;
            if (isCorrect) mathCorrect++;
        } else if (q.predmet === 'Čeština') {
            czechTotal++;
            if (isCorrect) czechCorrect++;
        }
    });

    // Update DB with stats
    db.updateSubjectStats(mathCorrect, mathTotal, czechCorrect, czechTotal);

    const baseXp = correctCount * 10; 
    let finalXp = baseXp;
    let bonus = 0;

    if (correctCount === questions.length) bonus += 50; 
    if (examConfig.mode === 'daily_challenge') finalXp *= 2; 

    finalXp += bonus;
    setEarnedXp(finalXp);

    db.addXp(finalXp);
    
    if (examConfig.mode === 'daily_challenge') {
        db.updateUser({ dailyChallengeLastCompleted: new Date().toISOString() });
    }

    if ((correctCount / questions.length) > 0.8) {
        setShowConfetti(true);
    }
  };

  const handleAIExplain = async () => {
    if (!currentWrongQ) return;
    
    // Check Cache first
    if (cachedExplanations[currentWrongQ.id]) {
        setAiExplanation(cachedExplanations[currentWrongQ.id]);
        return;
    }

    setAiLoading(true);
    const explanation = await geminiService.getExplanation(currentWrongQ, answers[currentWrongQ.id] || '?');
    setAiExplanation(explanation);
    setCachedExplanations(prev => ({...prev, [currentWrongQ.id]: explanation}));
    setAiLoading(false);
  };

  const closePopupAndNext = () => {
    setShowErrorPopup(false);
    setAiExplanation(null);
    proceedToNext();
  };

  const createFlashcards = () => {
    setFlashcardSaveStatus('creating');
    
    // Simulate creation delay for UX
    setTimeout(() => {
        const category = customCategory.trim() || 'Můj poslední test';
        const cards = questions.map(q => ({
          category: category,
          front: q.otazka,
          back: `Správně: ${q.spravnaOdpoved}. ${q.vysvetleniChyby}`
        }));
        db.addFlashcards(cards);
        setFlashcardSaveStatus('saved');
        setTimeout(() => setFlashcardSaveStatus('idle'), 3000);
    }, 800);
  };

  // --- RENDER: SELECTION ---
  if (mode === 'select') {
      const startSimulation = (subject: 'Matematika' | 'Čeština') => {
          const config: ExamConfig = { mode: 'simulation', subject };
          if (onExamStart) {
              onExamStart(config);
          } else {
              startExam(config);
          }
      };

      return (
        <div className="p-6 space-y-6 pt-12 pb-24 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Vyber předmět zkoušky</h1>
             <div className="space-y-4">
                <button onClick={() => startSimulation('Matematika')} 
                    className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 active:scale-95 transition-transform hover:border-blue-200 dark:hover:border-blue-900">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400"><Clock /></div>
                    <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Matematika (Simulace)</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">75 min • Bez nápovědy</p>
                    </div>
                </button>

                <button onClick={() => startSimulation('Čeština')} 
                    className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 active:scale-95 transition-transform hover:border-red-200 dark:hover:border-red-900">
                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400"><Clock /></div>
                    <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Český Jazyk (Simulace)</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">60 min • Bez nápovědy</p>
                    </div>
                </button>
             </div>
        </div>
      );
  }

  // --- RENDER: RESULT ---
  if (mode === 'result') {
    const correctCount = questions.filter(q => answers[q.id] === q.spravnaOdpoved).length;
    const percentage = Math.round((correctCount / questions.length) * 100) || 0;

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 relative overflow-y-auto">
        {showConfetti && (
            <div className="absolute inset-0 pointer-events-none flex justify-center overflow-hidden z-0 h-screen">
                <div className="absolute top-0 w-full h-full animate-pulse opacity-50 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent"></div>
                <div className="absolute top-10 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-bounce delay-100"></div>
                <div className="absolute top-20 right-1/4 w-2 h-2 bg-blue-500 rounded-md animate-bounce delay-300"></div>
                <div className="absolute top-30 left-3/4 w-3 h-3 bg-green-500 rounded-full animate-bounce delay-150"></div>
                <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-spin delay-75"></div>
                <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-500 rounded-md animate-pulse delay-200"></div>
            </div>
        )}
        
        <div className="p-6 flex flex-col items-center pt-12 relative z-10 animate-in slide-in-from-bottom-10 duration-700">
            <div className="text-6xl mb-4 animate-bounce">{percentage >= 80 ? '🏆' : (percentage >= 50 ? '🎉' : '💪')}</div>
            <h2 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{percentage}%</h2>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 rounded-full mb-8 border border-indigo-100 dark:border-indigo-800 transform transition-all hover:scale-110">
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 text-xl">
                    +{displayedXp} XP
                </span>
            </div>

            <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-8">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><BarChart2 size={16}/> Přehled odpovědí</h3>
                <div className="space-y-2">
                    {questions.map((q, idx) => {
                        const isRight = answers[q.id] === q.spravnaOdpoved;
                        return (
                            <div key={q.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 w-6">#{idx + 1}</span>
                                <span className="flex-1 truncate px-2 text-gray-700 dark:text-gray-200">{q.otazka}</span>
                                {isRight ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-500"/>}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="w-full space-y-3 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block">Uložit chyby jako kartičky</label>
                    <input 
                        type="text" 
                        value={customCategory} 
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Název kategorie..."
                        className="w-full p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mb-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                    />
                    <button 
                        onClick={createFlashcards} 
                        disabled={flashcardSaveStatus !== 'idle'}
                        className={`w-full py-3 rounded-xl font-bold shadow-sm transition-all duration-300 flex justify-center items-center gap-2 ${
                            flashcardSaveStatus === 'saved' 
                            ? 'bg-green-500 text-white' 
                            : flashcardSaveStatus === 'creating'
                                ? 'bg-indigo-400 text-white cursor-wait'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        {flashcardSaveStatus === 'saved' ? (
                            <>
                                <CheckCircle size={20} className="animate-in zoom-in duration-300" />
                                <span>Uloženo!</span>
                            </>
                        ) : flashcardSaveStatus === 'creating' ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Vytvářím...</span>
                            </>
                        ) : (
                            <>Vytvořit balíček</>
                        )}
                    </button>
                </div>

                <button onClick={onBack} className="w-full py-4 text-gray-600 dark:text-gray-300 font-bold border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Zpět na Dashboard
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: ACTIVE ---
  const currentQ = questions[currentQIndex];
  if (!currentQ) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 pb-safe">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
         <div className="flex items-center gap-4">
             <button onClick={handleSafeBack} className="text-gray-400"><ArrowLeft /></button>
             {timeLeft < 30 && timeLeft > 0 && (
                 <span className="text-orange-500 font-bold text-sm animate-pulse flex items-center gap-1">
                     <AlertTriangle size={16} /> Pozor na čas!
                 </span>
             )}
         </div>
         {!isPractice && (
             <div className={`font-mono font-bold ${timeLeft < 30 ? 'text-orange-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
         )}
         {isPractice && (
             <div className="text-sm font-bold text-green-600 dark:text-green-400">
                 Procvičování
             </div>
         )}
      </div>

      {smartReviewMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-in fade-in zoom-in duration-300 flex items-center gap-2">
              <Check size={16} /> {smartReviewMessage}
          </div>
      )}

      <div className="flex-1 p-6 pb-32 overflow-y-auto">
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mb-6 overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}></div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{currentQ.predmet} {isSimulation ? '(Simulace)' : '(Procvičování)'}</span>
                {currentQ.difficulty === 'hard' && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md">Těžké</span>}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">{currentQ.otazka}</h2>
        </div>

        <div className="space-y-3">
            {['A', 'B', 'C'].map((option) => {
                const isSelected = answers[currentQ.id] === option;
                const isCorrect = currentQ.spravnaOdpoved === option;
                
                // Simulation: Blue selection only
                if (isSimulation) {
                    return (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            disabled={processingAnswer}
                            className={`w-full p-5 text-left rounded-2xl border-2 shadow-sm transition-all duration-200 active:scale-[0.98] group ${
                                isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-gray-800 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <div className="flex items-center">
                                <span className={`font-bold mr-3 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>{option})</span>
                                <span className="font-medium">{(currentQ as any)[`odpoved${option}`]}</span>
                            </div>
                        </button>
                    );
                }

                // Practice: Red/Green immediate feedback
                const showCorrect = isSelected && isCorrect;
                const showWrong = isSelected && !isCorrect;

                return (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={processingAnswer}
                        className={`w-full p-5 text-left rounded-2xl border-2 shadow-sm transition-all duration-300 active:scale-[0.98] group relative overflow-hidden ${
                            showCorrect 
                            ? 'bg-green-500 border-green-600 text-white scale-105 z-10' 
                            : showWrong
                                ? 'bg-red-500 border-red-600 text-white z-10'
                                : 'bg-white dark:bg-gray-800 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        <div className="relative z-10 flex items-center">
                            <span className={`font-bold mr-3 ${showCorrect || showWrong ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>{option})</span>
                            <span className="font-medium">
                                {(currentQ as any)[`odpoved${option}`]}
                            </span>
                            {showCorrect && <CheckCircle className="ml-auto text-white animate-in zoom-in duration-300" />}
                            {showWrong && <XCircle className="ml-auto text-white animate-in zoom-in duration-300" />}
                        </div>
                        {showCorrect && <div className="absolute inset-0 bg-green-500 animate-pulse"></div>}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Error Popup (Only for Practice Mode) */}
      {showErrorPopup && !isSimulation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center space-x-3 mb-4 text-red-500">
                    <XCircle size={32} />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chyba!</h3>
                </div>
                {!aiExplanation ? (
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Chceš vysvětlit, proč je tvá odpověď špatná?</p>
                ) : (
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl mb-6 text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                       <div className="font-bold mb-1 flex items-center gap-2"><Brain size={14}/> AI Lektor:</div>
                       {aiExplanation}
                    </div>
                )}
                <div className="flex space-x-3">
                    {!aiExplanation ? (
                        <button onClick={handleAIExplain} disabled={aiLoading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex justify-center items-center">
                            {aiLoading ? <Loader2 className="animate-spin" /> : 'ANO, vysvětlit'}
                        </button>
                    ) : null}
                    <button onClick={closePopupAndNext} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold">
                        {aiExplanation ? 'Jdeme dál' : 'NE, pokračovat'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};