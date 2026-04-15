import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight } from "lucide-react";

export function LMSHeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-80" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-border bg-muted/50 backdrop-blur-sm text-sm text-primary font-medium">
                    🚀 New: AI-Powered Skill Tracking
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground">
                    Master New Skills <br /> With Precision
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    The ultimate platform for professional growth. Track your progress, certify your skills, and advance your career with AI-driven learning paths.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/lms/courses">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg hover:scale-105 transition-all">
                            Explore Courses
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="#ai-features">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-border bg-background hover:bg-muted text-foreground rounded-full">
                            <PlayCircle className="ml-2 w-5 h-5 mr-2" />
                            How It Works
                        </Button>
                    </Link>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Mock Partner Logos */}
                    {['TechCorp', 'EduGlobal', 'SkillUp', 'Innovate'].map((logo) => (
                        <div key={logo} className="text-xl font-bold font-serif text-muted-foreground">{logo}</div>
                    ))}
                </div>
            </div>
        </section>
    );
}
