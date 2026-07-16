"use client";

import React, { useState, useEffect, useRef } from "react";
import { QuizQuestion, dbService } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from "lucide-react";

const getQuizHistory = (userId: string | undefined, slug: string): string[] => {
  const key = `bc_quiz_history_${userId || "guest"}_${slug}`;
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(key);
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveQuizHistory = (userId: string | undefined, slug: string, history: string[]): void => {
  const key = `bc_quiz_history_${userId || "guest"}_${slug}`;
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(history));
  }
};

interface QuizCardProps {
  pathwaySlug: string;
  onQuizComplete?: (score: number, total: number) => void;
}

export default function QuizCard({ pathwaySlug, onQuizComplete }: QuizCardProps) {
  const { user } = useAuth();
  
  // Quiz data
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Completion screen state
  const [quizFinished, setQuizFinished] = useState(false);

  // Load questions for the selected pathway (or general quiz)
  useEffect(() => {
    let rawPool: QuizQuestion[] = [];
    if (pathwaySlug === "general" || pathwaySlug === "all") {
      rawPool = dbService.getQuizzes();
    } else {
      rawPool = dbService.getQuizzesByPathway(pathwaySlug);
    }

    if (rawPool.length === 0) {
      setQuestions([]);
      return;
    }

    const userId = user?.uid;
    let history = getQuizHistory(userId, pathwaySlug);
    
    // Fisher-Yates shuffle for true randomness
    const shuffleArray = <T,>(array: T[]): T[] => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const QUESTIONS_PER_QUIZ = 5;
    const targetCount = Math.min(QUESTIONS_PER_QUIZ, rawPool.length);
    let unasked = rawPool.filter(q => !history.includes(q.id));
    let selectedQuestions: QuizQuestion[] = [];

    if (unasked.length >= targetCount) {
      // We have enough unasked questions to form a full quiz
      selectedQuestions = shuffleArray(unasked).slice(0, targetCount);
      history = [...history, ...selectedQuestions.map(q => q.id)];
    } else {
      // Not enough unasked questions left. Use what we have, then reset and fill the rest.
      const firstPart = shuffleArray(unasked);
      const remainingNeeded = targetCount - firstPart.length;
      
      const poolWithoutFirstPart = rawPool.filter(q => !firstPart.map(x => x.id).includes(q.id));
      const secondPart = shuffleArray(poolWithoutFirstPart).slice(0, remainingNeeded);
      
      selectedQuestions = [...firstPart, ...secondPart];
      // Reset the history to just the newly selected questions
      history = selectedQuestions.map(q => q.id);
    }

    // Save history
    saveQuizHistory(userId, pathwaySlug, history);

    // Shuffle options for MCQ questions
    const preparedQuestions = selectedQuestions.map(q => {
      const qClone = JSON.parse(JSON.stringify(q)) as QuizQuestion;
      if (qClone.type === "mcq" && qClone.options) {
        const originalOptions = [...qClone.options];
        const correctIndex = parseInt(qClone.correctAnswer, 10);
        const correctOptionText = originalOptions[correctIndex];

        const shuffledOptions = shuffleArray(originalOptions);
        const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

        qClone.options = shuffledOptions;
        if (newCorrectIndex !== -1) {
          qClone.correctAnswer = newCorrectIndex.toString();
        }
      }
      return qClone;
    });

    setQuestions(preparedQuestions);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setFillAnswer("");
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setTimeLeft(30);
  }, [pathwaySlug, user, reloadTrigger]);

  // Start question timer
  useEffect(() => {
    if (questions.length === 0 || quizFinished || isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, questions, isAnswered, quizFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    // Score does not change (marked wrong)
  };

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (optionIdx: string) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIdx);
    setIsAnswered(true);
    
    if (optionIdx === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !fillAnswer.trim()) return;
    setIsAnswered(true);

    const isCorrect = fillAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setFillAnswer("");
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Save score inside Local DB
    if (user) {
      dbService.saveScore(user.uid, pathwaySlug, score, questions.length);
    }

    // Trigger fireworks if perfect score
    if (score === questions.length) {
      triggerConfetti();
    }

    if (onQuizComplete) {
      onQuizComplete(score, questions.length);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#0284c7", "#10b981", "#fbbf24"]
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#0284c7", "#10b981", "#fbbf24"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleRestart = () => {
    setReloadTrigger(prev => prev + 1);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-xl mx-auto shadow-lg">
        <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-bold">No questions available</h3>
        <p className="text-xs text-muted-foreground mt-1">This pathway does not have active quizzes associated yet.</p>
      </div>
    );
  }

  // --- FINISH SCREEN ---
  if (quizFinished) {
    const percent = Math.round((score / questions.length) * 100);
    const xpEarned = (score * 10) + 20;
    
    let heading = "Excellent Job!";
    let sub = "You have demonstrated strong grasp over this metabolic cycle.";
    if (percent < 50) {
      heading = "Keep Reviewing!";
      sub = "We recommend visiting the pathway viewer and revising study notes.";
    } else if (percent === 100) {
      heading = "Perfect Score!";
      sub = "Congratulations! You have mastered this biochemistry loop.";
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto shadow-xl text-center"
      >
        <div className="inline-flex p-3.5 bg-accent/10 text-accent rounded-full mb-4">
          <Award className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-foreground">{heading}</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">{sub}</p>

        {/* Stats Circle Grid */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="bg-muted/50 p-4 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Your Score</span>
            <div className="text-2xl font-black text-foreground mt-1">
              {score} / {questions.length}
            </div>
            <span className="text-[10px] text-primary font-semibold">({percent}% Accuracy)</span>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">XP Earned</span>
            <div className="text-2xl font-black text-accent mt-1 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent mr-1 fill-accent/10" />
              +{xpEarned} XP
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Synced to Dashboard</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 border border-border hover:bg-muted font-bold text-sm py-2.5 px-5 rounded-lg text-foreground transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry Quiz</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // --- QUESTION CARD VIEW ---
  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden max-w-xl mx-auto">
      {/* Progress header & Timer */}
      <div className="bg-muted/50 border-b border-border py-4 px-6 flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground">
          Question {currentIdx + 1} of {questions.length}
        </span>
        
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary uppercase">
            {currentQuestion.difficulty}
          </span>
          <div className={`flex items-center space-x-1.5 ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}>
            <Clock className="h-4 w-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border h-1">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Question Text */}
        <h3 className="text-md font-bold leading-snug mb-5 text-foreground">
          {currentQuestion.question}
        </h3>

        {/* --- ANSWER FORM / OPTIONS LIST --- */}
        <div className="space-y-3">
          {/* MCQ / Boolean type */}
          {(currentQuestion.type === "mcq" || currentQuestion.type === "boolean") && (
            <div className="space-y-2">
              {currentQuestion.type === "mcq" && currentQuestion.options?.map((option, idx) => {
                const optStr = idx.toString();
                const isSelected = selectedAnswer === optStr;
                const isCorrect = optStr === currentQuestion.correctAnswer;
                
                let btnStyle = "border-border hover:bg-muted";
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                  } else if (isSelected) {
                    btnStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300";
                  } else {
                    btnStyle = "border-border opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(optStr)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                  </button>
                );
              })}

              {currentQuestion.type === "boolean" && (
                <div className="flex space-x-3">
                  {["true", "false"].map((val) => {
                    const isSelected = selectedAnswer === val;
                    const isCorrect = val === currentQuestion.correctAnswer;

                    let btnStyle = "border-border hover:bg-muted";
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
                      } else if (isSelected) {
                        btnStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300";
                      } else {
                        btnStyle = "border-border opacity-60";
                      }
                    }

                    return (
                      <button
                        key={val}
                        disabled={isAnswered}
                        onClick={() => handleOptionSelect(val)}
                        className={`flex-1 text-center py-4 rounded-xl border text-sm capitalize font-semibold transition-all ${btnStyle}`}
                      >
                        {val === "true" ? "True" : "False"}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Fill-in-the-blank type */}
          {currentQuestion.type === "fill-blank" && (
            <form onSubmit={handleFillSubmit} className="space-y-3">
              <input
                type="text"
                disabled={isAnswered}
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              
              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!fillAnswer.trim()}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-primary/25 disabled:opacity-40 transition"
                >
                  Submit Answer
                </button>
              )}
            </form>
          )}
        </div>

        {/* --- EXPLANATION FEEDBACK OVERLAY --- */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-muted/60 border border-border"
            >
              <div className="flex items-center space-x-2 mb-1.5">
                {/* Icons */}
                {selectedAnswer === currentQuestion.correctAnswer || (currentQuestion.type === "fill-blank" && fillAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" />
                    Correct Answer
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                    Incorrect
                  </span>
                )}
              </div>
              
              {/* Correct answer text for fill-in-blank or if they got it wrong */}
              {currentQuestion.type === "fill-blank" && (
                <p className="text-xs font-bold mb-2">
                  Correct Answer: <span className="text-emerald-600 underline">{currentQuestion.correctAnswer}</span>
                </p>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentQuestion.explanation}
              </p>
              
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-foreground text-background font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center hover:opacity-95 transition"
              >
                <span>{currentIdx < questions.length - 1 ? "Next Question" : "Finish Quiz"}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
