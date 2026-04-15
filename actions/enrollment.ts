'use server';

import { db } from '@/lib/db';
import { getAuth } from '@/lib/auth-wrapper';
import { revalidatePath } from 'next/cache';

export async function enrollInCourseAction(courseId: string) {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    // Simulate payment process here if needed, or assume free/already paid
    // API logic to insert into DB
    try {
        await db.createEnrollment(userId, courseId);
        revalidatePath('/lms/student/me/my-courses');
        return { success: true };
    } catch (e) {
        console.error("Enrollment error:", e);
        return { error: "Failed to enroll" };
    }
}

export async function enrollInExamAction(examId: string) {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    try {
        await db.createExamEnrollment(userId, examId);
        revalidatePath('/lms/student/me/my-exams');
        return { success: true };
    } catch (e) {
        console.error("Exam Enrollment error:", e);
        return { error: "Failed to enroll in exam" };
    }
}

export async function enrollInLearningPathAction(pathId: string) {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    try {
        await db.createLearningPathEnrollment(userId, pathId);
        revalidatePath('/lms/student/me/my-learning-paths');
        return { success: true };
    } catch (e) {
        console.error("Learning Path Enrollment error:", e);
        return { error: "Failed to enroll in learning path" };
    }
}

export async function getEnrollmentAction(enrollmentId: string, type: 'course' | 'exam' = 'course') {
    const { userId } = await getAuth();
    if (!userId) return null;

    // This would need a DB method to fetch by ID
    // For now, allow fetching by courseId for backward compatibility or add specific ID method
    // If type is course, fetch from enrollments table
    return null; // Placeholder until DB adapter update
}

export async function getMyEnrollmentsAction() {
    const { userId } = await getAuth();
    if (!userId) return [];
    try {
        const enrollments = await db.getStudentEnrollmentsWithDetails(userId);
        return enrollments;
    } catch (e) {
        console.error("Failed to get my enrollments", e);
        return [];
    }
}

export async function getEnrollmentByIdAction(enrollmentId: string) {
    const { userId } = await getAuth();
    if (!userId) return null;

    try {
        const enrollment = await db.getEnrollment(enrollmentId);
        // Verify ownership
        if (enrollment && enrollment.user_id === userId) {
            return enrollment;
        }
        return null;
    } catch (e) {
        console.error("Failed to get enrollment", e);
        return null;
    }
}

export async function getMyExamEnrollmentsAction() {
    const { userId } = await getAuth();
    if (!userId) return [];
    try {
        const enrollments = await db.getStudentExamEnrollmentsWithDetails(userId);
        return enrollments;
    } catch (e) {
        console.error("Failed to get my exam enrollments", e);
        return [];
    }
}

export async function getExamEnrollmentByIdAction(enrollmentId: string) {
    const { userId } = await getAuth();
    if (!userId) return null;

    try {
        const enrollment = await db.getExamEnrollment(enrollmentId);
        // Verify ownership
        if (enrollment && enrollment.user_id === userId) {
            return enrollment;
        }
        return null;
    } catch (e) {
        console.error("Failed to get exam enrollment", e);
        return null; // or throw
    }
}

export async function getMyLearningPathEnrollmentsAction() {
    const { userId } = await getAuth();
    if (!userId) return [];
    try {
        revalidatePath('/lms/student/me/my-learning-paths');
        const enrollments = await db.getStudentLearningPathEnrollmentsWithDetails(userId);
        return enrollments;
    } catch (e) {
        console.error("Failed to get my learning path enrollments", e);
        return [];
    }
}

export async function getLPEnrollmentByIdAction(enrollmentId: string) {
    const { userId } = await getAuth();
    if (!userId) return null;

    try {
        const enrollment = await db.getLPEnrollment(enrollmentId);
        // Verify ownership
        if (enrollment && enrollment.user_id === userId) {
            return enrollment;
        }
        return null;
    } catch (e) {
        console.error("Failed to get LP enrollment", e);
        return null;
    }
}

export async function saveExamResultAction(enrollmentId: string, score: number, answers: any) {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    try {
        // Verify ownership/enrollment exists
        const enrollment = await db.getExamEnrollment(enrollmentId);
        if (!enrollment || enrollment.user_id !== userId) {
            return { error: "Enrollment not found or unauthorized" };
        }

        await db.updateExamEnrollment(enrollmentId, {
            score,
            answers,
            status: 'completed'
        });

        revalidatePath('/lms/student/me/my-exams');
        return { success: true };
    } catch (e) {
        console.error("Failed to save exam result", e);
        return { error: "Failed to save result" };
    }
}

export async function resetExamEnrollmentAction(enrollmentId: string) {
    const { userId } = await getAuth();
    if (!userId) return { error: "Unauthorized" };

    try {
        // Verify ownership/enrollment exists
        const enrollment = await db.getExamEnrollment(enrollmentId);
        if (!enrollment || enrollment.user_id !== userId) {
            return { error: "Enrollment not found or unauthorized" };
        }

        await db.updateExamEnrollment(enrollmentId, {
            score: null,
            answers: {},
            status: 'active'
        });

        revalidatePath('/lms/student/me/my-exams');
        return { success: true };
    } catch (e) {
        console.error("Failed to reset exam enrollment", e);
        return { error: "Failed to reset exam" };
    }
}
