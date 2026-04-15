import { Users, BookOpen, Trophy, Globe } from "lucide-react";

const stats = [
    { label: "Active Learners", value: "25,000+", icon: Users },
    { label: "Available Courses", value: "1,500+", icon: BookOpen },
    { label: "Certifications Earned", value: "12,000+", icon: Trophy },
    { label: "Global Community", value: "50+ Countries", icon: Globe },
];

export function LMSStatsSection() {
    return (
        <section className="border-y border-border bg-muted/20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                            <div className="p-3 rounded-full bg-card border border-border group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                                <stat.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
