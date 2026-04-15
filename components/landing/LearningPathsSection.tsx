import Link from "next/link";
import { ArrowRight, Map, CheckCircle } from "lucide-react";
import { LearningPath } from "@/lib/db/interface";

export function LearningPathsSection({ paths }: { paths: LearningPath[] }) {
    return (
        <section className="py-24 px-6 bg-muted/20 border-y border-border">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm mb-4">
                            <Map className="w-5 h-5" />
                            Structured Learning
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Career Tracks & Paths</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Don't know where to start? Follow our step-by-step learning paths designed to take you from novice to master in specific disciplines.
                        </p>
                    </div>
                    <Link href="/lms/learning-paths" className="text-primary hover:text-primary/80 font-bold transition-colors flex items-center gap-2">
                        Explore All Paths <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paths.length === 0 && (
                        <div className="col-span-full py-12 px-6 text-center border bordered-border rounded-xl bg-muted/50">
                            <p className="text-muted-foreground">No learning paths available at the moment. Check back soon!</p>
                        </div>
                    )}
                    {paths.slice(0, 3).map((path) => (
                        <Link href={`/lms/learning-paths/${path.slug.current}`} key={path._id} className="group">
                            <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                                <div className="h-48 bg-muted relative">
                                    {path.image ? (
                                        <img src={typeof path.image === 'string' ? path.image : ''} alt={path.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
                                    )}
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                                            {path.courses?.length || 0} Courses
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {path.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                        {path.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                        <span>Certification included</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
