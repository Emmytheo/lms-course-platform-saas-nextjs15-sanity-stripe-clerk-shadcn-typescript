import TestSelectionWrapper from '@/components/exam/TestSelectionWrapper';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { Calculator, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CBTPage() {
  // Fetch from Supabase via adapter
  const dbExams = await db.getAllExams();

  // Map DB exams to the format expected by the UI component
  const exams = dbExams.map(exam => {
    // Determine total questions from sections or fallback questions array
    const sections = typeof exam.sections === 'string' ? JSON.parse(exam.sections) : (exam.sections || []);
    const totalQuestions = sections.length > 0 
        ? sections.reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0)
        : (exam.questions?.length || 0);

    const tags = typeof exam.tags === 'string' ? JSON.parse(exam.tags) : (exam.tags || []);

    return {
      id: exam._id,
      title: exam.title,
      description: exam.description,
      totalQuestions: totalQuestions,
      duration: exam.duration_minutes,
      categories: tags.length > 0 ? tags : ['General']
    };
  });

  return (
    <div className="min-h-screen bg-background font-sans">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -mt-64 opacity-60" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-6">
                <Calculator className="w-3 h-3" />
                Practice Center
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                CBT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">PRACTICE</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                Simulate real-world exam environments with our precision Computer-Based Testing center. 
                Identify skill gaps and achieve mastery through rigorous practice.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto py-12 border-y border-border">
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest">Proctor Simulation</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Trophy className="w-8 h-8 text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest">Instant Results</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="w-8 h-8 text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest">Skill Analytics</span>
                </div>
            </div>
        </div>
      </section>

      {/* Selection Grid */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* Pass mapped data to the client component wrapper */}
        <TestSelectionWrapper exams={exams} />
      </main>

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