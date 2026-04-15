'use client';

import React, { useEffect, useState } from 'react';
import { getMyLearningPathEnrollmentsAction } from '@/actions/enrollment';
import { LearningPath, LearningPathEnrollment } from '@/lib/lms/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Map, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { LearningPathCard } from '@/components/LearningPathCard';

export default function MyLearningPathsPage() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyLearningPathEnrollmentsAction().then((data: any[]) => {
            setEnrollments(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="space-y-2 border-b border-border pb-8">
                    <h1 className="text-4xl font-bold tracking-tight">My Learning Paths</h1>
                    <p className="text-muted-foreground">Follow structured paths to mastery.</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse border border-border" />
                        ))}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground bg-muted/50 rounded-xl border border-dashed border-border">
                        <p className="text-xl mb-4">You haven't enrolled in any learning paths yet.</p>
                        <Link href="/lms/learning-paths">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Browse Paths</Button>
                        </Link>
                    </div>
                ) : (
                    <ViewProvider defaultView="list">
                        <div className="flex justify-between items-center mb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setLoading(true);
                                    import('@/actions/progress').then(({ syncUserEnrollmentsProgressAction }) => {
                                        syncUserEnrollmentsProgressAction().then(() => {
                                            window.location.reload();
                                        });
                                    });
                                }}
                            >
                                Refresh Progress
                            </Button>
                            <ViewTrigger />
                        </div>

                        <ViewList className="space-y-4">
                            {enrollments.map((item) => (
                                <div key={item.learning_path_id} className="bg-card border border-border rounded-lg p-3 flex flex-row gap-4 items-center hover:border-primary/50 transition-colors group">
                                    <div className="w-32 h-20 rounded-md overflow-hidden shrink-0 bg-muted relative flex items-center justify-center">
                                        {(item.learning_path?.thumbnail_url) ? (
                                            <img src={item.learning_path.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Map className="w-8 h-8 text-muted-foreground" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-base font-bold text-foreground truncate pr-4">{item.learning_path?.title}</h3>
                                            <Badge variant="secondary" className="scale-90 origin-right bg-muted text-muted-foreground">
                                                {(() => {
                                                    const courses = item.learning_path?.courses || [];
                                                    const examCount = courses.filter((c: any) => c.pass_score !== undefined).length;
                                                    const courseCount = courses.length - examCount;

                                                    const parts = [];
                                                    if (courseCount > 0) parts.push(`${courseCount} Course${courseCount !== 1 ? 's' : ''}`);
                                                    if (examCount > 0) parts.push(`${examCount} Exam${examCount !== 1 ? 's' : ''}`);
                                                    return parts.join(', ') || '0 items';
                                                })()}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-xs line-clamp-1 mb-2">{item.learning_path?.description}</p>

                                        <div className="w-48">
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-primary">{item.progress_percent || 0}% Complete</span>
                                            </div>
                                            <Progress value={item.progress_percent || 0} className="h-1 bg-muted" indicatorClassName="bg-primary" />
                                        </div>
                                    </div>
                                    <Link href={`/lms/student/me/my-learning-paths/${item.id}`} className="shrink-0">
                                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-8 text-xs px-4">
                                            {item.progress_percent === 0 ? "Start Path" : "Continue"}
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </ViewList>

                        <ViewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrollments.map((item) => (
                                <LearningPathCard
                                    key={item.learning_path_id}
                                    path={{
                                        ...item.learning_path,
                                        _id: item.learning_path?.id,
                                        slug: { current: item.learning_path?.slug || '' }
                                    }}
                                    href={`/lms/student/me/my-learning-paths/${item.id}`}
                                    progress={item.progress_percent || 0}
                                />
                            ))}
                        </ViewGrid>
                    </ViewProvider>
                )}

            </div>
        </div>
    );
}
