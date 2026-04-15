import { getAuth } from "@/lib/auth-wrapper";
import { db } from "@/lib/db";

export type UserRole = 'student' | 'instructor' | 'admin';

export const ROLES = {
    STUDENT: 'student' as UserRole,
    INSTRUCTOR: 'instructor' as UserRole,
    ADMIN: 'admin' as UserRole,
};

export async function getCurrentUserRole(): Promise<UserRole> {
    const { userId } = await getAuth();
    if (!userId) return ROLES.STUDENT;

    // Fetch from DB profile (Single Source of Truth)
    const profile = await db.getProfile(userId);
    return profile?.role || ROLES.STUDENT;
}

export async function checkRole(role: UserRole) {
    const currentRole = await getCurrentUserRole();

    if (currentRole === role) return true;

    // Hierarchical check (Admin has access to everything)
    if (currentRole === ROLES.ADMIN) return true;

    return false;
}

export async function isActiveInstructor() {
    const role = await getCurrentUserRole();
    return role === ROLES.INSTRUCTOR || role === ROLES.ADMIN;
}

export async function isAdmin() {
    const role = await getCurrentUserRole();
    return role === ROLES.ADMIN;
}
