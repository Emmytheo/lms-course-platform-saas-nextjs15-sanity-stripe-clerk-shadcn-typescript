'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";

export async function createPaymentRequestAction(data: {
    item_id: string;
    item_type: string;
    amount: number;
    proof_url?: string;
}) {
    const { userId } = await getAuth();
    if (!userId) throw new Error("Unauthorized");

    try {
        if (db.createPaymentRequest) {
            await db.createPaymentRequest({
                user_id: userId,
                item_id: data.item_id,
                item_type: data.item_type,
                amount: data.amount,
                status: 'pending',
                proof_url: data.proof_url
            });
        }
    } catch (error: any) {
        console.error("Create Payment Request Error:", error);
        throw new Error(error.message || "Failed to submit request");
    }

    revalidatePath("/lms/student/dashboard"); // Revalidate where the student might see pending status
    return { success: true };
}

export async function approvePaymentRequestAction(id: string) {
    // This should only be called by admins - validation inside the DB layer or here
    const { sessionClaims } = await getAuth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') throw new Error("Forbidden");

    try {
        if (db.updatePaymentRequestStatus) {
            await db.updatePaymentRequestStatus(id, 'approved');
        }
    } catch (error: any) {
        console.error("Approve Payment Error:", error);
        throw new Error(error.message || "Failed to approve payment");
    }

    revalidatePath("/lms/admin");
    return { success: true };
}

export async function rejectPaymentRequestAction(id: string) {
    const { sessionClaims } = await getAuth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') throw new Error("Forbidden");

    try {
        if (db.updatePaymentRequestStatus) {
            await db.updatePaymentRequestStatus(id, 'rejected');
        }
    } catch (error: any) {
        console.error("Reject Payment Error:", error);
        throw new Error(error.message || "Failed to reject payment");
    }

    revalidatePath("/lms/admin");
    return { success: true };
}
