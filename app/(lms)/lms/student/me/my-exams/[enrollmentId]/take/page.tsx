'use client';

import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ExamPlayerPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
    const { enrollmentId } = use(params);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour in seconds
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Mock Exam Data
    const exam = {
        title: "Advanced React Certification",
        questions: [
            { id: "q1", text: "What is the primary purpose of useEffect?", options: ["Side effects", "State management", "Routing", "Styling"], correct: 0 },
            { id: "q2", text: "Which hook is used for performance optimization?", options: ["useState", "useEffect", "useMemo", "useContext"], correct: 2 },
            { id: "q3", text: "What replaces Redux in many modern React apps?", options: ["Context API + useReducer", "jQuery", "Angular", "Vuex"], correct: 0 },
        ]
    };

    useEffect(() => {
        if (!isSubmitted && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted]);

    const handleSelect = (optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [exam.questions[currentQuestionIndex].id]: optionIndex }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        // Calculate score
        let correct = 0;
        exam.questions.forEach(q => {
            if (answers[q.id] === q.correct) correct++;
        });
        const score = (correct / exam.questions.length) * 100;
        toast.info(`Exam Submitted! You scored ${score.toFixed(0)}%`);
        // Here you would call an action to save the result
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = exam.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
                <div className="font-bold text-lg">{exam.title}</div>
                <div className="flex items-center gap-4">
                    <div className={`font-mono text-xl font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-destructive' : 'text-primary'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                    {!isSubmitted && (
                        <Button onClick={handleSubmit} variant="destructive">Submit Exam</Button>
                    )}
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex max-w-5xl mx-auto w-full p-6 gap-8">
                {/* Question Area */}
                <div className="flex-1 space-y-8">
                    <Card className="bg-card border-border p-8 min-h-[400px] flex flex-col">
                        <div className="mb-6 flex justify-between">
                            <Badge variant="outline" className="text-muted-foreground">Question {currentQuestionIndex + 1} of {exam.questions.length}</Badge>
                            {isSubmitted && (
                                <Badge className={answers[currentQuestion.id] === currentQuestion.correct ? "bg-green-600" : "bg-red-600"}>
                                    {answers[currentQuestion.id] === currentQuestion.correct ? "Correct" : "Incorrect"}
                                </Badge>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold mb-8 text-foreground">{currentQuestion.text}</h2>

                        <div className="space-y-3 flex-1">
                            {currentQuestion.options.map((opt, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                                        ${answers[currentQuestion.id] === idx ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/40 border-border hover:border-muted-foreground/50 text-muted-foreground'}
                                        ${isSubmitted && idx === currentQuestion.correct ? 'bg-green-500/10 border-green-500 text-green-500' : ''}
                                        ${isSubmitted && answers[currentQuestion.id] === idx && idx !== currentQuestion.correct ? 'bg-destructive/10 border-destructive text-destructive' : ''}
                                    `}
                                >
                                    <span>{opt}</span>
                                    {answers[currentQuestion.id] === idx && <CheckCircle className="w-5 h-5 text-primary" />}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-between pt-6 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="border-border text-muted-foreground"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                            </Button>

                            {currentQuestionIndex < exam.questions.length - 1 ? (
                                <Button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                !isSubmitted && <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 text-white">Finish Exam</Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar / Question Map */}
                <div className="w-64 shrink-0 space-y-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="font-bold text-foreground mb-4">Questions</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {exam.questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`h-10 w-10 rounded flex items-center justify-center text-sm font-bold transition-colors
                                        ${currentQuestionIndex === idx ? 'ring-2 ring-foreground bg-muted' : ''}
                                        ${answers[q.id] !== undefined
                                            ? (isSubmitted
                                                ? (answers[q.id] === q.correct ? 'bg-green-600 text-white' : 'bg-destructive text-destructive-foreground')
                                                : 'bg-primary text-primary-foreground')
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
