"use client";

import React, { useState } from 'react';
import { LearningPath } from '@/lib/lms/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface LearningPathBrowserProps {
    initialPaths: LearningPath[];
}

export default function LearningPathBrowser({ initialPaths }: LearningPathBrowserProps) {
    const [paths] = useState<LearningPath[]>(initialPaths);

    return (
        <div className="space-y-12">

            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    Curated Learning Paths
                </h1>
                <p className="text-muted-foreground text-lg">
                    Structured curriculums designed to take you from beginner to expert. Follow the roadmap to success.
                </p>
            </div>

            {/* Paths Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {paths.map((path) => (
                    <div key={path.id} className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 relative h-full flex flex-col">
                        {/* Link logic moved to onClick below on card or wrappers */}

                        {/* Background/Thumbnail Overlay */}
                        <div className="absolute inset-0 z-0 h-full w-full">
                            <img
                                src={path.thumbnail_url || '/placeholder-path.jpg'}
                                alt=""
                                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <Badge className="bg-primary/20 text-primary border-primary/50 backdrop-blur-md">
                                    {path.level || 'Journey'}
                                </Badge>
                                <Map className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {path.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                    {path.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-6 border-t border-border mt-auto">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{path.duration_minutes ? Math.round(path.duration_minutes / 60) : 0} Hours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-bold">{(path.courses || []).length}</span> Courses
                                </div>
                                <div className="ml-auto">
                                    {path.isEnrolled ? (
                                        <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => window.location.href = `/lms/student/learning-paths/${path.id}`}>
                                            Continue <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 hover:bg-transparent group-hover:translate-x-1 transition-transform"
                                            onClick={() => window.location.href = `/learning-paths/${path.slug || path.id}`}
                                        >
                                            Start Journey <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {paths.length === 0 && (
                    <div className="col-span-2 text-center text-muted-foreground py-10">
                        No learning paths available yet.
                    </div>
                )}
            </div>

        </div>
    );
}
