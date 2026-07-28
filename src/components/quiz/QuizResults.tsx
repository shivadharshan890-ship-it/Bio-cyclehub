"use client";

import React from "react";
import { QuizAttempt } from "@/firebase/quizService";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, Zap, Download, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetry: () => void;
}

export default function QuizResults({ attempt, onRetry }: QuizResultsProps) {
  const router = useRouter();

  const handleDownloadPDF = async () => {
    const element = document.getElementById("quiz-results-container");
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BioCycle_Quiz_Result_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error("Failed to generate PDF", e);
    }
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return "text-green-500";
    if (acc >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  // Group by topic
  const topicStats: Record<string, { correct: number, total: number }> = {};
  attempt.questionsAttempted.forEach(q => {
    if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
    topicStats[q.topic].total += 1;
    if (q.isCorrect) topicStats[q.topic].correct += 1;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      <div id="quiz-results-container" className="bg-card border border-border p-8 rounded-3xl shadow-xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Quiz Complete!</h1>
          <p className="text-muted-foreground font-medium">Here is your performance breakdown.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          
          <div className="bg-background border border-border p-4 rounded-2xl text-center space-y-1">
            <Target className="w-5 h-5 mx-auto text-sky-500 mb-2" />
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Score</div>
            <div className="text-2xl font-black text-foreground">{attempt.score} / {attempt.totalQuestions}</div>
          </div>
          
          <div className="bg-background border border-border p-4 rounded-2xl text-center space-y-1">
            <Activity className="w-5 h-5 mx-auto text-emerald-500 mb-2" />
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Accuracy</div>
            <div className={`text-2xl font-black ${getAccuracyColor(attempt.accuracy)}`}>
              {attempt.accuracy.toFixed(1)}%
            </div>
          </div>

          <div className="bg-background border border-border p-4 rounded-2xl text-center space-y-1">
            <Zap className="w-5 h-5 mx-auto text-yellow-500 mb-2" />
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">XP Earned</div>
            <div className="text-2xl font-black text-yellow-500">+{attempt.xpEarned}</div>
          </div>

          <div className="bg-background border border-border p-4 rounded-2xl text-center space-y-1">
            <Clock className="w-5 h-5 mx-auto text-purple-500 mb-2" />
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time</div>
            <div className="text-2xl font-black text-foreground">
              {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
            </div>
          </div>

        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-border pb-2">Topic Analysis</h3>
          <div className="space-y-3">
            {Object.entries(topicStats).map(([topic, stats]) => {
              const acc = (stats.correct / stats.total) * 100;
              return (
                <div key={topic} className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50">
                  <span className="font-semibold text-foreground capitalize">{topic.replace("-", " ")}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold text-muted-foreground">{stats.correct}/{stats.total}</span>
                    <span className={`w-14 text-right text-sm font-black ${getAccuracyColor(acc)}`}>{acc.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons (Not printed to PDF usually) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2 h-12 px-6">
          <RotateCcw className="w-4 h-4" /> Try Another
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2 h-12 px-6">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        <Button onClick={() => router.push("/quiz")} className="flex items-center gap-2 h-12 px-6">
          <Home className="w-4 h-4" /> Back to Lobby
        </Button>
      </div>

    </div>
  );
}

// Ensure Activity icon is imported (re-using zap's import place)
function Activity(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
