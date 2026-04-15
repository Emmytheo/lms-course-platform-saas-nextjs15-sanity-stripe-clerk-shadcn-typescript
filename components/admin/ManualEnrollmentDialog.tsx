"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { adminEnrollUserAction } from "@/actions/enrollment-override";

interface ManualEnrollmentDialogProps {
    studentId: string;
    studentName: string;
    availableContent: { id: string; title: string; type: 'course' | 'exam' | 'learning-path' }[];
}

export function ManualEnrollmentDialog({ studentId, studentName, availableContent }: ManualEnrollmentDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEnroll = async () => {
        if (!selectedContentId) return;
        const content = availableContent.find(c => c.id === selectedContentId);
        if (!content) return;

        setIsLoading(true);
        try {
            await adminEnrollUserAction(studentId, content.id, content.type);
            toast.success(`Enrolled ${studentName} in ${content.title}`);
            setOpen(false);
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Grant Access
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Enrollment</DialogTitle>
                    <DialogDescription>
                        Grant <strong>{studentName}</strong> access to content without payment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Content</Label>
                        <Select onValueChange={setSelectedContentId} value={selectedContentId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select course, exam or path" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableContent.map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        <span className="capitalize font-bold">[{item.type}]</span> {item.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleEnroll} disabled={!selectedContentId || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enroll User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
