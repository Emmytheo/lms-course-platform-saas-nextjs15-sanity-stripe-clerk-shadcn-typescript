'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
    const { userId } = await getAuth();
    if (!userId) {
        return { error: "Unauthorized" };
    }

    const fullName = formData.get("fullName") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const role = formData.get("role") as string;

    try {
        await db.updateProfile(userId, {
            fullName,
            avatarUrl,
            role: role as any
        });

        revalidatePath("/lms/settings");
        revalidatePath("/lms/admin"); // Revalidate admin to reflect permission changes

        return { message: "Profile updated successfully!" };
    } catch (error: any) {
        console.error("Update Profile Error:", error);
        return { error: error.message || "Failed to update profile" };
    }
}
