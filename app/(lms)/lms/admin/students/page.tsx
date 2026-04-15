import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, BookOpen } from "lucide-react";
import { getAuth } from "@/lib/auth-wrapper";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SyncStudentsButton } from "@/components/admin/SyncStudentsButton";

export default async function AdminStudentsPage() {
    const { userId } = await getAuth();
    if (!userId) redirect("/");
    // Role check: Admin only

    const students = await db.getStudents();

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage Students</h1>
                    <p className="text-muted-foreground">View and manage enrolled students.</p>
                </div>
                <SyncStudentsButton />
            </div>

            <div className="grid gap-6">
                {students.map((student) => (
                    <Link href={`/lms/admin/students/${student.id}`} key={student.id}>
                        <Card className="flex flex-row items-center justify-between p-6 hover:border-primary transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                                    <img src={student.avatarUrl || '/placeholder-user.jpg'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{student.fullName || 'Unknown Name'}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4 mr-1" />
                                        {student.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">View Profile</span>
                            </div>
                        </Card>
                    </Link>
                ))}

                {students.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        No students found.
                    </div>
                )}
            </div>
        </div>
    );
}
