import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, Award, BookOpen, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { getAuth } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { StudentStatsCards } from '@/components/student/student-stats-cards';
import { CourseCard } from '@/components/CourseCard';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { ExamCard } from '@/components/ExamCard';
import { LearningPathCard } from '@/components/LearningPathCard';
import { CourseProgress } from '@/components/CourseProgress';

export default async function StudentDashboardPage() {
    const { userId } = await getAuth();
    if (!userId) redirect('/sign-in');

    // Fetch real data from DB
    const enrollments = await db.getStudentEnrollmentsWithDetails(userId);
    const examEnrollments = await db.getStudentExamEnrollmentsWithDetails(userId);
    const pathEnrollments = await db.getStudentLearningPathEnrollmentsWithDetails(userId);

    // Calculate Real Stats
    const stats = {
        enrolledCount: enrollments.length + examEnrollments.length + pathEnrollments.length,
        completedCount: enrollments.filter(e => e.progress_percent === 100).length +
            examEnrollments.filter(e => e.status === 'passed').length +
            pathEnrollments.filter(e => e.progress === 100).length,
        avgScore: 0, // Needs logic
        certificatesCount: 0 // Needs logic
    };

    // Helper to calculate avg score if available
    const examsWithScores = examEnrollments.filter(e => e.score !== null);
    if (examsWithScores.length > 0) {
        stats.avgScore = Math.round(examsWithScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / examsWithScores.length);
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        My Dashboard
                    </h1>
                    <p className="text-muted-foreground">Welcome back! Track your progress and continue learning.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <StudentStatsCards {...stats} />

            {/* Main Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted border border-border w-full sm:w-auto justify-start overflow-x-auto overflow-y-hidden">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="courses">My Courses</TabsTrigger>
                    <TabsTrigger value="exams">My Exams</TabsTrigger>
                    <TabsTrigger value="paths">Learning Paths</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Learning Activity Chart */}
                        <div className="lg:col-span-2">
                            <ChartAreaInteractive />
                            {/* Note: In real app, pass data={studentActivityData} to Chart */}
                        </div>

                        {/* Recent Activity / Next Up */}
                        <div className="space-y-6">
                            <Card className="bg-card border-border h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg">Continue Learning</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {enrollments.slice(0, 3).map((enrollment) => (
                                        <div key={enrollment.course.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                                            <div className="w-16 h-16 rounded overflow-hidden shrink-0 relative">
                                                <img src={enrollment.course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlayCircle className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-sm truncate text-foreground">{enrollment.course.title}</h4>
                                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                    <span className="text-primary font-medium">{enrollment.progress_percent}%</span> Complete
                                                </div>
                                                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                                                        style={{ width: `${enrollment.progress_percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {enrollments.length === 0 && (
                                        <p className="text-muted-foreground text-sm">No recent activity.</p>
                                    )}
                                    <Link href="/lms/student/me/my-courses">
                                        <Button variant="ghost" className="w-full text-primary hover:text-primary/90 mt-2">View All My Courses</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* COURSES TAB */}
                <TabsContent value="courses" className="space-y-6">
                    <ViewProvider defaultView="list">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Enrolled Courses</h2>
                            <div className="flex items-center gap-4">
                                <ViewTrigger />
                                <Link href="/lms/courses">
                                    <Button variant="outline" className="border-border text-foreground hover:bg-muted">Browse Catalog</Button>
                                </Link>
                            </div>
                        </div>

                        {enrollments.length > 0 ? (
                            <>
                                {/* GRID VIEW */}
                                <ViewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {enrollments.map(enrollment => (
                                        <CourseCard
                                            key={enrollment.course.id}
                                            course={{
                                                _id: enrollment.course.id,
                                                title: enrollment.course.title,
                                                slug: { current: enrollment.course.slug || '' },
                                                image: enrollment.course.thumbnail_url,
                                                price: enrollment.course.price,
                                                category: { title: enrollment.course.category?.title || 'General' },
                                                modules: enrollment.course.modules
                                            }}
                                            href={`/lms/student/me/my-courses/${enrollment.course.id}/outline`}
                                            progress={enrollment.progress_percent}
                                        />
                                    ))}
                                </ViewGrid>

                                {/* LIST VIEW */}
                                <ViewList className="space-y-4">
                                    {enrollments.map(enrollment => {
                                        // Calculate module count
                                        const moduleCount = enrollment.course.modules?.length || 0;
                                        const category = enrollment.course.category?.title || 'General';

                                        return (
                                            <div key={enrollment.course.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors gap-4">
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <div className="h-16 w-16 rounded bg-muted overflow-hidden shrink-0">
                                                        <img src={enrollment.course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-bold text-foreground line-clamp-1">{enrollment.course.title}</h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                                                            <span>{category}</span>
                                                            <span className="hidden sm:inline">•</span>
                                                            <span>{moduleCount} Modules</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                    <div className="w-32">
                                                        <CourseProgress variant="default" size="sm" progress={enrollment.progress_percent} />
                                                    </div>
                                                    <Link href={`/lms/student/me/my-courses/${enrollment.course.id}/outline`}>
                                                        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-muted">
                                                            Continue
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ViewList>
                            </>
                        ) : (
                            <div className="text-center py-12 border border-dashed border-border rounded-lg text-muted-foreground">
                                No courses found. Time to start learning!
                            </div>
                        )}
                    </ViewProvider>
                </TabsContent>

                {/* EXAMS TAB */}
                <TabsContent value="exams" className="space-y-6">
                    <ViewProvider defaultView="list">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">My Exams</h2>
                            <div className="flex items-center gap-4">
                                <ViewTrigger />
                                <Link href="/lms/exams">
                                    <Button variant="outline" className="border-border text-foreground hover:bg-muted">Browse Exams</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {examEnrollments.length > 0 ? (
                                <>
                                    {/* GRID VIEW */}
                                    <ViewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {examEnrollments.map(enrollment => (
                                            <ExamCard
                                                key={enrollment.exam?.id}
                                                exam={enrollment.exam}
                                                status={enrollment.status}
                                                href={`/lms/student/exams/${enrollment.exam?.slug?.current || '#'}`}
                                            />
                                        ))}
                                    </ViewGrid>

                                    {/* LIST VIEW */}
                                    <ViewList className="space-y-4">
                                        {examEnrollments.map(enrollment => {
                                            const totalQuestions = enrollment.exam?.sections?.length
                                                ? enrollment.exam.sections.reduce((acc: any, section: any) => acc + (section.questions?.length || 0), 0)
                                                : (enrollment.exam?.questions?.length || 0);

                                            return (
                                                <div key={enrollment.exam?.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors gap-4">
                                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                                        <div className="h-16 w-16 rounded bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                                                            {enrollment.exam?.thumbnail_url ? (
                                                                <img src={enrollment.exam.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Shield className="w-8 h-8 text-primary" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-bold text-foreground line-clamp-1">{enrollment.exam?.title}</h3>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                                                                <span>Status: <span className="capitalize text-primary">{enrollment.status?.replace('_', ' ') || 'In Progress'}</span></span>
                                                                <span className="hidden sm:inline">•</span>
                                                                <span>{enrollment.exam?.duration_minutes || 0} min</span>
                                                                <span className="hidden sm:inline">•</span>
                                                                <span>{totalQuestions} Questions</span>
                                                                {enrollment.score !== null && (
                                                                    <>
                                                                        <span className="hidden sm:inline">•</span>
                                                                        <span>Score: {enrollment.score}%</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link href={`/lms/student/exams/${enrollment.exam?.slug?.current || '#'}`}>
                                                        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-muted">
                                                            {enrollment.status === 'passed' ? 'Review' : 'Continue'}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </ViewList>
                                </>
                            ) : (
                                <div className="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground">
                                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <p>You haven't enrolled in any certification exams yet.</p>
                                </div>
                            )}
                        </div>
                    </ViewProvider>
                </TabsContent>

                {/* PATHS TAB */}
                <TabsContent value="paths" className="space-y-6">
                    <ViewProvider defaultView="list">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">My Learning Paths</h2>
                            <div className="flex items-center gap-4">
                                <ViewTrigger />
                                <Link href="/lms/learning-paths">
                                    <Button variant="outline" className="border-border text-foreground hover:bg-muted">Browse Paths</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {pathEnrollments.length > 0 ? (
                                <>
                                    {/* GRID VIEW */}
                                    <ViewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {pathEnrollments.map(enrollment => (
                                            <LearningPathCard
                                                key={enrollment.learning_path?.id}
                                                path={enrollment.learning_path}
                                                progress={enrollment.progress} // Using 'progress' from db result
                                                href={`/lms/learning-paths/${enrollment.learning_path?.slug?.current || '#'}`}
                                            />
                                        ))}
                                    </ViewGrid>

                                    {/* LIST VIEW */}
                                    <ViewList className="space-y-4">
                                        {pathEnrollments.map(enrollment => (
                                            <div key={enrollment.learning_path?.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors gap-4">
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <div className="h-16 w-16 rounded bg-muted overflow-hidden shrink-0">
                                                        <img src={enrollment.learning_path?.image || ''} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-bold text-foreground line-clamp-1">{enrollment.learning_path?.title}</h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                                                            <span>{enrollment.learning_path?.courses?.length || 0} Modules</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link href={`/lms/learning-paths/${enrollment.learning_path?.slug?.current || '#'}`}>
                                                    <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                                                        Continue Path
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </ViewList>
                                </>
                            ) : (
                                <div className="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <p>No active learning paths.</p>
                                </div>
                            )}
                        </div>
                    </ViewProvider>
                </TabsContent>
            </Tabs>
        </div>
    );
}
