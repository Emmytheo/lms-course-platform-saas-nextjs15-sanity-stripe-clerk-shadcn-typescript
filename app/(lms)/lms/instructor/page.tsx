import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export default async function InstructorDashboardPage() {
    const { userId } = await getAuth();
    if (!userId) redirect("/sign-in");

    // Double check role? Middleware should handle, but safe play
    const profile = await db.getProfile(userId);
    if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
        redirect("/");
    }

    // Fetch Instructor Data (simplified for now, ideally specific queries)
    const courses = (await db.getAllCourses()).filter(c => c.instructor?.name === profile.fullName);
    // Student count logic might need specific query if we track "my students"
    // For now, let's just show course count

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {profile.fullName}</p>
                </div>
                <Link href="/lms/admin/courses/create"> {/* Instructors use same create flow? */}
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Create New Course
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">My Courses</CardTitle>
                        <BookOpen className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courses.length}</div>
                        <p className="text-xs text-muted-foreground">Active courses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">Enrolled across your content</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Hours Taught</CardTitle>
                        <Clock className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">Total content duration</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.length === 0 ? (
                        <p className="text-muted-foreground">You haven't created any courses yet.</p>
                    ) : (
                        courses.slice(0, 3).map(course => (
                            <Link href={`/lms/admin/courses/${course._id}/edit`} key={course._id} className="block group">
                                <Card className="h-full hover:border-primary transition-colors">
                                    <div className="h-40 bg-muted overflow-hidden rounded-t-lg">
                                        <img src={course.image || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold truncate">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground">{course.level || 'All Levels'}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
