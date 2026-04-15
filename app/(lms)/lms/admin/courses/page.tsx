import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DeleteResourceButton } from '@/components/admin/DeleteResourceButton';
import { deleteCourseAction } from '@/actions/admin';
import { getAuth } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { CourseCard } from '@/components/CourseCard';
import { BookOpen } from 'lucide-react';

export default async function AdminCoursesPage() {
    const { userId } = await getAuth();
    if (!userId) redirect('/auth/login');

    const courses = await db.getAllCourses();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Courses</h1>
                        <p className="text-muted-foreground">View and edit all your courses.</p>
                    </div>
                    <Link href="/lms/admin/courses/create">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                            <Plus className="w-4 h-4 mr-2" /> Add Course
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    <ViewProvider defaultView="list">
                        <div className="flex justify-end mb-4">
                            <ViewTrigger />
                        </div>
                        {courses.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                                No courses found. Create your first course to get started.
                            </div>
                        ) : (
                            <>
                                <ViewList className="space-y-4">
                                    {courses.map((course) => (
                                        <div key={course._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors gap-4">
                                            <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                                                <div className="h-16 w-16 rounded bg-muted overflow-hidden shrink-0">
                                                    <img src={course.image || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-card-foreground text-lg line-clamp-1">{course.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground mt-1">
                                                        <span className="bg-muted px-2 py-0.5 rounded text-xs border border-border shrink-0">{course.category?.title || 'General'}</span>
                                                        <span className="hidden md:inline text-muted-foreground">•</span>
                                                        <span className="text-primary font-medium shrink-0">{course.price ? `$${course.price}` : 'Free'}</span>
                                                        <span className="hidden md:inline text-muted-foreground">•</span>
                                                        <span className="shrink-0">{course.modules?.length || 0} Modules</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-border md:border-t-0">
                                                <Link href={`/lms/admin/courses/${course._id}/edit`}>
                                                    <Button variant="outline" size="sm" className="border-input hover:bg-accent hover:text-accent-foreground h-8">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <DeleteResourceButton id={course._id} action={deleteCourseAction} resourceName="Course" />
                                            </div>
                                        </div>
                                    ))}
                                </ViewList>
                                <ViewGrid className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {courses.map((course) => (
                                        <div key={course._id} className="relative group bg-card border border-border rounded-lg p-4 transition-colors hover:border-primary/50 flex flex-col">
                                            <CourseCard
                                                course={course}
                                                href={`/lms/admin/courses/${course._id}/edit`}
                                            />
                                            <div className="flex justify-end gap-2 mt-4 md:mt-0 md:absolute md:top-4 md:right-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 p-2 md:p-0 bg-transparent">
                                                <Link href={`/lms/admin/courses/${course._id}/edit`}>
                                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 text-foreground border border-border hover:bg-primary hover:text-primary-foreground md:shadow-lg md:backdrop-blur-sm">
                                                        <BookOpen className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteResourceButton id={course._id} action={deleteCourseAction} resourceName="Course" />
                                            </div>
                                        </div>
                                    ))}
                                </ViewGrid>
                            </>
                        )}
                    </ViewProvider>
                </div>
            </div>
        </div>
    );
}
