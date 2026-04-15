'use client';

import React, { useState } from 'react';
import VisionManager from './VisionManager';
import Scene from './visuals/Scene';
import { usePoseStore, PoseState } from '@/store/poseStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import PoseOverlay from './visuals/PoseOverlay';

import DojoLayout from './dojo/DojoLayout';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Activity, PlayCircle } from 'lucide-react';

const LiveSession = () => {
  const score = usePoseStore((state: PoseState) => state.score);
  const feedback = usePoseStore((state: PoseState) => state.feedback);
  const isSessionActive = usePoseStore((state: PoseState) => state.isSessionActive);
  const setSessionActive = usePoseStore((state: PoseState) => state.setSessionActive);

  const [view, setView] = useState<'live' | 'reference'>('live');

  return (
    <DojoLayout>
      <div className="relative w-full h-full overflow-hidden bg-black font-sans flex flex-col">
        {/* Vision Layer (Always Active for Tracking) */}
        <VisionManager />

        {/* View Controls */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-black/50 backdrop-blur-md border border-cyan-500/30 p-1 rounded-full flex gap-1">
            <Button
              variant={view === 'reference' ? 'default' : 'ghost'}
              size="sm"
              className={view === 'reference' ? 'bg-cyan-500 text-black hover:bg-cyan-400 rounded-full' : 'text-gray-400 hover:text-white rounded-full'}
              onClick={() => setView('reference')}
            >
              <Video className="w-4 h-4 mr-2" /> Reference
            </Button>
            <Button
              variant={view === 'live' ? 'default' : 'ghost'}
              size="sm"
              className={view === 'live' ? 'bg-cyan-500 text-black hover:bg-cyan-400 rounded-full' : 'text-gray-400 hover:text-white rounded-full'}
              onClick={() => setView('live')}
            >
              <Activity className="w-4 h-4 mr-2" /> Live Session
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">

          {/* Reference View */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${view === 'reference' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              {/* Mock Reference Video */}
              <div className="text-center space-y-4">
                <div className="w-[640px] h-[360px] bg-black rounded-xl border border-cyan-900 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
                  <PlayCircle className="w-16 h-16 text-cyan-500 opacity-80 group-hover:scale-110 transition-transform" />
                  <p className="absolute bottom-4 text-cyan-400 font-mono text-sm">DEMO_MOVE_01.mp4</p>
                </div>
                <p className="text-gray-400">Watch the master perform the technique.</p>
              </div>
            </div>
          </div>

          {/* Live View */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${view === 'live' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <Scene />

            {/* HUD Elements specific to Live View */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
              {/* Score (Top Right in this layout maybe? Or keep centered) */}
              <div className="mt-16 flex justify-center">
                <Card className="bg-black/50 backdrop-blur-md border-cyan-500/50 p-4 px-8 rounded-full flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                  <span className="text-cyan-400 text-xs uppercase tracking-widest">Alignment</span>
                  <span className={`text-4xl font-bold tabular-nums ${score > 80 ? 'text-green-400' : score < 50 ? 'text-red-400' : 'text-white'}`}>
                    {score}%
                  </span>
                </Card>
              </div>

              {/* Feedback (Bottom) */}
              <div className="flex justify-center pb-8">
                <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 px-8 py-4 rounded-2xl text-center max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <p className="text-2xl font-medium text-white">
                    {feedback}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Start Overlay (Global) */}
        {!isSessionActive && view === 'live' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/80 backdrop-blur-sm z-50">
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold text-white tracking-tighter">
                READY TO <span className="text-cyan-400">BEGIN?</span>
              </h1>
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
                onClick={() => setSessionActive(true)}
              >
                START SESSION
              </Button>
            </div>
          </div>
        )}
      </div>
    </DojoLayout>
  );
};

export default LiveSession;
