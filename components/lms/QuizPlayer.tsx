'use client';

import React, { useState } from 'react';
import { Lesson, Question } from '@/lib/db/interface';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Trophy, RefreshCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface QuizPlayerProps {
    lesson: Lesson;
    onComplete?: (score: number, passed: boolean) => void;
}

export function QuizPlayer({ lesson, onComplete }: QuizPlayerProps) {
    const questions = lesson.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = questions[currentIndex];

    const handleSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOptionIndex(index);
    };

    const handleSubmit = () => {
        if (selectedOptionIndex === null) return;

        setIsAnswered(true);
        const isCorrect = selectedOptionIndex === currentQuestion.correct_option_index;

        if (isCorrect) {
            setScore(s => s + currentQuestion.points);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOptionIndex(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
            const passed = (score / totalPoints) >= 0.7;
            onComplete?.(score, passed);
            if (passed) {
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
            }
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOptionIndex(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (questions.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-center bg-card rounded-xl border border-border h-96">
                <p className="text-muted-foreground">This quiz has no questions yet.</p>
            </div>
        );
    }

    if (showResults) {
        const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
        const percentage = Math.round((score / totalPoints) * 100);

        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-4">
                <Card className="max-w-md w-full bg-card border-dashed border-2 border-border">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 bg-muted p-4 rounded-full w-20 h-20 flex items-center justify-center">
                            <Trophy className={cn("w-10 h-10", percentage >= 70 ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <CardTitle className="text-2xl text-card-foreground">Quiz Completed!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            {percentage}%
                        </div>
                        <p className="text-muted-foreground">
                            You scored {score} out of {totalPoints} points.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        <Button variant="outline" onClick={handleRetry} className="border-border hover:bg-muted hover:text-foreground">
                            <RefreshCcw className="w-4 h-4 mr-2" /> Retry
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Next Lesson
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-70px)] p-4">
            <Card className="max-w-2xl w-full bg-card border-border shadow-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
                        <span className="text-sm text-primary font-bold">{score} pts</span>
                    </div>
                    <CardTitle className="text-xl md:text-2xl leading-none text-card-foreground">{currentQuestion.text}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        {(currentQuestion.options || []).map((option, index) => {
                            let stateStyles = "border-border hover:border-primary/50 hover:bg-muted/50";
                            if (isAnswered) {
                                if (index === currentQuestion.correct_option_index) {
                                    stateStyles = "border-primary bg-primary/10 text-primary";
                                } else if (index === selectedOptionIndex) {
                                    stateStyles = "border-destructive bg-destructive/10 text-destructive";
                                } else {
                                    stateStyles = "border-border opacity-50";
                                }
                            } else if (selectedOptionIndex === index) {
                                stateStyles = "border-primary bg-primary/10 text-primary ring-1 ring-primary";
                            }

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleSelect(index)}
                                    className={cn(
                                        "flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                        stateStyles
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border mr-3 flex items-center justify-center shrink-0",
                                        isAnswered && index === currentQuestion.correct_option_index ? "border-primary bg-primary text-primary-foreground" :
                                            isAnswered && index === selectedOptionIndex ? "border-destructive text-destructive" :
                                                selectedOptionIndex === index ? "border-primary" : "border-muted-foreground"
                                    )}>
                                        {isAnswered && index === currentQuestion.correct_option_index && <CheckCircle2 className="w-3 h-3" />}
                                        {isAnswered && index === selectedOptionIndex && index !== currentQuestion.correct_option_index && <XCircle className="w-3 h-3" />}
                                        {!isAnswered && selectedOptionIndex === index && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
                                    <span className="font-medium text-foreground">{option}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                    {!isAnswered ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedOptionIndex === null}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8"
                        >
                            Submit Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                        >
                            {currentIndex < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
