"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { dbService, Pathway, StudyNote, Flashcard } from "@/lib/db";
import Header from "@/components/Header";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { 
  Zap, 
  Award, 
  Activity, 
  BookOpen, 
  Bookmark, 
  CheckSquare, 
  TrendingUp, 
  ChevronRight, 
  Lock,
  Sparkles,
  Layers
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Hydration fix for Recharts
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Direct guest users to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground">Syncing academic records...</p>
          </div>
        </div>
      </div>
    );
  }

  // Load User Stats & Data
  const progress = dbService.getUserProgress(user.uid);
  const pathways = dbService.getPathways();
  const notes = dbService.getNotes();
  const flashcards = dbService.getFlashcards();

  const userLevel = Math.floor(progress.xp / 100) + 1;
  const currentLevelXp = progress.xp % 100;

  // Filter Bookmarks
  const bookmarkedNotes = notes.filter(n => n.bookmarked);
  const bookmarkedFlashcards = flashcards.filter(c => c.bookmarked);

  // Compute stats
  const completedCount = progress.completedPathways.length;
  const totalPathways = pathways.length;
  const completionRate = totalPathways > 0 ? Math.round((completedCount / totalPathways) * 100) : 0;

  // Recharts: Chart Data formatting
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activityData = daysOfWeek.map((day, idx) => ({
    name: day,
    actions: progress.weeklyActivity[idx] || 0
  }));

  const quizScoresData = progress.quizScores.map((qs: any, idx: any) => ({
    quizIndex: `Quiz ${idx + 1}`,
    scorePercent: Math.round((qs.score / qs.total) * 100),
    title: qs.quizId
  }));

  // Standard Achievement Badges Definition
  const badgesList = [
    { id: "welcome", title: "Freshman", desc: "Created account at BioCycle Hub", icon: Sparkles, color: "text-sky-500 bg-sky-500/10 border-sky-200" },
    { id: "glycolysis_master", title: "Glycolysis Guru", desc: "Visualized Glycolysis pathway", icon: Activity, color: "text-emerald-500 bg-emerald-500/10 border-emerald-200" },
    { id: "krebs-cycle_master", title: "Krebs Champion", desc: "Visualized Krebs Cycle", icon: TrendingUp, color: "text-amber-500 bg-amber-500/10 border-amber-200" },
    { id: "urea-cycle_master", title: "Urea Expert", desc: "Visualized Urea Cycle", icon: CheckSquare, color: "text-indigo-500 bg-indigo-500/10 border-indigo-200" },
    { id: "perfectionist", title: "Perfectionist", desc: "Scored 100% on any practice quiz", icon: Award, color: "text-yellow-500 bg-yellow-500/10 border-yellow-200" },
    { id: "streak3", title: "Flame Runner", desc: "Maintained a 3-day learning streak", icon: Zap, color: "text-orange-500 bg-orange-500/10 border-orange-200" },
  ];

  const unlockedBadges = badgesList.filter(b => progress.badges.includes(b.id) || progress.badges.includes(`${b.id.split("_")[0]}_master`));
  const lockedBadges = badgesList.filter(b => !progress.badges.includes(b.id) && !progress.badges.includes(`${b.id.split("_")[0]}_master`));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* 1. WELCOME HERO METRIC CARD */}
        <section className="bg-card border border-border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-black text-lg shadow-md">
              {user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Welcome back, {user.displayName}!</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center text-xs text-muted-foreground space-x-3 mt-1">
                <span>Pharmacy Student</span>
                <span>•</span>
                <span className="flex items-center text-orange-500 font-semibold">
                  <Zap className="h-3.5 w-3.5 fill-orange-500 mr-1 animate-bounce" />
                  {progress.streak} Day Study Streak
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Slider */}
          <div className="w-full md:w-80 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-primary flex items-center">
                <Award className="h-4 w-4 mr-1 text-accent" />
                Level {userLevel}
              </span>
              <span className="text-muted-foreground">{currentLevelXp} / 100 XP</span>
            </div>
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
                style={{ width: `${currentLevelXp}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-right">
              Earn {100 - currentLevelXp} XP to reach Level {userLevel + 1}
            </p>
          </div>
        </section>

        {/* 2. STATS TILES GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Tile 1 */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Pathway Progress</span>
              <h3 className="text-lg font-black text-foreground mt-0.5">{completedCount} / {totalPathways}</h3>
              <div className="w-24 bg-muted h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-sky-500 h-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
          </div>

          {/* Tile 2 */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Quizzes Taken</span>
              <h3 className="text-lg font-black text-foreground mt-0.5">{progress.quizScores.length} Sessions</h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                Practice makes perfect
              </span>
            </div>
          </div>

          {/* Tile 3 */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Revision Cards</span>
              <h3 className="text-lg font-black text-foreground mt-0.5">{bookmarkedFlashcards.length} Saved</h3>
              <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">
                Active Leitner revision cards
              </span>
            </div>
          </div>
        </section>

        {/* 3. CHARTS VISUALIZATION SECTION */}
        {mounted && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Study Action count */}
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Weekly Learning Activity</h3>
                <p className="text-[10px] text-muted-foreground">Study counts, quizzes, and visualizations completed</p>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "11px" }} />
                    <Bar dataKey="actions" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Quiz Accuracy */}
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Quiz Accuracy Trend</h3>
                <p className="text-[10px] text-muted-foreground">Percentage score performance history</p>
              </div>
              <div className="h-56 w-full">
                {quizScoresData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={quizScoresData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="quizIndex" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "11px" }} />
                      <Line type="monotone" dataKey="scorePercent" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                    Complete your first quiz to generate accuracy trends.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. LOWER GRID: BADGES & BOOKMARKS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Unlocked & Locked Achievements */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm md:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Achievement Badges</h3>
              <p className="text-[10px] text-muted-foreground">Unlock credentials by completing pathways and perfect quizzes</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Unlocked Badges */}
              {unlockedBadges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    className={`border p-3.5 rounded-xl text-center space-y-2 flex flex-col items-center justify-center ${badge.color}`}
                  >
                    <Icon className="h-6 w-6 stroke-[2.5]" />
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-wider">{badge.title}</h4>
                      <p className="text-[9px] text-muted-foreground/80 leading-none mt-1">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Locked Badges */}
              {lockedBadges.map(badge => {
                return (
                  <div 
                    key={badge.id}
                    className="border border-dashed border-border/80 bg-muted/20 p-3.5 rounded-xl text-center space-y-2 flex flex-col items-center justify-center opacity-50 relative group"
                  >
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground">{badge.title}</h4>
                      <p className="text-[9px] text-muted-foreground/60 leading-none mt-1">Locked</p>
                    </div>
                    {/* Hover requirement info */}
                    <div className="absolute inset-0 bg-card rounded-xl p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-center font-bold pointer-events-none">
                      Req: {badge.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookmarks Column */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Saved Bookmarks</h3>
              <p className="text-[10px] text-muted-foreground font-sans">Quick access to saved study resources</p>
            </div>

            <div className="space-y-3">
              {bookmarkedNotes.length === 0 && bookmarkedFlashcards.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  <Bookmark className="h-6 w-6 mx-auto text-muted-foreground/60 mb-2" />
                  <p>No bookmarks saved yet.</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5">Click the bookmark icon on notes or flashcards.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Saved Notes */}
                  {bookmarkedNotes.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase text-muted-foreground/80 block">Study Notes</span>
                      {bookmarkedNotes.map(n => (
                        <Link 
                          key={n.slug}
                          href="/notes"
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted text-[10px] font-semibold transition"
                        >
                          <span className="truncate text-foreground max-w-[160px]">{n.title}</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Saved Flashcards count info */}
                  {bookmarkedFlashcards.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase text-muted-foreground/80 block">Flashcard Decks</span>
                      <Link 
                        href="/flashcards"
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted text-[10px] font-semibold transition"
                      >
                        <span className="text-foreground">{bookmarkedFlashcards.length} Saved Flashcards</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. DAILY EXPERIENCE SCOREBOARD */}
        <section className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" />
                Daily Experience Scoreboard
              </h3>
              <p className="text-[10px] text-muted-foreground">Your XP development over the past week</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary">{progress.xp}</span>
              <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Total XP</span>
            </div>
          </div>
          
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4 font-black">Day</th>
                  <th className="py-3 px-4 font-black">Activities</th>
                  <th className="py-3 px-4 font-black">XP Earned (Est.)</th>
                  <th className="py-3 px-4 font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {daysOfWeek.map((day, idx) => {
                  const actions = progress.weeklyActivity[idx] || 0;
                  const estimatedXP = actions * 30; // ~30 XP per action
                  return (
                    <tr key={day} className="hover:bg-muted/50 transition-colors text-xs">
                      <td className="py-3 px-4 font-bold text-foreground">{day}</td>
                      <td className="py-3 px-4 text-muted-foreground">{actions} sessions</td>
                      <td className="py-3 px-4 font-black text-primary">+{estimatedXP} XP</td>
                      <td className="py-3 px-4">
                        {actions > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-500 border border-slate-500/20">
                            Rest
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
