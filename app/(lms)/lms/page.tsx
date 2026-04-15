import { db } from "@/lib/db";
import { CourseCard } from "@/components/CourseCard";
import { LMSHeroSection } from "@/components/lms-landing/LMSHeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LMSStatsSection } from "@/components/lms-landing/LMSStatsSection";
import { LMSCTASection } from "@/components/lms-landing/LMSCTASection";
import { LMSAIShowcaseSection } from "@/components/lms-landing/LMSAIShowcaseSection";
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
  Rocket
} from "lucide-react";
import { Course } from "@/lib/db/interface";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InteractiveShowcaseSection } from "@/components/landing/InteractiveShowcaseSection"; // Keeping interactive/games for now, can be rebranded if needed

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function LMSHomePage() {
  const [rawCourses, learningPaths] = await Promise.all([
    db.getAllCourses(),
    db.getAllLearningPaths()
  ]);

  // Safe mapping to ensure matching Course interface
  const courses: Course[] = rawCourses.map((c: any) => ({
    ...c,
    _id: c._id,
    title: c.title || "Untitled Course",
    slug: typeof c.slug === 'object' && c.slug?.current ? c.slug : { current: c.slug || "" },
  }));

  const featuredCourses = courses.slice(0, 4);

  const features = [
    {
      title: "AI-Enhanced Learning",
      description: "Get personalized feedback and recommendations to optimize your learning journey.",
      icon: Brain,
    },
    {
      title: "Gamified Progress",
      description: "Earn XP, badges, and traverse levels as you master new skills and complete modules.",
      icon: Trophy,
    },
    {
      title: "Structured Career Paths",
      description: "Step-by-step curriculums designed by industry experts to take you from beginner to professional.",
      icon: Target,
    },
    {
      title: "Global Community",
      description: "Join a network of learners. Compare stats, share knowledge, and grow together.",
      icon: Users,
    },
    {
      title: "Premium Video Content",
      description: "High-definition video lectures and tutorials for in-depth understanding.",
      icon: Video,
    },
    {
      title: "Performance Analytics",
      description: "Visualise your growth with detailed charts and skill-gap analysis.",
      icon: Zap,
    },
    {
      title: "Expert Instructors",
      description: "Learn from world-class professionals and certified industry leaders.",
      icon: ShieldCheck,
    },
    {
      title: "Career Boosting",
      description: "Earn verifiable certificates to showcase your achievements to employers.",
      icon: Rocket,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">

      {/* Mixed Navbar */}
      <LandingNavbar />

      {/* 1. Immersive Hero Section (Generic) */}
      <LMSHeroSection />

      {/* 2. Stats / Social Proof (Generic) */}
      <LMSStatsSection />

      {/* 3. Learning Paths Showcase */}
      <LearningPathsSection paths={learningPaths} />

      {/* 4. AI Showcase (Generic) */}
      <LMSAIShowcaseSection />

      {/* 5. Interactive Showcase */}
      {/* Hidden if too specific, or keep if games are relevant to generic skills */}
      {/* <InteractiveShowcaseSection /> */}

      {/* 6. Featured Courses */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm mb-4">
              <Video className="w-5 h-5" />
              Library
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Popular Courses</h2>
            <p className="text-muted-foreground text-lg">Start your journey with our top-rated programs.</p>
          </div>
          <a href="/lms/courses" className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-2">
            View All Courses &rarr;
          </a>
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

      {/* 7. Key Features Grid */}
      <section className="relative bg-muted/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Complete Learning Ecosystem
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to master your craft, from technical skills to soft skills.
            </p>
          </div>
          <FeaturesSection features={features} />
        </div>
      </section>

      {/* 8. Call To Action (Generic) */}
      <LMSCTASection />

      {/* Footer (Simple) */}
      <footer className="py-12 border-t border-border bg-background text-center text-muted-foreground text-sm">
        <div className="mb-4 flex items-center justify-center gap-2 opacity-50">
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-muted-foreground">
            <Zap className="w-3 h-3 fill-current" />
          </div>
          <span className="font-bold tracking-tighter">SKILL<span className="text-muted-foreground">HUB</span></span>
        </div>
        <p>&copy; {new Date().getFullYear()} SkillHub LMS. All rights reserved.</p>
      </footer>

    </div>
  );
}
