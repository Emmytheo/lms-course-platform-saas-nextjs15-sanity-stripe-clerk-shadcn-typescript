import React from 'react';
import { db } from '@/lib/db';
import { getAuth } from '@/lib/auth-wrapper';
import CourseBrowser from '@/components/lms/CourseBrowser';
import { Course as UICourse } from '@/lib/lms/types';
import { Course as DBCourse } from '@/lib/db/interface';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { BookOpen, GraduationCap, Video } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
    const { userId } = await getAuth();
    const dbCourses: DBCourse[] = await db.getAllCourses();
    const enrolledCourseIds = userId
        ? (await db.getStudentEnrollmentsWithDetails(userId)).map((e: any) => e.course_id || e.course?._id)
        : [];

    // Transform DB courses to UI courses
    const courses: UICourse[] = dbCourses.map(c => ({
        id: c._id,
        title: c.title,
        description: c.description || "",
        thumbnail_url: c.image || "",
        instructor_id: "system",
        difficulty: (c.level as any) || "Intermediate",
        duration_minutes: 0,
        tags: c.tags || [],
        published: true,
        created_at: new Date().toISOString(),
        slug: c.slug?.current || "",
        price: c.price,
        isEnrolled: enrolledCourseIds.includes(c._id),
        modules: []
    }));

    // Better mapping for modules count
    const coursesWithModules = courses.map((uiC, idx) => ({
        ...uiC,
        modules: dbCourses[idx].modules as any || []
    }));

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <LandingNavbar />
            
            {/* Premium Header Section */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 right-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -mt-64 opacity-50" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-6">
                        <GraduationCap className="w-3 h-3" />
                        Digital Academy
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
                        Master <br />
                        <span className="italic text-primary">Your Craft</span>
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                        Access our comprehensive library of expert-led digital courses. 
                        Structured for clarity, designed for impact, and proctor-verified for excellence.
                    </p>

                    <div className="flex items-center justify-center gap-12 mt-12 py-8 border-y border-border max-w-3xl mx-auto">
                        <div className="flex flex-col items-center gap-2">
                             <Video className="w-6 h-6 text-primary" />
                             <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{dbCourses.length} Courses</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <BookOpen className="w-6 h-6 text-primary" />
                             <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lifelong Access</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <GraduationCap className="w-6 h-6 text-primary" />
                             <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Certified Tracks</span>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <CourseBrowser initialCourses={coursesWithModules} />
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
