'use client';

import React, { useEffect, useState } from 'react';
import { lmsApi } from '@/lib/lms/api';
import { Course, Enrollment } from '@/lib/lms/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Award, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function MyCoursesPage() {
    const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        lmsApi.getMyEnrollments().then((data) => {
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
                    <div className="grid gap-6">
                        {enrollments.map((enrollment) => (
                            <Card key={enrollment.course_id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors group">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-80 h-48 md:h-auto relative">
                                        <img
                                            src={enrollment.course.thumbnail_url}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-16 h-16 text-white" />
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant={enrollment.completed ? "default" : "secondary"} className={enrollment.completed ? "bg-green-600 hover:bg-green-700" : "bg-muted text-muted-foreground"}>
                                                    {enrollment.completed ? "Completed" : "In Progress"}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">Last accessed: 2 days ago</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-card-foreground">{enrollment.course.title}</h3>
                                            <p className="text-muted-foreground text-sm">{enrollment.course.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className={enrollment.progress_percent === 100 ? "text-green-500" : "text-primary"}>{enrollment.progress_percent}% Complete</span>
                                                    <span className="text-muted-foreground">{enrollment.course.duration_minutes}m total</span>
                                                </div>
                                                <Progress value={enrollment.progress_percent} className="h-2 bg-muted" indicatorClassName={enrollment.completed ? "bg-green-500" : "bg-primary"} />
                                            </div>

                                            <div className="flex gap-4">
                                                <Link href={`/lms/courses/${enrollment.course.id}`} className="flex-1">
                                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                                                        {enrollment.progress_percent === 0 ? "Start Course" : enrollment.completed ? "Review Course" : "Resume Learning"}
                                                    </Button>
                                                </Link>
                                                {enrollment.completed && (
                                                    <Button variant="outline" className="border-green-800 text-green-500 hover:bg-green-900/30">
                                                        <Award className="w-4 h-4 mr-2" /> Certificate
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
