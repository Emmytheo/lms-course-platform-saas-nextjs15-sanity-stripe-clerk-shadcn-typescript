'use client';

import React, { useState } from 'react';
import { Exam } from '@/lib/db/interface'; // Use generic DB interface
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import { ExamSidebar } from '@/components/lms/ExamSidebar'; // Verify this component exists/works
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function ExamTaker({ exam }: { exam: Exam }) {
    // If exam has sections but no direct questions array, flatten them
    const questions = exam.questions && exam.questions.length > 0
        ? exam.questions
        : (exam.sections || []).flatMap((s: any) => s.questions || []);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return <div className="p-8 text-center text-white">No questions in this exam.</div>;
    }

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleAnswer = (optionIndex: number) => {
        // We store by Question ID (db interface has id or _id?)
        // Interface usually has _id for top level objects, but questions might use 'id'.
        // Let's assume 'id' as per previous code, but check interface.
        // If interface 'Question' uses 'id', we are good.
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
    };

    const handleSubmit = () => {
        let totalPoints = 0;
        let earnedPoints = 0;

        questions.forEach(q => {
            totalPoints += (q.points || 0);
            const correctAnswer = Number(q.correct_option_index);
            if (answers[q.id] === correctAnswer) {
                earnedPoints += (q.points || 0);
            }
        });

        const calculatedScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        setScore(calculatedScore);
        setSubmitted(true);
    };

    if (submitted) {
        const passed = score >= (exam.pass_score || 70);
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        {passed ? (
                            <CheckCircle className="w-20 h-20 text-green-500" />
                        ) : (
                            <XCircle className="w-20 h-20 text-red-500" />
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold mb-2">{passed ? 'Exam Passed!' : 'Exam Failed'}</h1>
                        <p className="text-gray-400">You scored <span className={passed ? "text-green-400" : "text-red-400"}>{score}%</span></p>
                        <p className="text-sm text-gray-500 mt-1">Required to pass: {exam.pass_score || 70}%</p>
                    </div>

                    <div className="pt-4">
                        <Link href="/lms/dashboard">
                            <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                                Return to Dashboard
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    // Create a modified exam object for Sidebar if needed, or pass props
    const examForSidebar = { ...exam, questions };

    return (
        <div className="h-screen bg-black text-white font-sans flex overflow-hidden">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 shrink-0 h-full border-r border-zinc-800">
                <ExamSidebar
                    exam={examForSidebar}
                    currentQuestionIndex={currentQuestionIndex}
                    answers={answers}
                    onSelectQuestion={setCurrentQuestionIndex}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">

                {/* Mobile Header */}
                <header className="lg:hidden h-14 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-900">
                    <span className="font-bold truncate">{exam.title}</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 bg-zinc-900 border-r-zinc-800 text-white">
                            <ExamSidebar
                                exam={examForSidebar}
                                currentQuestionIndex={currentQuestionIndex}
                                answers={answers}
                                onSelectQuestion={setCurrentQuestionIndex}
                            />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Question Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center">
                    <div className="w-full max-w-2xl space-y-8">

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-cyan-500 font-bold uppercase tracking-wider">Question {currentQuestionIndex + 1}</span>
                                <span className="text-sm text-gray-500">{currentQuestion.points} Points</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <RadioGroup
                            value={answers[currentQuestion.id]?.toString()}
                            onValueChange={(val) => handleAnswer(parseInt(val))}
                            className="space-y-4"
                        >
                            {(currentQuestion.options || []).map((option: string, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${answers[currentQuestion.id] === idx ? 'border-cyan-500 bg-cyan-500/10' : 'border-zinc-800 hover:bg-zinc-900'}`}
                                >
                                    <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="border-gray-500 text-cyan-500" />
                                    <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer text-lg font-medium text-gray-200">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <div className="flex justify-between pt-8 border-t border-zinc-800">
                            <Button
                                variant="ghost"
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="text-gray-400 hover:text-white"
                            >
                                Previous
                            </Button>

                            {isLastQuestion ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={answers[currentQuestion.id] === undefined}
                                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-8"
                                >
                                    Submit Exam
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    disabled={answers[currentQuestion.id] === undefined}
                                    className="bg-white text-black hover:bg-gray-200 font-bold px-8"
                                >
                                    Next Question
                                </Button>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
