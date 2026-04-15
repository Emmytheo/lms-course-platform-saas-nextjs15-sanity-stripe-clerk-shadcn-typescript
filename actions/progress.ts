'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/server";

export async function markLessonCompleteAction(courseId: string, lessonId: string, completed: boolean = true) {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    try {
        await db.updateLessonProgress(userId, courseId, lessonId, completed);
        if (db.calculateAndUpdateEnrollmentProgress) {
            await db.calculateAndUpdateEnrollmentProgress(userId, courseId);
        }
        revalidatePath(`/lms/student/courses/${courseId}`);
        revalidatePath('/lms/student/me/my-courses', 'layout'); // Refresh list and enrollment children
        return { success: true };
    } catch (error) {
        console.error("Failed to update progress:", error);
        return { error: "Failed to update progress" };
    }
}

export async function getEnrollmentProgressAction(courseId: string) {
    const { userId } = await getAuth();
    if (!userId) return { completedLessonIds: [] };

    try {
        const supabase = await createClient();

        // Fetch completed lesson IDs from the dedicated table
        const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('completed', true);

        const completedLessonIds = progressData?.map(p => p.lesson_id) || [];

        // If no progress found in new table, check legacy enrollments.progress for fallback
        if (completedLessonIds.length === 0) {
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('progress')
                .eq('user_id', userId)
                .eq('course_id', courseId)
                .single();

            if (enrollment?.progress && Object.keys(enrollment.progress).length > 0) {
                const legacyProgress = enrollment.progress as Record<string, { completed: boolean }>;
                return {
                    completedLessonIds: Object.entries(legacyProgress)
                        .filter(([_, val]) => val.completed)
                        .map(([key]) => key)
                };
            }
        }

        return { completedLessonIds };
    } catch (error) {
        console.error("Failed to get progress:", error);
        return { completedLessonIds: [] };
    }
}

export async function syncUserEnrollmentsProgressAction() {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    try {
        const supabase = await createClient();
        // Get all enrollments for user
        const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('user_id', userId);

        console.log(enrollments);

        if (enrollments && enrollments.length > 0) {
            for (const enrollment of enrollments) {
                if (db.calculateAndUpdateEnrollmentProgress) {
                    await db.calculateAndUpdateEnrollmentProgress(userId, enrollment.course_id);
                }
            }
        }
        revalidatePath('/lms/student/me/my-learning-paths');
        revalidatePath('/lms/student/me'); // Dashboard
        return { success: true };
    } catch (e) {
        console.error("Sync error:", e);
        return { error: "Failed to sync" };
    }
}

export async function syncLearningPathProgressAction(pathId?: string) {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    try {
        if (db.calculateAndUpdateLearningPathProgress) {
            if (pathId) {
                await db.calculateAndUpdateLearningPathProgress(userId, pathId);
            } else {
                const supabase = await createClient();
                const { data: enrollments } = await supabase.from('learning_path_enrollments').select('learning_path_id').eq('user_id', userId);
                if (enrollments) {
                    for (const enr of enrollments) {
                        await db.calculateAndUpdateLearningPathProgress(userId, enr.learning_path_id);
                    }
                }
            }
        }
        revalidatePath('/lms/student/me/my-learning-paths');
        return { success: true };
    } catch (e) {
        console.error("LP Sync error:", e);
        return { error: "Failed to sync" };
    }
}
