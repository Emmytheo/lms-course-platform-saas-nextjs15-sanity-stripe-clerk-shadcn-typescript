'use server';

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/roles";

export async function adminEnrollUserAction(
    userId: string,
    itemId: string,
    itemType: 'course' | 'exam' | 'learning-path'
) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        throw new Error("Unauthorized: Only Admins can manually enroll users.");
    }

    try {
        if (itemType === 'course') {
            await db.createEnrollment(userId, itemId);
        } else if (itemType === 'exam') {
            await db.createExamEnrollment(userId, itemId);
        } else if (itemType === 'learning-path') {
            await db.createLearningPathEnrollment(userId, itemId);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Manual Enrollment Error:", error);
        throw new Error(error.message || "Failed to enroll user");
    }
}
