'use client';

import React, { useEffect, useState, use } from 'react';
import { getCourse } from '@/actions/courses';
import { Course } from '@/lib/db/interface';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  CheckCircle, Clock, BookOpen, Target, Star, User, Shield, Award, ArrowLeft, Globe, PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { EnrollButton } from '@/components/lms/EnrollButton';

export default function CourseLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourse(id).then((c) => {
      setCourse(c || undefined);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading Course...</div>;
  if (!course) return <div className="h-screen bg-black flex items-center justify-center text-white">Course not found</div>;

  // Derived stats
  const totalModules = course.modules?.length || 0;
  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const level = course.level || 'All Levels';
  const language = course.language || 'English';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <div className="relative h-fit w-full border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
        <div className="absolute inset-0 z-0 opacity-30">
          {course.image ? (
            <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4 max-w-3xl">
            <Link href="/lms/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary text-primary">{level}</Badge>
              {course.category && (
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{course.category.title}</Badge>
              )}
              <div className="flex items-center gap-1 text-yellow-500 text-sm ml-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">4.8</span>
                <span className="text-muted-foreground">(New)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{course.title}</h1>
            <p className="text-xl text-muted-foreground">{course.description}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2"><User className="w-4 h-4" /> Enrolled Students</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {totalLessons} Lessons</div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> {language}</div>
            </div>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <Card className="bg-card/90 border-border backdrop-blur-md shadow-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">
                    {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                  </div>
                  {course.price && course.price > 0 && (
                    <div className="text-sm text-muted-foreground">One-time payment</div>
                  )}
                </div>

                <EnrollButton
                  courseId={course._id}
                  redirectUrl={`/lms/student/courses/${course.slug?.current || id}`}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-lg"
                  label={course.price ? "Buy Now" : "Start Learning"}
                  type="course"
                />

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" /> <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" /> <span>Access on mobile and TV</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-yellow-500" /> <span>Certificate of completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* What you'll learn */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Target className="w-5 h-5 text-primary" /> What you'll learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.objectives && course.objectives.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-sm">{obj}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No specific objectives listed.</p>
              )}
            </CardContent>
          </Card>

          {/* Course Content / Curriculum */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                <BookOpen className="w-5 h-5 text-primary" /> Course Content
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {totalModules} sections • {totalLessons} lessons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.modules?.map((module, idx) => (
                <div key={module._id} className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 p-4 border-b border-border flex justify-between items-center">
                    <h3 className="font-bold text-foreground">{module.title}</h3>
                    <span className="text-xs text-muted-foreground">{module.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="p-2 space-y-1 bg-card">
                    {module.lessons?.map((lesson, lIdx) => (
                      <div key={lesson._id} className="flex items-center gap-3 p-2 text-sm text-foreground hover:bg-muted rounded transition-colors">
                        <PlayCircle className="w-4 h-4 text-primary/70" />
                        <span>{lesson.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{lesson.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  {course.prerequisites.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Includes */}
          {/* Includes */}
          {course.includes && course.includes.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">This course includes:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {course.includes.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {course.instructor?.photo ? (
                  <img src={course.instructor.photo} alt={course.instructor.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-foreground">{course.instructor?.name || 'Instructor'}</div>
                  <div className="text-xs text-primary">Expert Instructor</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {course.tags && course.tags.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-border text-muted-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
