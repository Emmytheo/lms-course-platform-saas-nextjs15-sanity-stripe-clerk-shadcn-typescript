'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";
import { ExamSection } from "@/lib/db/interface";

const createExamSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

export async function createExamAction(prevState: any, formData: FormData) {
    const { userId, sessionClaims } = await getAuth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') return { error: "Forbidden" };

    const validatedFields = createExamSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { title, description } = validatedFields.data;
    const slug = slugify(title, { lower: true, strict: true });

    let newExam;
    try {
        newExam = await db.createExam({
            title,
            slug: { current: slug },
            description,
            sections: [], // Initial empty sections
        });
        revalidatePath("/lms/admin/exams");
    } catch (error) {
        console.error("Failed to create exam", error);
        return { error: "Failed to create exam." };
    }

    if (newExam?._id) {
        redirect(`/lms/admin/exams/${newExam._id}/edit`);
    } else {
        redirect("/lms/admin/exams");
    }
}

export async function updateExamAction(id: string, prevState: any, formData: FormData) {
    const { userId, sessionClaims } = await getAuth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') return { error: "Forbidden" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const durationStr = formData.get("duration") as string;
    const passingScoreStr = formData.get("passingScore") as string;
    const difficulty = formData.get("difficulty") as any;
    const sectionsJson = formData.get("sections") as string;
    const instructionsStr = formData.get("instructions") as string;
    const prerequisitesStr = formData.get("prerequisites") as string;
    const objectivesStr = formData.get("objectives") as string;
    const tagsStr = formData.get("tags") as string;

    const toArray = (str?: string) => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const toTagArray = (str?: string) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    let sections: ExamSection[] | undefined = undefined;
    if (sectionsJson) {
        try {
            sections = JSON.parse(sectionsJson);
        } catch (e) {
            console.error("Failed to parse sections JSON", e);
        }
    }

    try {
        await db.updateExam(id, {
            title,
            description,
            duration_minutes: parseInt(durationStr) || 0,
            pass_score: parseInt(passingScoreStr) || 0,
            difficulty,
            sections,
            instructions: toArray(instructionsStr),
            prerequisites: toArray(prerequisitesStr),
            objectives: toArray(objectivesStr),
            tags: toTagArray(tagsStr)
        });
        revalidatePath("/lms/admin/exams");
        revalidatePath(`/lms/admin/exams/${id}/edit`);
        return { message: "Exam updated successfully!" };
    } catch (error) {
        console.error("Failed to update exam", error);
        return { error: "Failed to update exam." };
    }
}

export async function getExamById(id: string) {
    // Ideally use db.getExamById(id) but standard is getExam(slug). 
    // Wait, the interface has getExam(slug) but not ID. 
    // And updateExam uses ID.
    // For now, fetch all and find by ID as makeshift solution
    const exams = await db.getAllExams();
    return exams.find(e => e._id === id);
}
