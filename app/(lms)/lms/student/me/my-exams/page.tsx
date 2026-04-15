'use client';

import React, { useEffect, useState } from 'react';
import { getMyExamEnrollmentsAction } from '@/actions/enrollment';
import { Exam, ExamEnrollment } from '@/lib/lms/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, FileText, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { ExamCard } from '@/components/ExamCard';

export default function MyExamsPage() {
    const [enrollments, setEnrollments] = useState<any[]>([]); // Relaxed type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyExamEnrollmentsAction().then((data: any[]) => {
            setEnrollments(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="space-y-2 border-b border-border pb-8">
                    <h1 className="text-4xl font-bold tracking-tight">My Exams</h1>
                    <p className="text-muted-foreground">Manage and track your examination progress.</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse border border-border" />
                        ))}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground bg-muted/50 rounded-xl border border-dashed border-border">
                        <p className="text-xl mb-4">You haven't enrolled in any exams yet.</p>
                        <Link href="/lms/student/exams">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Browse Exams</Button>
                        </Link>
                    </div>
                ) : (
                    <ViewProvider defaultView="list">
                        <div className="flex justify-end mb-6">
                            <ViewTrigger />
                        </div>

                        <ViewList className="space-y-4">
                            {enrollments.map((item) => (
                                <div key={item.exam_id} className="bg-card border border-border rounded-lg p-3 flex flex-row gap-4 items-center hover:border-primary/50 transition-colors group">
                                    <div className="w-32 h-20 rounded-md overflow-hidden shrink-0 bg-muted relative flex items-center justify-center">
                                        {item.exam.thumbnail_url ? (
                                            <img src={item.exam.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Trophy className="w-8 h-8 text-muted-foreground" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-base font-bold text-foreground truncate pr-4">{item.exam.title}</h3>
                                            <Badge variant={item.status === 'completed' ? "default" : "secondary"} className="scale-90 origin-right">
                                                {item.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-xs line-clamp-1 mb-2">{item.exam.description}</p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.exam.duration_minutes}m</span>
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                {
                                                    item.exam.sections?.length
                                                        ? item.exam.sections.reduce((acc: number, sec: any) => acc + (sec.questions?.length || 0), 0)
                                                        : (item.exam.questions?.length || 0)
                                                } Questions
                                            </span>
                                            <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> Pass: {item.exam.pass_score}%</span>
                                        </div>
                                    </div>
                                    <Link href={`/lms/student/me/my-exams/${item.id}`} className="shrink-0">
                                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-8 text-xs px-4">
                                            {item.status === 'not_started' ? "Start" : "Resume"}
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </ViewList>

                        <ViewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrollments.map((item) => (
                                <ExamCard
                                    key={item.exam_id}
                                    exam={{
                                        _id: item.exam.id,
                                        title: item.exam.title,
                                        description: item.exam.description,
                                        slug: { current: '' }, // mock
                                        duration_minutes: item.exam.duration_minutes,
                                        pass_score: item.exam.pass_score,
                                        thumbnail_url: item.exam.thumbnail_url,
                                        sections: item.exam.sections,
                                        questions: item.exam.questions
                                    }}
                                    href={`/lms/student/me/my-exams/${item.id}`}
                                    status={item.status}
                                />
                            ))}
                        </ViewGrid>
                    </ViewProvider>
                )}

            </div>
        </div>
    );
}
