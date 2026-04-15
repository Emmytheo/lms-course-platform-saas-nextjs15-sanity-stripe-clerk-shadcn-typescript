'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";
import { Course } from "@/lib/db/interface";

const createPathSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    level: z.string().optional(),
    language: z.string().optional(),
    prerequisites: z.string().optional(),
    objectives: z.string().optional(),
});

export async function createLearningPathAction(prevState: any, formData: FormData) {
    const { userId, sessionClaims } = await getAuth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') {
        return { error: "Forbidden" };
    }

    const validatedFields = createPathSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        level: formData.get("level"),
        language: formData.get("language"),
        prerequisites: formData.get("prerequisites"),
        objectives: formData.get("objectives"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { title, description, imageUrl, level, language, prerequisites, objectives } = validatedFields.data;
    const slug = slugify(title, { lower: true, strict: true });

    const toArray = (str?: string) => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];

    try {
        const newPath = await db.createLearningPath({
            title,
            slug: { current: slug },
            description,
            image: imageUrl || undefined,
            level: level as any,
            language: language,
            prerequisites: toArray(prerequisites),
            objectives: toArray(objectives),
        });

        // Handle initial courses if provided
        const coursesJson = formData.get("courses") as string;
        if (coursesJson) {
            try {
                const courseIds = JSON.parse(coursesJson);
                const courses = courseIds.map((id: string) => ({ _id: id })) as Course[];
                await db.updateLearningPath(newPath._id, { courses });
            } catch (e) {
                console.error("Failed to add initial courses", e);
            }
        }

        revalidatePath("/lms/admin/learning-paths");
    } catch (error) {
        console.error("Failed to create learning path:", error);
        return { error: "Failed to create learning path. Slug might be taken." };
    }

    redirect("/lms/admin/learning-paths");
}

export async function updateLearningPathAction(id: string, prevState: any, formData: FormData) {
    const { userId, sessionClaims } = await getAuth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') return { error: "Forbidden" };

    const validatedFields = createPathSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        level: formData.get("level"),
        language: formData.get("language"),
        prerequisites: formData.get("prerequisites"),
        objectives: formData.get("objectives"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { title, description, imageUrl, level, language, prerequisites, objectives } = validatedFields.data;

    const coursesJson = formData.get("courses") as string;
    let courses: (Course | any)[] | undefined = undefined; // Items (Courses or Exams)
    if (coursesJson) {
        try {
            // We expect full objects or at least objects with _id and type-distinguishing props
            courses = JSON.parse(coursesJson);
        } catch (e) {
            console.error("Failed to parse courses JSON", e);
        }
    }

    const toArray = (str?: string) => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];

    try {
        await db.updateLearningPath(id, {
            title: validatedFields.data.title,
            description: validatedFields.data.description,
            image: validatedFields.data.imageUrl || undefined,
            courses: courses,
            level: level as any,
            language: language,
            prerequisites: toArray(prerequisites),
            objectives: toArray(objectives),
        });
        revalidatePath(`/lms/admin/learning-paths`);
        return { message: "Learning Path updated successfully!" };
    } catch (error) {
        console.error("Failed to update learning path", error);
        return { error: "Failed to update learning path." };
    }
}

export async function getLearningPathById(id: string) {
    return await db.getLearningPathById(id);
}

export async function getAllCoursesAction() {
    return await db.getAllCourses();
}

export async function getAllExamsAction() {
    return await db.getAllExams();
}

export async function getAllLearningPaths() {
    return await db.getAllLearningPaths();
}
