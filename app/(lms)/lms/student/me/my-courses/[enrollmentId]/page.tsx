'use client';

import React, { useEffect, useState, use } from 'react';
import { getEnrollmentByIdAction } from '@/actions/enrollment'; // Need this action
import { markLessonCompleteAction } from '@/actions/progress';
import { Course, Module, Lesson } from '@/lib/db/interface';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { CourseSidebar } from '@/components/lms/CourseSidebar';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { GamePlayer } from '@/components/lms/GamePlayer';
import { QuizPlayer } from '@/components/lms/QuizPlayer';

export default function EnrollmentPlayerPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
    const { enrollmentId } = use(params);
    const [enrollment, setEnrollment] = useState<any>(null);
    const [course, setCourse] = useState<Course | undefined>(undefined);
    const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(undefined);
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEnrollmentByIdAction(enrollmentId).then((data) => {
            if (data && data.course) {
                setEnrollment(data);
                setCourse(data.course);

                // Set progress
                const progressMap = (data.progress as Record<string, { completed: boolean }>) || {};
                const completed = Object.entries(progressMap)
                    .filter(([_, val]) => val.completed)
                    .map(([key]) => key);
                setCompletedLessonIds(completed);

                // Default to first lesson
                if (data.course.modules?.[0]?.lessons?.[0]) {
                    setActiveLesson(data.course.modules[0].lessons[0]);
                }
            }
            setLoading(false);
        });
    }, [enrollmentId]);

    const handleLessonComplete = async () => {
        if (!activeLesson || !course) return;

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
        const next = getNextLesson();
        if (next) setActiveLesson(next);
    };

    const goToPrevLesson = () => {
        const prev = getPrevLesson();
        if (prev) setActiveLesson(prev);
    };

    const totalLessons = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const progressPercentage = totalLessons > 0 ? (completedLessonIds.length / totalLessons) * 100 : 0;

    if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (!course) return <div className="h-screen bg-black flex items-center justify-center text-white">Course not found</div>;

    return (
        <div className="h-screen bg-black text-white flex overflow-hidden">
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
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative">
                {/* Mobile Header */}
                <header className="lg:hidden h-14 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-900 shrink-0">
                    <div className="flex items-center gap-3">
                        <Link href="/lms/student/me/my-courses">
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <span className="font-bold truncate max-w-[200px]">{activeLesson?.title}</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 bg-zinc-900 border-r-zinc-800 text-white">
                            <CourseSidebar
                                course={course}
                                activeLessonId={activeLesson?._id}
                                onSelectLesson={setActiveLesson}
                                progress={progressPercentage}
                            />
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 overflow-y-auto p-0 flex flex-col">
                    <div className="flex-1 relative flex flex-col">
                        {!activeLesson ? (
                            <div className="flex h-full items-center justify-center text-zinc-500">
                                Select a lesson to view content
                            </div>
                        ) : activeLesson.type === 'video' ? (
                            <div className="w-full aspect-video max-h-[calc(100vh-122px)] bg-black">
                                <VideoPlayer
                                    url={activeLesson.videoUrl || ''}
                                    onComplete={handleLessonComplete}
                                />
                            </div>
                        ) : activeLesson.type === 'game' ? (
                            <div className="h-full min-h-[500px]">
                                <GamePlayer lessonId={activeLesson._id} />
                            </div>
                        ) : activeLesson.type === 'quiz' ? (
                            <div className="h-full min-h-[500px] bg-zinc-950 overflow-y-auto">
                                <QuizPlayer lesson={activeLesson} />
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto w-full p-8 md:p-12">
                                <h1 className="text-3xl font-bold mb-6">{activeLesson.title}</h1>
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <div className="whitespace-pre-wrap">{activeLesson.content || "No content available."}</div>
                                </div>
                                {/* <div className="mt-8 flex gap-4">
                                    <Button
                                        onClick={handleLessonComplete}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white"
                                        disabled={completedLessonIds.includes(activeLesson._id)}
                                    >
                                        {completedLessonIds.includes(activeLesson._id) ? "Completed" : "Mark as Complete"}
                                    </Button>
                                    <Button onClick={goToNextLesson} variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-950">
                                        Next Lesson &rarr;
                                    </Button>
                                </div> */}
                            </div>
                        )}
                    </div>
                    {/* Footer Nav */}
                    <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center shrink-0">
                        <div className="text-sm text-gray-400 hidden md:block">
                            {activeLesson?.title}
                        </div>
                        <div className="flex gap-4 ml-auto">
                            {activeLesson && (
                                <Button
                                    onClick={handleLessonComplete}
                                    variant="outline"
                                    className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                                    disabled={completedLessonIds.includes(activeLesson._id)}
                                >
                                    {completedLessonIds.includes(activeLesson._id) ? "Completed" : "Mark as Complete"}
                                </Button>
                            )}
                            <Button
                                onClick={goToPrevLesson}
                                variant="outline"
                                className="border-zinc-700 text-gray-300"
                                disabled={!getPrevLesson()}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={goToNextLesson}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white"
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
