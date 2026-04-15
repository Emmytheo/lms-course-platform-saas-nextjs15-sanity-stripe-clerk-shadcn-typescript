import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Mail } from "lucide-react";
import { getAuth } from "@/lib/auth-wrapper";
import { redirect } from "next/navigation";
import { InviteInstructorDialog } from "@/components/admin/InviteInstructorDialog";

export default async function AdminInstructorsPage() {
    const { userId } = await getAuth();
    // Auth check logic usually in layout or middleware, but for safety:
    if (!userId) redirect("/");
    // Role check: Admin only (assumed)

    const instructors = await db.getInstructors();

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage Instructors</h1>
                    <p className="text-muted-foreground">View and manage platform instructors.</p>
                </div>
                <InviteInstructorDialog />
            </div>

            <div className="grid gap-6">
                {instructors.map((instructor) => (
                    <Card key={instructor.id} className="flex flex-row items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                                <img src={instructor.avatarUrl || '/placeholder-user.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{instructor.fullName || 'Unknown Name'}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4 mr-1" />
                                    {instructor.email}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20">
                                Demote
                            </Button>
                        </div>
                    </Card>
                ))}

                {instructors.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        No instructors found. Invite users to become instructors.
                    </div>
                )}
            </div>
        </div>
    );
}
