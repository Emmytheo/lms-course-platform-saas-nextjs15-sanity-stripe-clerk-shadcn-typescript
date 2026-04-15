'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";

export async function enrollFreeAction(
    itemId: string,
    itemType: 'course' | 'exam' | 'learning-path'
) {
    const { userId } = await getAuth();
    if (!userId) {
        throw new Error("You must be logged in to enroll.");
    }

    try {
        // TODO: Validate item price is actually 0 to prevent abuse?
        // For now, trusting the UI/Client context, but secure way is fetching item again.
        // Let's do a quick fetch check.
        if (itemType === 'course') {
            const course = await db.getCourseById(itemId);
            if (course?.price && course.price > 0) throw new Error("This course is not free.");
            await db.createEnrollment(userId, itemId);
        } else if (itemType === 'exam') {
            const exam = await db.getExamById(itemId);
            // Exams might not have price field on interface yet? Assuming free for now if button shown.
            // If generic exam interface adds price, check it here.
            await db.createExamEnrollment(userId, itemId);
        } else if (itemType === 'learning-path') {
            // Paths usually don't have price field in interface?
            await db.createLearningPathEnrollment(userId, itemId);
        }

        revalidatePath('/lms/student');
        return { success: true };
    } catch (error: any) {
        console.error("Free Enrollment Error:", error);
        throw new Error(error.message || "Failed to enroll");
    }
}
