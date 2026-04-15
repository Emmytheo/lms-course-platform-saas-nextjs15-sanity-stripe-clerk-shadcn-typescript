'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { redirect } from "next/navigation";

export async function getStudentDashboardAction() {
    const { userId } = await getAuth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Get enrolled courses
    const enrolledCourses = await db.getStudentEnrollments(userId);

    // Get all learning paths (as recommended/available)
    const learningPaths = await db.getAllLearningPaths();

    return {
        courses: enrolledCourses,
        learningPaths
    };
}
