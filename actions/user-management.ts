'use server';

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/roles";
import { UserRole } from "@/lib/roles";

export async function updateUserRoleAction(userId: string, newRole: UserRole) {
    // 1. Check if current user is Admin
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        throw new Error("Unauthorized: Only Admins can change user roles.");
    }

    try {
        await db.updateProfile(userId, { role: newRole });
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update user role:", error);
        throw new Error(error.message || "Failed to update role");
    }
}

export async function getProfileByEmailAction(email: string) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        throw new Error("Unauthorized");
    }
    return await db.getProfileByEmail(email);
}
