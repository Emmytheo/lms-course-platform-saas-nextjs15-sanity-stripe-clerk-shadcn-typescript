"use client";

import Link from "next/link";
import { BookOpen, Clock, FileText, Trophy } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Exam } from '@/lib/db/interface';
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExamCardProps {
    exam: Exam;
    status?: string;
    href: string;
}

export function ExamCard({ exam, status, href }: ExamCardProps) {
    const imageUrl = exam.thumbnail_url; // Assuming direct URL for now, or sanitized

    return (
        <Card className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
            <Link href={href} className="block relative h-40 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={exam.title || "Exam Image"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Trophy className="w-10 h-10" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-background/50 backdrop-blur-md text-foreground border-border hover:bg-background/70">
                        {exam.difficulty || "Exam"}
                    </Badge>
                </div>
            </Link>

            <CardHeader className="flex-1 p-4">
                <Link href={href}>
                    <CardTitle className="text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {exam.title}
                    </CardTitle>
                </Link>
                <CardDescription className="text-muted-foreground line-clamp-2 mt-2">
                    {exam.description}
                </CardDescription>
            </CardHeader>

            <CardFooter className="border-t border-border p-4 pt-4 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {exam.duration_minutes}m
                    </div>
                    {/* Calculated Question Count */}
                    <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {
                            (exam.sections && Array.isArray(exam.sections))
                                ? exam.sections.reduce((acc: number, sec: any) => acc + (sec.questions?.length || 0), 0)
                                : (exam.questions?.length || 0)
                        } Qs
                    </div>
                </div>

                <Link href={href}>
                    <Button size="sm" className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary">
                        {status === 'in_progress' ? 'Resume' : 'Start'}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
