import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewProvider, ViewTrigger, ViewList, ViewGrid } from '@/components/view-toggle';
import { DeleteResourceButton } from "@/components/admin/DeleteResourceButton";
import { deleteLearningPathAction } from "@/actions/admin";

export default async function AdminLearningPathsPage() {
    const paths = await db.getAllLearningPaths();

    return (
        <div className="p-6 space-y-6 bg-background min-h-screen text-foreground">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Learning Paths</h1>
                    <p className="text-muted-foreground">Manage curated learning journeys.</p>
                </div>
                <Link href="/lms/admin/learning-paths/create">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="w-4 h-4 mr-2" /> Create Path
                    </Button>
                </Link>
            </div>

            <ViewProvider defaultView="list">
                <div className="flex justify-end mb-6">
                    <ViewTrigger />
                </div>

                <div className="space-y-6">
                    {paths.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No learning paths found. Create one to get started.
                        </div>
                    ) : (
                        <>
                            {/* LIST VIEW */}
                            <ViewList className="space-y-4">
                                {paths.map((path) => (
                                    <div key={path._id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-muted rounded border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                                {/* Placeholder image logic matching course card broadly */}
                                                <img src={path.image || ''} alt="" className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-card-foreground text-lg">{path.title}</h3>
                                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                    <BookOpen className="w-3 h-3 mr-1" />
                                                    {(() => {
                                                        const examCount = path.courses?.filter(c => (c as any).pass_score !== undefined).length || 0;
                                                        const courseCount = (path.courses?.length || 0) - examCount;
                                                        const parts = [];
                                                        if (courseCount > 0) parts.push(`${courseCount} Course${courseCount !== 1 ? 's' : ''}`);
                                                        if (examCount > 0) parts.push(`${examCount} Exam${examCount !== 1 ? 's' : ''}`);
                                                        return parts.join(', ') || '0 items';
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/lms/admin/learning-paths/${path._id}/edit`}>
                                                <Button variant="outline" size="sm" className="border-input hover:bg-accent hover:text-accent-foreground">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <DeleteResourceButton id={path._id} action={deleteLearningPathAction} resourceName="Learning Path" />
                                        </div>
                                    </div>
                                ))}
                            </ViewList>

                            {/* GRID VIEW - Reusing existing Card logic */}
                            <ViewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paths.map((path) => (
                                    <Card key={path._id} className="bg-card border-border hover:border-primary/50 transition-colors">
                                        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                                            <CardTitle className="text-lg font-medium text-card-foreground truncate pr-4">
                                                {path.title}
                                            </CardTitle>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                                                    <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer">
                                                        <Link href={`/lms/admin/learning-paths/${path._id}/edit`}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive hover:bg-destructive/10 cursor-pointer">
                                                        {/* Note: Delete logic for Dropdown needs to be handled carefully or just use DeleteResourceButton directly */}
                                                        <div className="w-full flex items-center">Delete (Use List View)</div>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                                {path.description || "No description provided."}
                                            </p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <BookOpen className="w-3 h-3 mr-1" />
                                                {(() => {
                                                    const examCount = path.courses?.filter(c => (c as any).pass_score !== undefined).length || 0;
                                                    const courseCount = (path.courses?.length || 0) - examCount;
                                                    const parts = [];
                                                    if (courseCount > 0) parts.push(`${courseCount} Course${courseCount !== 1 ? 's' : ''}`);
                                                    if (examCount > 0) parts.push(`${examCount} Exam${examCount !== 1 ? 's' : ''}`);
                                                    return parts.join(', ') || '0 items';
                                                })()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </ViewGrid>
                        </>
                    )}
                </div>
            </ViewProvider>
        </div>
    );
}
