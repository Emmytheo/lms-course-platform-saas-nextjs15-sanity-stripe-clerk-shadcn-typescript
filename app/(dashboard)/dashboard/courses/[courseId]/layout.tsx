import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getCourseProgress } from "@/sanity/lib/lessons/getCourseProgress";
import { checkCourseAccess } from "@/lib/auth";
// import Header from "@/components/Header";
import DashboardHeader from "@/components/DashboardHeader";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const user = await currentUser();
  const { courseId } = await params;

  if (!user?.id) {
    return redirect("/");
  }

  const authResult = await checkCourseAccess(user?.id || null, courseId);
  if (!authResult.isAuthorized || !user?.id) {
    return redirect(authResult.redirect!);
  }

  const [course, progress] = await Promise.all([
    getCourseById(courseId),
    getCourseProgress(user.id, courseId),
  ]);

  if (!course) {
    return redirect("/my-courses");
  }

  return (
    <div className="h-full">
      <DashboardHeader />
      
      <Sidebar course={course} completedLessons={progress.completedLessons} />
      
      <main className="h-full mt-16 lg:pt-[64px] lg:pl-96">{children}</main>
      
    </div>
  );
}
