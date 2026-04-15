import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Play, Trophy, Users, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';

const MODULES = [
  {
    id: '1',
    title: 'Precision Movement & Balance',
    description: 'The foundation of all physical skill. Master stances, center of gravity, and fluid transitions.',
    level: 'Beginner',
    duration: '45m',
    students: 1205,
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    color: "from-blue-500/20 to-blue-600/5"
  },
  {
    id: '2',
    title: 'Advanced Kinetic Striking',
    description: 'Harness total body torque and explosive power. Precision striking for high-stakes scenarios.',
    level: 'Advanced',
    duration: '60m',
    students: 850,
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop',
    color: "from-red-500/20 to-red-600/5"
  },
  {
    id: '3',
    title: 'Adaptive Defensive Maneuvers',
    description: 'Learn to read intent, evade efficiently, and neutralize threats with minimal effort.',
    level: 'Intermediate',
    duration: '50m',
    students: 930,
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=2070&auto=format&fit=crop',
    color: "from-emerald-500/20 to-emerald-600/5"
  },
];

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingNavbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-32 opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                <Zap className="w-3 h-3 fill-current" />
                Live Hub
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                LIVE <br />
                <span className="text-primary italic">TRAINING</span> HUB
              </h1>
              <p className="text-muted-foreground text-xl max-w-xl leading-relaxed">
                Elite physical instruction for those who demand excellence. 
                Our live training modules bridge the gap between theory and real-world execution.
              </p>
              <div className="flex items-center gap-8 py-4 border-y border-border">
                  <div className="flex flex-col">
                      <span className="text-2xl font-black">12.5k+</span>
                      <span className="text-xs text-muted-foreground uppercase font-bold">Graduates</span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex flex-col">
                      <span className="text-2xl font-black">4.9/5</span>
                      <span className="text-xs text-muted-foreground uppercase font-bold">Rating</span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex flex-col">
                      <span className="text-2xl font-black">32</span>
                      <span className="text-xs text-muted-foreground uppercase font-bold">Instructors</span>
                  </div>
              </div>
            </div>
            <div className="flex-1 relative">
                <div className="aspect-square rounded-3xl overflow-hidden border border-border bg-muted/50 relative shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=2000&auto=format&fit=crop" 
                        alt="Training Session" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="p-6 rounded-2xl bg-background/80 backdrop-blur-md border border-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transform rotate-3">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Certified Elite Training</p>
                                    <p className="text-xs text-muted-foreground">Verified by SkillHub</p>
                                </div>
                            </div>
                            <Play className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-24 px-6 bg-muted/20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 gap-6 flex-wrap">
              <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Current Modules</h2>
                  <p className="text-muted-foreground text-lg">Select your discipline and begin your physical mastery.</p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MODULES.map((module) => (
              <div key={module.id} className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={module.image} 
                    alt={module.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <Badge className="absolute top-6 right-6 bg-primary text-primary-foreground font-black tracking-widest uppercase">
                    {module.level}
                  </Badge>
                  <div className="absolute bottom-6 left-6 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-white uppercase tracking-tighter">
                          <Clock className="w-3 h-3 text-primary" />
                          {module.duration}
                      </div>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">
                    {module.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between py-6 border-t border-border mt-auto">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {module.students} Joiners
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary">
                      <Trophy className="w-4 h-4 fill-current" />
                      +500 XP
                    </div>
                  </div>

                  <Link href={`/training/${module.id}`} className="block">
                    <Button className="w-full h-14 rounded-2xl bg-muted hover:bg-primary hover:text-primary-foreground text-foreground border border-border group-hover:border-primary/50 font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all">
                      VIEW MODULE
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-border bg-background text-center text-muted-foreground text-sm">
        <div className="mb-4 flex items-center justify-center gap-2 opacity-100">
           <span className="font-black text-xl tracking-tighter text-foreground italic">SKILL<span className="text-primary">HUB</span></span>
        </div>
        <p className="font-medium">&copy; {new Date().getFullYear()} SkillHub Ecosystem. Empowering Professionals Globally.</p>
      </footer>
    </div>
  );
}
