'use client';

import React, { ReactNode } from 'react';
import TrainingSidebar from './TrainingSidebar';
import SystemsSidebar from './SystemsSidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Settings2 } from 'lucide-react';

interface DojoLayoutProps {
  children: ReactNode;
}

const DojoLayout = ({ children }: DojoLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden relative">
      
      {/* Left Sidebar - Desktop */}
      <div className="hidden lg:block w-80 h-full z-20">
        <TrainingSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col h-full min-w-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
          {/* Left Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="pointer-events-auto bg-black/50 backdrop-blur-md text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300 border border-cyan-900/30">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-cyan-900/30 bg-black w-80">
              <TrainingSidebar />
            </SheetContent>
          </Sheet>

          {/* Right Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="pointer-events-auto bg-black/50 backdrop-blur-md text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300 border border-cyan-900/30">
                <Settings2 className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 border-l-cyan-900/30 bg-black w-80">
              <SystemsSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Content */}
        <main className="flex-1 relative">
          {children}
        </main>
      </div>

      {/* Right Sidebar - Desktop */}
      <div className="hidden xl:block w-96 h-full z-20">
        <SystemsSidebar />
      </div>

    </div>
  );
};

export default DojoLayout;
