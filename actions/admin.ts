'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function checkAdminRole() {
    const { userId, sessionClaims } = await getAuth();
    if (!userId) return false;
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    return role === 'admin' || role === 'instructor';
}

export async function deleteCourseAction(id: string) {
    if (!await checkAdminRole()) return { error: "Forbidden" };

    try {
        await db.deleteCourse(id);
        revalidatePath("/lms/admin/courses");
        return { success: true };
    } catch (error) {
        console.error("Delete course Error:", error);
        return { error: "Failed to delete course" };
    }
}

export async function deleteExamAction(id: string) {
    if (!await checkAdminRole()) return { error: "Forbidden" };

    try {
        await db.deleteExam(id);
        revalidatePath("/lms/admin/exams");
        return { success: true };
    } catch (error) {
        console.error("Delete exam Error:", error);
        return { error: "Failed to delete exam" };
    }
}

export async function deleteLearningPathAction(id: string) {
    if (!await checkAdminRole()) return { error: "Forbidden" };

    try {
        await db.deleteLearningPath(id);
        revalidatePath("/lms/admin/learning-paths");
        return { success: true };
    } catch (error) {
        console.error("Delete LP Error:", error);
        return { error: "Failed to delete learning path" };
    }
}

export async function deletePostAction(id: string) {
    if (!await checkAdminRole()) return { error: "Forbidden" };

    try {
        if (db.deletePost) {
            await db.deletePost(id);
            revalidatePath("/lms/admin");
            return { success: true };
        }
        return { error: "Not implemented" };
    } catch (error) {
        console.error("Delete post Error:", error);
        return { error: "Failed to delete post" };
    }
}
