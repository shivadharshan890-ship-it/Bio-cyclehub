"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { quizService, QuizConfig, Question, QuizAttempt } from "@/firebase/quizService";
import Header from "@/components/Header";
import QuizEngine from "@/components/quiz/QuizEngine";
import QuizResults from "@/components/quiz/QuizResults";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Settings, 
  Brain,
  Layers,
  Activity,
  History,
  AlertCircle
} from "lucide-react";
import { isFirebaseEnabled } from "@/lib/db";

// Hardcoded for now. In a full version, we'd fetch these from Firestore or a constants file.
const ALL_TOPICS = [
  "glycolysis", "krebs-cycle", "electron-transport-chain", 
  "pentose-phosphate-pathway", "gluconeogenesis", "beta-oxidation", 
  "urea-cycle", "cholesterol-biosynthesis", "purine-metabolism"
];

export default function QuizPage() {
  const { user } = useAuth();
  
  const [config, setConfig] = useState<QuizConfig>({
    mode: "Practice",
    topics: [], // Empty means Mixed if mode is Mixed
    questionCount: 10,
    difficulty: "Mixed",
    isTimed: false,
  });

  const [quizState, setQuizState] = useState<"lobby" | "playing" | "results" | "loading">("lobby");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptData, setAttemptData] = useState<QuizAttempt | null>(null);
  const [error, setError] = useState("");

  const handleStartQuiz = async () => {
    if (!isFirebaseEnabled) {
      setError("Firebase is not configured. The advanced quiz engine requires Firestore.");
      return;
    }
    
    setError("");
    setQuizState("loading");
    
    try {
      const uid = user ? user.uid : "guest";
      const fetchedQuestions = await quizService.generateQuizSession(uid, config);
      
      if (fetchedQuestions.length === 0) {
        setError("No questions found matching your criteria.");
        setQuizState("lobby");
        return;
      }
      
      setQuestions(fetchedQuestions);
      setQuizState("playing");
    } catch (e: any) {
      console.error(e);
      setError("Failed to generate quiz: " + e.message);
      setQuizState("lobby");
    }
  };

  const handleQuizComplete = async (attempt: Omit<QuizAttempt, "id" | "timestamp">) => {
    setQuizState("loading");
    try {
      const uid = user ? user.uid : "guest";
      const attemptId = await quizService.submitQuizAttempt(uid, attempt);
      setAttemptData({
        ...attempt,
        id: attemptId,
        timestamp: new Date().toISOString()
      });
      setQuizState("results");
    } catch (e: any) {
      console.error(e);
      setError("Failed to save results: " + e.message);
      setQuizState("lobby");
    }
  };

  const toggleTopic = (topic: string) => {
    setConfig(prev => {
      if (prev.topics.includes(topic)) {
        return { ...prev, topics: prev.topics.filter(t => t !== topic) };
      } else {
        return { ...prev, topics: [...prev.topics, topic] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header />
      
      <main className="container mx-auto px-4 pt-8">
        
        {error && (
           <div className="max-w-3xl mx-auto mb-6 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex flex-col sm:flex-row items-center gap-4 justify-between">
             <div className="flex items-center gap-3">
               <AlertCircle className="w-6 h-6 shrink-0" />
               <p className="text-sm font-bold">{error}</p>
             </div>
             <Button variant="outline" onClick={() => { setError(""); setQuizState("lobby"); }} className="border-red-500/50 hover:bg-red-500/20">
               Retry
             </Button>
           </div>
        )}

        {quizState === "loading" && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground font-bold animate-pulse">Generating your custom quiz...</p>
          </div>
        )}

        {quizState === "lobby" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-black">BioCycle Hub Quiz Engine</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Configure your practice session. Our engine guarantees no immediate repetitions, 
                blending clinical cases with fundamental biochemistry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Settings Card */}
              <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
                  <Settings className="w-5 h-5 text-primary" /> Configuration
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-2">Quiz Mode</label>
                    <select 
                      value={config.mode}
                      onChange={(e) => setConfig({...config, mode: e.target.value as any})}
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Practice">Practice Mode (Detailed Explanations)</option>
                      <option value="Exam">Exam Mode (Strict)</option>
                      <option value="TopicWise">Topic Wise</option>
                      <option value="Mixed">Mixed Topics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-2">Number of Questions</label>
                    <div className="flex gap-2">
                      {[10, 20, 30, 50].map(num => (
                        <button
                          key={num}
                          onClick={() => setConfig({...config, questionCount: num})}
                          className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${config.questionCount === num ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-2">Difficulty</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Mixed", "Easy", "Medium", "Hard"].map(diff => (
                        <button
                          key={diff}
                          onClick={() => setConfig({...config, difficulty: diff as any})}
                          className={`py-2 rounded-lg text-sm font-bold border transition-colors ${config.difficulty === diff ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Topics Selection */}
              <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-6 flex flex-col">
                <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-3">
                  <Layers className="w-5 h-5 text-sky-500" /> Topics
                </h2>
                
                <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-2 custom-scrollbar">
                  {config.mode === "Mixed" ? (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center text-sm text-primary">
                      All topics will be randomly mixed.
                    </div>
                  ) : (
                    ALL_TOPICS.map(topic => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-colors ${config.topics.includes(topic) ? 'bg-sky-500/10 border-sky-500 text-foreground' : 'bg-background border-border text-muted-foreground hover:border-sky-500/50'}`}
                      >
                        <div className={`w-4 h-4 rounded shadow-inner flex items-center justify-center ${config.topics.includes(topic) ? 'bg-sky-500' : 'bg-muted'}`}>
                          {config.topics.includes(topic) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="capitalize">{topic.replace("-", " ")}</span>
                      </button>
                    ))
                  )}
                </div>

                <Button 
                  onClick={handleStartQuiz} 
                  className="w-full h-14 text-lg font-black mt-auto shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" /> Start Quiz
                </Button>
              </div>
            </div>
          </div>
        )}

        {quizState === "playing" && questions.length > 0 && (
          <QuizEngine 
            questions={questions} 
            config={config} 
            userId={user ? user.uid : "guest"} 
            onComplete={handleQuizComplete} 
          />
        )}

        {quizState === "results" && attemptData && (
          <QuizResults 
            attempt={attemptData} 
            onRetry={() => {
              setQuizState("lobby");
              setAttemptData(null);
            }} 
          />
        )}
      </main>
    </div>
  );
}
