"use client";

import React from "react";
import Header from "@/components/Header";
import FlashcardDeck from "@/components/FlashcardDeck";
import { Layers, HelpCircle, CheckSquare, CalendarDays, Award } from "lucide-react";

export default function Flashcards() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title */}
        <section className="text-left space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Spaced Revision Flashcards</h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Revise key enzymes, locations, energy budgets, and pathological features. Flip the card to test yourself, and rate card difficulty to organize your revision scheduling.
          </p>
        </section>

        {/* 1. Main Deck Container */}
        <section className="py-4">
          <FlashcardDeck />
        </section>

        {/* 2. Leitner System Explanation Guide */}
        <section className="bg-card border border-border p-6 rounded-2xl shadow-sm max-w-xl mx-auto space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center">
            <Layers className="h-4.5 w-4.5 mr-1.5 text-primary" />
            Spaced Repetition & The Leitner System
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Spaced repetition is an evidence-based learning technique designed to increase retention. The Leitner system organizes your cards into study boxes:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-semibold">
            {/* Box 1 */}
            <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl space-y-1">
              <span className="text-red-500 font-extrabold flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                Box 1: Hard
              </span>
              <p className="text-muted-foreground leading-normal">
                Study every day. Review new or challenging cards.
              </p>
            </div>
            
            {/* Box 2 */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl space-y-1">
              <span className="text-yellow-500 font-extrabold flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                Box 2: Medium
              </span>
              <p className="text-muted-foreground leading-normal">
                Study every 3 days. Review cards with moderate retention.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl space-y-1">
              <span className="text-emerald-500 font-extrabold flex items-center">
                <Award className="h-3.5 w-3.5 mr-1" />
                Box 3: Mastered
              </span>
              <p className="text-muted-foreground leading-normal">
                Study every 5 days. These concepts are locked into memory.
              </p>
            </div>
          </div>
          
          <p className="text-[10px] text-muted-foreground italic leading-normal">
            💡 **How to rate:** When checking the back of a card, click **Easy** to promote it to the next box, or **Hard** to demote it to Box 1 for immediate restudying.
          </p>
        </section>

      </main>
    </div>
  );
}
