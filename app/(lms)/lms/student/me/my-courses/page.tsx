'use client';

import React, { useEffect, useState } from 'react';
import { getMyEnrollmentsAction } from '@/actions/enrollment';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Award } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { CourseCard } from '@/components/CourseCard';
import { CourseProgress } from '@/components/CourseProgress';

export default function MyCoursesPage() {
    const [enrollments, setEnrollments] = useState<any[]>([]); // Relaxed type for joined data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyEnrollmentsAction().then((data) => {
            setEnrollments(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="space-y-2 border-b border-border pb-8">
                    <h1 className="text-4xl font-bold tracking-tight">My Training</h1>
                    <p className="text-muted-foreground">Track your progress and continue your journey.</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse border border-border" />
                        ))}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground bg-muted/50 rounded-xl border border-dashed border-border">
                        <p className="text-xl mb-4">You haven't enrolled in any courses yet.</p>
                        <Link href="/lms/courses">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Browse Courses</Button>
                        </Link>
                    </div>
                ) : (
                    <ViewProvider defaultView="list">
                        <div className="flex justify-end mb-6">
                            <ViewTrigger />
                        </div>

                        <ViewList className="space-y-4">
                            {enrollments.map((enrollment) => (
                                <div key={enrollment.course_id} className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row gap-6 hover:border-primary/50 transition-colors">
                                    <div className="w-full md:w-28 h-28 md:h-28 rounded-md overflow-hidden shrink-0 bg-muted relative group">
                                        <img
                                            src={enrollment.course.thumbnail_url}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2 flex-col md:flex-row">
                                                <h3 className="text-xl font-bold text-foreground line-clamp-1">{enrollment.course.title}</h3>
                                                <Badge variant={enrollment.completed ? "default" : "secondary"} className={enrollment.completed ? "bg-green-600 hover:bg-green-700" : "bg-muted text-muted-foreground"}>
                                                    {enrollment.completed ? "Completed" : "In Progress"}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{enrollment.course.description}</p>
                                        </div>

                                        <div className="flex items-center gap-6 mt-2 justify-between">
                                            <div className="flex-1 max-w-sm">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className={enrollment.progress_percent === 100 ? "text-green-500" : "text-primary"}>{enrollment.progress_percent}% Complete</span>
                                                </div>
                                                <Progress value={enrollment.progress_percent} className="h-1.5 bg-muted" indicatorClassName={enrollment.completed ? "bg-green-500" : "bg-primary"} />
                                            </div>
                                            <Link href={`/lms/student/me/my-courses/${enrollment.id}/outline`}>
                                                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                                                    {enrollment.progress_percent === 0 ? "Start" : "Continue"}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ViewList>

                        <ViewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrollments.map((enrollment) => (
                                <CourseCard
                                    key={enrollment.course_id}
                                    course={{
                                        _id: enrollment.course.id,
                                        title: enrollment.course.title,
                                        slug: { current: enrollment.course.slug || '' },
                                        image: enrollment.course.thumbnail_url,
                                        price: enrollment.course.price,
                                        category: { title: 'TBD' }, // You might want to fetch category
                                        description: enrollment.course.description
                                    }}
                                    href={`/lms/student/me/my-courses/${enrollment.id}/outline`}
                                    progress={enrollment.progress_percent}
                                />
                            ))}
                        </ViewGrid>
                    </ViewProvider>
                )}

            </div>
        </div>
    );
}
