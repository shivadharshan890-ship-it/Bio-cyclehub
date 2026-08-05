"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Pathway, ReactionNode } from "@/lib/db";
import { validatePathway } from "@/lib/validation";
import { pathwayEnergy } from "@/lib/pathwayData";
import { 
  Play, Pause, RotateCcw, ShieldAlert, CheckCircle, MapPin, Eye, EyeOff, Network
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
  Edge,
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

// -------------------------------------------------------------
// 1. HELPERS & STYLES
// -------------------------------------------------------------

const getPubChemName = (name: string) => {
  if (!name) return "";
  // Split by '+' and take the first part
  let clean = name.split('+')[0].trim();
  // Remove leading stoichiometric numbers and spaces (e.g., "2 Pyruvate" -> "Pyruvate")
  clean = clean.replace(/^[0-9]+\s+/, '');
  
  // Remove anything in parentheses (e.g. "Phosphoenolpyruvate (PEP)" -> "Phosphoenolpyruvate")
  clean = clean.replace(/\s*\([^)]*\)/g, '').trim();
  
  // Replace terminal -P with -Phosphate (e.g. "Glucose-1-P" -> "Glucose-1-Phosphate")
  clean = clean.replace(/-P$/, '-Phosphate');
  
  // Some edge cases for common biochemistry terms that PubChem might not like directly
  const lower = clean.toLowerCase();
  if (lower.includes('limit dextrin') || lower.includes('dna') || lower.includes('rna') || lower.includes('primer') || lower.includes('amino acids') || lower.includes('glycogen')) {
    return '';
  }
  return clean;
};

const getCarbonCount = (molecule: string) => {
  const mol = molecule.toLowerCase();
  if (mol.includes('glucose') || mol.includes('fructose') || mol.includes('citrate') || mol.includes('isocitrate')) return '6C';
  if (mol.includes('ketoglutarate')) return '5C';
  if (mol.includes('succinate') || mol.includes('fumarate') || mol.includes('malate') || mol.includes('oxaloacetate')) return '4C';
  if (mol.includes('pyruvate') || mol.includes('glyceraldehyde') || mol.includes('dhap') || mol.includes('phosphoglycerate') || mol.includes('enol')) return '3C';
  if (mol.includes('acetyl')) return '2C';
  return '';
};

const getMoleculeStyle = (mol: string) => {
  switch (mol) {
    case 'ATP': return { bg: '#facc1520', border: '#facc15', text: '#facc15', shadow: 'shadow-[0_0_8px_rgba(250,204,21,0.8)]' };
    case 'ADP': return { bg: '#ca8a0420', border: '#ca8a04', text: '#ca8a04', shadow: '' };
    case 'NADH': return { bg: '#22c55e20', border: '#22c55e', text: '#22c55e', shadow: 'shadow-[0_0_8px_rgba(34,197,94,0.8)]' };
    case 'NAD_plus': return { bg: '#16a34a20', border: '#16a34a', text: '#16a34a', shadow: '' };
    case 'NADPH': return { bg: '#84cc1620', border: '#84cc16', text: '#84cc16', shadow: 'shadow-[0_0_8px_rgba(132,204,22,0.8)]' };
    case 'NADP_plus': return { bg: '#65a30d20', border: '#65a30d', text: '#65a30d', shadow: '' };
    case 'FADH2': return { bg: '#f9731620', border: '#f97316', text: '#f97316', shadow: 'shadow-[0_0_8px_rgba(249,115,22,0.8)]' };
    case 'FAD': return { bg: '#c2410c20', border: '#c2410c', text: '#c2410c', shadow: '' };
    case 'GTP': return { bg: '#06b6d420', border: '#06b6d4', text: '#06b6d4', shadow: 'shadow-[0_0_8px_rgba(6,182,212,0.8)]' };
    case 'GDP': return { bg: '#0891b220', border: '#0891b2', text: '#0891b2', shadow: '' };
    case 'CO2': return { bg: '#ef444420', border: '#ef4444', text: '#ef4444', shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.8)]' };
    case 'CoA':
    case 'Acetyl_CoA': return { bg: '#a855f720', border: '#a855f7', text: '#a855f7', shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.8)]' };
    case 'H2O': return { bg: '#3b82f620', border: '#3b82f6', text: '#3b82f6', shadow: 'shadow-[0_0_8px_rgba(59,130,246,0.8)]' };
    case 'O2': return { bg: '#7dd3fc20', border: '#7dd3fc', text: '#7dd3fc', shadow: '' };
    default: return { bg: '#cbd5e120', border: '#cbd5e1', text: '#cbd5e1', shadow: '' };
  }
};

const getSubstrateColor = (step: number, isFinal: boolean) => {
  if (step === 1) return { bg: "#22c55e15", border: "#22c55e" };
  if (isFinal) return { bg: "#16653420", border: "#166534", shadow: 'drop-shadow-[0_0_15px_rgba(22,101,52,0.8)]' };
  return { bg: "#3b82f615", border: "#3b82f6" };
};

const getEnzymeColor = (isRateLimiting?: boolean) => isRateLimiting ? { bg: "#ef444415", border: "#ef4444" } : { bg: "#a855f715", border: "#a855f7" };

// -------------------------------------------------------------
// 2. CUSTOM NODE
// -------------------------------------------------------------

function BiochemicalNodeComponent({ data }: { data: any }) {
  const rxn: ReactionNode = data.reaction;
  const isFinal = data.isFinal;
  const isActive = data.isActive;
  const showStructures = data.showStructures;
  
  const subStyle = getSubstrateColor(rxn.step, false);
  const enzStyle = getEnzymeColor(rxn.isRateLimiting);
  const finalSubStyle = getSubstrateColor(rxn.step + 1, true);

  const consumes = rxn.molecules?.consumes ? Object.entries(rxn.molecules.consumes) : [];
  const produces = rxn.molecules?.produces ? Object.entries(rxn.molecules.produces) : [];

  return (
    <div className={`relative flex flex-col items-center w-[300px] font-sans transition-all duration-500 ${isActive ? 'scale-105' : 'opacity-90'}`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      {/* 1. Substrate */}
      <div className="flex flex-col items-center mb-6">
        <div 
          className="px-6 py-3 rounded-xl border-2 text-center shadow-lg transition-all flex flex-col items-center"
          style={{ backgroundColor: subStyle.bg, borderColor: subStyle.border, boxShadow: isActive ? `0 0 15px ${subStyle.border}80` : '' }}
        >
          {showStructures && getPubChemName(rxn.substrate) && (
            <div className="w-24 h-24 mb-2 bg-white rounded-md overflow-hidden flex items-center justify-center p-1 opacity-90 dark:invert transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[3] active:scale-[3] hover:z-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] cursor-pointer origin-center">
              <img 
                src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(getPubChemName(rxn.substrate))}/PNG`} 
                alt={rxn.substrate} 
                className="max-w-full max-h-full object-contain pointer-events-none"
                draggable={false}
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                  if (e.currentTarget.parentElement) e.currentTarget.parentElement.style.display = 'none';
                }}
              />
            </div>
          )}
          <span className="text-white font-bold text-sm block">{rxn.substrate}</span>
          {getCarbonCount(rxn.substrate) && (
            <span className="text-slate-400 font-black tracking-widest text-[10px] mt-1 block">{getCarbonCount(rxn.substrate)}</span>
          )}
        </div>
      </div>

      {/* 2. Enzyme Section */}
      <div className="relative flex items-center justify-center w-full my-2">
        {/* Consume Badges (Left) */}
        <div className="absolute left-0 flex flex-col space-y-2 translate-x-[-10px]">
          {consumes.map(([mol, count]) => {
            const st = getMoleculeStyle(mol);
            const label = mol.replace('_plus', '+').replace('_', '-');
            return (
              <div key={mol} className={`px-3 py-1 rounded-full border-2 text-[10px] font-black uppercase whitespace-nowrap ${st.shadow}`} style={{ backgroundColor: st.bg, borderColor: st.border, color: st.text }}>
                - {label} {count && count > 1 ? `×${count}` : ''}
              </div>
            );
          })}
        </div>

        {/* Central Enzyme Circle */}
        <div 
          className={`relative w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center z-10 bg-[#020617] ${rxn.isRateLimiting ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: enzStyle.bg, borderColor: enzStyle.border, boxShadow: isActive ? `0 0 20px ${enzStyle.border}90` : '' }}
        >
          {rxn.isRateLimiting && (
            <div className="absolute inset-0 rounded-full border-2 border-red-500 border-dashed animate-[spin_4s_linear_infinite] scale-110 opacity-70"></div>
          )}
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-900 border-2 flex items-center justify-center" style={{ borderColor: enzStyle.border }}>
            <span className="text-white font-black text-xs">{rxn.step}</span>
          </div>
          <span className="text-center font-black uppercase tracking-widest text-[10px] px-2" style={{ color: enzStyle.border }}>
            {rxn.enzyme.length > 15 ? rxn.enzyme.substring(0, 13) + "..." : rxn.enzyme}
          </span>
        </div>

        {/* Produce Badges (Right) */}
        <div className="absolute right-0 flex flex-col space-y-2 translate-x-[10px]">
          {produces.map(([mol, count]) => {
            const st = getMoleculeStyle(mol);
            const label = mol.replace('_plus', '+').replace('_', '-');
            return (
              <div key={mol} className={`px-3 py-1 rounded-full border-2 text-[10px] font-black uppercase whitespace-nowrap ${st.shadow}`} style={{ backgroundColor: st.bg, borderColor: st.border, color: st.text }}>
                + {label} {count && count > 1 ? `×${count}` : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Final Product (Only if it's the last step) */}
      {isFinal && (
        <div className="flex flex-col items-center mt-6">
          <div 
            className={`px-6 py-3 rounded-xl border-[3px] text-center ${finalSubStyle.shadow} transition-all flex flex-col items-center`}
            style={{ backgroundColor: finalSubStyle.bg, borderColor: finalSubStyle.border }}
          >
            {showStructures && getPubChemName(rxn.product) && (
              <div className="w-24 h-24 mb-2 bg-white rounded-md overflow-hidden flex items-center justify-center p-1 opacity-90 dark:invert transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[3] active:scale-[3] hover:z-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] cursor-pointer origin-center">
                <img 
                  src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(getPubChemName(rxn.product))}/PNG`} 
                  alt={rxn.product} 
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  draggable={false}
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none'; 
                    if (e.currentTarget.parentElement) e.currentTarget.parentElement.style.display = 'none';
                  }}
                />
              </div>
            )}
            <span className="text-white font-black text-sm uppercase tracking-widest block">{rxn.product}</span>
            {getCarbonCount(rxn.product) && (
              <span className="text-slate-400 font-black tracking-widest text-[10px] mt-1 block">{getCarbonCount(rxn.product)}</span>
            )}
          </div>
          <Handle type="source" position={Position.Bottom} className="opacity-0" id="final-source" />
        </div>
      )}

      {/* Main outgoing handle */}
      <Handle type="source" position={Position.Bottom} className="opacity-0" id="main-source" />
    </div>
  );
}

const nodeTypes = {
  biochemical: BiochemicalNodeComponent
};

// -------------------------------------------------------------
// 3. LAYOUT ENGINES
// -------------------------------------------------------------

const getLayoutedElements = (reactions: ReactionNode[], isCycle: boolean, currentStep: number, showStructures: boolean) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Create raw nodes and edges
  reactions.forEach((r, idx) => {
    const isFinal = idx === reactions.length - 1;
    const isActive = currentStep === 0 || currentStep === r.step;
    
    nodes.push({
      id: r.step.toString(),
      type: 'biochemical',
      position: { x: 0, y: 0 },
      data: { reaction: r, isFinal, isActive, showStructures }
    });

    if (idx < reactions.length - 1) {
      edges.push({
        id: `e${r.step}-${reactions[idx + 1].step}`,
        source: r.step.toString(),
        target: reactions[idx + 1].step.toString(),
        sourceHandle: 'main-source',
        type: isCycle ? 'bezier' : 'smoothstep',
        animated: isActive || currentStep > r.step,
        style: { stroke: (isActive || currentStep > r.step) ? '#06b6d4' : '#475569', strokeWidth: (isActive || currentStep > r.step) ? 6 : 4 },
        markerEnd: { type: MarkerType.ArrowClosed, color: (isActive || currentStep > r.step) ? '#06b6d4' : '#475569' }
      });
    }
  });

  // Cyclic connection
  if (isCycle && reactions.length > 0) {
    edges.push({
      id: `e${reactions[reactions.length - 1].step}-1`,
      source: reactions[reactions.length - 1].step.toString(),
      target: reactions[0].step.toString(),
      sourceHandle: 'final-source',
      type: 'bezier',
      animated: currentStep === 0 || currentStep === reactions.length,
      style: { stroke: (currentStep === 0 || currentStep === reactions.length) ? '#06b6d4' : '#475569', strokeWidth: (currentStep === 0 || currentStep === reactions.length) ? 6 : 4 },
      markerEnd: { type: MarkerType.ArrowClosed, color: (currentStep === 0 || currentStep === reactions.length) ? '#06b6d4' : '#475569' }
    });
  }

  // 2. Apply Layout
  if (isCycle) {
    // CIRCULAR LAYOUT (Mathematical)
    const radius = reactions.length * 80; // Scale radius based on steps
    const center = { x: 0, y: 0 };
    
    nodes.forEach((n, idx) => {
      // Start at top (90 degrees, or -PI/2 in radians) and go clockwise
      const angle = (idx / reactions.length) * 2 * Math.PI - Math.PI / 2;
      n.position = {
        x: center.x + Math.cos(angle) * radius - 150, // -150 to center the 300px wide node
        y: center.y + Math.sin(angle) * radius - 100
      };
      
      // Customize handles based on quadrant for cleaner curved lines
      if (idx === reactions.length - 1) {
        // Last node connects back to first node
        n.targetPosition = Position.Right;
        n.sourcePosition = Position.Left;
      }
    });
  } else {
    // LINEAR LAYOUT (Dagre)
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 200 }); // Top to Bottom

    nodes.forEach(node => {
      dagreGraph.setNode(node.id, { width: 300, height: 250 });
    });
    edges.forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach(node => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = Position.Top;
      node.sourcePosition = Position.Bottom;
      node.position = {
        x: nodeWithPosition.x - 150, // center
        y: nodeWithPosition.y - 125
      };
    });
  }

  return { layoutedNodes: nodes, layoutedEdges: edges };
};

// -------------------------------------------------------------
// 4. MAIN COMPONENT
// -------------------------------------------------------------

interface PathwayViewerProps {
  pathway: Pathway;
  onStepComplete?: (stepNumber: number) => void;
}

export default function PathwayViewer({ pathway }: PathwayViewerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); 
  const [showStructures, setShowStructures] = useState(true); 
  const [viewMode, setViewMode] = useState<'flow' | 'mindmap'>('flow');

  const isCycle = false;
  const isPathwayVerified = useMemo(() => validatePathway(pathway), [pathway]);

  // Layout state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const layoutKeyRef = React.useRef('');

  // Setup/Update Layout whenever step or pathway changes
  useEffect(() => {
    if (!pathway.reactions || pathway.reactions.length === 0) return;
    
    const layoutKey = `${pathway.slug}-${isCycle}-${showStructures}`;
    const { layoutedNodes, layoutedEdges } = getLayoutedElements(pathway.reactions, isCycle, currentStep, showStructures);
    
    setNodes((currentNodes) => {
      if (layoutKeyRef.current === layoutKey && currentNodes.length === layoutedNodes.length) {
        return currentNodes.map((n, i) => ({
          ...n,
          data: layoutedNodes[i].data
        }));
      }
      layoutKeyRef.current = layoutKey;
      return layoutedNodes;
    });
    setEdges(layoutedEdges);
  }, [pathway, isCycle, currentStep, showStructures, setNodes, setEdges]);

  const mindMapNodes = useMemo<Node[]>(() => {
    if (!pathway.mindMapUrl) return [];
    return [{
      id: 'mindmap-node',
      position: { x: 0, y: 0 },
      data: { 
        label: (
          <img 
            src={pathway.mindMapUrl} 
            alt={`${pathway.title} Mind Map`} 
            className="w-[80vw] md:w-[800px] lg:w-[1000px] h-auto rounded-2xl shadow-2xl border-4 border-slate-700 pointer-events-none" 
            draggable={false} 
          />
        ) 
      },
      type: 'default',
      style: { background: 'transparent', border: 'none', padding: 0, width: 'auto', display: 'flex', justifyContent: 'center' }
    }];
  }, [pathway.mindMapUrl, pathway.title]);

  // Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= pathway.reactions.length) return 1;
          return prev + 1;
        });
      }, 3000); 
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
  };

  return (
    <div className="relative w-full h-[65vh] md:h-[750px] bg-[#020617] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans flex text-slate-100">
      
      {/* UI Overlay */}
      <motion.div 
        drag
        dragMomentum={false}
        className="absolute z-50 bottom-8 left-4 sm:bottom-auto sm:top-6 sm:left-6 flex flex-col space-y-3 bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-700 shadow-2xl cursor-grab active:cursor-grabbing"
      >
        <button
          onClick={togglePlay}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/30 w-full"
        >
          {isPlaying ? <Pause className="h-4 w-4 shrink-0" /> : <Play className="h-4 w-4 shrink-0" />}
          <span>{isPlaying ? "Pause Flow" : currentStep === 0 ? "Start Animation" : "Resume Flow"}</span>
        </button>
        
        <button
          onClick={resetAnimation}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all w-full"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4 shrink-0" />
          <span>Reset Flow</span>
        </button>

        <button
          onClick={() => setViewMode(viewMode === 'flow' ? 'mindmap' : 'flow')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all w-full ${viewMode === 'mindmap' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
          title="Toggle Mindmap View"
        >
          <Network className="h-4 w-4 shrink-0" />
          <span>Mindmap</span>
        </button>

        <button
          onClick={() => setShowStructures(!showStructures)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all w-full ${showStructures ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
          title="Toggle 2D Chemical Structures"
        >
          {showStructures ? <EyeOff className="h-4 w-4 shrink-0" /> : <Eye className="h-4 w-4 shrink-0" />}
          <span>{showStructures ? "Hide Structures" : "Show Structures"}</span>
        </button>
        
        {isPathwayVerified && (
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.3)] pointer-events-none w-full">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>Verified Graph</span>
          </div>
        )}
      </motion.div>

      {/* Canvas */}
      {viewMode === 'mindmap' ? (
        pathway.mindMapUrl ? (
          <ReactFlow
            nodes={mindMapNodes}
            edges={[]}
            fitView
            fitViewOptions={{ padding: 0.1, maxZoom: 1.5 }}
            minZoom={0.1}
            maxZoom={4}
            className="bg-[#020617]"
            nodesDraggable={true}
            panOnDrag={true}
          >
            <Background variant={BackgroundVariant.Dots} gap={30} size={2} color="#1e293b" />
            <Controls className="bg-slate-800 border-slate-700 fill-white" />
          </ReactFlow>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#020617]">
            <div className="text-slate-400 text-lg flex flex-col items-center">
              <Network className="h-16 w-16 mb-4 opacity-20" />
              <p className="font-semibold tracking-wide">Mind map not available</p>
            </div>
          </div>
        )
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          className="bg-[#020617]"
        >
          <Background variant={BackgroundVariant.Dots} gap={30} size={2} color="#1e293b" />
          <Controls className="bg-slate-800 border-slate-700 fill-white" />
        </ReactFlow>
      )}

    </div>
  );
}
