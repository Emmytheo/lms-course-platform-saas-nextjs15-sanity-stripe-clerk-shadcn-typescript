'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { enrollInCourseAction, enrollInLearningPathAction, enrollInExamAction } from '@/actions/enrollment';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnrollButtonProps {
    courseId: string; // Used as pathId for learning paths, examId for exams
    redirectUrl: string;
    className?: string;
    label?: string;
    type?: 'course' | 'learning_path' | 'exam';
}

export function EnrollButton({ courseId, redirectUrl, className, label = "Start Learning", type = 'course' }: EnrollButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleEnroll = async () => {
        setIsLoading(true);
        try {
            let res;
            if (type === 'learning_path') {
                res = await enrollInLearningPathAction(courseId);
            } else if (type === 'exam') {
                res = await enrollInExamAction(courseId);
            } else {
                res = await enrollInCourseAction(courseId);
            }

            if (res.success) {
                toast.success("Enrolled successfully!");
                router.push(redirectUrl);
            } else {
                console.error("Enrollment status:", res);
                // Fallback: mostly likely already enrolled, so push to dashboard/redirect
                router.push(redirectUrl);
            }
        } catch (error) {
            console.error("Enrollment error", error);
            router.push(redirectUrl);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleEnroll}
            className={className}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {label}
        </Button>
    );
}
