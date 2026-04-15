'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import PoseOverlay from '@/components/visuals/PoseOverlay';
import { cn } from '@/lib/utils';
import { Camera, Settings, User } from 'lucide-react';

const SystemsSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col h-full bg-black/80 border-l border-cyan-900/30 backdrop-blur-xl", className)}>
      <div className="p-6 border-b border-cyan-900/30">
        <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <span className="text-cyan-400">SYSTEMS</span> ONLINE
        </h2>
      </div>

      <Tabs defaultValue="camera" className="flex-1 flex flex-col">
        <div className="px-6 pt-4">
          <TabsList className="w-full bg-cyan-950/30 border border-cyan-900/30">
            <TabsTrigger value="camera" className="flex-1 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <Camera className="w-4 h-4 mr-2" /> Feed
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" /> Config
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="camera" className="p-6 space-y-6 m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Live Feed Overlay</Label>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="rounded-lg overflow-hidden border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <PoseOverlay />
              </div>
              <p className="text-xs text-gray-500">
                Real-time skeletal tracking active. Latency: ~16ms
              </p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-6 space-y-8 m-0">
            {/* Character Customization */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" /> Avatar
              </h3>
              
              <div className="space-y-3">
                <Label className="text-gray-300">Glow Intensity</Label>
                <Slider defaultValue={[75]} max={100} step={1} className="py-2" />
              </div>

              <div className="space-y-3">
                <Label className="text-gray-300">Color Theme</Label>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-cyan-500 ring-2 ring-white cursor-pointer" />
                  <div className="h-8 w-8 rounded-full bg-purple-500 cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
                  <div className="h-8 w-8 rounded-full bg-emerald-500 cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
                  <div className="h-8 w-8 rounded-full bg-amber-500 cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* View Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Viewport
              </h3>
              
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Show Master Ghost</Label>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Mirror Mode</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default SystemsSidebar;
