import { db } from "@/lib/db";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await db.getPost?.(slug);

    if (!post || !post.published) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <LandingNavbar />

            {/* Post Header */}
            <header className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-border">
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-primary text-sm font-bold mb-8 hover:gap-3 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Insights
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags?.map(tag => (
                            <Badge key={tag} className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <span>SkillHub Editorial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            5 min read
                        </div>
                    </div>
                </div>
            </header>

            {/* Post Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                {post.cover_image && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl">
                        <img 
                            src={post.cover_image} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <article className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary">
                    {/* In a real app, you'd use a markdown or rich-text renderer here */}
                    {/* For now, we'll assume content is HTML or plain text */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                <div className="mt-20 pt-12 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Share this article</span>
                        <div className="flex gap-2">
                             <button className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                                 <Share2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                </div>
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
