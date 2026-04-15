import { db } from "@/lib/db";
import { BlogPost } from "@/lib/db/interface";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, PenTool } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const posts: BlogPost[] = await db.getAllPosts?.() || [];
    const publishedPosts = posts.filter(p => p.published);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <LandingNavbar />

            {/* Premium Blog Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -mt-32 opacity-50" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-6">
                        <PenTool className="w-3 h-3" />
                        Our Publications
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
                        Insights <br />
                        <span className="italic text-primary">& Perspectives</span>
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                        Stay ahead of the curve with our latest articles on technology, 
                        educational mastery, and professional development.
                    </p>
                </div>
            </section>

            {/* Post Grid */}
            <main className="max-w-7xl mx-auto px-6 py-24">
                {publishedPosts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border rounded-3xl">
                        <p className="text-muted-foreground text-xl">No publications yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publishedPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                                <Card className="bg-card border-border overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-primary/50 hover:-translate-y-2 rounded-3xl">
                                    <div className="relative h-64 overflow-hidden">
                                        {post.cover_image ? (
                                            <img 
                                                src={post.cover_image} 
                                                alt={post.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                                                <PenTool className="w-12 h-12 text-primary opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                            {post.tags?.slice(0, 2).map(tag => (
                                                <Badge key={tag} className="bg-background/80 backdrop-blur-sm text-foreground border-none text-[10px] uppercase font-bold tracking-widest">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.published_at || post.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                5 min read
                                            </div>
                                        </div>
                                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="px-8 flex-1">
                                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="p-8 pt-4">
                                        <div className="w-full flex items-center justify-between text-primary font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                            Read Article
                                            <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer (Simplified) */}
            <footer className="py-12 border-t border-border bg-background text-center text-muted-foreground text-sm">
                <div className="mb-4 flex items-center justify-center gap-2 opacity-100">
                <span className="font-black text-xl tracking-tighter text-foreground italic">SKILL<span className="text-primary">HUB</span></span>
                </div>
                <p className="font-medium">&copy; {new Date().getFullYear()} SkillHub Ecosystem. Empowering Professionals Globally.</p>
            </footer>
        </div>
    );
}
