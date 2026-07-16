"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Pathway, ReactionNode } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Activity, ShieldAlert, Sparkles, Droplet, Stethoscope, Pill, BookOpen, FlaskConical, Wind } from "lucide-react";

interface PathwayViewerProps {
  pathway: Pathway;
  onStepComplete?: (stepNumber: number) => void;
}

export default function PathwayViewer({ pathway }: PathwayViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedReaction, setSelectedReaction] = useState<ReactionNode | null>(null);
  
  // Hover Tooltip State
  const [hoveredReaction, setHoveredReaction] = useState<ReactionNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= pathway.reactions.length) return 1;
          return prev + 1;
        });
      }, 3000); // 3s per step for better readability
    }
    return () => clearInterval(interval);
  }, [isPlaying, pathway.reactions.length]);

  const togglePlay = () => {
    if (currentStep === 0) setCurrentStep(1);
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSelectedReaction(null);
  };

  const handleNodeClick = (rxn: ReactionNode) => {
    setIsPlaying(false);
    setCurrentStep(rxn.step);
    setSelectedReaction(rxn);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredReaction) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const viewBox = useMemo(() => {
    if (!pathway.reactions || pathway.reactions.length === 0) return "0 0 1000 800";
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pathway.reactions.forEach(r => {
      if (r.x < minX) minX = r.x;
      if (r.x > maxX) maxX = r.x;
      if (r.y < minY) minY = r.y;
      if (r.y > maxY) maxY = r.y;
    });
    const width = Math.max(maxX - minX, 400);
    const height = Math.max(maxY - minY, 400);
    return `${minX - 300} ${minY - 250} ${width + 600} ${height + 500}`;
  }, [pathway]);

  // Color Mapping Engine based on Phase 1 specs
  const getSubstrateColor = (step: number, isFinal: boolean) => {
    if (step === 1) return "#22c55e"; // Start = Bright Green
    if (isFinal) return "#166534"; // Final Product = Dark Green
    return "#3b82f6"; // Metabolites = Bright Blue
  };
  const getEnzymeColor = (isRateLimiting?: boolean) => isRateLimiting ? "#ef4444" : "#a855f7"; 

  const renderConnections = () => {
    return pathway.reactions.map((rxn, idx) => {
      if (idx === pathway.reactions.length - 1) return null;
      const nextRxn = pathway.reactions[idx + 1];
      
      const isCurrentActive = currentStep === rxn.step || currentStep === 0;
      const isPast = currentStep > rxn.step;
      
      const startX = rxn.x;
      const startY = rxn.y + 60; 
      const endX = nextRxn.x;
      const endY = nextRxn.y - 120; 
      
      const cy1 = startY + (endY - startY) / 2;
      const cy2 = endY - (endY - startY) / 2;
      const d = `M ${startX} ${startY} C ${startX} ${cy1}, ${endX} ${cy2}, ${endX} ${endY}`;

      return (
        <g key={`edge-${rxn.step}`}>
          <path
            d={d}
            fill="none"
            stroke="#1e293b" 
            strokeWidth={4}
            className="transition-all duration-500"
          />
          <path
            d={d}
            fill="none"
            stroke={isCurrentActive || isPast ? "#38bdf8" : "transparent"} 
            strokeWidth={5}
            strokeDasharray="15, 15"
            className={isCurrentActive || isPast ? "flow-animation filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" : ""}
          />
        </g>
      );
    });
  };

  return (
    <div 
      className="relative w-full h-[65vh] md:h-[750px] bg-[#020617] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans flex text-slate-100"
      onMouseMove={handleMouseMove}
    >
      <style>{`
        .flow-animation { animation: flow 1.2s linear infinite; }
        @keyframes flow { to { stroke-dashoffset: -30; } }
        .glow-active { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)); }
        .dimmed { opacity: 0.15; filter: grayscale(95%) blur(1px); }
        .medical-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes subtle-pulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(239,68,68,0.5)); }
          50% { transform: scale(1.03); filter: drop-shadow(0 0 15px rgba(239,68,68,0.9)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(239,68,68,0.5)); }
        }
        .rate-limiting-pulse { animation: subtle-pulse 1.5s infinite ease-in-out; }
        
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float-badge 3s ease-in-out infinite; }
      `}</style>

      <div className="flex-grow h-full relative medical-grid">
        <motion.div 
          drag
          dragMomentum={false}
          className="absolute z-50 bottom-8 left-4 sm:bottom-auto sm:top-6 sm:left-6 flex space-x-3 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-700 shadow-2xl cursor-grab active:cursor-grabbing"
        >
          <button
            onClick={togglePlay}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/30"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? "Pause Flow" : currentStep === 0 ? "Start Animation" : "Resume Flow"}</span>
          </button>
          
          <button
            onClick={resetAnimation}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </motion.div>

        <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          {renderConnections()}
          
          {pathway.reactions.map((rxn) => {
            const isActive = currentStep === rxn.step;
            const isDimmed = currentStep !== 0 && !isActive;
            const isFinalStep = rxn.step === pathway.reactions.length;
            
            const substrateColor = getSubstrateColor(rxn.step, false);
            const productColor = getSubstrateColor(rxn.step + 1, isFinalStep);
            const enzymeColor = getEnzymeColor(rxn.isRateLimiting);
            
            // Derive Badges from text or strict properties
            const str = rxn.energyChange?.toLowerCase() || "";
            const producesATP = str.includes("atp") && !str.includes("consumes") && !str.includes("-> adp");
            const consumesATP = str.includes("consumes") || str.includes("atp -> adp");
            const producesNADH = rxn.nadhProduced || str.includes("nadh");
            const producesFADH2 = rxn.fadh2Produced || str.includes("fadh2");
            const producesWater = rxn.waterProduced || str.includes("h2o") || str.includes("water");
            const producesCO2 = rxn.co2Produced || str.includes("co2") || str.includes("carbon dioxide");

            return (
              <g 
                key={`node-${rxn.step}`}
                transform={`translate(${rxn.x}, ${rxn.y})`}
                className={`cursor-pointer transition-all duration-700 ${isActive ? 'glow-active scale-[1.12]' : ''} ${isDimmed ? 'dimmed' : ''}`}
                onClick={() => handleNodeClick(rxn)}
                onMouseEnter={(e) => { setHoveredReaction(rxn); setMousePos({ x: e.clientX, y: e.clientY }); }}
                onMouseLeave={() => setHoveredReaction(null)}
                style={{ transformOrigin: `${rxn.x}px ${rxn.y}px` }}
              >
                {/* SUBSTRATE NODE */}
                <g transform="translate(0, -95)">
                  <rect x="-100" y="-20" width="200" height="40" rx="20" fill={`${substrateColor}15`} stroke={substrateColor} strokeWidth="2.5" className="transition-all duration-300 hover:fill-opacity-30" />
                  <text x="0" y="5" textAnchor="middle" fill="#f8fafc" className="text-[15px] font-bold" style={{ pointerEvents: 'none' }}>
                    {rxn.substrate.length > 24 ? rxn.substrate.substring(0, 22) + "..." : rxn.substrate}
                  </text>
                </g>

                {/* ENZYME NODE */}
                <circle cx="0" cy="0" r="50" fill={`${enzymeColor}15`} stroke={enzymeColor} strokeWidth="4" className="transition-all duration-300 hover:fill-opacity-30" />
                {rxn.isRateLimiting && (
                  <circle cx="0" cy="0" r="60" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 6" className="rate-limiting-pulse" />
                )}
                
                {/* Step Badge */}
                <circle cx="-45" cy="-45" r="18" fill="#0f172a" stroke={enzymeColor} strokeWidth="2" />
                <text x="-45" y="-39" textAnchor="middle" fill="#f8fafc" className="text-[18px] font-black">{rxn.step}</text>

                <text x="0" y="5" textAnchor="middle" fill={enzymeColor} className="text-[13px] font-black uppercase tracking-widest" style={{ pointerEvents: 'none' }}>
                  {rxn.enzyme.length > 15 ? rxn.enzyme.substring(0, 13) + "..." : rxn.enzyme}
                </text>

                {/* FLOATING REWARD BADGES */}
                <g className="animate-float">
                  {consumesATP && (
                    <g transform="translate(-105, -20)">
                      <rect x="-35" y="-16" width="70" height="32" rx="16" fill="#f9731620" stroke="#f97316" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#f97316" className="text-[12px] font-black">- ATP</text>
                    </g>
                  )}
                  {producesATP && (
                    <g transform="translate(105, -20)">
                      <rect x="-35" y="-16" width="70" height="32" rx="16" fill="#facc1520" stroke="#facc15" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#facc15" className="text-[12px] font-black">+ ATP</text>
                    </g>
                  )}
                  {producesNADH && (
                    <g transform="translate(105, 20)">
                      <rect x="-40" y="-16" width="80" height="32" rx="16" fill="#10b98120" stroke="#10b981" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#10b981" className="text-[12px] font-black">+ NADH</text>
                    </g>
                  )}
                  {producesFADH2 && (
                    <g transform="translate(105, 20)">
                      <rect x="-40" y="-16" width="80" height="32" rx="16" fill="#06b6d420" stroke="#06b6d4" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#06b6d4" className="text-[12px] font-black">+ FADH₂</text>
                    </g>
                  )}
                  {producesWater && (
                    <g transform="translate(105, 60)">
                      <rect x="-30" y="-16" width="60" height="32" rx="16" fill="#94a3b820" stroke="#94a3b8" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#94a3b8" className="text-[12px] font-black">+ H₂O</text>
                    </g>
                  )}
                  {producesCO2 && (
                    <g transform="translate(-105, 60)">
                      <rect x="-35" y="-16" width="70" height="32" rx="16" fill="#a1620720" stroke="#a16207" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#eab308" className="text-[12px] font-black">+ CO₂</text>
                    </g>
                  )}
                </g>

                {/* PRODUCT NODE (Rendered physically if it's the final step) */}
                {isFinalStep && (
                  <g transform="translate(0, 110)">
                    <rect x="-100" y="-20" width="200" height="40" rx="20" fill={`${productColor}20`} stroke={productColor} strokeWidth="3" className="filter drop-shadow-[0_0_10px_rgba(22,101,52,0.8)]" />
                    <text x="0" y="6" textAnchor="middle" fill="#f8fafc" className="text-[16px] font-black uppercase tracking-widest" style={{ pointerEvents: 'none' }}>
                      {rxn.product}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* HOVER TOOLTIP */}
        <AnimatePresence>
          {hoveredReaction && !selectedReaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed pointer-events-none z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl w-64"
              style={{ 
                left: mousePos.x + 20, 
                top: mousePos.y + 20,
                // Prevent falling off right edge
                transform: mousePos.x > window.innerWidth - 300 ? "translateX(-110%)" : "none"
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">Step {hoveredReaction.step}</span>
                {hoveredReaction.isRateLimiting && <span className="text-[10px] font-black text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded animate-pulse">Rate Limit</span>}
              </div>
              <h4 className="text-sm font-bold text-white mb-1 leading-tight">{hoveredReaction.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{hoveredReaction.description}</p>
              <div className="mt-2 pt-2 border-t border-slate-700/50 flex flex-col space-y-1 text-[10px] text-slate-300 font-medium">
                <div className="flex justify-between"><span>Substrate:</span><span className="text-white">{hoveredReaction.substrate}</span></div>
                <div className="flex justify-between"><span>Enzyme:</span><span className="text-purple-400">{hoveredReaction.enzyme}</span></div>
                <div className="flex justify-between"><span>Product:</span><span className="text-blue-400">{hoveredReaction.product}</span></div>
              </div>
              <div className="mt-2 text-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">Click for Full Details</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FULL INFORMATION SIDE PANEL */}
      <AnimatePresence>
        {selectedReaction && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 md:w-[420px] h-full bg-[#020617]/95 backdrop-blur-3xl border-l border-slate-700/50 p-6 overflow-y-auto z-40 shadow-2xl absolute right-0 top-0 bottom-0"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/15 px-3 py-1.5 rounded-full border border-primary/30">
                Reaction {selectedReaction.step}
              </span>
              <button 
                onClick={() => setSelectedReaction(null)}
                className="text-slate-400 hover:text-white transition text-xs font-bold bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg"
              >
                Close Panel
              </button>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-4">
              {selectedReaction.title}
            </h2>

            {/* Reaction Flow Graphic */}
            <div className="flex flex-col space-y-2 text-sm text-slate-300 bg-slate-900 p-5 rounded-2xl border border-slate-800 mb-6 shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">From</span>
              </div>
              <span className="font-bold text-base text-white pl-6 pb-3 border-b border-slate-800">{selectedReaction.substrate}</span>
              
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">To</span>
              </div>
              <span className="font-bold text-base text-white pl-6">{selectedReaction.product}</span>
            </div>

            <div className="space-y-4 pb-10">
              
              {/* ENZYME & COFACTORS */}
              <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-2xl space-y-3">
                <h3 className="text-sm font-black uppercase text-purple-400 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Catalytic Enzyme
                </h3>
                <p className="text-lg font-black text-white">{selectedReaction.enzyme}</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedReaction.description}
                </p>
                {selectedReaction.isRateLimiting && (
                  <div className="mt-3 inline-block bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black uppercase px-4 py-2 rounded-xl animate-pulse">
                    ⚠️ Rate-Limiting Step
                  </div>
                )}
                {selectedReaction.cofactors && selectedReaction.cofactors.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-purple-500/20">
                    <span className="text-xs font-bold text-purple-300 uppercase block mb-1.5">Required Cofactors</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedReaction.cofactors.map(c => (
                        <span key={c} className="text-xs font-bold bg-purple-900/50 text-purple-200 px-2 py-1 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ENERGY YIELD */}
              {selectedReaction.energyChange && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-2xl space-y-2">
                  <h3 className="text-sm font-black uppercase text-yellow-500 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Energy Balance
                  </h3>
                  <p className="text-sm font-black text-yellow-400">{selectedReaction.energyChange}</p>
                </div>
              )}

              {/* HIGH YIELD EXAM POINTS */}
              {selectedReaction.highYield && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-2">
                  <h3 className="text-sm font-black uppercase text-amber-500 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    High-Yield Exam Point
                  </h3>
                  <p className="text-sm text-amber-200/90 font-medium leading-relaxed">{selectedReaction.highYield}</p>
                </div>
              )}

              {/* CLINICAL SIGNIFICANCE */}
              <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl space-y-5">
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase text-cyan-400 flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Clinical Significance
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Mutations or deficiencies in <span className="font-bold text-white">{selectedReaction.enzyme}</span> lead to metabolic blockades, accumulating <span className="font-bold text-white">{selectedReaction.substrate}</span>.
                  </p>
                  {selectedReaction.diseases && selectedReaction.diseases.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {selectedReaction.diseases.map(d => (
                        <span key={d} className="text-xs font-bold bg-cyan-900/40 border border-cyan-800 text-cyan-200 px-2 py-1 rounded">{d}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="h-px bg-slate-700 w-full" />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase text-emerald-400 flex items-center">
                    <Pill className="w-4 h-4 mr-2" />
                    Pharmacology
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedReaction.isRateLimiting ? "As a rate-limiting enzyme, this is a prime target for pharmacological inhibitors to downregulate the entire pathway." : "Typically targeted by specific allosteric modulators."}
                  </p>
                  {selectedReaction.drugs && selectedReaction.drugs.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {selectedReaction.drugs.map(d => (
                        <span key={d} className="text-xs font-bold bg-emerald-900/40 border border-emerald-800 text-emerald-200 px-2 py-1 rounded">{d}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
