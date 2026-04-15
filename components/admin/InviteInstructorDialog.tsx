"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/db"; // Can't use server-side db in client
// We need a Server Action to fetch profile by email
import { getProfileByEmailAction } from "@/actions/user-management"; // Will create this
import { updateUserRoleAction } from "@/actions/user-management";

export function InviteInstructorDialog() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [foundUser, setFoundUser] = useState<any>(null);

    const handleSearch = async () => {
        if (!email) return;
        setIsLoading(true);
        setFoundUser(null);
        try {
            const user = await getProfileByEmailAction(email);
            if (user) {
                setFoundUser(user);
            } else {
                toast.error("User not found via email");
            }
        } catch (error) {
            toast.error("Error searching user");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromote = async () => {
        if (!foundUser) return;
        setIsLoading(true);
        try {
            await updateUserRoleAction(foundUser.id, 'instructor');
            toast.success(`${foundUser.fullName} promoted to Instructor`);
            setOpen(false);
            setFoundUser(null);
            setEmail("");
            // Refresh logic? Ideally router.refresh()
            window.location.reload();
        } catch (error) {
            toast.error("Failed to promote user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Invite Instructor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Instructor</DialogTitle>
                    <DialogDescription>
                        Search for an existing user by email to promote them to an Instructor.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex gap-2">
                        <Input
                            id="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button size="icon" onClick={handleSearch} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>

                    {foundUser && (
                        <div className="border rounded-md p-4 bg-muted/50">
                            <p className="font-medium text-sm">Found User:</p>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 overflow-hidden">
                                    <img src={foundUser.avatarUrl || ''} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{foundUser.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{foundUser.email}</p>
                                    <p className="text-xs font-mono mt-1 px-1 bg-background rounded w-fit border">
                                        Current Role: {foundUser.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handlePromote} disabled={!foundUser || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Promote to Instructor
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
