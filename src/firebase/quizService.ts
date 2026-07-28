import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc,
  query, 
  where, 
  limit,
  Timestamp,
  arrayUnion,
  increment
} from "firebase/firestore";

import { isFirebaseEnabled, db } from "../lib/db";
import localQuestions from "../data/quizQuestions.json";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "MCQ" | "TrueFalse" | "FillBlank" | "Match" | "Clinical";

export interface Question {
  id: string;
  topic: string;
  category: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ, TrueFalse
  correctAnswer: string | string[]; // Can be array for matching or fill in the blank
  explanation: string;
  image?: string;
  tags?: string[];
  memoryTrick?: string;
  clinicalImportance?: string;
  createdAt: string; 
}

export interface QuizAttempt {
  id: string;
  userId: string;
  timestamp: string;
  config: QuizConfig;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTakenSeconds: number;
  xpEarned: number;
  questionsAttempted: {
    questionId: string;
    isCorrect: boolean;
    topic: string;
  }[];
}

export interface UserQuizStats {
  userId: string;
  attemptedQuestionIds: string[];
  totalAttempts: number;
  highestScore: number;
  averageScore: number;
  totalXp: number;
  wrongQuestions: string[];
  topicPerformance: Record<string, { correct: number, total: number }>;
}

export interface QuizConfig {
  mode: "Practice" | "Exam" | "RapidFire" | "TopicWise" | "Mixed";
  topics: string[];
  questionCount: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  isTimed: boolean;
}

const QUESTIONS_COLLECTION = "questions";
const QUIZ_STATS_COLLECTION = "user_quiz_stats";
const QUIZ_ATTEMPTS_COLLECTION = "quiz_attempts";

export const quizService = {
  async getUserStats(userId: string): Promise<UserQuizStats> {
    if (!db) throw new Error("Firestore not initialized");
    const docRef = doc(db, QUIZ_STATS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserQuizStats;
    } else {
      const defaultStats: UserQuizStats = {
        userId,
        attemptedQuestionIds: [],
        totalAttempts: 0,
        highestScore: 0,
        averageScore: 0,
        totalXp: 0,
        wrongQuestions: [],
        topicPerformance: {}
      };
      await setDoc(docRef, defaultStats);
      return defaultStats;
    }
  },

  async generateQuizSession(userId: string, config: QuizConfig): Promise<Question[]> {
    if (!db) throw new Error("Firestore not initialized");

    let attemptedIds = new Set<string>();
    if (userId !== "guest") {
        try {
            const stats = await this.getUserStats(userId);
            attemptedIds = new Set(stats.attemptedQuestionIds);
        } catch (e) {
            console.error("Failed to load user stats", e);
        }
    }

    const questionsRef = collection(db, QUESTIONS_COLLECTION);
    let qBase = query(questionsRef);

    if (config.topics.length > 0 && config.mode !== "Mixed") {
       qBase = query(qBase, where("topic", "in", config.topics));
    }
    
    if (config.difficulty !== "Mixed") {
      qBase = query(qBase, where("difficulty", "==", config.difficulty));
    }

    let allQuestions: Question[] = [];
    
    try {
      if (db) {
        const querySnapshot = await getDocs(qBase);
        querySnapshot.forEach((doc) => {
          allQuestions.push({ id: doc.id, ...doc.data() } as Question);
        });
      }
    } catch (e) {
      console.warn("Firestore fetch failed, falling back to local JSON data", e);
    }

    // Fallback if Firestore is empty or failed
    if (allQuestions.length === 0) {
      console.log("No questions found in Firestore (or connection failed). Using local fallback data.");
      
      allQuestions = localQuestions as unknown as Question[];
      
      // Manually filter local questions just like the Firestore query would
      if (config.topics.length > 0 && config.mode !== "Mixed") {
         allQuestions = allQuestions.filter(q => config.topics.includes(q.topic));
      }
      if (config.difficulty !== "Mixed") {
         allQuestions = allQuestions.filter(q => q.difficulty === config.difficulty);
      }
    }

    if (allQuestions.length === 0) {
       throw new Error("No questions available for the selected configuration. Please try different settings.");
    }

    // 1. Filter out already attempted questions
    let availableQuestions = allQuestions.filter(q => !attemptedIds.has(q.id));

    // 2. Recycle if needed
    if (availableQuestions.length < config.questionCount) {
      console.warn("Not enough fresh questions, recycling previously attempted questions...");
      availableQuestions = allQuestions; 
    }

    // 3. Shuffle
    availableQuestions = this.shuffleArray(availableQuestions);

    // 4. Slice
    return availableQuestions.slice(0, config.questionCount);
  },

  async submitQuizAttempt(userId: string, attempt: Omit<QuizAttempt, "id" | "timestamp">): Promise<string> {
    if (!db) throw new Error("Firestore not initialized");

    const attemptId = doc(collection(db, QUIZ_ATTEMPTS_COLLECTION)).id;
    const timestamp = new Date().toISOString();

    const fullAttempt: QuizAttempt = {
      ...attempt,
      id: attemptId,
      timestamp
    };

    await setDoc(doc(db, QUIZ_ATTEMPTS_COLLECTION, attemptId), fullAttempt);

    if (userId === "guest") return attemptId;

    const stats = await this.getUserStats(userId);
    
    const newAttemptedIds = attempt.questionsAttempted.map(q => q.questionId);
    const newWrongIds = attempt.questionsAttempted.filter(q => !q.isCorrect).map(q => q.questionId);
    
    const newTotalAttempts = stats.totalAttempts + 1;
    const newHighestScore = Math.max(stats.highestScore, attempt.score);
    const newAverageScore = ((stats.averageScore * stats.totalAttempts) + attempt.score) / newTotalAttempts;
    
    const updatedTopicPerformance = { ...stats.topicPerformance };
    attempt.questionsAttempted.forEach(q => {
      if (!updatedTopicPerformance[q.topic]) {
        updatedTopicPerformance[q.topic] = { correct: 0, total: 0 };
      }
      updatedTopicPerformance[q.topic].total += 1;
      if (q.isCorrect) {
        updatedTopicPerformance[q.topic].correct += 1;
      }
    });

    const statsRef = doc(db, QUIZ_STATS_COLLECTION, userId);
    await updateDoc(statsRef, {
      attemptedQuestionIds: arrayUnion(...newAttemptedIds),
      wrongQuestions: arrayUnion(...newWrongIds),
      totalAttempts: increment(1),
      totalXp: increment(attempt.xpEarned),
      highestScore: newHighestScore,
      averageScore: newAverageScore,
      topicPerformance: updatedTopicPerformance
    });

    return attemptId;
  },

  shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }
};
