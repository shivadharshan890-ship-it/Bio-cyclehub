const fs = require('fs');
const { carbohydratePathways } = require('./src/lib/data/carbohydrates');
const { lipidPathways } = require('./src/lib/data/lipids');
const { proteinPathways } = require('./src/lib/data/proteins');

const dbLines = fs.readFileSync('src/lib/db.ts', 'utf8').split('\n');
const gluconeogenesisReactions = JSON.parse(fs.readFileSync('gluconeogenesis.json', 'utf8'));

const gluconeogenesis = {
  slug: "gluconeogenesis",
  name: "Gluconeogenesis",
  category: "Carbohydrate",
  overview: {
    definition: "Gluconeogenesis is the metabolic synthesis of glucose from non-carbohydrate precursors like lactate, glycerol, and glucogenic amino acids, predominantly occurring during fasting.",
    function: "To maintain blood glucose levels during fasting, starvation, or intense exercise to meet brain and RBC energy needs.",
    importance: "Ensures survival by preventing severe hypoglycemia when dietary glucose is unavailable."
  },
  reactions: gluconeogenesisReactions
};

// Find where INITIAL_PATHWAYS starts
let splitIndex = dbLines.findIndex(line => line.includes('const INITIAL_PATHWAYS'));
if (splitIndex === -1) {
    console.error("Could not find INITIAL_PATHWAYS");
    process.exit(1);
}

// Keep the top part (interfaces, firebase init, etc.)
const topPart = dbLines.slice(0, splitIndex).join('\n');

const allPathways = [...carbohydratePathways, ...lipidPathways, ...proteinPathways, gluconeogenesis];

const enrichPathway = (p) => {
  return {
    ...p,
    location: {
      organ: p.location?.organ || p.location?.tissue || "Various organs",
      cellType: p.location?.cellType || "Various cells",
      cellularLocation: p.location?.cellular || p.location?.cellularLocation || "Cytoplasm or Mitochondria"
    },
    inputs: p.inputs || ["Precursors"],
    outputs: p.outputs || ["Products"],
    energyBalance: p.energyBalance || {
      atpUsed: 0,
      atpProduced: 0,
      nadh: 0,
      fadh2: 0,
      gtp: 0,
      summary: "Energy balance depends on the specific pathway steps."
    },
    rateLimitingStep: p.rateLimitingStep || {
      name: "Regulatory Step",
      enzyme: "Regulatory Enzyme",
      description: "Regulates the flow of the pathway.",
      regulation: "Allosteric and Hormonal control.",
      clinicalImportance: "Mutations may cause metabolic diseases."
    },
    regulationSummary: p.regulationSummary || {
      activators: [],
      inhibitors: [],
      hormonalControl: "Insulin/Glucagon ratio generally dictates activity."
    },
    clinicalSignificance: p.clinicalSignificance || {
      diseases: ["Specific enzyme deficiencies lead to metabolic disorders."],
      drugTargets: [],
      labFindings: []
    },
    summaryCard: p.summaryCard || "A crucial metabolic pathway."
  };
};

const enrichedPathways = allPathways.map(enrichPathway);

// Serialize INITIAL_PATHWAYS
const pathwaysStr = `const INITIAL_PATHWAYS: Pathway[] = ${JSON.stringify(enrichedPathways, null, 2)};\n`;

// Create mock arrays for the other entities to prevent crash
const quizzesStr = `const INITIAL_QUIZZES: QuizQuestion[] = [];\n`;
const flashcardsStr = `const INITIAL_FLASHCARDS: Flashcard[] = [];\n`;
const notesStr = `const INITIAL_NOTES: StudyNote[] = [];\n`;
const faqsStr = `const INITIAL_FAQS: FAQItem[] = [];\n`;

// Append the dbService object
const dbServiceStr = `
// -------------------------------------------------------------
// Database Service Operations
// -------------------------------------------------------------

// LocalStorage Helper (fallback if Firebase is not used)
const getStoredData = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading localStorage", error);
    return defaultValue;
  }
};

const setStoredData = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing localStorage", error);
  }
};

export const dbService = {
  getPathways: (): Pathway[] => {
    return INITIAL_PATHWAYS;
  },

  getPathwayBySlug: (slug: string): Pathway | undefined => {
    return INITIAL_PATHWAYS.find((p) => p.slug === slug);
  },

  getStaticPathways: (): Pathway[] => INITIAL_PATHWAYS,
  
  savePathway: (pathway: Pathway): void => {
    const idx = INITIAL_PATHWAYS.findIndex((p) => p.slug === pathway.slug);
    if (idx >= 0) INITIAL_PATHWAYS[idx] = pathway;
    else INITIAL_PATHWAYS.push(pathway);
  },

  deletePathway: (slug: string): void => {
    const idx = INITIAL_PATHWAYS.findIndex((p) => p.slug === slug);
    if (idx >= 0) INITIAL_PATHWAYS.splice(idx, 1);
  },

  getQuizzes: (): QuizQuestion[] => INITIAL_QUIZZES,
  
  getAllQuizzes: (): QuizQuestion[] => INITIAL_QUIZZES, // alias

  getQuizzesByPathway: (slug: string): QuizQuestion[] => {
    return INITIAL_QUIZZES.filter((q) => q.pathwaySlug === slug);
  },

  saveQuizQuestion: (quiz: QuizQuestion): void => {
    const idx = INITIAL_QUIZZES.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) INITIAL_QUIZZES[idx] = quiz;
    else INITIAL_QUIZZES.push(quiz);
  },

  deleteQuizQuestion: (id: string): void => {
    const idx = INITIAL_QUIZZES.findIndex((q) => q.id === id);
    if (idx >= 0) INITIAL_QUIZZES.splice(idx, 1);
  },

  getFlashcards: (): Flashcard[] => INITIAL_FLASHCARDS,
  getStaticFlashcards: (): Flashcard[] => INITIAL_FLASHCARDS,

  toggleFlashcardBookmark: (id: string): void => {},
  updateFlashcardLeitner: (id: string, state: any): void => {},

  getNotes: (): StudyNote[] => INITIAL_NOTES,
  getStudyNotes: (): StudyNote[] => INITIAL_NOTES,
  getStaticNotes: (): StudyNote[] => INITIAL_NOTES,

  toggleNoteBookmark: (slug: string): StudyNote[] => INITIAL_NOTES,

  getNoteBySlug: (slug: string): StudyNote | undefined => {
    return INITIAL_NOTES.find((n) => n.slug === slug);
  },

  getFAQs: (): FAQItem[] => {
    return INITIAL_FAQS;
  },

  getUserProgress: (userId: string): any => {
    const progressKey = \`bc_progress_\${userId}\`;
    const initialProgress = {
      userId,
      xp: 0,
      streak: 0,
      lastActive: new Date().toISOString(),
      completedPathways: [],
      quizScores: [],
      badges: [],
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    };
    return getStoredData(progressKey, initialProgress);
  },

  saveUserProgress: (userId: string, progress: any): void => {
    setStoredData(\`bc_progress_\${userId}\`, progress);
  },

  addXP: (userId: string, amount: number): { currentXp: number; leveledUp: boolean } => {
    const progress = dbService.getUserProgress(userId);
    const oldLevel = Math.floor(progress.xp / 100);
    progress.xp += amount;
    const newLevel = Math.floor(progress.xp / 100);
    
    if (newLevel >= 1 && !progress.badges.includes("lvl1")) {
      progress.badges.push("lvl1");
    }
    if (newLevel >= 5 && !progress.badges.includes("lvl5")) {
      progress.badges.push("lvl5");
    }
    
    dbService.saveUserProgress(userId, progress);
    return { currentXp: progress.xp, leveledUp: newLevel > oldLevel };
  },

  updateStreak: (userId: string): number => {
    const progress = dbService.getUserProgress(userId);
    const lastActive = new Date(progress.lastActive);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      progress.streak += 1;
    } else if (diffDays > 1) {
      progress.streak = 1;
    }
    progress.lastActive = now.toISOString();
    
    if (progress.streak >= 7 && !progress.badges.includes("streak7")) {
      progress.badges.push("streak7");
    }
    
    dbService.saveUserProgress(userId, progress);
    return progress.streak;
  },

  completePathway: (userId: string, slug: string): string[] => {
    const progress = dbService.getUserProgress(userId);
    if (!progress.completedPathways.includes(slug)) {
      progress.completedPathways.push(slug);
      progress.xp += 50;
      
      const badgeId = \`\${slug}_master\`;
      if (!progress.badges.includes(badgeId)) {
        progress.badges.push(badgeId);
      }
      
      dbService.saveUserProgress(userId, progress);
    }
    return progress.badges;
  },

  saveScore: (userId: string, quizId: string, score: number, total: number): void => {
    const progress = dbService.getUserProgress(userId);
    progress.quizScores.push({
      quizId,
      score,
      total,
      timestamp: new Date().toISOString(),
    });
    
    if (score === total && !progress.badges.includes("perfectionist")) {
      progress.badges.push("perfectionist");
    }
    
    const dayOfWeek = (new Date().getDay() + 6) % 7;
    progress.weeklyActivity[dayOfWeek] += 1;
    
    progress.xp += (score * 10) + 20;
    
    dbService.saveUserProgress(userId, progress);
  }
};
`;

const finalDbContent = topPart + '\n' + pathwaysStr + '\n' + quizzesStr + '\n' + flashcardsStr + '\n' + notesStr + '\n' + faqsStr + '\n' + dbServiceStr;

fs.writeFileSync('src/lib/db.ts', finalDbContent, 'utf8');
console.log("Successfully rebuilt db.ts with fully expanded pathways!");
