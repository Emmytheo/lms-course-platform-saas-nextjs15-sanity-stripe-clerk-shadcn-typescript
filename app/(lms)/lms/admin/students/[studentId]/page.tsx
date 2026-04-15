import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManualEnrollmentDialog } from "@/components/admin/ManualEnrollmentDialog";
import { SyncStudentsButton } from "@/components/admin/SyncStudentsButton";
import { createClient } from "@supabase/supabase-js";

interface Props {
    params: Promise<{ studentId: string }>;
}

export default async function AdminStudentDetailPage(props: Props) {
    const params = await props.params;
    const { userId } = await getAuth();
    if (!userId) redirect("/");
    // Admin check

    const student = await db.getProfile(params.studentId);
    if (!student) return <div>Student not found</div>;

    // Use Service Role to bypass RLS for Enrollments viewing
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Fetch Enrollments (Direct Admin Query)
    const { data: enrolledCoursesRaw } = await supabaseAdmin
        .from('enrollments')
        .select('*, course:courses(title)')
        .eq('user_id', student.id);

    const { data: enrolledExamsRaw } = await supabaseAdmin
        .from('exam_enrollments')
        .select('*, exam:exams(title, pass_score)')
        .eq('user_id', student.id);

    const { data: enrolledPathsRaw } = await supabaseAdmin
        .from('learning_path_enrollments')
        .select('*, learning_path:learning_paths(title)')
        .eq('user_id', student.id);

    const enrolledCourses = enrolledCoursesRaw || [];
    const enrolledExams = enrolledExamsRaw || [];
    const enrolledPaths = enrolledPathsRaw || [];

    // Fetch All Content for Manual Override options
    const allCourses = await db.getAllCourses();
    const allExams = await db.getAllExams();
    const allPaths = await db.getAllLearningPaths();

    // Map content for Dialog
    const availableContent = [
        ...allCourses.map(c => ({ id: c._id, title: c.title, type: 'course' as const })),
        ...allExams.map(e => ({ id: e._id, title: e.title, type: 'exam' as const })),
        ...allPaths.map(p => ({ id: p._id, title: p.title, type: 'learning-path' as const }))
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap2">
                <div>
                    <h1 className="text-3xl font-bold">{student.fullName}</h1>
                    <p className="text-muted-foreground">{student.email}</p>
                    <Badge className="mt-2" variant="outline">{student.role}</Badge>
                </div>
                <div className="flex gap-2">
                    <SyncStudentsButton />
                    <ManualEnrollmentDialog
                        studentId={student.id}
                        studentName={student.fullName || 'Student'}
                        availableContent={availableContent}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...enrolledCourses, ...enrolledExams, ...enrolledPaths].length === 0 ? (
                            <p className="text-muted-foreground">No active enrollments.</p>
                        ) : (
                            <div className="space-y-4">
                                {/* Courses */}
                                {enrolledCourses.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-muted-foreground mb-2">Courses</h3>
                                        <div className="grid gap-2">
                                            {enrolledCourses.map((enr: any) => (
                                                <div key={enr.id} className="flex justify-between p-3 border rounded-md">
                                                    <span>{enr.course?.title}</span>
                                                    <Badge>{Math.round(enr.progress_percent || 0)}%</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Exams */}
                                {enrolledExams.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-bold text-muted-foreground mb-2">Exams</h3>
                                        <div className="grid gap-2">
                                            {enrolledExams.map((enr: any) => (
                                                <div key={enr.id} className="flex justify-between p-3 border rounded-md">
                                                    <span>{enr.exam?.title}</span>
                                                    <Badge variant={(enr.score || 0) >= enr.exam?.pass_score ? "default" : "secondary"}>
                                                        {enr.status === 'completed' ? `Grade: ${enr.score}%` : 'In Progress'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Paths */}
                                {enrolledPaths.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-bold text-muted-foreground mb-2">Learning Paths</h3>
                                        <div className="grid gap-2">
                                            {enrolledPaths.map((enr: any) => (
                                                <div key={enr.id} className="flex justify-between p-3 border rounded-md">
                                                    <span>{enr.learning_path?.title}</span>
                                                    <Badge>{Math.round(enr.progress_percent || 0)}%</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
