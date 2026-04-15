import React, { use } from 'react';
import { db } from '@/lib/db';
import { EnrollButton } from '@/components/lms/EnrollButton';
import { redirect } from 'next/navigation';
import { Shield, Clock, Award, CheckCircle, ArrowLeft, HelpCircle, BarChart3, BookOpen, List, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const dynamic = 'force-dynamic';

export default async function ExamEnrollmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch real exam data
    const exam = await db.getExamById(id);

    if (!exam) {
        return (
            <div className="h-screen bg-background flex flex-col items-center justify-center text-foreground space-y-4">
                <h1 className="text-2xl font-bold">Exam Not Found</h1>
                <p className="text-muted-foreground">The exam you are looking for does not exist or has been removed.</p>
                <Link href="/lms/student/exams" className="text-primary hover:underline">Return to Exams</Link>
            </div>
        );
    }

    const sections = typeof exam.sections === 'string' ? JSON.parse(exam.sections) : (exam.sections || []);
    const totalQuestions = sections.length > 0
        ? sections.reduce((acc: number, sec: any) => acc + sec.questions.length, 0)
        : (exam.questions?.length || 0);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Banner */}
            <div className="relative h-fit w-full border-b border-border">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
                <div className="absolute inset-0 z-0 bg-muted flex items-center justify-center">
                    {exam.thumbnail_url ? (
                        <img src={exam.thumbnail_url} className="w-full h-full object-cover opacity-50" alt="" />
                    ) : (
                        <Shield className="w-32 h-32 text-muted-foreground" />
                    )}
                </div>

                <div className="relative z-10 container mx-auto px-6 py-12 md:py-16">
                    <Link href="/lms/student/exams" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Exams
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-4 max-w-3xl">
                            <div className="flex gap-2">
                                <Badge className="bg-primary/20 text-primary border-none px-3 py-1"> Certification Exam </Badge>
                                <Badge variant="outline" className="text-primary border-primary">{exam.difficulty || "Intermediate"}</Badge>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">{exam.title}</h1>
                            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">{exam.description}</p>

                            <div className="flex flex-wrap gap-6 mt-6 text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>{exam.duration_minutes} Minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    <span>{totalQuestions} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Pass Score: {exam.pass_score}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content & Action */}
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">

                    {/* Structure / Sections with Progress Weighting */}
                    {sections.length > 0 ? (
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-card-foreground flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" /> Exam Structure
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Breakdown of sections and their weight in the exam
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {sections.map((section: any, idx: number) => {
                                    const sectionWeight = (section.questions.length / totalQuestions) * 100;
                                    return (
                                        <div key={idx} className="border border-border rounded-lg p-4 bg-muted/20">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-foreground text-lg">{section.title}</h3>
                                                <Badge variant="outline" className="border-border text-muted-foreground">{section.questions.length} questions</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Section Weight</span>
                                                    <span>{Math.round(sectionWeight)}%</span>
                                                </div>
                                                <Progress value={sectionWeight} className="h-1.5 bg-muted" indicatorClassName="bg-primary" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="bg-card border border-border rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">About this Exam</h2>
                            <p className="text-muted-foreground">This classic exam contains {totalQuestions} questions testing your core knowledge.</p>
                        </div>
                    )}

                    {/* Instructions */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-card-foreground">
                                <List className="w-5 h-5 text-primary" /> Exam Instructions
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">Read carefully before starting</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {(exam.instructions || [
                                    'Complete all questions within the time limit.',
                                    'Ensure stable internet connection.',
                                    'No outside assistance allowed.',
                                    'Results are calculated immediately upon submission.'
                                ]).map((inst: string, idx: number) => (
                                    <li key={idx} className="flex gap-4 text-muted-foreground">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-primary border border-border">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm pt-0.5">{inst}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* What You'll Prove / Objectives */}
                    {exam.objectives && exam.objectives.length > 0 && (
                        <div className="bg-card border border-border rounded-2xl p-8">
                            <h3 className="text-lg font-bold mb-4 text-foreground">What You'll Prove</h3>
                            <ul className="grid grid-cols-1 gap-3">
                                {exam.objectives.map((obj, i) => (
                                    <li key={i} className="flex gap-3 text-muted-foreground">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                        <span className="text-sm">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Prerequisites */}
                    {exam.prerequisites && exam.prerequisites.length > 0 && (
                        <div className="bg-card border border-border rounded-2xl p-8">
                            <h3 className="text-lg font-bold mb-4 text-foreground">Prerequisites</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                {exam.prerequisites.map((req, i) => (
                                    <li key={i}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!exam.objectives && !exam.prerequisites && (
                        <div className="bg-card border border-border rounded-2xl p-8">
                            <h3 className="text-lg font-bold mb-4 text-foreground">Certification Value</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Successful completion of this exam demonstrates your mastery of the subject matter and earns you a recognized certification in {exam.title}.
                            </p>
                        </div>
                    )}

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        {/* Registration Card */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <span className="block text-muted-foreground text-sm uppercase tracking-wider mb-2">Registration Required</span>
                                <span className="text-3xl font-bold text-card-foreground">Free</span>
                            </div>

                            <EnrollButton
                                courseId={exam._id}
                                redirectUrl="/lms/student/me/my-exams"
                                className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                                label="Register for Exam"
                                type="exam"
                            />

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                By registering, you agree to the exam terms and conditions.
                            </p>
                        </div>

                        {/* Exam Stats */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-card-foreground">Exam Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <BarChart3 className="w-4 h-4" /> Avg. Score
                                    </div>
                                    <span className="font-bold text-foreground">78%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Clock className="w-4 h-4" /> Completion Rate
                                    </div>
                                    <span className="font-bold text-foreground">92%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preparation Tips */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-card-foreground">Preparation Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-sm">Review Materials</div>
                                        <div className="text-xs text-muted-foreground">Focus on the core concepts.</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-sm">Manage Time</div>
                                        <div className="text-xs text-muted-foreground">~{Math.round(exam.duration_minutes / totalQuestions)} min per question.</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
