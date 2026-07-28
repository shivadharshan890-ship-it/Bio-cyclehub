"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { dbService, Pathway } from "@/lib/db";
import { pathwayEnergy } from "@/lib/pathwayData";
import Header from "@/components/Header";
import { 
  Search, 
  Activity, 
  Clock, 
  MapPin, 
  Flame,
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function PathwaysList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [filteredPathways, setFilteredPathways] = useState<Pathway[]>([]);

  const [pathways, setPathways] = useState<Pathway[]>(() => dbService.getStaticPathways());

  useEffect(() => {
    setPathways(dbService.getPathways());
  }, []);

  useEffect(() => {
    let result = pathways;

    // Apply category tab filter
    if (activeTab !== "All") {
      result = result.filter(p => p.category === activeTab);
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.cellularLocation?.toLowerCase().includes(q) ||
        p.rateLimitingStep?.enzyme?.toLowerCase().includes(q)
      );
    }

    setFilteredPathways(result);
  }, [searchQuery, activeTab, pathways]);

  const tabs = ["All", "Carbohydrate", "Lipid", "Protein", "Nucleotide", "Molecular", "Drug"];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Title */}
        <section className="text-left space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Metabolic Pathways Catalog</h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Explore step-by-step reaction steps, cellular localizations, rate-limiting control points, and clinical pathology linkages for core biochemistry cycles.
          </p>
        </section>

        {/* 1. FILTER BAR & SEARCH */}
        <section className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-muted p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab} {tab !== "All" && "Metabolism"}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 border border-border bg-muted/40 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pathways or enzymes..."
              className="w-full pl-9 pr-4 py-2.5 text-xs text-foreground bg-transparent focus:outline-none placeholder-muted-foreground"
            />
          </div>
        </section>

        {/* 2. PATHWAYS LIST GRID */}
        {filteredPathways.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPathways.map((p) => {
              return (
                <div 
                  key={p.slug}
                  className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className="p-6 space-y-4">
                    {/* Tags header */}
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase">
                        {p.category}
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {p.reactions.length} Steps
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-md font-bold text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>

                    {/* Definition */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {p.description}
                    </p>

                    {/* Specifications List */}
                    <div className="pt-4 border-t border-border grid grid-cols-2 gap-x-2 gap-y-3">
                      {(() => {
                        const energyData = pathwayEnergy[p.slug];
                        if (!energyData) return null;
                        
                        return (
                          <>
                            {/* Rate Limiting */}
                            <div className="col-span-2">
                              <span className="text-[9px] uppercase font-black text-muted-foreground block">Rate Limiting Enzyme</span>
                              <span className="text-xs font-bold text-red-500 line-clamp-1">{energyData.rateLimitingEnzyme}</span>
                            </div>

                            {/* Location */}
                            <div className="col-span-2">
                              <span className="text-[9px] uppercase font-black text-muted-foreground block">Location</span>
                              <span className="text-xs font-medium text-foreground line-clamp-1">{energyData.location}</span>
                            </div>

                            {/* Final Product */}
                            <div className="col-span-2">
                              <span className="text-[9px] uppercase font-black text-muted-foreground block">Final Product</span>
                              <span className="text-xs font-bold text-primary line-clamp-1">{energyData.endProduct}</span>
                            </div>

                            {/* ATP Metrics */}
                            {(energyData.atpConsumed ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">ATP Consumed</span>
                                <span className="text-xs font-bold text-red-400">{energyData.atpConsumed}</span>
                              </div>
                            )}
                            
                            {(energyData.atpProduced ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">ATP Produced</span>
                                <span className="text-xs font-bold text-emerald-400">{energyData.atpProduced}</span>
                              </div>
                            )}

                            <div className="col-span-2 bg-yellow-500/10 rounded px-2 py-1 border border-yellow-500/20">
                              <span className="text-[9px] uppercase font-black text-yellow-600 dark:text-yellow-400 block">Net ATP</span>
                              <span className="text-sm font-black text-yellow-500">{energyData.netATP ?? 0}</span>
                            </div>

                            {/* Other Metrics */}
                            {(energyData.nadh ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">NADH Produced</span>
                                <span className="text-xs font-bold text-sky-400">+{energyData.nadh}</span>
                              </div>
                            )}
                            
                            {(energyData.nadhConsumed ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">NADH Consumed</span>
                                <span className="text-xs font-bold text-red-400">-{energyData.nadhConsumed}</span>
                              </div>
                            )}

                            {(energyData.fadh2 ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">FADH₂ Produced</span>
                                <span className="text-xs font-bold text-sky-400">+{energyData.fadh2}</span>
                              </div>
                            )}

                            {(energyData.fadh2Consumed ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">FADH₂ Consumed</span>
                                <span className="text-xs font-bold text-red-400">-{energyData.fadh2Consumed}</span>
                              </div>
                            )}

                            {(energyData.gtp ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">GTP Produced</span>
                                <span className="text-xs font-bold text-emerald-400">+{energyData.gtp}</span>
                              </div>
                            )}

                            {(energyData.gtpConsumed ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">GTP Consumed</span>
                                <span className="text-xs font-bold text-red-400">-{energyData.gtpConsumed}</span>
                              </div>
                            )}

                            {(energyData.nadph ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">NADPH Produced</span>
                                <span className="text-xs font-bold text-purple-400">+{energyData.nadph}</span>
                              </div>
                            )}

                            {(energyData.nadphConsumed ?? 0) > 0 && (
                              <div>
                                <span className="text-[9px] uppercase font-black text-muted-foreground block">NADPH Consumed</span>
                                <span className="text-xs font-bold text-red-400">-{energyData.nadphConsumed}</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="bg-muted/40 border-t border-border px-6 py-4 flex items-center justify-between">
                    <Link 
                      href={`/quiz?slug=${p.slug}`}
                      className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center space-x-1"
                    >
                      <Award className="h-3.5 w-3.5 text-accent mr-1" />
                      <span>Take Practice Quiz</span>
                    </Link>
                    
                    <Link
                      href={`/pathways/${p.slug}`}
                      className="bg-primary text-primary-foreground group-hover:bg-primary-hover py-1.5 px-3.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition shadow-sm"
                    >
                      <span>Visualize Map</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <section className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto">
            <Activity className="h-10 w-10 mx-auto text-muted-foreground mb-3 animate-pulse" />
            <h3 className="text-md font-bold">No pathways matched</h3>
            <p className="text-xs text-muted-foreground mt-1">Try refining search parameters or selecting a different tab.</p>
          </section>
        )}

      </main>
    </div>
  );
}
