"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dbService, Pathway, QuizQuestion, Flashcard } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import { 
  Settings, 
  Plus, 
  Trash2, 
  Activity, 
  Award, 
  Users, 
  Layers, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Database,
  Lock,
  ShieldAlert
} from "lucide-react";

export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Datasets
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (user && user.email.toLowerCase().includes("admin")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [user, authLoading]);

  // Loading screen
  if (authLoading || isAdmin === null) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground">Verifying administrator tokens...</p>
          </div>
        </div>
      </div>
    );
  }

  // Security authorization barrier
  if (isAdmin === false) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950/20">
          <div className="max-w-md w-full space-y-6 bg-card border border-border p-8 rounded-3xl shadow-xl text-center">
            <div className="mx-auto h-12 w-12 bg-red-500/10 rounded-xl text-red-500 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-foreground">Access Denied</h2>
              <p className="text-xs text-muted-foreground">
                Administrative authorization is required. Your current account does not have permission to alter the biochemistry pathway curriculum datasets or practice quizzes.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/" 
                className="bg-muted hover:bg-border text-foreground font-bold text-xs py-2.5 px-6 rounded-xl transition text-center"
              >
                Go Back Home
              </Link>
              <Link 
                href="/auth" 
                className="bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md shadow-primary/20 transition text-center"
              >
                Sign In as Admin
              </Link>
            </div>

            <div className="text-[10px] text-muted-foreground/80 mt-4 bg-muted/50 p-2.5 rounded-lg leading-normal">
              💡 **Demo Mode Bypass:** Logout from your student account, go to the login screen and sign in using email **admin@biocyclehub.edu** (any password) to bypass this check.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add Pathway Form State
  const [newPathwayName, setNewPathwayName] = useState("");
  const [newPathwayCategory, setNewPathwayCategory] = useState<"Carbohydrate" | "Lipid" | "Protein">("Carbohydrate");
  const [newPathwayDef, setNewPathwayDef] = useState("");
  const [newPathwayOrgan, setNewPathwayOrgan] = useState("");

  // Add Quiz Form State
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizPathway, setQuizPathway] = useState("glycolysis");
  const [quizOptionA, setQuizOptionA] = useState("");
  const [quizOptionB, setQuizOptionB] = useState("");
  const [quizOptionC, setQuizOptionC] = useState("");
  const [quizOptionD, setQuizOptionD] = useState("");
  const [quizCorrect, setQuizCorrect] = useState("0");
  const [quizExplanation, setQuizExplanation] = useState("");

  // Notification state
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    setPathways(dbService.getPathways());
    setQuizzes(dbService.getQuizzes());
    setFlashcards(dbService.getFlashcards());
  }, []);

  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => {
      setNotif(null);
    }, 2000);
  };

  // Add Pathway Handler
  const handleAddPathway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPathwayName.trim()) return;

    const slug = newPathwayName.toLowerCase().replace(/\s+/g, "-");
    const newPathway: Pathway = {
      slug,
      title: newPathwayName,
      category: newPathwayCategory,
      description: newPathwayDef || `${newPathwayName} is a metabolic cycle.`,
      clinicalImportance: "Core pharmaceutical concept",
      cellularLocation: newPathwayOrgan || "All tissues",
      rateLimitingStep: { name: "Step 1", enzyme: "Enzyme A", description: "First reaction", regulation: "Inhibited by ATP", clinicalImportance: "Syndrome A" },
      regulationSummary: { activators: ["ADP"], inhibitors: ["ATP"], hormonalControl: "Regulated by energy ratio" },
      clinicalSignificance: { diseases: [], drugTargets: [], labFindings: [] },
      reactions: [
        { step: 1, title: "Initial Reaction", enzyme: "Enzyme 1", substrate: "Glucose", product: "G6P", type: "irreversible", description: "Phosphorylation" },
        { step: 2, title: "Synthesis", enzyme: "Enzyme 2", substrate: "G6P", product: "Product X", type: "reversible", description: "Isomerization" }
      ],
      summaryCard: `${newPathwayName} cycle details.`
    };

    dbService.savePathway(newPathway);
    setPathways(dbService.getPathways());
    
    // Clear Form
    setNewPathwayName("");
    setNewPathwayDef("");
    setNewPathwayOrgan("");
    triggerNotif(`Pathway "${newPathwayName}" created successfully!`);
  };

  // Add Quiz Question Handler
  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion.trim() || !quizOptionA.trim()) return;

    const newQuiz: QuizQuestion = {
      id: "q-" + Math.random().toString(36).substr(2, 9),
      pathwaySlug: quizPathway,
      type: "mcq",
      question: quizQuestion,
      options: [quizOptionA, quizOptionB, quizOptionC, quizOptionD],
      correctAnswer: quizCorrect,
      explanation: quizExplanation || "Option verified by biochemistry curriculum.",
      difficulty: "Medium"
    };

    dbService.saveQuizQuestion(newQuiz);
    setQuizzes(dbService.getQuizzes());

    // Clear Form
    setQuizQuestion("");
    setQuizOptionA("");
    setQuizOptionB("");
    setQuizOptionC("");
    setQuizOptionD("");
    setQuizExplanation("");
    triggerNotif("New quiz question published!");
  };

  // Delete handlers (Mock)
  const handleDeletePathway = (slug: string) => {
    dbService.deletePathway(slug);
    setPathways(dbService.getPathways());
    triggerNotif("Pathway deleted.");
  };

  const handleDeleteQuiz = (id: string) => {
    dbService.deleteQuizQuestion(id);
    setQuizzes(dbService.getQuizzes());
    triggerNotif("Question deleted.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title */}
        <section className="flex justify-between items-center border-b border-border pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center">
              <Settings className="h-6 w-7 mr-2 text-primary animate-spin" style={{ animationDuration: '8s' }} />
              Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground">Manage curriculum datasets, quiz indexes, and review mock analytics</p>
          </div>
          
          <div className="flex items-center space-x-2 text-[10px] bg-muted/60 py-1.5 px-3 rounded-xl font-bold border border-border">
            <Database className="h-4 w-4 text-accent" />
            <span>Mock Database Active</span>
          </div>
        </section>

        {/* Floating Notification */}
        {notif && (
          <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg border border-border flex items-center space-x-2 animate-bounce">
            <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
            <span>{notif}</span>
          </div>
        )}

        {/* 1. MOCK ANALYTICS TILE GRID */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground">Active Students</span>
              <h3 className="text-md font-black text-foreground leading-tight mt-0.5">1,480</h3>
            </div>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 bg-sky-500/10 text-sky-500 rounded-lg shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground">Pathways Catalog</span>
              <h3 className="text-md font-black text-foreground leading-tight mt-0.5">{pathways.length} Active</h3>
            </div>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 bg-accent/10 text-accent rounded-lg shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground">Quizzes Logged</span>
              <h3 className="text-md font-black text-foreground leading-tight mt-0.5">{quizzes.length} Questions</h3>
            </div>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground">Avg Quiz Accuracy</span>
              <h3 className="text-md font-black text-foreground leading-tight mt-0.5">72.4%</h3>
            </div>
          </div>
        </section>

        {/* 2. ADMIN FORMS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Pathway Form */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-3">
              <Plus className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Add Metabolic Pathway</h3>
            </div>

            <form onSubmit={handleAddPathway} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="font-bold text-muted-foreground block mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  value={newPathwayName}
                  onChange={(e) => setNewPathwayName(e.target.value)}
                  placeholder="e.g. Gluconeogenesis"
                  className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Category</label>
                  <select
                    value={newPathwayCategory}
                    onChange={(e) => setNewPathwayCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none font-bold"
                  >
                    <option value="Carbohydrate">Carbohydrate</option>
                    <option value="Lipid">Lipid</option>
                    <option value="Protein">Protein</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Organ Location</label>
                  <input
                    type="text"
                    value={newPathwayOrgan}
                    onChange={(e) => setNewPathwayOrgan(e.target.value)}
                    placeholder="e.g. Liver & Kidneys"
                    className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-muted-foreground block mb-1">Overview Definition</label>
                <textarea
                  value={newPathwayDef}
                  onChange={(e) => setNewPathwayDef(e.target.value)}
                  placeholder="Summarize the pathway's biological role..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-lg transition"
              >
                Insert Pathway
              </button>
            </form>
          </div>

          {/* Create Quiz Form */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-3">
              <Plus className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-bold text-foreground">Publish Practice Question</h3>
            </div>

            <form onSubmit={handleAddQuiz} className="space-y-3.5 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Target Cycle</label>
                  <select
                    value={quizPathway}
                    onChange={(e) => setQuizPathway(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none capitalize font-bold"
                  >
                    {pathways.map(p => (
                      <option key={p.slug} value={p.slug}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Correct Answer Index</label>
                  <select
                    value={quizCorrect}
                    onChange={(e) => setQuizCorrect(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none font-bold"
                  >
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-muted-foreground block mb-1">Question Prompt</label>
                <input
                  type="text"
                  required
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  placeholder="e.g. What cofactor is required by enzyme X?"
                  className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={quizOptionA}
                  onChange={(e) => setQuizOptionA(e.target.value)}
                  placeholder="Option A"
                  className="p-2 border border-border rounded-lg bg-card"
                />
                <input
                  type="text"
                  required
                  value={quizOptionB}
                  onChange={(e) => setQuizOptionB(e.target.value)}
                  placeholder="Option B"
                  className="p-2 border border-border rounded-lg bg-card"
                />
                <input
                  type="text"
                  required
                  value={quizOptionC}
                  onChange={(e) => setQuizOptionC(e.target.value)}
                  placeholder="Option C"
                  className="p-2 border border-border rounded-lg bg-card"
                />
                <input
                  type="text"
                  required
                  value={quizOptionD}
                  onChange={(e) => setQuizOptionD(e.target.value)}
                  placeholder="Option D"
                  className="p-2 border border-border rounded-lg bg-card"
                />
              </div>

              <div>
                <label className="font-bold text-muted-foreground block mb-1">Feedback Explanation</label>
                <input
                  type="text"
                  value={quizExplanation}
                  onChange={(e) => setQuizExplanation(e.target.value)}
                  placeholder="Provide an explanation for incorrect answers..."
                  className="w-full p-2.5 rounded-lg border border-border bg-card focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-bold py-2.5 rounded-lg transition"
              >
                Publish MCQ Question
              </button>
            </form>
          </div>
        </section>

        {/* 3. INVENTORY LISTS */}
        <section className="bg-card border border-border rounded-2xl shadow-sm p-6 text-xs text-left">
          <div className="flex items-center space-x-2 border-b border-border pb-3 mb-4">
            <Database className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">Current Curriculum Databases</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pathways Catalog */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Pathways List</span>
              <div className="border border-border rounded-xl divide-y divide-border overflow-hidden max-h-[250px] overflow-y-auto">
                {pathways.map(p => (
                  <div key={p.slug} className="flex justify-between items-center p-3 hover:bg-muted/30">
                    <div>
                      <span className="font-bold text-foreground">{p.title}</span>
                      <span className="text-[9px] bg-primary/10 text-primary py-0.5 px-2.5 rounded-full ml-2 uppercase font-semibold">{p.category}</span>
                    </div>
                    {/* Only allow deleting custom pathways (preserve Glycolysis, Krebs, Urea Cycle core datasets) */}
                    {!["glycolysis", "krebs-cycle", "urea-cycle"].includes(p.slug) ? (
                      <button 
                        onClick={() => handleDeletePathway(p.slug)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-[9px] text-muted-foreground font-bold italic">Core Dataset</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quizzes list */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Quiz Question Index</span>
              <div className="border border-border rounded-xl divide-y divide-border overflow-hidden max-h-[250px] overflow-y-auto">
                {quizzes.map(q => (
                  <div key={q.id} className="flex justify-between items-start p-3 hover:bg-muted/30">
                    <div className="max-w-[280px]">
                      <span className="font-bold text-foreground line-clamp-1">{q.question}</span>
                      <span className="text-[8px] text-muted-foreground block uppercase mt-0.5">Target: {q.pathwaySlug}</span>
                    </div>
                    {/* Delete Quiz */}
                    <button 
                      onClick={() => handleDeleteQuiz(q.id)}
                      className="text-red-500 hover:text-red-700 transition mt-0.5 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
