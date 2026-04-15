import { Users, BookOpen, Trophy, Globe } from "lucide-react";

const stats = [
    { label: "Active Students", value: "15,000+", icon: Users },
    { label: "Video Lessons", value: "1,200+", icon: BookOpen },
    { label: "Certificates Issued", value: "8,500+", icon: Trophy },
    { label: "Countries Reached", value: "45+", icon: Globe },
];

export function StatsSection() {
    return (
        <section className="border-y border-zinc-800 bg-zinc-950/50">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                            <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-colors">
                                <stat.icon className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
