'use client';

import React, { useEffect, useState, use } from 'react';
import { getExamEnrollmentByIdAction, saveExamResultAction, resetExamEnrollmentAction } from '@/actions/enrollment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, AlertCircle, CheckCircle, ChevronRight, ChevronLeft, Save, Menu, Award, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ExamSidebar } from '@/components/lms/ExamSidebar'; // Import Sidebar
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile sidebar

// Types for local state
interface ExamState {
    currentSectionIndex: number;
    answers: Record<string, number>; // Question ID -> Option Index
    score: number | null; // Null if not submitted
    submitted: boolean;
    timeLeft: number | null; // Seconds
}

export default function ExamPlayerPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
    const { enrollmentId } = use(params);
    const [loading, setLoading] = useState(true);
    const [enrollment, setEnrollment] = useState<any>(null);
    const [exam, setExam] = useState<any>(null);

    // Exam Session State
    const [started, setStarted] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [reviewMode, setReviewMode] = useState(false);

    const [viewMode, setViewMode] = useState<'list' | 'single'>('list');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index within the current SECTION
    const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0); // For tracking "active" question in sidebar

    useEffect(() => {
        getExamEnrollmentByIdAction(enrollmentId).then((data) => {
            if (data) {
                setEnrollment(data);
                setExam(data.exam);
                // Check if already completed
                if (data.status === 'completed') {
                    setSubmitted(true);
                    setScore(data.score || 0);
                    setAnswers(data.answers || {});
                }
            }
            setLoading(false);
        });
    }, [enrollmentId]);

    // Timer Effect
    useEffect(() => {
        if (!started || submitted || !exam) return;

        // Initialize time if null
        if (timeLeft === null) {
            setTimeLeft(exam.duration_minutes * 60);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev !== null && prev <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev !== null ? prev - 1 : 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [started, submitted, exam, timeLeft]);

    // Update global index when section changes (default to first question of section)
    // This mostly aids "List View" navigation to keep sidebar in sync
    useEffect(() => {
        if (!exam || !started) return;
        const sections = exam.sections || [{ questions: exam.questions || [] }];
        let count = 0;
        for (let i = 0; i < currentSection; i++) {
            count += sections[i].questions.length;
        }
        // Only update if we are not in single mode to avoid fighting with local index, 
        // OR simply ensure it syncs to start of section.
        // In Single Mode, we handle global index manually in next/prev.
        if (viewMode === 'list') {
            setCurrentGlobalIndex(count);
        }
    }, [currentSection, exam, started, viewMode]);


    const handleStart = () => {
        setStarted(true);
    };

    const handleAnswer = (questionId: string, optionIndex: number) => {
        if (submitted) return;
        setAnswers(prev => {
            const newAnswers = {
                ...prev,
                [questionId]: optionIndex
            };
            return newAnswers;
        });
    };

    // Update handleJumpToQuestion to sync local index
    const handleJumpToQuestion = (globalIndex: number) => {
        if (!exam) return;
        const sections = exam.sections || [{ questions: exam.questions || [] }];

        let count = 0;
        for (let i = 0; i < sections.length; i++) {
            const secLen = sections[i].questions.length;
            if (globalIndex >= count && globalIndex < count + secLen) {
                setCurrentSection(i);
                setCurrentQuestionIndex(globalIndex - count); // Capture local index
                setCurrentGlobalIndex(globalIndex);
                return;
            }
            count += secLen;
        }
    };

    const calculateScore = () => {
        if (!exam) return 0;
        let totalPoints = 0;
        let earnedPoints = 0;

        const allSections = exam.sections || [{ title: "General", questions: exam.questions || [] }];

        // Helper to get correct index robustly
        const getCorrectOptionIndex = (q: any) => {
            if (typeof q.correct_option_index === 'number') return q.correct_option_index;
            if (q.correctAnswer && q.options) {
                return q.options.indexOf(q.correctAnswer);
            }
            return -1;
        };

        allSections.forEach((s: any, sIdx: number) => {
            s.questions.forEach((q: any, qIdx: number) => {
                const bestId = q.id || `q-${sIdx}-${qIdx}`;
                const points = q.points || 1;
                const userAnswer = answers[bestId];
                const correctIndex = getCorrectOptionIndex(q);

                totalPoints += points;

                if (userAnswer !== undefined && userAnswer === correctIndex) {
                    earnedPoints += points;
                }
            });
        });

        if (totalPoints === 0) return 0;
        return Math.round((earnedPoints / totalPoints) * 100);
    };

    const handleSubmit = async () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setSubmitted(true);

        try {
            const res = await saveExamResultAction(enrollmentId, finalScore, answers);
            if (res.success) {
                toast.success("Exam submitted successfully!");
            } else {
                toast.error("Failed to save result. Please check connection.");
            }
        } catch (e) {
            toast.error("Error submitting exam");
        }
    };

    // Loading Guard
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">Loading Exam...</p>
                </div>
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Exam Not Found</h1>
                    <Link href="/lms/student/me/my-exams">
                        <Button>Return to Exams</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // VIEW STATE 1: RESULTS (Submitted)
    // ------------------------------------------------------------------
    // ------------------------------------------------------------------
    // VIEW STATE 1: RESULTS (Submitted)
    // ------------------------------------------------------------------
    if (submitted && !reviewMode) {
        const passed = score >= (exam.pass_score || 70);
        return (
            <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-6 bg-dot-pattern">
                <Card className="max-w-md w-full border-border bg-card shadow-lg">
                    <CardHeader className="text-center space-y-4 pb-2">
                        <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-muted mb-2">
                            {passed ? (
                                <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
                            ) : (
                                <AlertCircle className="w-10 h-10 text-destructive" />
                            )}
                        </div>
                        <CardTitle className="text-3xl font-bold">
                            {passed ? "Congratulations!" : "Keep Practicing"}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            You have {passed ? "passed" : "failed"} the {exam.title} exam.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl font-black text-primary">{score}%</span>
                            <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Your Score</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Passing Score</span>
                                <span className="font-bold">{exam.pass_score || 70}%</span>
                            </div>
                            <Progress value={score} className={passed ? "bg-muted" : "bg-destructive/20"} indicatorClassName={passed ? "bg-green-500" : "bg-destructive"} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Link href="/lms/student/me/my-exams">
                                <Button variant="outline" className="w-full border-border hover:bg-muted">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> All Exams
                                </Button>
                            </Link>
                            <Button onClick={async () => {
                                setLoading(true); // Show loading state
                                try {
                                    await resetExamEnrollmentAction(enrollmentId);
                                    // Reset local state
                                    setSubmitted(false);
                                    setScore(0);
                                    setAnswers({});
                                    setStarted(false);
                                    setTimeLeft(null);
                                    setReviewMode(false);
                                    setCurrentSection(0);
                                    setCurrentQuestionIndex(0);
                                    window.location.reload(); // Reload to fetch fresh data
                                } catch (e) {
                                    toast.error("Failed to reset exam");
                                    setLoading(false);
                                }
                            }} variant="default" className="w-full">
                                Retake Exam
                            </Button>
                        </div>
                        <Button onClick={() => setReviewMode(true)} variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
                            Review Answers
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // VIEW STATE 2: INSTRUCTIONS (Pre-start)
    // ------------------------------------------------------------------
    if (!started && !reviewMode && !submitted) {
        return (
            <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="space-y-2 text-center">
                        <Badge variant="outline" className="mb-4">Pre-Exam Instructions</Badge>
                        <h1 className="text-4xl font-bold tracking-tight">{exam.title}</h1>
                        <p className="text-xl text-muted-foreground">{exam.description || "Please read the instructions carefully before starting."}</p>
                    </div>

                    <Card className="bg-card border-border shadow-sm">
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                                    <Clock className="w-8 h-8 text-primary mb-3" />
                                    <span className="font-bold text-lg">{exam.duration_minutes} Minutes</span>
                                    <span className="text-xs text-muted-foreground uppercase">Duration</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                                    <Award className="w-8 h-8 text-primary mb-3" />
                                    <span className="font-bold text-lg">{exam.pass_score}%</span>
                                    <span className="text-xs text-muted-foreground uppercase">To Pass</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                                    <HelpCircle className="w-8 h-8 text-primary mb-3" />
                                    <span className="font-bold text-lg">
                                        {exam.sections?.reduce((a: any, b: any) => a + b.questions.length, 0) || exam.questions?.length || 0}
                                    </span>
                                    <span className="text-xs text-muted-foreground uppercase">Questions</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-primary" /> Important Rules:
                                </h3>
                                <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                                    <li>Ensure you have a stable internet connection.</li>
                                    <li>Do not refresh the page during the exam.</li>
                                    <li>The timer will start immediately when you click "Start Exam".</li>
                                    <li>You cannot pause the exam once started.</li>
                                    {exam.instructions?.map((inst: string, idx: number) => (
                                        <li key={idx}>{inst}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4">
                                <Button
                                    size="lg"
                                    className="w-full text-lg h-14 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                                    onClick={handleStart}
                                >
                                    Start Exam Now <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // VIEW STATE 3: ACTIVE PLAYER (Started)
    // ------------------------------------------------------------------
    // Active Exam View helpers
    const sections = exam.sections || [{ title: "General", questions: exam.questions || [] }];
    const activeSectionData = sections[currentSection];
    const totalDeepQuestions = exam.questions?.length || 0;
    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((answeredCount / totalDeepQuestions) * 100);

    const activeQuestion = activeSectionData.questions[currentQuestionIndex];

    return (
        <div className="h-screen bg-background text-foreground font-sans flex overflow-hidden">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-80 h-full border-r border-border z-20">
                <ExamSidebar
                    exam={exam}
                    currentQuestionIndex={currentGlobalIndex}
                    answers={answers}
                    onSelectQuestion={handleJumpToQuestion}
                    timeLeft={timeLeft !== null
                        ? `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
                        : "--:--"
                    }
                />
            </div>

            {/* Main Layout Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile Sidebar Toggle */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80 bg-background border-border">
                                <ExamSidebar
                                    exam={exam}
                                    currentQuestionIndex={currentGlobalIndex}
                                    answers={answers}
                                    onSelectQuestion={(idx) => {
                                        handleJumpToQuestion(idx);
                                    }}
                                    timeLeft={timeLeft !== null
                                        ? `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
                                        : "--:--"
                                    }
                                />
                            </SheetContent>
                        </Sheet>

                        <h1 className="font-bold text-lg hidden md:block">{exam.title}</h1>
                        <Badge variant="outline" className="border-border text-muted-foreground hidden sm:flex">Section {currentSection + 1} of {sections.length}</Badge>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* VIEW MODE TOGGLE */}
                        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setViewMode('list')}
                            >
                                List View
                            </Button>
                            <Button
                                variant={viewMode === 'single' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setViewMode('single')}
                            >
                                Single Question
                            </Button>
                        </div>

                        <div className="flex flex-col items-end w-32 md:w-64 hidden sm:flex">
                            <div className="flex justify-between w-full text-xs text-primary mb-1">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5 bg-muted" indicatorClassName="bg-primary" />
                        </div>
                        <div className={`flex items-center gap-2 font-mono px-3 py-1 rounded border ${timeLeft && timeLeft < 300 ? 'text-destructive bg-destructive/10 border-destructive/20' : 'text-primary bg-primary/10 border-primary/20'
                            }`}>
                            <Clock className="w-4 h-4" />
                            <span>
                                {reviewMode ? "Review Mode" : (timeLeft !== null
                                    ? `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
                                    : "--:--")}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
                    <div className="max-w-4xl mx-auto w-full space-y-8 pb-32">
                        {viewMode === 'list' && (
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-primary">{activeSectionData.title}</h2>
                                <p className="text-muted-foreground">{activeSectionData.description}</p>
                            </div>
                        )}

                        <div className="space-y-8">
                            {viewMode === 'list' ? (
                                // LIST MODE: Render all questions in section
                                activeSectionData.questions.map((q: any, idx: number) => {
                                    const qKey = q.id || `q-${currentSection}-${idx}`;
                                    return (
                                        <Card key={qKey} id={`question-${idx}`} className={`bg-card border-border ${answers[qKey] !== undefined ? 'border-primary/50' : ''}`}>
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between">
                                                    <CardTitle className="text-lg text-foreground font-medium flex gap-3">
                                                        <span className="text-muted-foreground">{(idx + 1)}.</span>
                                                        {q.text}
                                                    </CardTitle>
                                                    <Badge variant="secondary" className="bg-muted h-6">
                                                        {q.points || 1} pts
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <div className="grid gap-3">
                                                    {q.options.map((opt: string, optIdx: number) => {
                                                        const isSelected = answers[qKey] === optIdx;
                                                        // Use same helper logic inline or repeat for rendering 
                                                        const correctIndex = (typeof q.correct_option_index === 'number')
                                                            ? q.correct_option_index
                                                            : (q.correctAnswer ? q.options.indexOf(q.correctAnswer) : -1);

                                                        const isCorrect = correctIndex === optIdx;
                                                        let itemClass = "bg-muted border-border hover:bg-muted/80 hover:border-border/80 text-muted-foreground";

                                                        if (submitted) {
                                                            if (isCorrect) itemClass = "bg-green-500/10 border-green-500 text-green-700 font-medium";
                                                            else if (isSelected && !isCorrect) itemClass = "bg-red-500/10 border-red-500 text-red-700";
                                                            else itemClass = "opacity-60 grayscale";
                                                        } else if (isSelected) {
                                                            itemClass = "bg-primary/10 border-primary text-primary";
                                                        }

                                                        return (
                                                            <div
                                                                key={optIdx}
                                                                onClick={() => !submitted && handleAnswer(qKey, optIdx)}
                                                                className={`
                                                                p-4 rounded-lg cursor-pointer border transition-all flex items-center justify-between
                                                                ${itemClass}
                                                            `}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] 
                                                                    ${submitted
                                                                            ? (isCorrect ? 'border-green-500 bg-green-500 text-white' : (isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-border'))
                                                                            : (isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground')
                                                                        }
                                                                `}>
                                                                        {String.fromCharCode(65 + optIdx)}
                                                                    </div>
                                                                    <span>{opt}</span>
                                                                </div>
                                                                {submitted
                                                                    ? (isCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : (isSelected && <AlertCircle className="w-5 h-5 text-red-600" />))
                                                                    : (isSelected && <CheckCircle className="w-5 h-5 text-primary" />)
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                // SINGLE MODE: Render active question only
                                (() => {
                                    const q = activeQuestion;
                                    if (!q) return <div>No question selected</div>;
                                    const qKey = q.id || `q-${currentSection}-${currentQuestionIndex}`;
                                    return (
                                        <Card key={qKey} className={`bg-card border-border min-h-[400px] flex flex-col`}>
                                            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    Question {currentQuestionIndex + 1} of {activeSectionData.questions.length}
                                                </Badge>
                                                <Badge variant="secondary" className="bg-muted h-6">
                                                    {q.points || 1} pts
                                                </Badge>
                                            </div>
                                            <CardContent className="p-8 flex-1 flex flex-col">
                                                <h2 className="text-2xl font-bold mb-8 text-foreground leading-relaxed">{q.text}</h2>

                                                <div className="space-y-3 flex-1">
                                                    {q.options.map((opt: string, optIdx: number) => {
                                                        const isSelected = answers[qKey] === optIdx;
                                                        const correctIndex = (typeof q.correct_option_index === 'number')
                                                            ? q.correct_option_index
                                                            : (q.correctAnswer ? q.options.indexOf(q.correctAnswer) : -1);

                                                        const isCorrect = correctIndex === optIdx;
                                                        let itemClass = "bg-muted/40 border-border hover:border-primary/30 hover:bg-muted/60 text-muted-foreground";

                                                        if (submitted) {
                                                            if (isCorrect) itemClass = "bg-green-500/10 border-green-500 text-green-700 font-medium";
                                                            else if (isSelected && !isCorrect) itemClass = "bg-red-500/10 border-red-500 text-red-700";
                                                            else itemClass = "opacity-60 grayscale";
                                                        } else if (isSelected) {
                                                            itemClass = "bg-primary/10 border-primary text-primary shadow-sm";
                                                        }

                                                        return (
                                                            <div
                                                                key={optIdx}
                                                                onClick={() => !submitted && handleAnswer(qKey, optIdx)}
                                                                className={`
                                                                p-5 rounded-xl cursor-pointer border transition-all flex items-center justify-between
                                                                ${itemClass}
                                                            `}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm 
                                                                    ${submitted
                                                                            ? (isCorrect ? 'border-green-500 bg-green-500 text-white' : (isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-border'))
                                                                            : (isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground')
                                                                        }
                                                                `}>
                                                                        {String.fromCharCode(65 + optIdx)}
                                                                    </div>
                                                                    <span className="text-lg">{opt}</span>
                                                                </div>
                                                                {submitted
                                                                    ? (isCorrect ? <CheckCircle className="w-6 h-6 text-green-600" /> : (isSelected && <AlertCircle className="w-6 h-6 text-red-600" />))
                                                                    : (isSelected && <CheckCircle className="w-6 h-6 text-primary" />)
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="h-20 border-t border-border bg-background flex items-center justify-between px-6 md:px-12 shrink-0">
                    <Button
                        variant="ghost"
                        disabled={viewMode === 'list' ? currentSection === 0 : (currentSection === 0 && currentQuestionIndex === 0)}
                        onClick={() => {
                            if (viewMode === 'list') {
                                setCurrentSection(prev => prev - 1);
                            } else {
                                // Single Mode Prev Logic
                                if (currentQuestionIndex > 0) {
                                    setCurrentQuestionIndex(prev => prev - 1);
                                    // Update global index for sidebar sync
                                    setCurrentGlobalIndex(prev => prev - 1);
                                } else if (currentSection > 0) {
                                    // Go to prev section, last question
                                    const prevSectionIdx = currentSection - 1;
                                    const prevSection = sections[prevSectionIdx];
                                    setCurrentSection(prevSectionIdx);
                                    setCurrentQuestionIndex(prevSection.questions.length - 1);
                                    // Need to calculate global index for start of prev section + length - 1
                                    let gIdx = 0;
                                    for (let i = 0; i < prevSectionIdx; i++) gIdx += sections[i].questions.length;
                                    setCurrentGlobalIndex(gIdx + prevSection.questions.length - 1);
                                }
                            }
                        }}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> {viewMode === 'list' ? 'Previous Section' : 'Previous'}
                    </Button>

                    <div className="flex gap-4">
                        {/* Save Draft Button could go here */}
                    </div>

                    {(() => {
                        const isLastSection = currentSection >= sections.length - 1;
                        const isLastQuestionInSection = currentQuestionIndex >= activeSectionData.questions.length - 1;
                        const isLastQuestionOfExam = isLastSection && (viewMode === 'list' || isLastQuestionInSection);

                        if (reviewMode) {
                            return (
                                <Button
                                    onClick={() => setReviewMode(false)}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8"
                                >
                                    Back to Results <ArrowLeft className="w-4 h-4 ml-2" />
                                </Button>
                            )
                        }

                        if (isLastQuestionOfExam) {
                            return (
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8"
                                >
                                    Submit Exam <Save className="w-4 h-4 ml-2" />
                                </Button>
                            );
                        }

                        return (
                            <Button
                                onClick={() => {
                                    if (viewMode === 'list') {
                                        const main = document.querySelector('main');
                                        if (main) main.scrollTop = 0;
                                        setCurrentSection(prev => prev + 1);
                                    } else {
                                        // Single Mode Next Logic
                                        if (currentQuestionIndex < activeSectionData.questions.length - 1) {
                                            setCurrentQuestionIndex(prev => prev + 1);
                                            setCurrentGlobalIndex(prev => prev + 1);
                                        } else if (currentSection < sections.length - 1) {
                                            // Go to next section, first question
                                            setCurrentSection(prev => prev + 1);
                                            setCurrentQuestionIndex(0);
                                            setCurrentGlobalIndex(prev => prev + 1);
                                        }
                                    }
                                }}
                                className={viewMode === 'single' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}
                            >
                                {viewMode === 'list' ? 'Next Section' : 'Next'} <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )
                    })()}
                </footer>
            </div>
        </div>
    );
}
