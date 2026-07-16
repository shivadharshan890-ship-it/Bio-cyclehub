"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { dbService, Pathway, StudyNote } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Activity, 
  BookOpen, 
  Layers, 
  Award, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Clock,
  ChevronRight,
  Star,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  HelpCircle as QuestionIcon
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    pathways: Pathway[];
    notes: StudyNote[];
  }>({ pathways: [], notes: [] });

  const [pathways, setPathways] = useState<Pathway[]>(() => dbService.getStaticPathways());
  const [notes, setNotes] = useState<StudyNote[]>(() => dbService.getStaticNotes());

  // FAQ state
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const toggleFaq = (idx: number) => {
    setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    setPathways(dbService.getPathways());
    setNotes(dbService.getNotes());
  }, []);

  // Instant Search Engine
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ pathways: [], notes: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Filter pathways
    const matchedPathways = pathways.filter(p => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.location.organ.toLowerCase().includes(query) ||
        p.location.cellularLocation.toLowerCase().includes(query) ||
        p.reactions.some(r => r.enzyme.toLowerCase().includes(query)) ||
        p.clinicalSignificance.diseases.some(d => d.toLowerCase().includes(query)) ||
        p.rateLimitingStep.enzyme.toLowerCase().includes(query)
      );
    });

    // Filter notes
    const matchedNotes = notes.filter(n => {
      return (
        n.title.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    });

    setSearchResults({ pathways: matchedPathways, notes: matchedNotes });
  }, [searchQuery, pathways, notes]);

  // Categories list
  const categoriesList = [
    { name: "Carbohydrate Metabolism", count: 9, icon: Activity, color: "text-sky-500 bg-sky-500/10" },
    { name: "Lipid Metabolism", count: 4, icon: Sparkles, color: "text-emerald-500 bg-emerald-500/10" },
    { name: "Protein Metabolism", count: 5, icon: BookOpen, color: "text-amber-500 bg-amber-500/10" },
    { name: "Nucleotide Metabolism", count: 2, icon: Layers, color: "text-indigo-500 bg-indigo-500/10" },
  ];

  // Daily learning tips
  const dailyTips = [
    "Mature Red Blood Cells (RBCs) lack mitochondria and rely 100% on anaerobic glycolysis to generate ATP. A pyruvate kinase deficiency directly triggers hemolytic anemia.",
    "The enzyme Aconitase in the Krebs Cycle is suicide-inhibited by fluorocitrate (a metabolite of fluoroacetate rodent poison), shutting down aerobic respiration.",
    "Carbamoyl Phosphate Synthetase I (CPS I) is the rate-limiting mitochondrial enzyme of the Urea Cycle, and it absolutely requires N-Acetylglutamate (NAG) to function.",
    "Fluoride ions inhibit Enolase (Step 9 of Glycolysis). This is why gray-top blood vials contain sodium fluoride—to lock glucose levels for reliable lab assays."
  ];

  // FAQs list
  const faqs = [
    {
      q: "Is BioCycle Hub aligned with the PCI B.Pharm Syllabus?",
      a: "Yes! All 27 core pathways, clinical linkages, and rate-limiting regulatory steps are strictly mapped based on the Pharmacy Council of India (PCI) syllabus for Biochemistry."
    },
    {
      q: "How does the interactive flowchart visualizer help in learning?",
      a: "Instead of staring at complex equations, students can toggle between modes like 'Medicine Factory' or 'Cyber Neon' to watch molecules move along animated conveyor belts, take step-specific quizzes, and review memory tricks."
    },
    {
      q: "What is the study streak and level system?",
      a: "Like Duolingo, we reward consistent learning. Every step you complete, flashcard you flip, or quiz you master awards XP. Maintain your daily streak to level up your biochemical rank!"
    },
    {
      q: "Can I download study notes for exams?",
      a: "Absolutely. Every pathway page has options to view detailed study notes, exam tables, print directly, or download as printable cheat-sheets for your sessional or university exams."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Aditya Sharma",
      role: "B.Pharm 2nd Year Student",
      avatar: "👨‍⚕️",
      feedback: "BioCycle Hub transformed biochemistry from my worst subject to my highest scorer! The Medicine Factory theme helped me remember all rate-limiting enzymes easily."
    },
    {
      name: "Priyanka Patel",
      role: "GPAT 2026 Aspirant (Rank 78)",
      avatar: "👩‍⚕️",
      feedback: "I used the Flashcards and dynamic Step Quizzes daily. The clinical links for Enolase fluoride inhibition and Arsenate poisoning are direct questions on GPAT exams."
    },
    {
      name: "Prof. Rajesh Mehta",
      role: "HOD Pharmaceutical Chemistry",
      avatar: "👨‍🏫",
      feedback: "This tool is a brilliant pedagogical asset. Watching metabolic loops rotate and pathways animate provides deep visual understanding that regular textbooks fail to deliver."
    }
  ];
  
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * dailyTips.length));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      
      {/* 3D Spin DNA Animation Styles */}
      <style>{`
        @keyframes dnaSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .dna-bar {
          transform-style: preserve-3d;
          animation: dnaSpin 5s linear infinite;
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-transparent to-transparent py-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Animated DNA Helix (Left Side) */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-28 h-80 opacity-15 pointer-events-none hidden xl:block">
          <div className="relative w-full h-full flex flex-col justify-between items-center" style={{ perspective: "400px" }}>
            {Array.from({ length: 11 }).map((_, i) => (
              <div 
                key={i} 
                className="dna-bar w-24 h-1.5 flex items-center justify-between"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                <div className="flex-grow h-0.5 border-t border-dashed border-slate-600 mx-1" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </div>
            ))}
          </div>
        </div>

        {/* Animated DNA Helix (Right Side) */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-28 h-80 opacity-15 pointer-events-none hidden xl:block">
          <div className="relative w-full h-full flex flex-col justify-between items-center" style={{ perspective: "400px" }}>
            {Array.from({ length: 11 }).map((_, i) => (
              <div 
                key={i} 
                className="dna-bar w-24 h-1.5 flex items-center justify-between"
                style={{ animationDelay: `${(i * 0.25) + 0.1}s` }}
              >
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <div className="flex-grow h-0.5 border-t border-dashed border-slate-600 mx-1" />
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>Dedicated to B.Pharmacy & Medical Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-tight">
            Learn. Visualize. Master{" "}
            <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
              Biochemistry.
            </span>
          </h1>

          <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop memorizing static textbooks. Explore interactive metabolic processes inside our 3D animated Medicine Factory, test your GPAT preparation with quizzes, and excel in pharmacy exams.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button asChild size="lg" className="rounded-xl font-bold shadow-lg shadow-primary/20">
              <Link href="/pathways" className="flex items-center space-x-1">
                <span>Explore 27+ Pathways</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl font-bold shadow-sm">
              <Link href="/quiz">
                Take Practice Quiz
              </Link>
            </Button>
          </div>

          {/* SEARCH BAR SECTION */}
          <div className="max-w-2xl mx-auto relative pt-6">
            <div className="relative shadow-md rounded-2xl bg-card border border-border flex items-center p-1.5 focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200">
              <Search className="h-5 w-5 text-muted-foreground ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pathways, enzymes, drugs, diseases, cofactors..."
                className="w-full bg-transparent py-3 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold px-3 py-1 bg-muted rounded-lg mr-1.5"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Instant Search Results Panel */}
            {searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-30 p-4 max-h-[350px] overflow-y-auto text-left">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 px-1">
                  Search Results for "{searchQuery}"
                </span>
                
                {searchResults.pathways.length === 0 && searchResults.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No matches found. Try checking spelling or search keywords.</p>
                ) : (
                  <div className="space-y-4">
                    {/* Pathways results */}
                    {searchResults.pathways.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-primary mb-1 border-b border-border pb-1">Metabolic Pathways</h4>
                        <div className="space-y-1.5">
                          {searchResults.pathways.map(p => (
                            <Link 
                              key={p.slug}
                              href={`/pathways/${p.slug}`}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-xs transition-colors"
                            >
                              <div>
                                <span className="font-bold text-foreground">{p.name}</span>
                                <span className="text-[10px] text-muted-foreground ml-2">({p.category})</span>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes results */}
                    {searchResults.notes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-accent mb-1 border-b border-border pb-1">Study Notes</h4>
                        <div className="space-y-1.5">
                          {searchResults.notes.map(n => (
                            <Link 
                              key={n.slug}
                              href={`/notes`}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-xs transition-colors"
                            >
                              <div>
                                <span className="font-bold text-foreground">{n.title}</span>
                                <span className="text-[10px] text-muted-foreground ml-2">({n.category})</span>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-card border border-border p-6 rounded-3xl shadow-sm text-center">
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-primary">27+</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1 block">Pathways Mapped</span>
          </div>
          <div className="border-l border-border">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-500">1,500+</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1 block">Flashcards Flipped</span>
          </div>
          <div className="border-l border-border">
            <span className="block text-2xl sm:text-3xl font-black text-amber-500">800+</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1 block">GPAT Quiz Prep</span>
          </div>
          <div className="border-l border-border">
            <span className="block text-2xl sm:text-3xl font-black text-indigo-500">98%</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1 block">Exam Success Rate</span>
          </div>
        </div>
      </section>

      {/* 3. DAILY LEARNING TIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-slate-900/60 dark:to-slate-800/20 p-5 rounded-2xl border border-sky-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3 text-left">
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-primary-hover uppercase tracking-wider">Daily Pharmacy Learning Tip</h4>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-3xl leading-relaxed">
                {dailyTips[tipIndex]}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setTipIndex((prev) => (prev + 1) % dailyTips.length)}
            className="text-[10px] font-extrabold text-primary hover:text-primary-hover uppercase tracking-wide shrink-0 transition"
          >
            Next Tip
          </button>
        </div>
      </section>

      {/* 4. WHY CHOOSE BIOCYCLE HUB SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-foreground">Why Pharmacy Students Love BioCycle Hub</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">Visual simulations built strictly according to academic needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Syllabus Aligned</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Structured to align with standard PCI B.Pharmacy courses. We cover Carbohydrates, Lipids, Proteins, and Nucleotides comprehensively.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Conveyor Belts & Flow</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Our unique Medicine Factory theme transforms biochemical enzymes into robotic assembly lines carrying capsule products dynamically.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">GPAT Exam Focused</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              We highlight clinical relevance (diseases, drugs, targets) and high-yield exam tips to prepare you for state and national qualification exams.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PATHWAYS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Featured Pathways</h2>
            <p className="text-xs text-muted-foreground">Interactive step-by-step visual models</p>
          </div>
          <Link href="/pathways" className="text-xs font-bold text-primary hover:underline flex items-center space-x-1">
            <span>View All Pathways</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pathways.slice(0, 3).map((p) => {
            const level = p.rateLimitingStep.enzyme;
            return (
              <div 
                key={p.slug}
                className="bg-card border border-border hover:border-primary/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-6 space-y-4">
                  {/* Category Tag */}
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="bg-primary/10 text-primary py-0.5 px-2.5 rounded-full capitalize">
                      {p.category}
                    </span>
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {p.reactions.length} Steps
                    </span>
                  </div>

                  {/* Pathway Title */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {p.overview.definition}
                  </p>

                  {/* Visual specs */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-semibold text-muted-foreground">
                    <div className="bg-muted/40 p-2 rounded-lg">
                      <span className="block text-[9px] font-black uppercase text-muted-foreground/80">Location</span>
                      <span className="text-foreground truncate block">{p.location.cellularLocation.split(" ")[0]}</span>
                    </div>
                    <div className="bg-muted/40 p-2 rounded-lg">
                      <span className="block text-[9px] font-black uppercase text-muted-foreground/80">ATP Yield</span>
                      <span className="text-foreground block">{p.energyBalance.atpProduced - p.energyBalance.atpUsed} Net</span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="bg-muted/30 border-t border-border px-6 py-4 flex items-center justify-between">
                  <div className="text-[9px] text-muted-foreground">
                    <span className="block font-bold">Rate Limiting:</span>
                    <span className="text-red-500 font-extrabold max-w-[130px] truncate block">{level}</span>
                  </div>
                  <Link 
                    href={`/pathways/${p.slug}`}
                    className="bg-primary text-primary-foreground group-hover:bg-primary-hover py-1.5 px-4 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
                  >
                    <span>Visualize</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. LEARNING CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Learning Categories</h2>
          <p className="text-xs text-muted-foreground">Syllabus-aligned core pharmacy structures</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesList.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link 
                href="/pathways"
                key={idx}
                className="bg-card border border-border p-5 rounded-2xl hover:bg-muted/30 transition-all text-center flex flex-col items-center justify-center space-y-3 group shadow-sm"
              >
                <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1 inline-block">
                    {cat.count} Core Cycles
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 7. STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-foreground">From Beaker to Boardroom: Student Success</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">Review from pharmacy students and educators using BioCycle Hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.feedback}"
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="text-2xl">{t.avatar}</div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                  <span className="text-[9px] text-slate-400 block font-medium">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-foreground">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Everything you need to know about the BioCycle Hub platform</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = !!faqOpen[idx];
            return (
              <div 
                key={idx} 
                className="bg-card border border-border rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-muted/40 transition"
                >
                  <span className="text-xs sm:text-sm font-bold text-foreground">{faq.q}</span>
                  <ChevronRight className={`h-4.5 w-4.5 text-muted-foreground transform transition ${isOpen ? "rotate-90 text-primary" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl text-center sm:text-left">
          {/* Beaker Circle decoration background */}
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4 pointer-events-none">
            <Activity className="h-96 w-96" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to boost your exam score?</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Create a free student profile to track your study streaks, unlock achievement badges, and save flashcard decks. Accessible from any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-3 justify-center sm:justify-start">
              <Link 
                href="/auth" 
                className="bg-white text-primary font-bold text-sm py-2.5 px-6 rounded-xl hover:bg-slate-50 transition shadow-lg text-center"
              >
                Sign Up for Free
              </Link>
              <Link 
                href="/quiz" 
                className="bg-primary-hover/50 text-white font-bold text-sm py-2.5 px-6 rounded-xl hover:bg-primary-hover/75 transition border border-white/20 text-center flex items-center justify-center space-x-1"
              >
                <span>Take a Practice Quiz</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center space-x-6">
            <Link href="/pathways" className="hover:text-foreground transition">Pathways</Link>
            <Link href="/quiz" className="hover:text-foreground transition">Practice Quizzes</Link>
            <Link href="/flashcards" className="hover:text-foreground transition">Flashcards</Link>
            <Link href="/notes" className="hover:text-foreground transition font-medium">Study Notes</Link>
          </div>
          <p>© {new Date().getFullYear()} BioCycle Hub. Designed for B.Pharmacy, Pharm.D and GPAT aspirants. All mock pathways verified.</p>
        </div>
      </footer>
    </div>
  );
}
