'use client';

import React, { useEffect, useState, use } from 'react';
import { getCourse } from '@/actions/courses';
import { markLessonCompleteAction, getEnrollmentProgressAction } from '@/actions/progress';
import { Course, Module, Lesson } from '@/lib/db/interface';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { CourseSidebar } from '@/components/lms/CourseSidebar';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { GamePlayer } from '@/components/lms/GamePlayer';
import { QuizPlayer } from '@/components/lms/QuizPlayer';
import { toast } from 'sonner';

export default function CoursePlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // 'id' here is the slug based on route structure expectation
    const [course, setCourse] = useState<Course | undefined>(undefined);
    const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(undefined);
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Assuming 'id' param is actually the SLUG or ID. 
        // getCourse handles both via getAllCourses filter currently.
        getCourse(id).then(async (c) => {
            setCourse(c || undefined);

            if (c) {
                // Fetch progress
                const { completedLessonIds } = await getEnrollmentProgressAction(c._id);
                setCompletedLessonIds(completedLessonIds || []);

                // Default to first lesson
                if (c.modules?.[0]?.lessons?.[0]) {
                    setActiveLesson(c.modules[0].lessons[0]);
                }
            }
            setLoading(false);
        });
    }, [id]);

    const handleLessonComplete = async () => {
        if (!activeLesson || !course) return;

        // Optimistic update
        if (!completedLessonIds.includes(activeLesson._id)) {
            setCompletedLessonIds(prev => [...prev, activeLesson._id]);
            toast.success("Lesson Completed!");

            await markLessonCompleteAction(course._id, activeLesson._id, true);
        }
    };

    // --- Navigation Logic ---
    const getAllLessons = () => {
        if (!course?.modules) return [];
        return course.modules.flatMap(m => m.lessons || []);
    };

    const getNextLesson = () => {
        const all = getAllLessons();
        if (!activeLesson || !all.length) return undefined;
        const idx = all.findIndex(l => l._id === activeLesson._id);
        return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
    };

    const getPrevLesson = () => {
        const all = getAllLessons();
        if (!activeLesson || !all.length) return undefined;
        const idx = all.findIndex(l => l._id === activeLesson._id);
        return idx > 0 ? all[idx - 1] : undefined;
    };

    const goToNextLesson = () => {
        console.log("Going to next lesson");
        const next = getNextLesson();
        if (next) setActiveLesson(next);
    };

    const goToPrevLesson = () => {
        console.log("Going to previous lesson");
        const prev = getPrevLesson();
        if (prev) setActiveLesson(prev);
    };

    // Calculate progress
    const totalLessons = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const progressPercentage = totalLessons > 0 ? (completedLessonIds.length / totalLessons) * 100 : 0;

    if (loading) return <div className="h-screen bg-background flex items-center justify-center text-foreground">Loading Course...</div>;
    if (!course) return <div className="h-screen bg-background flex items-center justify-center text-foreground">Course not found</div>;

    return (
        <div className="h-screen bg-background text-foreground flex overflow-hidden">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 shrink-0 h-full z-20 relative">
                <CourseSidebar
                    course={course}
                    activeLessonId={activeLesson?._id}
                    onSelectLesson={setActiveLesson}
                    progress={progressPercentage}
                    completedLessonIds={completedLessonIds}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background relative">

                {/* Mobile Header */}
                <header className="lg:hidden h-14 border-b border-border flex items-center px-4 justify-between bg-card shrink-0">
                    <div className="flex items-center gap-3">
                        <Link href="/lms/dashboard">
                            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                        </Link>
                        <span className="font-bold truncate max-w-[200px]">{activeLesson?.title}</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 bg-card border-r-border text-foreground">
                            <CourseSidebar
                                course={course}
                                activeLessonId={activeLesson?._id}
                                onSelectLesson={setActiveLesson}
                                progress={progressPercentage}
                            />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-0 flex flex-col">

                    {/* Viewer Container */}
                    <div className="flex-1 relative flex flex-col">
                        {!activeLesson ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                Select a lesson to view content
                            </div>
                        ) : activeLesson.type === 'video' ? (
                            <div className="w-full aspect-video max-h-[calc(100vh-64px)] bg-black">
                                <VideoPlayer
                                    url={activeLesson.videoUrl || ''}
                                    onComplete={handleLessonComplete}
                                />
                            </div>
                        ) : activeLesson?.type === 'game' ? (
                            <div className="h-full min-h-[500px]">
                                <GamePlayer lessonId={activeLesson._id} />
                            </div>
                        ) : activeLesson?.type === 'quiz' ? (
                            <div className="h-full min-h-[500px] bg-background overflow-y-auto">
                                <QuizPlayer lesson={activeLesson} />
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto w-full p-8 md:p-12">
                                <h1 className="text-3xl font-bold mb-6">{activeLesson?.title}</h1>
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <div className="whitespace-pre-wrap">{activeLesson?.content || "No content available."}</div>
                                </div>
                                {/* <div className="mt-8 flex gap-4">
                            <Button
                                onClick={handleLessonComplete}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white"
                                disabled={!activeLesson || completedLessonIds.includes(activeLesson._id)}
                            >
                                {activeLesson && completedLessonIds.includes(activeLesson._id) ? "Completed" : "Mark as Complete"}
                            </Button>
                                    <Button onClick={goToNextLesson} variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-950">
                                        Next Lesson &rarr;
                                    </Button>
                                </div> */}
                            </div>
                        )}
                    </div>

                    {/* Lesson Footer / Navigation */}
                    <div className="p-4 border-t border-border bg-card flex justify-between items-center shrink-0">
                        <div className="text-sm text-muted-foreground hidden md:block">
                            {activeLesson?.title}
                        </div>
                        <div className="flex gap-4 ml-auto">
                            <Button
                                onClick={handleLessonComplete}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={!activeLesson || completedLessonIds.includes(activeLesson._id)}
                            >
                                {activeLesson && completedLessonIds.includes(activeLesson._id) ? "Completed" : "Mark as Complete"}
                            </Button>
                            <Button
                                onClick={goToPrevLesson}
                                variant="outline"
                                className="border-border text-muted-foreground"
                                disabled={!getPrevLesson()}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={goToNextLesson}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={!getNextLesson()}
                            >
                                Next Lesson
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
