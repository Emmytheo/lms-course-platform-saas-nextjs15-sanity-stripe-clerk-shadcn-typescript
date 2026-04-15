import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-cyan-900 via-zinc-900 to-black rounded-3xl p-12 md:p-20 text-center border border-zinc-800 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight">
                        Ready To Start Your Transformation?
                    </h2>
                    <p className="text-xl text-gray-300 max-w-xl mx-auto">
                        Join thousands of students and start your journey to mastery today.
                        Free access to introductory courses.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/lms/courses">
                            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-black hover:bg-gray-200 rounded-full">
                                Browse Library
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10 rounded-full">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
