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
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="space-y-2 border-b border-zinc-800 pb-8">
                    <h1 className="text-4xl font-bold tracking-tight">My Training</h1>
                    <p className="text-gray-400">Track your progress and continue your journey.</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-40 rounded-xl bg-zinc-900 animate-pulse border border-zinc-800" />
                        ))}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
                        <p className="text-xl mb-4">You haven't enrolled in any courses yet.</p>
                        <Link href="/lms/courses">
                            <Button className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold">Browse Courses</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {enrollments.map((enrollment) => (
                            <Card key={enrollment.course_id} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-cyan-500/30 transition-colors group">
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
                                                <Badge variant={enrollment.completed ? "default" : "secondary"} className={enrollment.completed ? "bg-green-600 hover:bg-green-700" : "bg-zinc-800 text-gray-400"}>
                                                    {enrollment.completed ? "Completed" : "In Progress"}
                                                </Badge>
                                                <span className="text-sm text-gray-500">Last accessed: 2 days ago</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">{enrollment.course.title}</h3>
                                            <p className="text-gray-400 text-sm">{enrollment.course.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className={enrollment.progress_percent === 100 ? "text-green-500" : "text-cyan-500"}>{enrollment.progress_percent}% Complete</span>
                                                    <span className="text-gray-500">{enrollment.course.duration_minutes}m total</span>
                                                </div>
                                                <Progress value={enrollment.progress_percent} className="h-2 bg-zinc-800" indicatorClassName={enrollment.completed ? "bg-green-500" : "bg-cyan-500"} />
                                            </div>

                                            <div className="flex gap-4">
                                                <Link href={`/lms/courses/${enrollment.course.id}`} className="flex-1">
                                                    <Button className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold">
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
