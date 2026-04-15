'use client';

import React, { useEffect, useState, use } from 'react';
import { lmsApi } from '@/lib/lms/api';
import { Exam } from '@/lib/lms/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, AlertCircle, CheckCircle2, Shield, Play, HelpCircle, List, BarChart3, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export default function ExamOutlinePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [exam, setExam] = useState<Exam | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        lmsApi.getExamById(id).then((e) => {
            setExam(e);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Exam Details...</div>;
    if (!exam) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Exam not found</div>;

    const totalQuestions = exam.sections
        ? exam.sections.reduce((acc, sec) => acc + sec.questions.length, 0)
        : exam.questions?.length || 0;

    return (
        <div className="min-h-screen bg-black text-white font-sans">

            {/* Hero Section */}
            <div className="relative h-fit w-full border-b border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/50" />
                {exam.thumbnail_url && (
                    <div className="absolute inset-0 z-0 opacity-30">
                        <img src={exam.thumbnail_url} className="w-full h-full object-cover" alt="" />
                    </div>
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4 max-w-3xl">
                        <div className="flex gap-2">
                            <Badge variant="outline" className="text-cyan-500 border-cyan-500">{exam.difficulty || "Intermediate"}</Badge>
                            {(exam.questions || []).length > 0 && <Badge variant="secondary" className="bg-zinc-800 text-gray-300">New</Badge>}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">{exam.title}</h1>
                        <p className="text-xl text-gray-400">{exam.description}</p>
                    </div>

                    <div className="w-full md:w-auto shrink-0 bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl backdrop-blur-md backdrop-saturate-150">
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><Clock className="w-4 h-4 text-cyan-500" /> Duration</div>
                                <div className="text-2xl font-bold text-white">{exam.duration_minutes}m</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><HelpCircle className="w-4 h-4 text-cyan-500" /> Questions</div>
                                <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                            </div>
                        </div>
                        <Link href={`/lms/exams/${exam.id}`} className="block">
                            <Button className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold h-12 text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                <Play className="w-5 h-5 mr-2 fill-current" /> Start Exam
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div className="lg:col-span-2 space-y-8">

                    {/* Structure / Sections with Progress Weighting */}
                    {exam.sections && exam.sections.length > 0 ? (
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-cyan-500" /> Exam Structure
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Breakdown of sections and their weight in the exam
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {exam.sections.map((section, idx) => {
                                    const sectionWeight = (section.questions.length / totalQuestions) * 100;
                                    return (
                                        <div key={idx} className="border border-zinc-800 rounded-lg p-4 bg-black/40">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-white text-lg">{section.title}</h3>
                                                <Badge variant="outline" className="border-zinc-700 text-gray-400">{section.questions.length} questions</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4">{section.description}</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Section Weight</span>
                                                    <span>{Math.round(sectionWeight)}%</span>
                                                </div>
                                                <Progress value={sectionWeight} className="h-1.5 bg-zinc-800" indicatorClassName="bg-cyan-500" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ) : (
                        <Alert>
                            <AlertTitle>Structure Info</AlertTitle>
                            <AlertDescription>No detailed section breakdown available.</AlertDescription>
                        </Alert>
                    )}

                    {/* Instructions */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                                <List className="w-5 h-5 text-cyan-500" /> Exam Instructions
                            </CardTitle>
                            <CardDescription className="text-gray-400">Read carefully before starting</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {(exam.instructions || [
                                    'Complete all questions within the time limit.',
                                    'Ensure stable internet connection.',
                                    'No outside assistance allowed.'
                                ]).map((inst, idx) => (
                                    <li key={idx} className="flex gap-4 text-gray-300">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-cyan-500 border border-zinc-700">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm pt-0.5">{inst}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Stats Card */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white">Exam Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <BarChart3 className="w-4 h-4" /> Avg. Score
                                </div>
                                <span className="font-bold text-white">78%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Clock className="w-4 h-4" /> Completion Rate
                                </div>
                                <span className="font-bold text-white">92%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <HelpCircle className="w-4 h-4" /> Attempts
                                </div>
                                <span className="font-bold text-white">854</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preparation Tips */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white">Preparation Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-950/50 flex items-center justify-center text-cyan-500 shrink-0">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">Review Materials</div>
                                    <div className="text-xs text-gray-400">Focus on the 'Advanced Techniques' module.</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-950/50 flex items-center justify-center text-cyan-500 shrink-0">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">Manage Time</div>
                                    <div className="text-xs text-gray-400">Approx 2 min per question.</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </div>
    );
}
