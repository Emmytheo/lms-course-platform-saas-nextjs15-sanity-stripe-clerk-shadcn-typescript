'use client';

import React, { useState } from 'react';
import { Exam } from '@/lib/db/interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Award, Shield } from 'lucide-react';
import Link from 'next/link';

interface ExamsBrowserProps {
    initialExams: Exam[];
}

export default function ExamsBrowser({ initialExams }: ExamsBrowserProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredExams = initialExams.filter(exam =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Shield className="w-10 h-10 text-primary" /> Certifications
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            Validate your expertise. Take exams to earn professional certifications and advance your career.
                        </p>
                    </div>

                    <div className="w-full md:w-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search exams..."
                            className="w-full md:w-80 pl-10 bg-card border-border focus:border-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Exams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map((exam) => {
                        const qCount = exam.sections
                            ? exam.sections.reduce((acc, sec) => acc + sec.questions.length, 0)
                            : (exam.questions?.length || 0);

                        return (
                            <Card key={exam._id} className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden flex flex-col justify-between hover:-translate-y-1 duration-300">

                                {/* Thumbnail / Header Image */}
                                <div className="relative h-48 bg-muted">
                                    {exam.thumbnail_url ? (
                                        <img src={exam.thumbnail_url} alt={exam.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                            <Shield className="w-16 h-16 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {exam.difficulty && (
                                            <Badge className="bg-background/70 hover:bg-background/90 text-foreground backdrop-blur-sm border-none">
                                                {exam.difficulty}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <CardHeader className="p-6 pb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                                            Pass: {exam.pass_score}%
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">{exam.title}</CardTitle>
                                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                                        {exam.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="px-6 pb-2 flex-grow">
                                    <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium pt-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>{exam.duration_minutes} Min</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-primary" />
                                            <span>{qCount} Questions</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 pt-4 border-t border-border/50">
                                    {(exam as any).isEnrolled ? (
                                        <Link href={`/lms/student/exams/${exam._id}`} className="w-full">
                                            <Button className="w-full bg-green-600 text-white hover:bg-green-700 font-bold text-lg h-12">
                                                Take Exam
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href={`/cbt/exam/${exam._id}`} className="w-full">
                                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg h-12">
                                                Enroll / Details
                                            </Button>
                                        </Link>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
