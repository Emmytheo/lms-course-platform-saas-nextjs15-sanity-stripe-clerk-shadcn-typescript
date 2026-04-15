import React, { use } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, CheckCircle, Target, Zap } from 'lucide-react';

export default function ModuleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop" 
          alt="Hero" 
          className="w-full h-full object-cover opacity-50"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto">
          <Link href="/training" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            FUNDAMENTALS OF <span className="text-cyan-500">MOVEMENT</span>
          </h1>
          <div className="flex flex-wrap gap-4 text-lg text-gray-300">
            <span className="flex items-center gap-2"><Target className="w-5 h-5 text-cyan-500" /> Precision Focus</span>
            <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> High Intensity</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Mission Briefing</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              In this module, you will learn the foundational stances that form the basis of all advanced combat techniques. 
              Proper alignment, weight distribution, and balance are critical. You will be graded on your ability to match the 
              master's form in real-time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Objectives</h2>
            <ul className="space-y-3">
              {[
                "Master the Neutral Stance",
                "Execute a perfect Forward Lunge",
                "Maintain balance during transition",
                "Achieve >90% alignment score"
              ].map((obj, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                  <CheckCircle className="w-5 h-5 text-cyan-500" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-zinc-900/80 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl space-y-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
            <div className="text-center">
              <span className="text-sm text-gray-400 uppercase tracking-widest">Current Status</span>
              <div className="text-3xl font-bold text-white mt-1">NOT STARTED</div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Difficulty</span>
                <span className="text-cyan-400 font-bold">Beginner</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Est. Time</span>
                <span className="text-white">45 Minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">XP Reward</span>
                <span className="text-yellow-500 font-bold">500 XP</span>
              </div>
            </div>

            <Link href="/live-session" className="block">
              <Button size="lg" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xl py-8 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                <PlayCircle className="w-6 h-6 mr-2" /> ENTER DOJO
              </Button>
            </Link>
            
            <p className="text-xs text-center text-gray-500">
              Webcam required for live grading.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
