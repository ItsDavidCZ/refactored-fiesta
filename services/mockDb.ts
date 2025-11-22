
import { User, Question, ErrorLog, Flashcard, AINote, Badge } from '../types';

// --- Mock Data: Questions (Expanded Content) ---
const MOCK_QUESTIONS: Question[] = [
  // --- ČEŠTINA (Existing + New) ---
  {
    id: 'cz_1', predmet: 'Čeština', tema: 'Pravopis', difficulty: 'easy',
    otazka: 'Ve které větě je chyba v psaní i/y?',
    odpovedA: 'Psi hlasitě vyli na měsíc.',
    odpovedB: 'Děti si hráli na hřišti.',
    odpovedC: 'Byli jsme tam včas.',
    spravnaOdpoved: 'B',
    vysvetleniChyby: 'Děti (rod střední, množné číslo) si hrály (shoda přísudku s podmětem středního rodu v množném čísle -> koncovka -y).',
    isCritical: true
  },
  {
    id: 'cz_2', predmet: 'Čeština', tema: 'Literatura', difficulty: 'medium',
    otazka: 'Kdo je autorem díla "Kytice"?',
    odpovedA: 'Karel Hynek Mácha',
    odpovedB: 'Karel Jaromír Erben',
    odpovedC: 'Božena Němcová',
    spravnaOdpoved: 'B',
    vysvetleniChyby: 'Kytice je sbírka balad K. J. Erbena. Mácha napsal Máj, Němcová Babičku.',
    isCritical: false
  },
  {
    id: 'cz_3', predmet: 'Čeština', tema: 'Tvarosloví', difficulty: 'hard',
    otazka: 'Určete slovní druh slova "protože".',
    odpovedA: 'Příslovce',
    odpovedB: 'Částice',
    odpovedC: 'Spojka',
    spravnaOdpoved: 'C',
    vysvetleniChyby: 'Protože je spojka podřadící, připojuje vedlejší věty příčinné.',
    isCritical: true
  },
  {
    id: 'cz_4', predmet: 'Čeština', tema: 'Pravopis', difficulty: 'medium',
    otazka: 'Doplňte správně: "S ___ přáteli jsme šli do kina."',
    odpovedA: 'milými',
    odpovedB: 'mylími',
    odpovedC: 'milími',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Přídavné jméno "milý" (vzor mladý). 7. pád mn. č. -> s mladými -> s milými. Kořen mil- je měkký (milovat).',
    isCritical: true
  },
  {
    id: 'cz_5', predmet: 'Čeština', tema: 'Větná skladba', difficulty: 'hard',
    otazka: 'Jaký je podmět ve větě: "Z dálky se ozývalo temné dunění."',
    odpovedA: 'dunění',
    odpovedB: 'Z dálky',
    odpovedC: 'nevyjádřený (ono)',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Kdo, co se ozývalo? Dunění. To je podmět věty.',
    isCritical: true
  },
  {
    id: 'cz_6', predmet: 'Čeština', tema: 'Pravopis', difficulty: 'medium',
    otazka: 'Které slovo je napsáno chybně?',
    odpovedA: 'Vyjímka',
    odpovedB: 'Výjimka',
    odpovedC: 'Výhled',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Slovo se píše "výjimka" (dlouhé ý, krátké i). Tvar "vyjímka" je chybný.',
    isCritical: true
  },
  {
    id: 'cz_7', predmet: 'Čeština', tema: 'Pravopis', difficulty: 'medium',
    otazka: 'Doplňte: "Zapomněl jsi na ___ ."',
    odpovedA: 'mě',
    odpovedB: 'mně',
    odpovedC: 'mne',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Pomůcka: Zapomněl jsi na Tebe (krátké) -> Mě (krátké). Nebo 4. pád (vidím koho/co) -> mě.',
    isCritical: true
  },
  {
    id: 'cz_8', predmet: 'Čeština', tema: 'Literatura', difficulty: 'easy',
    otazka: 'Jan Amos Komenský je znám jako:',
    odpovedA: 'Učitel národů',
    odpovedB: 'Otec vlasti',
    odpovedC: 'Husitský vojevůdce',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Komenský je "Učitel národů". Otec vlasti je Karel IV.',
    isCritical: false
  },
  {
    id: 'cz_9', predmet: 'Čeština', tema: 'Pravopis', difficulty: 'hard',
    otazka: 'Vyberte správný tvar s/z:',
    odpovedA: 'zhlédnout film',
    odpovedB: 'shlédnout film',
    odpovedC: 'schlédnout film',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Zhlédnout (ve smyslu vidět) píšeme se Z. Shlédnout znamená dívat se shora dolů.',
    isCritical: true
  },
  {
    id: 'cz_10', predmet: 'Čeština', tema: 'Slovní zásoba', difficulty: 'easy',
    otazka: 'Co znamená slovo "abstraktní"?',
    odpovedA: 'Nehmotný, myšlený',
    odpovedB: 'Barevný',
    odpovedC: 'Přesný, konkrétní',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Abstraktní je opakem konkrétního. Označuje nehmotné pojmy (láska, dobro).',
    isCritical: false
  },
  // NEW CZECH QUESTIONS
  {
    id: 'cz_11', predmet: 'Čeština', tema: 'Větná skladba', difficulty: 'easy',
    otazka: 'Věta "Kéž by už nasněžilo!" je:',
    odpovedA: 'Rozkazovací',
    odpovedB: 'Přací',
    odpovedC: 'Zvolací',
    spravnaOdpoved: 'B',
    vysvetleniChyby: 'Věty uvozené částicemi "kéž, ať" vyjadřující přání jsou věty přací.',
    isCritical: false 
  },
  {
    id: 'cz_12', predmet: 'Čeština', tema: 'Tvarosloví', difficulty: 'medium',
    otazka: 'Určete vzor podstatného jména "soudce".',
    odpovedA: 'Pán',
    odpovedB: 'Muž',
    odpovedC: 'Předseda',
    spravnaOdpoved: 'C',
    vysvetleniChyby: 'Soudce končí v 1. pádě na -e a v 2. pádě na -e (soudce bez soudce). Skloňuje se podle vzoru soudce a částečně předseda, ale v školní praxi se často řadí k vzoru předseda/soudce jako měkký typ.',
    isCritical: false
  },
  {
    id: 'cz_13', predmet: 'Čeština', tema: 'Literatura', difficulty: 'hard',
    otazka: 'Kdo napsal "Osudy dobrého vojáka Švejka"?',
    odpovedA: 'Karel Čapek',
    odpovedB: 'Jaroslav Hašek',
    odpovedC: 'Vladislav Vančura',
    spravnaOdpoved: 'B',
    vysvetleniChyby: 'Autorem tohoto světoznámého humoristického románu je Jaroslav Hašek.',
    isCritical: false
  },

  // --- MATEMATIKA (Existing + New) ---
  {
    id: 'mat_1', predmet: 'Matematika', tema: 'Rovnice', difficulty: 'medium',
    otazka: 'Řešte rovnici: 3x - 7 = 20',
    odpovedA: 'x = 9',
    odpovedB: 'x = 8',
    odpovedC: 'x = 7',
    spravnaOdpoved: 'A',
    vysvetleniChyby: '3x = 20 + 7 -> 3x = 27 -> x = 9.',
    isCritical: true
  },
  {
    id: 'mat_2', predmet: 'Matematika', tema: 'Procenta', difficulty: 'easy',
    otazka: 'Kolik je 20 % z 150?',
    odpovedA: '30',
    odpovedB: '20',
    odpovedC: '15',
    spravnaOdpoved: 'A',
    vysvetleniChyby: '10 % ze 150 je 15. 20 % je dvakrát tolik, tedy 30.',
    isCritical: true
  },
  {
    id: 'mat_3', predmet: 'Matematika', tema: 'Zlomky', difficulty: 'medium',
    otazka: 'Vypočítejte: 1/2 + 1/4',
    odpovedA: '3/4',
    odpovedB: '2/6',
    odpovedC: '2/4',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Společný jmenovatel je 4. 1/2 rozšíříme na 2/4. Tedy 2/4 + 1/4 = 3/4.',
    isCritical: true
  },
  {
    id: 'mat_4', predmet: 'Matematika', tema: 'Geometrie', difficulty: 'medium',
    otazka: 'Obvod obdélníku je 20 cm. Jedna strana měří 6 cm. Kolik měří druhá?',
    odpovedA: '4 cm',
    odpovedB: '14 cm',
    odpovedC: '7 cm',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'O = 2*(a+b). 20 = 2*(6+b) -> 10 = 6+b -> b = 4 cm.',
    isCritical: true
  },
  {
    id: 'mat_5', predmet: 'Matematika', tema: 'Mocniny', difficulty: 'easy',
    otazka: 'Kolik je 5 na druhou mínus 3 na druhou?',
    odpovedA: '16',
    odpovedB: '4',
    odpovedC: '2',
    spravnaOdpoved: 'A',
    vysvetleniChyby: '25 - 9 = 16.',
    isCritical: false
  },
  {
    id: 'mat_6', predmet: 'Matematika', tema: 'Převody jednotek', difficulty: 'medium',
    otazka: 'Kolik litrů je 2,5 m³?',
    odpovedA: '250 litrů',
    odpovedB: '2 500 litrů',
    odpovedC: '25 000 litrů',
    spravnaOdpoved: 'B',
    vysvetleniChyby: '1 m³ = 1000 litrů. 2,5 * 1000 = 2500 litrů.',
    isCritical: true
  },
  {
    id: 'mat_7', predmet: 'Matematika', tema: 'Pythagorova věta', difficulty: 'hard',
    otazka: 'Přepona pravoúhlého trojúhelníku měří 10 cm, jedna odvěsna 6 cm. Druhá odvěsna měří:',
    odpovedA: '8 cm',
    odpovedB: '4 cm',
    odpovedC: '16 cm',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'c² = a² + b². 100 = 36 + b². b² = 64 -> b = 8.',
    isCritical: true
  },
  {
    id: 'mat_8', predmet: 'Matematika', tema: 'Desetinná čísla', difficulty: 'easy',
    otazka: 'Vypočti: 0,3 * 0,4',
    odpovedA: '0,12',
    odpovedB: '1,2',
    odpovedC: '0,012',
    spravnaOdpoved: 'A',
    vysvetleniChyby: '3*4=12. Máme celkem dvě desetinná místa. Výsledek 0,12.',
    isCritical: false
  },
  {
    id: 'mat_9', predmet: 'Matematika', tema: 'Poměr', difficulty: 'medium',
    otazka: 'Rozdělte 200 Kč v poměru 3:2.',
    odpovedA: '120 Kč a 80 Kč',
    odpovedB: '150 Kč a 50 Kč',
    odpovedC: '100 Kč a 100 Kč',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'Celkem 5 dílů (3+2). 1 díl = 200/5 = 40. 3 díly = 120, 2 díly = 80.',
    isCritical: false
  },
  {
    id: 'mat_10', predmet: 'Matematika', tema: 'Úhly', difficulty: 'medium',
    otazka: 'Součet vnitřních úhlů v trojúhelníku je:',
    odpovedA: '180°',
    odpovedB: '360°',
    odpovedC: '90°',
    spravnaOdpoved: 'A',
    vysvetleniChyby: 'V každém trojúhelníku v rovině je součet úhlů vždy 180°.',
    isCritical: true
  },
  // NEW MATH QUESTIONS
  {
    id: 'mat_11', predmet: 'Matematika', tema: 'Geometrie', difficulty: 'hard',
    otazka: 'Jaký je objem krychle o hraně 3 cm?',
    odpovedA: '9 cm³',
    odpovedB: '27 cm³',
    odpovedC: '54 cm³',
    spravnaOdpoved: 'B',
    vysvetleniChyby: 'Objem krychle V = a³. V = 3³ = 3 * 3 * 3 = 27 cm³.',
    isCritical: false
  },
  {
    id: 'mat_12', predmet: 'Matematika', tema: 'Zlomky', difficulty: 'medium',
    otazka: 'Který zlomek je největší?',
    odpovedA: '1/2',
    odpovedB: '3/5',
    odpovedC: '4/10',
    spravnaOdpoved: 'B',
    vysvetleniChyby: 'Převedeme na desetinná čísla: 1/2 = 0,5; 3/5 = 0,6; 4/10 = 0,4. Největší je 0,6.',
    isCritical: false
  },
  {
    id: 'mat_13', predmet: 'Matematika', tema: 'Rovnice', difficulty: 'hard',
    otazka: 'Řešte rovnici: 2(x + 1) = 10',
    odpovedA: 'x = 4',
    odpovedB: 'x = 5',
    odpovedC: 'x = 3',
    spravnaOdpoved: 'A',
    vysvetleniChyby: '2x + 2 = 10 -> 2x = 8 -> x = 4.',
    isCritical: true
  }
];

const CURRENT_USER_ID = 'user_demo_1';

// --- Badges Definition ---
export const BADGES: Badge[] = [
  {
    id: 'first_blood',
    icon: '⚔️',
    name: 'První krev',
    description: 'Dokonči svůj první test',
    condition: (u) => u.celkoveSkore > 0
  },
  {
    id: 'nerd',
    icon: '🤓',
    name: 'Šprt',
    description: 'Drž streak alespoň 3 dny',
    condition: (u) => u.pocetDniStreak >= 3
  },
  {
    id: 'math_wizard',
    icon: '🧙‍♂️',
    name: 'Matemág',
    description: 'Dosáhni levelu 5',
    condition: (u) => u.level >= 5
  },
  {
    id: 'collector',
    icon: '💎',
    name: 'Sběratel',
    description: 'Nasbírej přes 5000 XP',
    condition: (u) => u.xp >= 5000
  }
];

// --- Helper: Level Calculation ---
// Level 1: 0-500 XP, Level 2: 501-1200 XP, etc. Simple quadratic curve.
export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const getLevelProgress = (xp: number): number => {
    const level = calculateLevel(xp);
    const currentLevelBaseXp = (level - 1) * (level - 1) * 100;
    const nextLevelBaseXp = level * level * 100;
    return ((xp - currentLevelBaseXp) / (nextLevelBaseXp - currentLevelBaseXp)) * 100;
};

// --- Service Layer ---

export const db = {
  getCurrentUser: (): User => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        const u = JSON.parse(stored);
        // Migration for old data structure
        if (u.xp === undefined) u.xp = u.celkoveSkore * 10; 
        if (u.level === undefined) u.level = 1;
        if (u.badges === undefined) u.badges = [];
        // Migration for stats
        if (u.stats === undefined) {
            u.stats = { math: { total: 0, correct: 0 }, czech: { total: 0, correct: 0 } };
        }
        return u;
    }
    
    const newUser: User = {
      id: CURRENT_USER_ID,
      email: 'student@skola.cz',
      displayName: 'Nový Student',
      username: 'student123',
      celkoveSkore: 0,
      xp: 0,
      level: 1,
      badges: [],
      pocetDniStreak: 1,
      posledniPrihlaseni: new Date().toISOString(),
      stats: {
          math: { total: 0, correct: 0 },
          czech: { total: 0, correct: 0 }
      }
    };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },

  updateUser: (updates: Partial<User>) => {
    const user = db.getCurrentUser();
    const updated = { ...user, ...updates };
    
    // Check Level Up
    updated.level = calculateLevel(updated.xp);

    // Check Badges
    BADGES.forEach(b => {
        if (!updated.badges.includes(b.id) && b.condition(updated)) {
            updated.badges.push(b.id);
            // Could trigger a toast here via an event emitter in a real app
        }
    });

    localStorage.setItem('currentUser', JSON.stringify(updated));
    return updated;
  },

  updateSubjectStats: (mathCorrect: number, mathTotal: number, czechCorrect: number, czechTotal: number) => {
      const user = db.getCurrentUser();
      const newStats = {
          math: {
              total: user.stats.math.total + mathTotal,
              correct: user.stats.math.correct + mathCorrect
          },
          czech: {
              total: user.stats.czech.total + czechTotal,
              correct: user.stats.czech.correct + czechCorrect
          }
      };
      db.updateUser({ stats: newStats });
  },

  addXp: (amount: number) => {
      const user = db.getCurrentUser();
      db.updateUser({ xp: user.xp + amount, celkoveSkore: user.celkoveSkore + Math.floor(amount / 10) });
  },

  checkStreak: (): User => {
    const user = db.getCurrentUser();
    const lastLogin = new Date(user.posledniPrihlaseni);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = user.pocetDniStreak;
    const isSameDay = lastLogin.toDateString() === now.toDateString();
    const isNextDay =  (now.getDate() - lastLogin.getDate() === 1) || (diffDays === 1 && !isSameDay);

    if (!isSameDay) {
      if (isNextDay) newStreak += 1;
      else newStreak = 1;
      
      return db.updateUser({
        pocetDniStreak: newStreak,
        posledniPrihlaseni: now.toISOString()
      });
    }
    
    db.updateUser({ posledniPrihlaseni: now.toISOString() });
    return user;
  },

  getQuestions: (): Question[] => MOCK_QUESTIONS,

  // Returns 5 random questions for Daily Challenge
  getDailyChallengeQuestions: (): Question[] => {
      const all = MOCK_QUESTIONS;
      const shuffled = [...all].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
  },

  logError: (questionId: string) => {
    const logs: ErrorLog[] = JSON.parse(localStorage.getItem('errorLog') || '[]');
    // Avoid duplicates for the same day
    const exists = logs.find(l => l.questionId === questionId && l.userId === CURRENT_USER_ID && !l.isCorrected);
    if (!exists) {
        const newLog: ErrorLog = {
            id: Date.now().toString(),
            userId: CURRENT_USER_ID,
            questionId,
            timestamp: new Date().toISOString(),
            isCorrected: false
        };
        logs.push(newLog);
        localStorage.setItem('errorLog', JSON.stringify(logs));
    }
  },

  getErrors: (): ErrorLog[] => JSON.parse(localStorage.getItem('errorLog') || '[]'),

  markErrorCorrected: (questionId: string) => {
    const logs: ErrorLog[] = JSON.parse(localStorage.getItem('errorLog') || '[]');
    const updatedLogs = logs.map(l => 
      (l.questionId === questionId && l.userId === CURRENT_USER_ID) 
        ? { ...l, isCorrected: true } 
        : l
    );
    localStorage.setItem('errorLog', JSON.stringify(updatedLogs));
  },

  addFlashcards: (cards: Omit<Flashcard, 'id' | 'userId' | 'status'>[]) => {
    const existing: Flashcard[] = JSON.parse(localStorage.getItem('flashcards') || '[]');
    const newCards = cards.map(c => ({
      ...c,
      id: Math.random().toString(36).substr(2, 9),
      userId: CURRENT_USER_ID,
      status: 'new' as const
    }));
    localStorage.setItem('flashcards', JSON.stringify([...existing, ...newCards]));
  },

  getFlashcards: (): Flashcard[] => {
    const all: Flashcard[] = JSON.parse(localStorage.getItem('flashcards') || '[]');
    return all.filter(f => f.userId === CURRENT_USER_ID);
  },

  updateFlashcardStatus: (id: string, status: 'learning' | 'mastered') => {
      const all: Flashcard[] = JSON.parse(localStorage.getItem('flashcards') || '[]');
      const updated = all.map(f => f.id === id ? { ...f, status } : f);
      localStorage.setItem('flashcards', JSON.stringify(updated));
  },

  saveAINote: (title: string, content: string) => {
    const notes: AINote[] = JSON.parse(localStorage.getItem('aiNotes') || '[]');
    const newNote: AINote = {
      id: Math.random().toString(36).substr(2, 9),
      userId: CURRENT_USER_ID,
      title,
      content,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('aiNotes', JSON.stringify([...notes, newNote]));
  }
};
