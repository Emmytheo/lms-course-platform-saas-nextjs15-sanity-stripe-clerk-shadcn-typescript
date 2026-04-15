import { getStudentDashboardAction } from "@/actions/student-dashboard";
import { CourseCard } from "@/components/CourseCard";
import { getAuth } from "@/lib/auth-wrapper";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";

export default async function StudentDashboardPage() {
  const { userId, sessionClaims } = await getAuth();
  if (!userId) return redirect("/sign-in");

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Redirect Admins and Instructors to the Admin/Instructor Dashboard (same route now)
  if (role === 'admin' || role === 'instructor') {
    redirect('/lms/admin');
  }

  const { courses, learningPaths } = await getStudentDashboardAction();

  return (
    <div className="p-6 md:p-12 space-y-12 bg-background min-h-screen text-foreground">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          My Learning Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back! Continue where you left off.</p>
      </div>

      {/* Enrolled Courses */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/lms/courses/${course.slug.current}`}
              progress={0}
            />
          ))}
          {courses.length === 0 && (
            <div className="col-span-full border border-dashed border-border rounded-lg p-12 text-center text-muted-foreground">
              You haven't enrolled in any courses yet. <br />
              <Link href="/lms/courses" className="text-primary hover:underline">Browse Courses</Link>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Learning Paths */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Recommended Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths?.map(path => (
            <Link key={path._id} href={`/lms/learning-paths/${path.slug.current}`} className="group">
              <Card className="bg-card border-border h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-card-foreground group-hover:text-primary transition-colors">
                    {path.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {path.description}
                  </p>
                  <div className="flex items-center text-xs text-primary font-bold uppercase tracking-wider">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {path.courses?.length || 0} Courses
                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {(!learningPaths || learningPaths.length === 0) && (
            <div className="col-span-full text-muted-foreground">No learning paths available yet.</div>
          )}
        </div>
      </section>

    </div>
  );
}
