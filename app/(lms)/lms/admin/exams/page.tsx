import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Shield, Clock, Award } from 'lucide-react';
import { DeleteResourceButton } from '@/components/admin/DeleteResourceButton';
import { deleteExamAction } from '@/actions/admin';
import { getAuth } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { BookOpen } from 'lucide-react';

export default async function AdminExamsPage() {
    const { userId } = await getAuth();
    if (!userId) redirect('/auth/login');

    const exams = await db.getAllExams();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Exams</h1>
                        <p className="text-muted-foreground">Create and manage your assessments.</p>
                    </div>
                    <Link href="/lms/admin/exams/create">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                            <Plus className="w-4 h-4 mr-2" /> Create Exam
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    <ViewProvider defaultView="list">
                        <div className="flex justify-end mb-4">
                            <ViewTrigger />
                        </div>
                        {exams.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                                No exams found. Create your first exam to get started.
                            </div>
                        ) : (
                            <>
                                <ViewList className="space-y-4">
                                    {exams.map((exam) => (
                                        <div key={exam._id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded bg-muted border border-border flex items-center justify-center shrink-0">
                                                    <Shield className="w-8 h-8 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-card-foreground text-lg">{exam.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{exam.duration_minutes} mins</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Award className="w-3 h-3 text-yellow-500" />
                                                            <span>Pass: {exam.pass_score}%</span>
                                                        </div>
                                                        <span className="bg-muted px-2 py-0.5 rounded text-xs border border-border">
                                                            {exam.difficulty || 'General'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/lms/admin/exams/${exam._id}/edit`}>
                                                    <Button variant="outline" size="sm" className="border-input hover:bg-accent hover:text-accent-foreground">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <DeleteResourceButton id={exam._id} action={deleteExamAction} resourceName="Exam" />
                                            </div>
                                        </div>
                                    ))}
                                </ViewList>
                                <ViewGrid className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {exams.map((exam) => (
                                        <div key={exam._id} className="relative group border border-border rounded-xl bg-card overflow-hidden hover:border-primary/50 transition-colors flex flex-col">
                                            <div className="h-32 bg-muted flex items-center justify-center shrink-0">
                                                <Shield className="w-12 h-12 text-primary" />
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-bold text-card-foreground mb-2 line-clamp-1">{exam.title}</h3>
                                                <div className="text-xs text-muted-foreground flex justify-between mt-auto">
                                                    <span>{exam.questions?.length || 0} Questions</span>
                                                    <span>Pass: {exam.pass_score}%</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/lms/admin/exams/${exam._id}/edit`}>
                                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 text-foreground border border-border hover:bg-primary hover:text-primary-foreground">
                                                        <BookOpen className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteResourceButton id={exam._id} action={deleteExamAction} resourceName="Exam" />
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
