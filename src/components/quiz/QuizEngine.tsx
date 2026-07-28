"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Question, QuizConfig, QuizAttempt } from "@/firebase/quizService";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ChevronRight, AlertCircle, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizEngineProps {
  questions: Question[];
  config: QuizConfig;
  onComplete: (attempt: Omit<QuizAttempt, "id" | "timestamp">) => void;
  userId: string;
}

export default function QuizEngine({ questions, config, onComplete, userId }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionsAttempted, setQuestionsAttempted] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  // Shuffle options if it's MCQ or TrueFalse
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) return [];
    // We only shuffle MCQ options, T/F should remain T/F
    if (currentQuestion.type === "TrueFalse") return ["True", "False"];
    const arr = [...currentQuestion.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentQuestion]);

  if (!currentQuestion) {
    return <div className="text-center p-12 text-muted-foreground">Loading questions...</div>;
  }

  const handleSelectAnswer = (ans: string) => {
    if (isAnswerRevealed) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: ans
    }));
  };

  const checkAnswer = () => {
    if (!selectedAnswers[currentQuestion.id]) return;
    
    const userAns = selectedAnswers[currentQuestion.id];
    let isCorrect = false;

    if (currentQuestion.type === "MCQ" || currentQuestion.type === "TrueFalse" || currentQuestion.type === "Clinical") {
       isCorrect = userAns === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "FillBlank") {
       // Answer could be an array of acceptable strings
       const answers = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
       isCorrect = answers.some(a => a.toLowerCase() === userAns.toLowerCase());
    }

    if (isCorrect) setScore(s => s + 1);

    setQuestionsAttempted(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect,
        topic: currentQuestion.topic
      }
    ]);

    setIsAnswerRevealed(true);

    // If it's Exam mode and not practice, we might auto-advance, but let's always show feedback in this version.
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setIsAnswerRevealed(false);
    } else {
      // Finish
      const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
      const accuracy = (score / questions.length) * 100;
      const xpEarned = score * (config.difficulty === "Hard" ? 20 : config.difficulty === "Medium" ? 15 : 10);
      
      onComplete({
        userId,
        config,
        score,
        totalQuestions: questions.length,
        accuracy,
        timeTakenSeconds,
        xpEarned,
        questionsAttempted
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-card border border-border rounded-2xl shadow-lg relative overflow-hidden">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-muted w-full">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center space-x-2">
           <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
             currentQuestion.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' :
             currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
             'bg-green-500/10 text-green-500'
           }`}>
             {currentQuestion.difficulty}
           </span>
           <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
             {currentQuestion.category}
           </span>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-foreground leading-snug">
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {(currentQuestion.type === "MCQ" || currentQuestion.type === "TrueFalse" || currentQuestion.type === "Clinical") && (
          shuffledOptions.map((opt, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === opt;
            const isCorrectAnswer = currentQuestion.correctAnswer === opt;
            
            let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
            
            if (!isAnswerRevealed) {
              btnClass += isSelected 
                ? "border-primary bg-primary/10 ring-2 ring-primary/50" 
                : "border-border bg-background hover:border-primary/50 hover:bg-muted/30";
            } else {
              if (isCorrectAnswer) {
                btnClass += "border-green-500 bg-green-500/10";
              } else if (isSelected && !isCorrectAnswer) {
                btnClass += "border-red-500 bg-red-500/10";
              } else {
                btnClass += "border-border bg-background opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt)}
                disabled={isAnswerRevealed}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isSelected && !isAnswerRevealed ? 'text-primary' : 'text-foreground'}`}>
                    {opt}
                  </span>
                  {isAnswerRevealed && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {isAnswerRevealed && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })
        )}

        {currentQuestion.type === "FillBlank" && (
           <div className="space-y-4">
             <input 
               type="text"
               disabled={isAnswerRevealed}
               value={selectedAnswers[currentQuestion.id] || ""}
               onChange={(e) => handleSelectAnswer(e.target.value)}
               placeholder="Type your answer here..."
               className="w-full p-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
             />
           </div>
        )}
      </div>

      {/* Controls */}
      {!isAnswerRevealed ? (
        <Button 
          onClick={checkAnswer} 
          disabled={!selectedAnswers[currentQuestion.id]}
          className="w-full h-12 text-lg font-bold"
        >
          Check Answer
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Feedback Panel */}
            <div className={`p-5 rounded-xl border ${questionsAttempted[questionsAttempted.length - 1].isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <h3 className={`font-bold flex items-center mb-2 ${questionsAttempted[questionsAttempted.length - 1].isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {questionsAttempted[questionsAttempted.length - 1].isCorrect ? (
                  <><CheckCircle2 className="w-5 h-5 mr-2" /> Correct!</>
                ) : (
                  <><XCircle className="w-5 h-5 mr-2" /> Incorrect</>
                )}
              </h3>
              
              <div className="space-y-3 mt-4 text-sm">
                <div>
                  <span className="font-bold text-foreground">Explanation: </span>
                  <span className="text-muted-foreground">{currentQuestion.explanation}</span>
                </div>
                
                {currentQuestion.memoryTrick && (
                  <div className="flex items-start bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                    <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 shrink-0" />
                    <p className="text-yellow-600 dark:text-yellow-400"><span className="font-bold">Memory Trick:</span> {currentQuestion.memoryTrick}</p>
                  </div>
                )}

                {currentQuestion.clinicalImportance && (
                  <div className="flex items-start bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <Activity className="w-4 h-4 text-blue-500 mt-0.5 mr-2 shrink-0" />
                    <p className="text-blue-600 dark:text-blue-400"><span className="font-bold">Clinical Pearl:</span> {currentQuestion.clinicalImportance}</p>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleNext} 
              className="w-full h-12 text-lg font-bold flex items-center justify-center gap-2"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
