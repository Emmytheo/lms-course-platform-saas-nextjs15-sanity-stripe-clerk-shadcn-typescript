import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calculator, GraduationCap, PenTool } from "lucide-react";

export function GlobalHeroSection() {
    return (
        <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center pt-20">
            {/* dynamic Background with Animated Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-40 animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-30" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md text-sm text-primary font-bold tracking-wide uppercase">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    The Unified Skill Ecosystem
                </div>

                <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 text-foreground leading-[1.1]">
                    Elevate Your Potential <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-500 to-primary bg-[length:200%_auto] animate-gradient">Across Every vertical</span>
                </h1>

                <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                    From structured digital courses to hands-on live training and professional certifications. One platform, infinite growth opportunities.
                </p>

                {/* Service Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { name: "LMS Library", icon: GraduationCap, href: "/lms/courses", color: "text-primary" },
                        { name: "CBT Center", icon: Calculator, href: "/cbt", color: "text-cyan-500" },
                        { name: "Live Training", icon: BookOpen, href: "/training", color: "text-emerald-500" },
                        { name: "Publications", icon: PenTool, href: "/blog", color: "text-orange-500" },
                    ].map((service) => (
                        <Link key={service.name} href={service.href} className="group p-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300">
                            <service.icon className={`w-8 h-8 mx-auto mb-3 ${service.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-sm font-bold text-foreground">{service.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/lms/courses">
                        <Button size="lg" className="h-16 px-10 text-lg font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
                            GET STARTED NOW
                            <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>
                    </Link>
                    <Link href="/learning-paths">
                        <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-border bg-background/50 backdrop-blur-sm hover:bg-muted text-foreground rounded-2xl transition-all">
                            View Roadmaps
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
