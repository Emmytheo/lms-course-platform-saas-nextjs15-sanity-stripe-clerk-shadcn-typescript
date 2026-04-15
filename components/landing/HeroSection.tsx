import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black opacity-80" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm text-sm text-cyan-400 font-medium">
                    🚀 New: AI-Powered Posture Analysis
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                    Master Your Craft <br /> With Precision
                </h1>

                <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    The first martial arts platform that uses AI to detect your form, correct your posture, and track your progress in real-time.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/lms/courses">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105">
                            Start Training Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="#ai-demo">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-zinc-700 hover:bg-zinc-800 text-white rounded-full">
                            <PlayCircle className="ml-2 w-5 h-5 mr-2" />
                            Watch Demo
                        </Button>
                    </Link>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Mock Partner Logos */}
                    {['UFC', 'Bellator', 'Glory', 'ONE'].map((logo) => (
                        <div key={logo} className="text-xl font-bold font-serif text-white">{logo}</div>
                    ))}
                </div>
            </div>
        </section>
    );
}
