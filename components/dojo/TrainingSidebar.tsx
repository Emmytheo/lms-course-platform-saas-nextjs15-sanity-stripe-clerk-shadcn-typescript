'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  locked: boolean;
}

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Calibration Sequence', completed: true, locked: false },
  { id: '2', title: 'Basic Stance Alignment', completed: false, locked: false },
  { id: '3', title: 'Forward Punch Mechanics', completed: false, locked: true },
  { id: '4', title: 'Defensive Guard', completed: false, locked: true },
  { id: '5', title: 'Balance Challenge', completed: false, locked: true },
];

const TrainingSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col h-full bg-black/80 border-r border-cyan-900/30 backdrop-blur-xl", className)}>
      <div className="p-6 border-b border-cyan-900/30">
        <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <span className="text-cyan-400">MISSION</span> CONTROL
        </h2>
        <p className="text-xs text-cyan-600 mt-1 uppercase tracking-widest">Module 01: Fundamentals</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {MOCK_TASKS.map((task) => (
            <Card 
              key={task.id}
              className={cn(
                "p-4 border-l-4 transition-all hover:bg-white/5 cursor-pointer",
                task.completed ? "border-l-green-500 bg-green-950/10 border-t-0 border-r-0 border-b-0" : 
                task.locked ? "border-l-gray-700 opacity-50 border-t-0 border-r-0 border-b-0" : 
                "border-l-cyan-500 bg-cyan-950/10 border-t-0 border-r-0 border-b-0"
              )}
            >
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : task.locked ? (
                  <Lock className="w-5 h-5 text-gray-500" />
                ) : (
                  <Circle className="w-5 h-5 text-cyan-500" />
                )}
                <span className={cn("text-sm font-medium", task.locked ? "text-gray-400" : "text-gray-200")}>
                  {task.title}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-cyan-900/30 bg-black/40">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 uppercase">Progress</span>
          <span className="text-xs text-cyan-400 font-bold">20%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 w-[20%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        </div>
      </div>
    </div>
  );
};

export default TrainingSidebar;
