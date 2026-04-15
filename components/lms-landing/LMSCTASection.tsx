import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LMSCTASection() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto bg-card rounded-3xl p-12 md:p-20 text-center border border-border relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-tight">
                        Ready To Accelerate Your Career?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                        Join our community of professionals and start mastering high-demand skills today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/lms/courses">
                            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                                Browse Catalog
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-border text-foreground hover:bg-muted rounded-full">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
