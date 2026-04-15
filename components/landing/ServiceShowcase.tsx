import Link from "next/link";
import { GraduationCap, Calculator, Video, PenTool, ArrowRight } from "lucide-react";

const services = [
    {
        title: "LMS Academy",
        description: "Access a vast library of structured courses, track your progress, and earn certifications.",
        icon: GraduationCap,
        href: "/lms/courses",
        cta: "Browse Library",
        color: "from-blue-500/20 to-blue-600/5",
        iconColor: "text-blue-500"
    },
    {
        title: "CBT Practice",
        description: "Sharpen your skills with our standalone Computer-Based Testing center. Practice for real-world excellence.",
        icon: Calculator,
        href: "/cbt",
        cta: "Start Practice",
        color: "from-cyan-500/20 to-cyan-600/5",
        iconColor: "text-cyan-500"
    },
    {
        title: "Live Training",
        description: "Join hands-on physical training sessions led by industry experts. Real world, real skills.",
        icon: Video,
        href: "/training",
        cta: "View Sessions",
        color: "from-emerald-500/20 to-emerald-600/5",
        iconColor: "text-emerald-500"
    },
    {
        title: "Publications",
        description: "Stay informed with the latest research, articles, and updates from our professional community.",
        icon: PenTool,
        href: "/blog",
        cta: "Read Blog",
        color: "from-orange-500/20 to-orange-600/5",
        iconColor: "text-orange-500"
    }
];

export function ServiceShowcase() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black mb-6">Our Core Ecosystem</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We've built a multi-dimensional platform to support every aspect of your professional journey.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service) => (
                    <div key={service.title} className={`group relative p-8 rounded-3xl border border-border bg-gradient-to-br ${service.color} hover:border-primary/50 transition-all duration-500 overflow-hidden`}>
                        <div className="relative z-10">
                            <service.icon className={`w-12 h-12 mb-6 ${service.iconColor}`} />
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                {service.description}
                            </p>
                            <Link href={service.href}>
                                <div className="inline-flex items-center font-bold text-primary group-hover:gap-3 transition-all">
                                    {service.cta}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </div>
                            </Link>
                        </div>
                        
                        {/* subtle decorative element */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <service.icon className="w-48 h-48 -mr-12 -mt-12" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
