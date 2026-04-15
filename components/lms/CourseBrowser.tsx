"use client";

import React, { useEffect, useState } from 'react';
import { Course } from '@/lib/lms/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EnrollButton } from '@/components/EnrollButton';
import { useRouter } from 'next/navigation';

interface CourseBrowserProps {
    initialCourses: Course[];
}

export default function CourseBrowser({ initialCourses }: CourseBrowserProps) {
    const [courses] = useState<Course[]>(initialCourses);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        // console.log('Courses:', courses);
    }, [courses]);

    const handleCardClick = (e: React.MouseEvent, course: Course) => {
        // Prevent navigation if clicking buttons
        if ((e.target as HTMLElement).closest('button')) {
            e.preventDefault();
            return;
        }

        if (course.isEnrolled) {
            router.push(`/lms/courses/${course.id}/outline`);
        } else {
            // Redirect to sales page or show enrollment
            if (course.slug) {
                router.push(`/courses/${course.slug}`);
            } else {
                // Check fallback if slug missing?
                router.push(`/courses/${course.id}`); // Assuming ID route might work or be caught
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Explore Our Library
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Discover a comprehensive collection of expert-led courses. From fundamental skills to advanced professional techniques.
                    </p>
                </div>

                <div className="w-full md:w-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        className="w-full md:w-80 pl-10 bg-muted border-border focus:border-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                    <p className="text-xl">No courses found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        // Wrapper div instead of Link to handle logic nicely
                        <div key={course.id} onClick={(e) => handleCardClick(e, course)} className="group cursor-pointer">
                            <Card className="bg-card border-border overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-primary/50 group-hover:transform group-hover:-translate-y-1 relative">

                                {/* Thumbnail */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={course.thumbnail_url || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Badge className="bg-background/70 hover:bg-background/90 text-foreground backdrop-blur-sm border-none">
                                            {course.difficulty || 'All Levels'}
                                        </Badge>
                                    </div>
                                    {!course.isEnrolled && (
                                        <div className="absolute bottom-3 right-3">
                                            <Badge variant="secondary" className="shadow-lg backdrop-blur-sm">
                                                {course.price ? `$${course.price}` : 'Free'}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="space-y-2 p-6">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                        {course.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="px-6 pb-2 flex-grow">
                                    <div className="flex flex-wrap gap-2">
                                        {(course.tags || []).slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">#{tag}</span>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 pt-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
                                    {course.isEnrolled ? (
                                        <div className="w-full flex justify-between items-center">
                                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Enrolled</Badge>
                                            <span className="text-primary font-medium flex items-center">
                                                Resume <BookOpen className="ml-1 w-4 h-4" />
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-full flex justify-between items-center gap-4">
                                            {/* We can put EnrollButton here directly! */}
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration_minutes || 0} min</span>
                                            </div>
                                            <Button size="sm" variant="default" onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                // If we use EnrollButton logic here it might conflict with nested buttons
                                                // So redirecting to Sales Page is cleaner or rendering EnrollButton
                                            }}>
                                                {course.slug ? (
                                                    <Link href={`/courses/${course.slug}`}>Learn More</Link>
                                                ) : (
                                                    <span>View Details</span>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
