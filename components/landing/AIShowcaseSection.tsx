import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanFace, Move, Fingerprint } from "lucide-react";

export function AIShowcaseSection() {
    return (
        <section id="ai-demo" className="relative py-24 overflow-hidden bg-zinc-900">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">

                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 text-cyan-400 font-bold tracking-wider uppercase text-sm">
                        <ScanFace className="w-5 h-5" />
                        AI Vision Technology
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Your Personal Coach,<br />
                        <span className="text-cyan-500">Available 24/7.</span>
                    </h2>

                    <p className="text-lg text-gray-400 leading-relaxed">
                        Our proprietary computer vision algorithms analyze your movement
                        through your webcam, comparing your form against world champions
                        in real-time.
                    </p>

                    <ul className="space-y-4">
                        {[
                            'Skeletal tracking for precise angle measurement',
                            'Real-time feedback overlay on your video feed',
                            'Score calculation focused on stability and speed',
                            'Historical progress tracking for every move'
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                                    <Fingerprint className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <Link href="/lms/dashboard">
                        <Button className="mt-4 bg-white text-black hover:bg-gray-200 font-bold rounded-full px-8 h-12">
                            Try AI Assessment
                        </Button>
                    </Link>
                </div>

                <div className="relative">
                    {/* Visual representation of AI analysis */}
                    <div className="relative rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl bg-black aspect-video group">
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            {/* Overlay UI Mockup */}
                            <div className="w-full h-full p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-green-400 border border-green-500/30">
                                        ● Tracking Active
                                    </div>
                                    <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-cyan-400 font-mono">
                                        Score: 92/100
                                    </div>
                                </div>
                                {/* Svg Skeleton Overlay */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 text-cyan-500" viewBox="0 0 100 100">
                                    <circle cx="50" cy="20" r="5" stroke="currentColor" strokeWidth="0.5" fill="none" />
                                    <line x1="50" y1="25" x2="50" y2="45" stroke="currentColor" strokeWidth="0.5" />
                                    <line x1="50" y1="30" x2="30" y2="40" stroke="currentColor" strokeWidth="0.5" />
                                    <line x1="50" y1="30" x2="70" y2="40" stroke="currentColor" strokeWidth="0.5" />
                                    <line x1="50" y1="45" x2="40" y2="70" stroke="currentColor" strokeWidth="0.5" />
                                    <line x1="50" y1="45" x2="60" y2="70" stroke="currentColor" strokeWidth="0.5" />
                                </svg>
                            </div>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=2000&auto=format&fit=crop"
                            alt="Karate Stance"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    {/* Floating Cards */}
                    <div className="absolute -bottom-6 -left-6 bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-xl flex items-center gap-3 animate-bounce">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <Move className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">Stance Width</div>
                            <div className="font-bold text-white">Perfect</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
