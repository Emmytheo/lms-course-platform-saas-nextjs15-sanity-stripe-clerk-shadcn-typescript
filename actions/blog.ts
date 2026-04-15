'use server';

import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth-wrapper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BlogPost } from "@/lib/db/interface";

async function checkAdminRole() {
    const { userId, sessionClaims } = await getAuth();
    if (!userId) return false;
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    return role === 'admin' || role === 'instructor';
}

export async function createPostAction(prevState: any, formData: FormData) {
    if (!await checkAdminRole()) return { error: "Forbidden" };

    const { userId } = await getAuth();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const cover_image = formData.get('cover_image') as string;
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean);
    const published = formData.get('published') === 'true';

    // Basic slug generation
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

    try {
        if (db.createPost) {
            await db.createPost({
                title,
                slug,
                content,
                excerpt,
                cover_image,
                tags,
                published,
                author_id: userId
            });
        }
    } catch (error: any) {
        console.error("Create Post Error:", error);
        return { error: error.message || "Failed to create post" };
    }

    revalidatePath("/lms/admin");
    revalidatePath("/blog");
    redirect("/lms/admin");
}

export async function updatePostAction(id: string, prevState: any, formData: FormData) {
    if (!await checkAdminRole()) return { error: "Forbidden" };

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const cover_image = formData.get('cover_image') as string;
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean);
    const published = formData.get('published') === 'true';

    try {
        if (db.updatePost) {
            await db.updatePost(id, {
                title,
                content,
                excerpt,
                cover_image,
                tags,
                published
            });
        }
    } catch (error: any) {
        console.error("Update Post Error:", error);
        return { error: error.message || "Failed to update post" };
    }

    revalidatePath("/lms/admin");
    revalidatePath("/blog");
    revalidatePath(`/blog/${formData.get('slug')}`);
    redirect("/lms/admin");
}
