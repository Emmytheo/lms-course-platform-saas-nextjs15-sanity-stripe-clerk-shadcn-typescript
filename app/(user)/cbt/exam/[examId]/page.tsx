import Link from "next/link";
import { ArrowLeft, Clock, HelpCircle, BarChart3, BookOpen, Shield, Award, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const { userId } = await getAuth();

  const exam = await db.getExamById(examId);

  if (!exam) {
    return notFound();
  }

  const sections = typeof exam.sections === 'string' ? JSON.parse(exam.sections) : (exam.sections || []);
  const totalQuestions = sections.length > 0
    ? sections.reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0)
    : (exam.questions?.length || 0);
  
  const instructions = exam.instructions || [
    "Read each question carefully before selecting an answer.",
    "Manage your time effectively using the sidebar navigation.",
    "Submit your exam only after reviewing all questions.",
    "Results and analytics will be available immediately after submission."
  ];

  const tags = typeof exam.tags === 'string' ? JSON.parse(exam.tags) : (exam.tags || []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 blur-3xl z-0" />
        
        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
          <Link
            href="/cbt"
            className="group inline-flex items-center text-sm font-bold text-muted-foreground hover:text-white transition-all mb-12 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-primary/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Practice Library
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
                <Badge className="bg-primary/20 text-primary border-primary/50 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                  CBT Practice Exam
                </Badge>
                {exam.difficulty && (
                  <Badge variant="outline" className="border-white/20 text-white/70 px-3 py-1 uppercase text-[10px] tracking-widest font-black">
                    {exam.difficulty}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-left-6 duration-1000">
                {exam.title}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                {exam.description}
              </p>

              <div className="flex flex-wrap gap-6 pt-4 text-sm font-bold tracking-wider uppercase text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{exam.duration_minutes} Mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span>{totalQuestions} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>{exam.pass_score}% Pass Score</span>
                </div>
              </div>
            </div>

            <div className="lg:min-w-[400px] animate-in fade-in zoom-in duration-1000 delay-700">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-3xl overflow-hidden p-8">
                <div className="text-center mb-8">
                    <span className="block text-primary text-xs font-black tracking-widest uppercase mb-2">Access Status</span>
                    <span className="text-4xl font-black text-white italic">FREE <span className="text-primary">ACCESS</span></span>
                </div>
                
                <Button asChild className="w-full h-16 text-lg font-black tracking-widest uppercase rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" size="lg">
                  <Link href={`/cbt/exam/${examId}/start`}>
                    <Zap className="mr-2 h-5 w-5 fill-current" />
                    Launch Exam Center
                  </Link>
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-50">
                  Simulated environment &bull; Instant Analytics
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {/* Sections */}
            {sections.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Exam Blueprint
                </h2>
                <div className="grid gap-6">
                  {sections.map((section: any, idx: number) => {
                    const weight = totalQuestions > 0 ? Math.round((section.questions?.length / totalQuestions) * 100) : 0;
                    return (
                        <div key={idx} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{section.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 lowercase first-letter:uppercase">{section.description}</p>
                                </div>
                                <Badge variant="outline" className="border-white/10 text-white/50">{section.questions?.length} Qs</Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span>Section Weight</span>
                                    <span>{weight}%</span>
                                </div>
                                <Progress value={weight} className="h-1 bg-white/10" indicatorClassName="bg-primary" />
                            </div>
                        </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Instructions */}
            <section className="space-y-6">
                <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                    <ListIcon className="w-6 h-6 text-primary" />
                    Rules of Engagement
                </h2>
                <Card className="bg-white/5 border-white/10 rounded-2xl overflow-hidden p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {instructions.map((inst, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/50 flex items-center justify-center text-xs font-black">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed pt-1.5">{inst}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
          </div>

          <div className="space-y-8">
            {/* Tag Cloud */}
            <Card className="bg-white/5 border-white/10 rounded-2xl p-8">
                <CardTitle className="text-lg font-black tracking-widest uppercase mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Competencies
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, i: number) => (
                        <Badge key={i} className="bg-white/10 hover:bg-primary/20 hover:text-primary transition-colors text-white/70 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                            {tag}
                        </Badge>
                    ))}
                    {tags.length === 0 && <span className="text-muted-foreground text-sm font-bold uppercase italic">General Proficiency</span>}
                </div>
            </Card>

            {/* Pro Tips */}
            <Card className="bg-white/5 border-white/10 rounded-2xl p-8 border-l-2 border-l-primary/50">
                <CardTitle className="text-lg font-black tracking-widest uppercase mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Proctor Tips
                </CardTitle>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <div className="font-black text-xs uppercase tracking-widest mb-1">Pace Yourself</div>
                            <div className="text-[11px] text-muted-foreground font-medium leading-relaxed">Limit your time per question to ~{Math.round(exam.duration_minutes / totalQuestions)} minutes for optimal coverage.</div>
                        </div>
                    </div>
                </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    );
}
