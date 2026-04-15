"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, Map } from "lucide-react";
import { LearningPath } from '@/lib/db/interface';
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LearningPathCardProps {
    path: LearningPath;
    progress?: number;
    href: string;
}

export function LearningPathCard({ path, progress, href }: LearningPathCardProps) {
    const imageUrl = path.image || path.thumbnail_url; // Handle both prop names if ambiguous

    return (
        <Card className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
            <Link href={href} className="block relative h-40 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={path.title || "Path Image"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Map className="w-10 h-10" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-background/50 backdrop-blur-md text-foreground border-border hover:bg-background/70">
                        Learning Path
                    </Badge>
                </div>
            </Link>

            <CardHeader className="flex-1 p-4">
                <Link href={href}>
                    <CardTitle className="text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {path.title}
                    </CardTitle>
                </Link>
                <CardDescription className="text-muted-foreground line-clamp-2 mt-2">
                    {path.description}
                </CardDescription>
            </CardHeader>

            <CardFooter className="border-t border-border p-4 pt-4 flex flex-col gap-4 mt-auto">
                <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>
                            {(() => {
                                // Logic: Check if it's an exam (has pass_score), otherwise it's a course.
                                const examCount = path.courses?.filter(c => (c as any).pass_score !== undefined).length || 0;
                                const courseCount = (path.courses?.length || 0) - examCount;

                                const parts = [];
                                if (courseCount > 0) parts.push(`${courseCount} Course${courseCount !== 1 ? 's' : ''}`);
                                if (examCount > 0) parts.push(`${examCount} Exam${examCount !== 1 ? 's' : ''}`);
                                return parts.join(', ') || '0 items';
                            })()}
                        </span>
                    </div>
                    {typeof progress === "number" && (
                        <span className="text-primary font-medium">{progress}%</span>
                    )}
                </div>

                {typeof progress === "number" ? (
                    <Progress value={progress} className="h-1 bg-muted" indicatorClassName="bg-primary" />
                ) : (
                    <Link href={href} className="w-full">
                        <Button size="sm" className="w-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary">
                            View Path
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
}
