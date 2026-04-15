import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Target,
  CheckCircle,
  Award,
  BarChart3,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { EnrollButton } from "@/components/EnrollButton";
import { getAuth } from "@/lib/auth-wrapper"; // Assuming we want check enrollment status later

export default async function LearningPathDetailPage({ params }) {
  const { slug } = await params;
  const path = await db.getLearningPath(slug);
  const { userId } = await getAuth();

  if (!path) {
    notFound();
  }

  // Separate courses and exams from the polymorphic list
  const courses = path.courses?.filter(c => !('pass_score' in c)) || [];
  const exams = path.courses?.filter(c => 'pass_score' in c) || [];

  // Determine enrollment (Optional: check if user already enrolled in path)
  // const isEnrolled = ...

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-fit w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40" />
        <div className="relative inset-0 container mx-auto p-8 md:px-16 flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-none"
                >
                  Learning Path
                </Badge>
                {path.level && (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-none"
                  >
                    {path.level}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {path.title}
              </h1>
              <p className="text:lg md:text-xl text-white/90 max-w-3xl">
                {path.description}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:min-w-80 border border-white/20">
              {/* <div className="text-3xl font-bold text-white mb-2">
                Free
              </div> */}
              {/* Path duration logic? Sum of courses? */}

              <div className="mt-4">
                <EnrollButton
                  itemId={path._id}
                  itemType="learning-path"
                  title={path.title}
                  price={0} // Paths usually free or bundle price? Assuming free/0 for now as strict schema missing price
                  description={path.description?.substring(0, 100)}
                // isEnrolled={isEnrolled}
                />
              </div>

              <div className="text-center mt-3">
                <span className="text-white/70 text-sm">
                  Complete collection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Objectives */}
            {path.objectives && path.objectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {path.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Curriculum
                </CardTitle>
                <CardDescription>
                  {courses.length} courses • {exams.length} exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Courses */}
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex justify-start w-full sm:w-fit items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm line-clamp-1">
                            {course.title}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center gap-4 w-full sm:w-fit ">
                        <Link href={`/courses/${course.slug.current}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Exams */}
                  {exams.map((exam) => (
                    <div
                      key={exam._id}
                      className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex justify-start w-full sm:w-fit items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm line-clamp-1">
                            {exam.title}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center gap-4 w-full sm:w-fit">
                        {/* Link to exam details? Exams have /exams/[slug] or /cbt? */}
                        {/* Assuming /exams/[slug] or similar public page */}
                        {/* <Link href={`/exams/${exam.slug.current}`}>
                             <Button variant="outline" size="sm">Details</Button>
                        </Link> */}
                        <Badge variant="secondary">Exam</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Path Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Path Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium">{path.level || 'All Levels'}</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
