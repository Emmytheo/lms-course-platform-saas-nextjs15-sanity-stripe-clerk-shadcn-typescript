import { Gamepad2, BrainCircuit, Play, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractiveShowcaseSection() {
    return (
        <section className="py-24 px-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                        Learn By Doing
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Forget passive video watching. Engage with interactive games, quizzes, and simulation exams to retain knowledge.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Visual: Mock Game/Exam Interface */}
                    <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl skew-y-1 group hover:skew-y-0 transition-transform duration-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative rounded-lg overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-zinc-900">
                            <div className="text-center p-8">
                                <div className="text-6xl mb-4">🥋</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Technique Quiz #4</h3>
                                <p className="text-gray-400 mb-6">Identify the correct stance for a roundhouse kick.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-zinc-900 border border-zinc-700 rounded text-sm text-gray-300 hover:bg-zinc-800 cursor-pointer">Front Stance</div>
                                    <div className="p-3 bg-indigo-600 border border-indigo-400 rounded text-sm text-white font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)]">Side Stance</div>
                                    <div className="p-3 bg-zinc-900 border border-zinc-700 rounded text-sm text-gray-300 hover:bg-zinc-800 cursor-pointer">Back Stance</div>
                                    <div className="p-3 bg-zinc-900 border border-zinc-700 rounded text-sm text-gray-300 hover:bg-zinc-800 cursor-pointer">Horse Stance</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                <Gamepad2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Gamified Drills</h3>
                                <p className="text-gray-400">
                                    Test your reaction time and decision making with flashcard games and reflex drills.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Adaptive Quizzes</h3>
                                <p className="text-gray-400">
                                    Questions that get harder as you improve, ensuring you're always challenged at the right level.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Certification Exams</h3>
                                <p className="text-gray-400">
                                    Pass comprehensive end-of-course exams to earn verifiable digital certificates.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button variant="secondary" className="bg-white text-black hover:bg-gray-200">
                                Try a Sample Quiz
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
