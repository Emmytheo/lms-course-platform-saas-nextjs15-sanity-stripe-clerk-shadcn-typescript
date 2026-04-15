'use client';

import React, { useEffect, useState, use } from 'react';
import { getLPEnrollmentByIdAction, getMyEnrollmentsAction, getMyExamEnrollmentsAction } from '@/actions/enrollment';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Map, CheckCircle, ChevronRight, Lock, PlayCircle, Trophy, BookOpen,
    Target, Star, User, Clock, ArrowLeft, Shield, Award
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LPEnrollmentPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
    const { enrollmentId } = use(params);
    const [loading, setLoading] = useState(true);
    const [enrollment, setEnrollment] = useState<any>(null);
    const [path, setPath] = useState<any>(null);
    const [childEnrollments, setChildEnrollments] = useState<any[]>([]);
    const [childExamEnrollments, setChildExamEnrollments] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            getLPEnrollmentByIdAction(enrollmentId),
            getMyEnrollmentsAction(),
            getMyExamEnrollmentsAction()
        ]).then(([lpData, coursesData, examsData]) => {
            if (lpData) {
                setEnrollment(lpData);
                setPath(lpData.learning_path);

                // Self-healing: Update DB progress to match reality
                if (lpData.learning_path_id) {
                    import('@/actions/progress').then(({ syncLearningPathProgressAction }) => {
                        syncLearningPathProgressAction(lpData.learning_path_id);
                    });
                }
            }
            setChildEnrollments(coursesData || []);
            setChildExamEnrollments(examsData || []);
            setLoading(false);
        });
    }, [enrollmentId]);

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Path...</div>;
    }

    if (!enrollment || !path) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Learning Path Not Found</div>;
    }

    const courses = path.courses || [];
    const enrolledCount = 1234; // Placeholder


    // Calculate Deep Progress
    let completedItemsCount = 0;
    const itemsWithStatus = courses.reduce((acc: any[], item: any, index: number) => {
        const itemType = item.pass_score !== undefined ? 'exam' : 'course';
        let isCompleted = false;
        let childEnrollment = null;

        if (itemType === 'course') {
            childEnrollment = childEnrollments.find((e: any) => e.course_id === item._id);
            if (childEnrollment && (childEnrollment.completed || childEnrollment.progress_percent >= 100)) {
                isCompleted = true;
            }
        } else {
            childEnrollment = childExamEnrollments.find((e: any) => e.exam_id === item._id);
            if (childEnrollment && (childEnrollment.status === 'completed' || childEnrollment.score >= item.pass_score)) {
                isCompleted = true;
            }
        }

        if (isCompleted) completedItemsCount++;

        // Unlock Logic: Unlocked if it is the first item, OR previous item is completed
        const isUnlocked = index === 0 || (index > 0 && acc[index - 1].isCompleted);

        acc.push({ ...item, isCompleted, isUnlocked, itemType, childEnrollment });
        return acc;
    }, []);

    const deepProgressPercent = courses.length > 0 ? Math.round((completedItemsCount / courses.length) * 100) : 0;
    const courseCount = courses.filter((c: any) => c.pass_score === undefined).length;
    const examCount = courses.filter((c: any) => c.pass_score !== undefined).length;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Hero Section */}
            <div className="relative h-fit w-full border-b border-border">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
                <div className="absolute inset-0 z-0 opacity-30">
                    {path.image ? (
                        <img src={path.image} className="w-full h-full object-cover" alt={path.title} />
                    ) : (
                        <div className="w-full h-full bg-muted" />
                    )}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4 max-w-3xl">
                        <Link href="/lms/student/me" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Link>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-primary text-primary">{path.level || 'All Levels'}</Badge>
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Enrolled</Badge>
                            <div className="flex items-center gap-1 text-yellow-500 text-sm ml-2">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold">5.0</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">{path.title}</h1>
                        <p className="text-xl text-muted-foreground">{path.description}</p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                            <div className="flex items-center gap-2"><User className="w-4 h-4" /> {enrolledCount.toLocaleString()} Students</div>
                            <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> {path.language || 'English'}</div>
                        </div>
                    </div>


                    {/* Quick Progress Card in Header */}
                    <div className="w-full md:w-80 shrink-0">
                        <Card className="bg-card/90 border-border backdrop-blur-md shadow-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold text-card-foreground flex justify-between">
                                    Your Progress
                                    <span className="text-primary">{deepProgressPercent}%</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Progress value={deepProgressPercent} className="h-2 bg-muted" indicatorClassName="bg-primary" />
                                <div className="text-sm text-muted-foreground flex justify-between">
                                    <span>{completedItemsCount}/{courses.length} Steps</span>
                                    <span>{itemsWithStatus.find((i: any) => i.isUnlocked && !i.isCompleted) ? 'In Progress' : 'Tracked'}</span>
                                </div>
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                                    {deepProgressPercent === 100 ? "View Certificate" : "Continue Path"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        import('@/actions/progress').then(({ syncUserEnrollmentsProgressAction }) => {
                                            syncUserEnrollmentsProgressAction();
                                            window.location.reload();
                                        });
                                    }}
                                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Refresh Progress
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Learning Objectives */}
                    {path.objectives && path.objectives.length > 0 && (
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-card-foreground">
                                    <Target className="w-5 h-5 text-primary" /> What you'll learn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {path.objectives.map((obj: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                            <span className="text-sm">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Curriculum */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-card-foreground">
                                <BookOpen className="w-5 h-5 text-primary" /> Curriculum
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {courseCount} courses • {examCount} exams • {courses.length} steps
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {itemsWithStatus.map((item: any, idx: number) => {
                                const isExam = item.itemType === 'exam';
                                const meta = isExam ? `${item.pass_score}% Pass Score` : `Module`;

                                return (
                                    <div
                                        key={item._id}
                                        className={cn(
                                            "group border rounded-lg transition-all p-4 flex flex-col md:flex-row items-center justify-between gap-4",
                                            item.isCompleted
                                                ? "bg-card/50 border-border hover:border-primary/30"
                                                : item.isUnlocked
                                                    ? "bg-card border-border hover:border-primary"
                                                    : "bg-card border-border opacity-60"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 w-full">
                                            <div className={cn(
                                                "h-10 w-10 shrink-0 rounded-full flex items-center justify-center border text-sm font-mono transition-colors",
                                                item.isCompleted
                                                    ? "bg-primary/20 border-primary text-primary"
                                                    : item.isUnlocked
                                                        ? "bg-primary/20 border-primary text-primary"
                                                        : "bg-muted border-border text-muted-foreground"
                                            )}>
                                                {item.isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className={cn("font-bold transition-colors", item.isUnlocked || item.isCompleted ? "text-foreground group-hover:text-primary" : "text-muted-foreground")}>
                                                        {item.title}
                                                    </h3>
                                                    {isExam && <Badge className="bg-primary/20 text-primary h-5 text-[10px] px-1 hover:bg-primary/30">Exam</Badge>}
                                                    {!item.isUnlocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex gap-2">
                                                    <span>{isExam ? "Exam" : "Course"}</span> • <span>{meta}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {item.isUnlocked ? (
                                            <Link href={
                                                item.itemType === 'course'
                                                    ? (item.childEnrollment ? `/lms/student/me/my-courses/${item.childEnrollment.id}` : `/lms/courses/${item.slug.current}`)
                                                    : (item.childEnrollment ? `/lms/student/me/my-exams/${item.childEnrollment.id}` : `/lms/student/exams`)
                                                // Note: using explicit logic for href. If enrolled -> player. If not -> Enrollment Page (which is usually public course page)
                                            }>
                                                <Button
                                                    variant={item.isCompleted ? "outline" : "default"}
                                                    size="sm"
                                                    className={cn(
                                                        "w-full md:w-auto font-bold min-w-[120px]",
                                                        !item.isCompleted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-primary border-primary hover:bg-primary/20"
                                                    )}
                                                >
                                                    {item.isCompleted ? "Review" : item.childEnrollment ? "Continue" : "Start"}
                                                    {!item.isCompleted && <ChevronRight className="w-4 h-4 ml-2" />}
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button variant="ghost" size="sm" disabled className="text-muted-foreground border border-border bg-muted/50">
                                                Locked
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-card-foreground">Instructors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                {path.instructor ? (
                                    <img src={path.instructor.photo} alt={path.instructor.name} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                        <User className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-card-foreground">{path.instructor?.name || 'LMS Team'}</div>
                                    <div className="text-xs text-primary">Curriculum Designers</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-card-foreground">Path Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-bold text-card-foreground">Self-paced</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Level</span>
                                <span className="font-bold text-card-foreground">{path.level || 'All Levels'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Certificates</span>
                                <span className="font-bold text-card-foreground">Yes, Included</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}

function Globe(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
