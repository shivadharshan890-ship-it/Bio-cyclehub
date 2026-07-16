"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { dbService, QuizQuestion, Pathway } from "@/lib/db";
import Header from "@/components/Header";
import QuizCard from "@/components/QuizCard";
import { 
  Award, 
  BookOpen, 
  HelpCircle, 
  Play, 
  History, 
  TrendingUp, 
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

// Sub-component that does search-param queries inside Suspense
function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const slug = searchParams.get("slug");
  
  // State for lobby
  const [pathways, setPathways] = useState<Pathway[]>(() => dbService.getStaticPathways());
  const progress = user ? dbService.getUserProgress(user.uid) : null;

  useEffect(() => {
    setPathways(dbService.getPathways());
  }, []);

  const handleStartQuiz = (pSlug: string) => {
    router.push(`/quiz?slug=${pSlug}`);
  };

  const handleBackToLobby = () => {
    router.push("/quiz");
  };

  // --- 1. ACTIVE QUIZ PLAY VIEW ---
  if (slug) {
    const pway = pathways.find(p => p.slug === slug);
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToLobby}
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center space-x-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Quiz / Back to Lobby</span>
        </button>
        
        {pway ? (
          <h2 className="text-xl font-black text-center mt-2">
            Practice: {pway.name} Quiz
          </h2>
        ) : (
          <h2 className="text-xl font-black text-center mt-2">
            Practice: General Biochemistry Quiz
          </h2>
        )}

        <QuizCard 
          pathwaySlug={slug} 
          onQuizComplete={() => {
            // refresh data if needed
          }}
        />
      </div>
    );
  }

  // --- 2. LOBBY VIEW ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Quiz Lobby Cards */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Select Practice Module</h2>
          <p className="text-xs text-muted-foreground">Select a pathway to start a timed exam preparation session</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* General Quiz Card */}
          <div 
            className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-2xl p-5 hover:border-primary/40 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full uppercase">
                  General
                </span>
                <span className="text-muted-foreground">{dbService.getQuizzes().length} Questions</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-1">General Practice Arena</h3>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                Timed exam with mixed questions from all B.Pharmacy biochemical pathways.
              </p>
            </div>

            <button
              onClick={() => handleStartQuiz("general")}
              className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center space-x-1 shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-white mr-1" />
              <span>Start Mixed Quiz</span>
            </button>
          </div>

          {pathways.map((p) => {
            const rxnsCount = dbService.getQuizzesByPathway(p.slug).length;
            
            return (
              <div 
                key={p.slug}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full capitalize">
                      {p.category}
                    </span>
                    <span className="text-muted-foreground">{rxnsCount} Questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mt-1">{p.name} Practice</h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    Covers rate-limiting enzymes, cofactors (NAD+/ATP), inhibitors, and diagnostic findings.
                  </p>
                </div>

                <button
                  onClick={() => handleStartQuiz(p.slug)}
                  disabled={rxnsCount === 0}
                  className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center space-x-1 shadow-sm disabled:opacity-40"

                >
                  <Play className="h-3.5 w-3.5 fill-white mr-1" />
                  <span>Start Practice</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* History & Statistics Column */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Your Performance Log</h2>
          <p className="text-xs text-muted-foreground">Historical records and diagnostic streaks</p>
        </div>

        {/* User stats widget */}
        {progress && (
          <div className="bg-gradient-to-tr from-sky-500/10 to-accent/5 border border-border p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-accent" /> Accuracy Index
              </span>
              <span className="font-extrabold text-foreground">
                {progress.quizScores.length > 0
                  ? `${Math.round(
                      (progress.quizScores.reduce((acc: any, curr: any) => acc + curr.score, 0) /
                        progress.quizScores.reduce((acc: any, curr: any) => acc + curr.total, 0)) *
                        100
                    )}%`
                  : "0%"}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase text-muted-foreground block">Session History</span>
              {progress.quizScores.length === 0 ? (
                <p className="text-[11px] text-muted-foreground/60 italic py-2">No historical quiz submissions logged.</p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {progress.quizScores.slice().reverse().map((qs: any, idx: any) => (
                    <div 
                      key={idx} 
                      className="bg-card border border-border p-2.5 rounded-lg flex justify-between items-center text-[10px]"
                    >
                      <div>
                        <span className="font-bold text-foreground capitalize">{qs.quizId}</span>
                        <span className="text-muted-foreground block text-[8px] mt-0.5 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(qs.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="font-extrabold bg-muted text-foreground py-0.5 px-2 rounded">
                        {qs.score} / {qs.total}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!progress && (
          <div className="bg-card border border-border p-5 rounded-2xl text-center text-xs text-muted-foreground">
            <History className="h-6 w-6 mx-auto text-muted-foreground/60 mb-2" />
            <p>Log in to track your scores and unlock achievements.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Quiz() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title */}
        <section className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Interactive Practice Arena</h1>
          <p className="text-xs text-muted-foreground">
            GPAT-oriented, concept-enhancing biochemistry questions. Get instant feedback and explanations.
          </p>
        </section>

        {/* Load Content wrapped in Suspense for Next.js 15 searchParams compatibility */}
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <QuizContent />
        </Suspense>

      </main>
    </div>
  );
}
