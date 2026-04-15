import { db } from "@/lib/db";
import { CourseCard } from "@/components/CourseCard";
import { GlobalHeroSection } from "@/components/landing/GlobalHeroSection";
import { ServiceShowcase } from "@/components/landing/ServiceShowcase";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LMSStatsSection as StatsSection } from "@/components/lms-landing/LMSStatsSection";
import { LMSCTASection as CTASection } from "@/components/lms-landing/LMSCTASection";
import { LMSAIShowcaseSection as AIShowcaseSection } from "@/components/lms-landing/LMSAIShowcaseSection";
import { LearningPathsSection } from "@/components/landing/LearningPathsSection";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import {
  Brain,
  Trophy,
  Target,
  Users,
  Video,
  Zap,
  ShieldCheck,
  Rocket,
  Link,
  ArrowRight
} from "lucide-react";
import { Course } from "@/lib/db/interface";

export const dynamic = "force-dynamic"; // Use force-dynamic because we fetch from Supabase
export const revalidate = 3600;

export default async function HubPage() {
  const [rawCourses, learningPaths] = await Promise.all([
    db.getAllCourses(),
    db.getAllLearningPaths()
  ]);

  // Safe mapping to ensure matching Course interface
  const courses: Course[] = rawCourses.map((c: any) => ({
    ...c,
    _id: c._id || c.id,
    title: c.title || "Untitled Course",
    slug: typeof c.slug === 'object' && c.slug?.current ? c.slug : { current: c.slug || "" },
  }));

  const featuredCourses = courses.slice(0, 4);

  const features = [
    {
      title: "AI-Powered Intelligence",
      description: "Harness the power of GPT-4 integration for personalized feedback and skill assessment.",
      icon: Brain,
    },
    {
      title: "Performance Tracking",
      description: "Earn XP, unlock achievements, and visualize your growth with real-time analytics.",
      icon: Trophy,
    },
    {
      title: "Integrated Ecosystem",
      description: "Seamlessly transition between digital courses, live sessions, and proctor-led exams.",
      icon: Target,
    },
    {
      title: "Global Community",
      description: "Connect with thousands of learners and experts in our collaborative professional network.",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <LandingNavbar />
      
      {/* 1. Global Multi-Service Hero */}
      <GlobalHeroSection />

      {/* 2. core Service Showcase (LMS, CBT, Training, Blog) */}
      <ServiceShowcase />

      {/* 3. Learning Paths (The Roadmap) */}
      <LearningPathsSection paths={learningPaths} />

      {/* 4. key Features Grid */}
      <section className="relative bg-muted/20 border-y border-border overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">
              Engineered for Excellence
            </h2>
            <p className="text-muted-foreground text-lg">
              We leverage cloud-native technology to provide a robust, 
              scalable, and intuitive learning experience.
            </p>
          </div>
          <FeaturesSection features={features} />
        </div>
      </section>

      {/* 5. AI Coach Showcase */}
      <AIShowcaseSection />

      {/* 6. Featured Courses Library */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
             <div className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm mb-4">
                <Video className="w-5 h-5" />
                Digital Library
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">Popular Courses</h2>
            <p className="text-muted-foreground text-lg">Master in-demand skills with our top-rated video courses.</p>
          </div>
          <Link href="/lms/courses" className="text-primary font-black hover:text-primary/80 transition-all flex items-center gap-2 group">
            All Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/lms/courses/${course.slug.current}`}
            />
          ))}
        </div>
      </section>

      {/* 7. Stats / Social Proof */}
      <StatsSection />

      {/* 8. Call To Action */}
      <CTASection />

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
