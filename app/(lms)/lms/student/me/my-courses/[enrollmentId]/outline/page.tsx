import React from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlayCircle, Clock, FileText, CheckCircle, Lock, Shield, BarChart3, HelpCircle, List, User } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EnrollmentOutlinePage({ params }: { params: Promise<{ enrollmentId: string }> }) {
    const { enrollmentId } = await params;

    const enrollment = await db.getEnrollment(enrollmentId);

    if (!enrollment) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Enrollment not found.</div>;
    }

    const { course: dbCourse } = enrollment;

    if (!dbCourse) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Course data missing.</div>;
    }

    const course = {
        id: dbCourse._id,
        title: dbCourse.title,
        description: dbCourse.description,
        thumbnail_url: dbCourse.image || '/placeholder-course.jpg', // Provide a default if missing
        difficulty: dbCourse.level || 'All Levels',
        tags: [dbCourse.category?.title, ...(dbCourse.tags || [])].filter(Boolean) as string[],
        duration_minutes: 0, // DB doesn't have this yet, maybe sum lessons later
        modules: dbCourse.modules || [],
        objectives: dbCourse.objectives,
        prerequisites: dbCourse.prerequisites,
        instructor: dbCourse.instructor,
        level: dbCourse.level,
        last_updated: dbCourse.last_updated,
        image: dbCourse.image,
        category: dbCourse.category,
    };




    const totalLessons = course.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0;

    // Progress Calculation
    const progressMap = (enrollment.progress as Record<string, { completed: boolean }>) || {};
    const completedLessonIds = Object.entries(progressMap)
        .filter(([_, val]) => val.completed)
        .map(([key]) => key);

    const completedCount = completedLessonIds.length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Hero Section */}
            <div className="relative h-[75vh] md:h-[60vh] min-h-[500px] flex items-end pb-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={course.image || '/placeholder-course.jpg'} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row gap-8 items-end">
                    <div className="flex-1 space-y-4">
                        <div className="flex gap-2">
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">All Levels</Badge>
                            {/* {course.category?.title && <Badge variant="secondary" className="bg-background/20 text-foreground backdrop-blur-sm hover:bg-background/40">{course.category.title}</Badge>} */}
                            {course.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-background/20 text-foreground backdrop-blur-sm hover:bg-background/40">{tag}</Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground">{course.title}</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">{course.description}</p>
                        <div className="flex items-center gap-6 text-muted-foreground pt-2">
                            <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> {totalLessons * 10} Minutes</span> {/* Estimate */}
                            <span>•</span>
                            <span>{course.modules?.length || 0} Modules</span>
                            <span>•</span>
                            <span>{totalLessons} Lessons</span>
                        </div>
                    </div>

                    <div className="w-full md:w-80 shrink-0">
                        <Card className="bg-card/90 border-border backdrop-blur-md">
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center pb-4 border-b border-border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-muted-foreground text-sm uppercase tracking-wider">Your Progress</span>
                                        <span className="text-primary font-bold">{progressPercent}%</span>
                                    </div>
                                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-1000"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{completedCount} of {totalLessons} lessons completed</p>
                                </div>

                                <Link href={`/lms/student/me/my-courses/${enrollmentId}`} className="block">
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 text-lg">
                                        {progressPercent === 0 ? "Start Learning" : "Continue Learning"}
                                    </Button>
                                </Link>
                                <p className="text-xs text-center text-muted-foreground">
                                    Full lifetime access • Certificate of completion
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
                            <FileText className="w-6 h-6 text-primary" /> Course Curriculum
                        </h2>

                        <Accordion type="single" collapsible className="space-y-4">
                            {(course.modules || []).map((module: any, idx: number) => (
                                <AccordionItem key={module._id} value={module._id} className="border border-border rounded-lg bg-card/50 px-4">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-start gap-4 text-left">
                                            <span className="font-mono text-primary/50 text-sm pt-1">0{idx + 1}</span>
                                            <div>
                                                <div className="font-bold text-lg text-foreground">{module.title}</div>
                                                <div className="text-sm text-muted-foreground">{module.lessons?.length || 0} Lessons</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 pb-4 space-y-2">
                                        {module.lessons?.map((lesson: any) => {
                                            const isCompleted = completedLessonIds.includes(lesson._id);
                                            return (
                                                <div key={lesson._id} className="flex items-center justify-between p-3 rounded hover:bg-accent/50 transition-colors group cursor-default">
                                                    <div className="flex items-center gap-3">
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                        ) : (
                                                            lesson.type === 'video' ? <PlayCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary" /> :
                                                                lesson.type === 'quiz' ? <Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary" /> :
                                                                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                        )}
                                                        <span className={isCompleted ? "text-muted-foreground" : "text-muted-foreground group-hover:text-foreground"}>{lesson.title}</span>
                                                    </div>
                                                    {isCompleted && <Badge variant="secondary" className="bg-green-900/20 text-green-500 border-green-900">Completed</Badge>}
                                                </div>
                                            );
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {course.objectives && course.objectives.length > 0 && (
                        <div className="bg-card/30 border border-border rounded-xl p-8">
                            <h3 className="text-xl font-bold mb-4 text-foreground">What you'll learn</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.objectives.map((obj: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary shrink-0" /> {obj}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Instructor Card - Added as requested */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4 text-card-foreground">Instructor</h3>
                        <div className="flex items-center gap-3">
                            {course.instructor?.photo ? (
                                <img src={course.instructor.photo} alt={course.instructor.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                    <User className="w-6 h-6 text-muted-foreground" />
                                </div>
                            )}
                            <div>
                                <div className="font-bold text-card-foreground">{course.instructor?.name || 'Instructor'}</div>
                                <div className="text-xs text-primary">Expert Instructor</div>
                            </div>
                        </div>
                    </div>

                    {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-bold mb-4 text-card-foreground">Prerequisites</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {course.prerequisites.map((req: string, i: number) => (
                                    <li key={i} className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4 text-card-foreground">Course Stats</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Level</span>
                                <span className="text-card-foreground">{course.level || 'All Levels'}</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Last Updated</span>
                                <span className="text-card-foreground">Jan 2026</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    );
}
