import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, BarChart, BrainCircuit } from "lucide-react";

export function LMSAIShowcaseSection() {
    return (
        <section id="ai-features" className="relative py-24 overflow-hidden bg-card/30 border-y border-border">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">

                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm">
                        <Sparkles className="w-5 h-5" />
                        Smart Learning Assistant
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Personalized Growth,<br />
                        <span className="text-primary">Powered by AI.</span>
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Our intelligent system adapts to your learning style, recommending content
                        and tracking your progress to ensure you master every concept efficiently.
                    </p>

                    <ul className="space-y-4">
                        {[
                            'Adaptive learning paths tailored to your goals',
                            'Real-time skill assessment and gap analysis',
                            'Automated progress tracking and insights',
                            'Smart content recommendations'
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <BrainCircuit className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-muted-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <Link href="/lms/dashboard">
                        <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-8 h-12">
                            View Demo
                        </Button>
                    </Link>
                </div>

                <div className="relative">
                    {/* Visual representation of Analytics */}
                    <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card aspect-video group flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background z-0" />

                        {/* Mock Chart/Graph UI */}
                        <div className="relative z-10 w-3/4 h-3/4 border border-border bg-background/50 backdrop-blur rounded-xl p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                                <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                                    <BarChart className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <div className="flex-1 flex items-end gap-2">
                                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                    <div key={i} className="flex-1 bg-primary/20 rounded-t-md relative group/bar overflow-hidden">
                                        <div
                                            style={{ height: `${h}%` }}
                                            className="absolute bottom-0 w-full bg-primary transition-all duration-1000 ease-out group-hover/bar:bg-primary/80"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                                <span>MON</span>
                                <span>SUN</span>
                            </div>
                        </div>

                    </div>
                    {/* Floating Cards */}
                    <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl border border-border shadow-xl flex items-center gap-3 animate-bounce">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Skill Level</div>
                            <div className="font-bold text-foreground">Advanced</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
