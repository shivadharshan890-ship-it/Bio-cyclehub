"use client";

import React, { useState, useEffect } from "react";
import { Flashcard, dbService } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, 
  BookmarkCheck, 
  Rotate3d, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  RefreshCw,
  FolderOpen
} from "lucide-react";

interface FlashcardDeckProps {
  initialCategory?: string;
}

export default function FlashcardDeck({ initialCategory }: FlashcardDeckProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || "All");
  const [leitnerFilter, setLeitnerFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>(() => [
    "All",
    ...(Array.from(new Set(dbService.getStaticFlashcards().map((c: any) => String(c.category)))))
  ]);

  useEffect(() => {
    const allCards = dbService.getFlashcards();
    const distinctCategories = ["All", ...(Array.from(new Set(allCards.map((c: any) => String(c.category)))))];
    setCategories(distinctCategories);
  }, []);

  // Load cards and filter them
  useEffect(() => {
    let allCards = dbService.getFlashcards();
    
    // Apply category filter
    if (categoryFilter !== "All") {
      allCards = allCards.filter(c => c.category === categoryFilter || c.pathwayName.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Apply Leitner box filter
    if (leitnerFilter !== "all") {
      allCards = allCards.filter(c => c.leitnerState === leitnerFilter);
    }

    setCards(allCards);
    setCurrentIdx(0);
    setIsFlipped(false);
  }, [categoryFilter, leitnerFilter, initialCategory]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    // Delay index change slightly to allow card to face front first
    setTimeout(() => {
      setCurrentIdx(prev => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx(prev => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIdx(0);
    }, 150);
  };

  const handleBookmarkToggle = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation(); // Avoid card flip on bookmark click
    const updated = dbService.toggleFlashcardBookmark(cardId);
    // Sync local state
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, bookmarked: !c.bookmarked } : c));
  };

  const handleLeitnerRate = (e: React.MouseEvent, cardId: string, rate: "new" | "review" | "mastered") => {
    e.stopPropagation();
    dbService.updateFlashcardLeitner(cardId, rate);
    // Sync local state
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, leitnerState: rate } : c));
    
    // Auto advance to next card after a small delay
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const currentCard = cards[currentIdx];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* 1. Filter controls */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between text-xs shadow-sm">
        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-muted border border-border rounded px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Leitner Box Filter */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Revision Filter:</span>
          <select
            value={leitnerFilter}
            onChange={(e) => setLeitnerFilter(e.target.value)}
            className="bg-muted border border-border rounded px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="all">All Cards</option>
            <option value="new">New / Study</option>
            <option value="review">Reviewing</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>

        {/* Shuffle Button */}
        <button
          onClick={handleShuffle}
          disabled={cards.length === 0}
          className="flex items-center space-x-1.5 hover:bg-muted border border-border font-bold px-3 py-1.5 rounded-lg disabled:opacity-40"
        >
          <Shuffle className="h-3.5 w-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* 2. Flashcard deck visualization */}
      {cards.length > 0 ? (
        <div className="space-y-6">
          {/* Card Flapper */}
          <div 
            onClick={handleFlip}
            className="w-full h-80 perspective-1000 cursor-pointer group"
          >
            <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
              {/* FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-card border border-border rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/50 pb-3">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {currentCard.pathwayName}
                  </span>
                  
                  <button 
                    onClick={(e) => handleBookmarkToggle(e, currentCard.id)}
                    className="hover:text-primary transition-all p-1"
                  >
                    {currentCard.bookmarked ? (
                      <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center flex-1 my-4">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-black mb-2">Question</span>
                  <p className="text-lg font-bold text-center text-foreground leading-snug max-w-md">
                    {currentCard.front}
                  </p>
                </div>

                {/* Footer hint */}
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground border-t border-border/50 pt-3">
                  <span className="flex items-center">
                    <Rotate3d className="h-3.5 w-3.5 mr-1 text-primary animate-pulse" />
                    Click card to flip
                  </span>
                  <span className="capitalize px-2 py-0.5 rounded-full bg-muted">
                    Box: {currentCard.leitnerState || "new"}
                  </span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/50 pb-3">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-primary">
                    {currentCard.pathwayName} (Solution)
                  </span>
                  
                  <button 
                    onClick={(e) => handleBookmarkToggle(e, currentCard.id)}
                    className="hover:text-primary transition-all p-1"
                  >
                    {currentCard.bookmarked ? (
                      <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center flex-1 my-4">
                  <span className="text-xs uppercase tracking-widest text-accent font-black mb-2">Answer</span>
                  <p className="text-md font-medium text-center text-foreground leading-relaxed max-w-md">
                    {currentCard.back}
                  </p>
                </div>

                {/* Leitner rating buttons */}
                <div className="pt-3 border-t border-border/50 flex justify-between items-center space-x-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none max-w-[80px]">
                    Rate difficulty:
                  </span>
                  
                  <div className="flex space-x-1.5 flex-1 justify-end">
                    <button
                      onClick={(e) => handleLeitnerRate(e, currentCard.id, "new")}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black tracking-wide uppercase transition-all"
                    >
                      Hard
                    </button>
                    <button
                      onClick={(e) => handleLeitnerRate(e, currentCard.id, "review")}
                      className="px-2.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-black tracking-wide uppercase transition-all"
                    >
                      Medium
                    </button>
                    <button
                      onClick={(e) => handleLeitnerRate(e, currentCard.id, "mastered")}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-wide uppercase transition-all flex items-center"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Easy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls below the card */}
          <div className="flex items-center justify-between px-4">
            <span className="text-xs font-semibold text-muted-foreground">
              Card {currentIdx + 1} of {cards.length}
            </span>

            <div className="flex space-x-3">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-all shadow-sm"
                title="Previous Card"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-all shadow-sm"
                title="Next Card"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-md font-bold">No cards match filters</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Try clearing active category or revision filters to show cards.</p>
          <button
            onClick={() => {
              setCategoryFilter("All");
              setLeitnerFilter("all");
            }}
            className="inline-flex items-center space-x-1 bg-primary text-white font-semibold text-xs px-4 py-2 rounded-lg"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
