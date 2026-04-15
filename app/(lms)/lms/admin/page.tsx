import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, BookOpen, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getAuth } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { DeleteResourceButton } from '@/components/admin/DeleteResourceButton';
import { deleteCourseAction, deleteExamAction, deleteLearningPathAction, deletePostAction } from '@/actions/admin';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { CourseCard } from '@/components/CourseCard';
import { SyncStudentsButton } from '@/components/admin/SyncStudentsButton';
import { approvePaymentRequestAction, rejectPaymentRequestAction } from '@/actions/payments';
import { CreditCard, CheckCircle, XCircle, Eye } from 'lucide-react';

export default async function AdminDashboard() {
  const { userId, sessionClaims } = await getAuth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Double-check because middleware should catch this, but good for safety
  if (role !== 'admin' && role !== 'instructor') {
    redirect('/');
  }

  const courses = await db.getAllCourses();
  const learningPaths = await db.getAllLearningPaths();
  const exams = await db.getAllExams();
  const students = await db.getStudents();
  const posts = await db.getAllPosts?.() || [];
  const paymentRequests = await db.getPaymentRequests?.() || [];

  const studentsCount = await db.getStudentCount();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{role === 'admin' ? 'Admin Dashboard' : 'Instructor Dashboard'}</h1>
            <p className="text-gray-400">Manage your platform, students, and content.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/lms/admin/courses/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                <Plus className="w-4 h-4 mr-2" /> New Course
              </Button>
            </Link>
            <Link href="/lms/admin/blog/create">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 font-bold">
                <Plus className="w-4 h-4 mr-2" /> New Post
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{studentsCount}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Content</CardTitle>
              <BookOpen className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{courses.length + exams.length} Items</div>
              <p className="text-xs text-muted-foreground">Across courses & exams</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
              <BarChart3 className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">68%</div>
              <p className="text-xs text-muted-foreground">+4% increase</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted border border-border w-full sm:w-auto justify-start overflow-x-auto overflow-y-hidden">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="payments">Payments ({paymentRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
          </TabsList>


          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2">
                <ChartAreaInteractive />
              </div>

              {/* Quick Actions & Recent */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Link href="/lms/admin/courses/create">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-muted text-left">
                        <Plus className="w-4 h-4 mr-2" /> Create New Course
                      </Button>
                    </Link>
                    <Link href="/lms/admin/exams/create">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-muted text-left">
                        <Plus className="w-4 h-4 mr-2" /> Create New Exam
                      </Button>
                    </Link>
                    <Link href="/lms/admin/learning-paths/create">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-muted text-left">
                        <Plus className="w-4 h-4 mr-2" /> Create Learning Path
                      </Button>
                    </Link>
                    <Link href="/lms/admin/blog/create">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-muted text-left">
                        <Plus className="w-4 h-4 mr-2" /> Create Publication
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recent Courses (Mini List) */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses.slice(0, 3).map(course => (
                      <div key={course._id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                          <img src={course.image || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate text-foreground">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.category?.title}</p>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && <p className="text-sm text-muted-foreground">No courses created yet.</p>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* COURSES TAB */}
          <TabsContent value="courses" className="space-y-4">
            <ViewProvider defaultView="list">
              <div className="flex justify-between sm:items-center pb-2 flex-col sm:flex-row gap-4 sm:gap-0">
                <h2 className="text-xl font-bold">Manage Courses</h2>
                <div className="flex items-center gap-4 justify-between sm:justify-center">
                  <ViewTrigger />
                  <Link href="/lms/admin/courses/create">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Plus className="w-4 h-4 mr-2" /> Add Course
                    </Button>
                  </Link>
                </div>
              </div>

              {/* LIST VIEW */}
              <ViewList className="space-y-4">
                {courses.map((course) => (
                  <div key={course._id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                        <img src={course.image || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{course.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{course.category?.title || 'General'}</span>
                          <span>•</span>
                          <span>{course.price ? `$${course.price}` : 'Free'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/lms/admin/courses/${course._id}/edit`}>
                        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-muted">Edit</Button>
                      </Link>
                      <DeleteResourceButton id={course._id} action={deleteCourseAction} resourceName="Course" />
                    </div>
                  </div>
                ))}
              </ViewList>

              {/* GRID VIEW */}
              <ViewGrid className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="relative group">
                    <CourseCard
                      course={course}
                      href={`/lms/admin/courses/${course._id}/edit`}
                    />
                    {/* Overlay Actions for Grid View */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/lms/admin/courses/${course._id}/edit`}>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 text-foreground border border-border hover:bg-primary hover:text-primary-foreground">
                          <BookOpen className="h-4 w-4" /> {/* Edit Icon really */}
                        </Button>
                      </Link>
                      <DeleteResourceButton id={course._id} action={deleteCourseAction} resourceName="Course" />
                    </div>
                  </div>
                ))}
              </ViewGrid>
            </ViewProvider>
          </TabsContent>

          {/* EXAMS TAB */}
          <TabsContent value="exams" className="space-y-4">
            <ViewProvider defaultView="list">
              <div className="flex justify-between sm:items-center pb-2 flex-col sm:flex-row gap-4 sm:gap-0">
                <h2 className="text-xl font-bold">Manage Exams</h2>
                <div className="flex items-center gap-4 justify-between sm:justify-center">
                  <ViewTrigger />
                  <Link href="/lms/admin/exams/create">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Plus className="w-4 h-4 mr-2" /> Create Exam
                    </Button>
                  </Link>
                </div>
              </div>

              <ViewList className="space-y-4">
                {exams.map((exam) => (
                  <div key={exam._id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-primary">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{exam.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Pass Score: {exam.pass_score}%</span>
                          <span>•</span>
                          <span>{exam.questions?.length || 0} Questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/lms/admin/exams/${exam._id}/edit`}>
                        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-muted">Edit</Button>
                      </Link>
                      <DeleteResourceButton
                        id={exam._id}
                        action={deleteExamAction}
                        resourceName="Exam"
                      />
                    </div>
                  </div>
                ))}
              </ViewList>

              <ViewGrid className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {exams.map((exam) => (
                  <div key={exam._id} className="relative group border border-border rounded-xl bg-card overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="h-32 bg-muted flex items-center justify-center">
                      <Shield className="w-12 h-12 text-primary/80" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-1">{exam.title}</h3>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{exam.questions?.length || 0} Questions</span>
                        <span>Pass: {exam.pass_score}%</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/lms/admin/exams/${exam._id}/edit`}>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 text-foreground border border-border hover:bg-primary/20">
                          <BookOpen className="h-3 w-3" />
                        </Button>
                      </Link>
                      <DeleteResourceButton id={exam._id} action={deleteExamAction} resourceName="Exam" />
                    </div>
                  </div>
                ))}
              </ViewGrid>
            </ViewProvider>
          </TabsContent>

          {/* LEARNING PATHS TAB */}
          <TabsContent value="paths" className="space-y-4">
            <ViewProvider defaultView="list">
              <div className="flex justify-between sm:items-center pb-2 flex-col sm:flex-row gap-4 sm:gap-0">
                <h2 className="text-xl font-bold">Manage Learning Paths</h2>
                <div className="flex items-center gap-4 justify-between sm:justify-center">
                  <ViewTrigger />
                  <Link href="/lms/admin/learning-paths/create">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Plus className="w-4 h-4 mr-2" /> Create Path
                    </Button>
                  </Link>
                </div>
              </div>

              <ViewList className="space-y-4">
                {learningPaths.map((path) => (
                  <div key={path._id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                        <img src={path.image || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{path.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {(() => {
                              const examCount = path.courses?.filter(c => (c as any).pass_score !== undefined).length || 0;
                              const courseCount = (path.courses?.length || 0) - examCount;
                              const parts = [];
                              if (courseCount > 0) parts.push(`${courseCount} Course${courseCount !== 1 ? 's' : ''}`);
                              if (examCount > 0) parts.push(`${examCount} Exam${examCount !== 1 ? 's' : ''}`);
                              return parts.join(', ') || '0 items';
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/lms/admin/learning-paths/${path._id}/edit`}>
                        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-muted">Edit</Button>
                      </Link>
                      <DeleteResourceButton id={path._id} action={deleteLearningPathAction} resourceName="Learning Path" />
                    </div>
                  </div>
                ))}
              </ViewList>

              <ViewGrid className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {learningPaths.map((path) => (
                  <div key={path._id} className="relative group border border-border rounded-xl bg-card overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="h-40 bg-muted">
                      <img src={path.image || ''} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-1">{path.title}</h3>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>
                          {(() => {
                            const examCount = path.courses?.filter(c => (c as any).pass_score !== undefined).length || 0;
                            const courseCount = (path.courses?.length || 0) - examCount;
                            const parts = [];
                            if (courseCount > 0) parts.push(`${courseCount} Course${courseCount !== 1 ? 's' : ''}`);
                            if (examCount > 0) parts.push(`${examCount} Exam${examCount !== 1 ? 's' : ''}`);
                            return parts.join(', ') || '0 items';
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/lms/admin/learning-paths/${path._id}/edit`}>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 text-foreground border border-border hover:bg-primary/20">
                          <BookOpen className="h-3 w-3" />
                        </Button>
                      </Link>
                      <DeleteResourceButton id={path._id} action={deleteLearningPathAction} resourceName="Learning Path" />
                    </div>
                  </div>
                ))}
              </ViewGrid>
            </ViewProvider>
          </TabsContent>

          {/* STUDENTS TAB */}
          <TabsContent value="students">
            <div className="space-y-4">
              <div className="flex justify-between sm:items-center pb-2 flex-col sm:flex-row gap-4 sm:gap-0">
                <h2 className="text-xl font-bold">Manage Students</h2>
                <div className="flex items-center gap-4 justify-between sm:justify-center">
                  <SyncStudentsButton />
                  <Link href="/lms/admin/students">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      View Full Directory
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {students.slice(0, 10).map((student: any) => (
                  <Link href={`/lms/admin/students/${student.id}`} key={student.id}>
                    <Card className="flex flex-row items-center justify-between p-4 hover:border-primary transition-colors cursor-pointer bg-card border-border">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                          <img src={student.avatarUrl || '/placeholder-user.jpg'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-foreground">{student.fullName || 'Unknown Name'}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-3 h-3 mr-1" />
                            {student.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-8">
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {student.email}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <BookOpen className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
                {students.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                    No students enrolled yet.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* PUBLICATIONS TAB */}
          <TabsContent value="publications" className="space-y-4">
             <div className="flex justify-between sm:items-center pb-2 flex-col sm:flex-row gap-4 sm:gap-0">
                <h2 className="text-xl font-bold">Manage Publications</h2>
                <Link href="/lms/admin/blog/create">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                        <Plus className="w-4 h-4 mr-2" /> New Post
                    </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {posts.map((post: any) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                        {post.cover_image ? (
                            <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                <Plus className="w-4 h-4" />
                            </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{post.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className={post.published ? "text-green-500" : "text-yellow-500 underline"}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/lms/admin/blog/${post.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-muted">Edit</Button>
                      </Link>
                      <DeleteResourceButton id={post.id} action={deletePostAction} resourceName="Post" />
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                   <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                     No blog posts yet.
                   </div>
                )}
              </div>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-4">
             <div className="flex justify-between sm:items-center pb-2 flex-col sm:flex-row gap-4 sm:gap-0">
                <h2 className="text-xl font-bold">Manual Enrollment Requests</h2>
                <div className="text-sm text-muted-foreground">
                    {paymentRequests.filter(r => r.status === 'pending').length} pending approval
                </div>
              </div>

              <div className="space-y-4">
                {paymentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-6 rounded-2xl border border-border bg-card hover:border-border/80 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          request.status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                          request.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 
                          'bg-primary/10 text-primary'
                      }`}>
                         <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-foreground">{request.user?.fullName || 'Anonymous'}</h3>
                            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest px-2 py-0 h-5">
                                {request.item_type}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="font-bold text-foreground">${request.amount}</span>
                          <span>•</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                          {request.proof_url && (
                            <>
                                <span>•</span>
                                <a 
                                    href={request.proof_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline font-bold"
                                >
                                    <Eye className="w-3 h-3" /> View Receipt
                                </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {request.status === 'pending' ? (
                        <>
                          <form action={async () => {
                              'use server';
                              await approvePaymentRequestAction(request.id);
                          }}>
                              <Button variant="outline" size="sm" className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white font-bold">
                                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                              </Button>
                          </form>
                          <form action={async () => {
                              'use server';
                              await rejectPaymentRequestAction(request.id);
                          }}>
                              <Button variant="outline" size="sm" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white font-bold">
                                  <XCircle className="w-4 h-4 mr-2" /> Reject
                              </Button>
                          </form>
                        </>
                      ) : (
                        <Badge variant={request.status === 'approved' ? "default" : "destructive"} className="font-bold uppercase tracking-widest text-[10px]">
                            {request.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {paymentRequests.length === 0 && (
                   <div className="text-center py-20 text-muted-foreground border border-dashed rounded-3xl">
                     No payment requests recorded yet.
                   </div>
                )}
              </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

