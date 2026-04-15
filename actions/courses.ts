'use server';

import { db } from "@/lib/db";
import { Course } from "@/lib/db/interface";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";

const createCourseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0).optional(),
    category: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    level: z.string().optional(),
    language: z.string().optional(),
    prerequisites: z.string().optional(), // Newline separated string from textarea
    objectives: z.string().optional(), // Newline separated string from textarea
    includes: z.string().optional(), // Newline separated string from textarea
    tags: z.string().optional(), // Comma separated
});

export async function createCourseAction(prevState: any, formData: FormData) {
    const { userId, sessionClaims } = await getAuth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    // Basic RBAC check - simplified
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') {
        return { error: "Forbidden" };
    }

    const validatedFields = createCourseSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        imageUrl: formData.get("imageUrl"),
        category: formData.get("category"),
        level: formData.get("level"),
        language: formData.get("language"),
        prerequisites: formData.get("prerequisites"),
        objectives: formData.get("objectives"),
        includes: formData.get("includes"),
        tags: formData.get("tags"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { title, description, price, imageUrl, category, level, language, prerequisites, objectives, includes, tags } = validatedFields.data;

    const slug = slugify(title, { lower: true, strict: true });

    // Helper to split text areas into arrays
    const toArray = (str?: string) => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const toTagArray = (str?: string) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    try {
        const newCourse = await db.createCourse({
            title,
            slug: { current: slug },
            description,
            price: price || 0,
            image: imageUrl || undefined,
            category: category ? { title: category } : undefined,
            level: level as any,
            language: language,
            prerequisites: toArray(prerequisites),
            objectives: toArray(objectives),
            includes: toArray(includes),
            tags: toTagArray(tags),
            instructor: { _id: userId } as any,
        });

        revalidatePath("/lms/admin/courses");
    } catch (error) {
        console.error("Failed to create course:", error);
        return { error: "Failed to create course. Slug might be taken." };
    }

    redirect("/lms/admin/courses");
}

export async function updateCourseAction(id: string, prevState: any, formData: FormData) {
    const { userId, sessionClaims } = await getAuth();
    // RBAC Check
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'instructor') return { error: "Forbidden" };

    const validatedFields = createCourseSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        imageUrl: formData.get("imageUrl"),
        category: formData.get("category"),
        level: formData.get("level"),
        language: formData.get("language"),
        prerequisites: formData.get("prerequisites"),
        objectives: formData.get("objectives"),
        includes: formData.get("includes"),
        tags: formData.get("tags"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { title, description, price, imageUrl, category, level, language, prerequisites, objectives, includes, tags } = validatedFields.data;

    const modulesJson = formData.get("modules") as string;
    let modules: any[] | undefined = undefined;
    if (modulesJson) {
        try {
            modules = JSON.parse(modulesJson);
        } catch (e) {
            console.error("Failed to parse modules JSON", e);
        }
    }

    const toArray = (str?: string) => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const toTagArray = (str?: string) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    try {
        await db.updateCourse(id, {
            title,
            description,
            price,
            image: imageUrl || undefined,
            category: category ? { title: category } : undefined,
            level: level as any,
            language: language,
            prerequisites: toArray(prerequisites),
            objectives: toArray(objectives),
            includes: toArray(includes),
            tags: toTagArray(tags),
            modules: modules,
        });
        revalidatePath(`/lms/admin/courses/${id}/edit`);
        revalidatePath("/lms/admin/courses");
        return { message: "Course updated successfully!" };
    } catch (error: any) {
        console.error("COURSE UPDATE ERROR:", error);
        return { error: error.message || "Failed to update course." };
    }
}

export async function getCourse(slugOrId: string) {
    // TEMPORARY: using getAllCourses filter. Optimisation needed logic within adapter.
    // The Sanity adapter takes a slug for getCourse.
    // We should implement getCourseById in the adapters for better perf.
    // For now we try to find by ID or Slug.
    const courses = await db.getAllCourses();
    return courses.find(c => c._id === slugOrId || c.slug.current === slugOrId);
}
