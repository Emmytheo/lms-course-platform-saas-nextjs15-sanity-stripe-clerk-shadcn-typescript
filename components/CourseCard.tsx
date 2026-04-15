"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { CourseProgress } from "@/components/CourseProgress";
import { Course } from '@/lib/db/interface';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
  progress?: number;
  href: string;
}

export function CourseCard({ course, progress, href }: CourseCardProps) {
  const imageUrl = typeof course.image === 'string'
    ? course.image
    : (course.image ? urlFor(course.image).url() : "");

  return (
    <Card className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
      <Link href={href} className="block relative h-40 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={course.title || "Course Image"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            <BookOpen className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          {/* Use category as 'difficulty' proxy or just show category */}
          <Badge className="bg-black/50 backdrop-blur-md text-white border-white/20 hover:bg-black/70">
            {course.category?.title || "Course"}
          </Badge>
        </div>
      </Link>

      <CardHeader className="flex-1 p-4">
        <Link href={href}>
          <CardTitle className="text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </CardTitle>
        </Link>
        <CardDescription className="text-muted-foreground line-clamp-2 mt-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="border-t border-border p-4 pt-4 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" /> {course.modules?.length || 0} Modules
        </div>

        {typeof progress === "number" ? (
          <div className="w-24">
            <CourseProgress variant="default" size="sm" progress={progress} />
          </div>
        ) : (
          <Link href={href}>
            <Button size="sm" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:text-primary">
              View Course
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
