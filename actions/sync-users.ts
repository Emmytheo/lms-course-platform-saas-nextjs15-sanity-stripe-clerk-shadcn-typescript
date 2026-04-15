'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function syncUsersAction() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Missing Supabase credentials for Admin Sync.");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    console.log("Starting User Sync...");

    try {
        // 0. Fetch User IDs from Enrollments (as requested specific check)
        const { data: courseEnr } = await supabase.from('enrollments').select('user_id');
        const { data: examEnr } = await supabase.from('exam_enrollments').select('user_id');
        const { data: pathEnr } = await supabase.from('learning_path_enrollments').select('user_id');

        const enrolledUserIds = new Set([
            ...(courseEnr?.map(e => e.user_id) || []),
            ...(examEnr?.map(e => e.user_id) || []),
            ...(pathEnr?.map(e => e.user_id) || [])
        ]);
        console.log(`Found ${enrolledUserIds.size} unique users across all enrollment tables.`);

        // 1. Fetch all users from Auth (using pagination)
        let allUsers: any[] = [];
        let page = 1;
        const perPage = 50;
        let hasMore = true;

        while (hasMore) {
            const { data: { users }, error } = await supabase.auth.admin.listUsers({
                page: page,
                perPage: perPage
            });

            if (error) throw new Error(`Auth fetch error: ${error.message}`);

            if (!users || users.length === 0) {
                hasMore = false;
            } else {
                allUsers = [...allUsers, ...users];
                if (users.length < perPage) hasMore = false;
                else page++;
            }
        }

        console.log(`Found ${allUsers.length} users in Auth.`);

        // 2. Upsert into public.profiles
        const profilesToUpsert = allUsers.map(u => ({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || u.user_metadata?.fullName || u.email?.split('@')[0] || 'Unknown',
            avatar_url: u.user_metadata?.avatar_url || u.user_metadata?.avatarUrl || '',
            role: 'student', // Default role. If exists, we might overwrite? No, we should be careful.
            // Actually, for sync, we probably want to PRESERVE existing role if possible,
            // but `upsert` in SQL requires fetching first or using ON CONFLICT DO UPDATE.
            // Supabase upsert will overwrite unless we specify fields?
            // Let's rely on ON CONFLICT ignoring role if we assume strict sync? 
            // Better: We only insert if missing, OR update basic info. Role is sensitive.
            // But if the user is asking to "make necessary associations", it implies missing profiles.
            // Let's use upsert but maybe we can't easily skip role if it's required.
            // The `profiles` table might have `role` as default 'student'.
        }));

        // We'll do it one by one or in batches to handle existing roles safely
        // "ON CONFLICT (id) DO UPDATE SET full_name=EXCLUDED.full_name ..."
        // Supabase-js upsert:
        // .upsert({ ... }, { onConflict: 'id' }) -> This replaces everything provided.
        // If we provide role='student', it resets admin to student! THAT IS BAD.

        // Strategy: Fetch existing profiles first to avoid overwriting roles.
        const { data: existingProfiles, error: fetchErr } = await supabase.from('profiles').select('id, role');
        if (fetchErr) throw fetchErr;

        const existingMap = new Map(existingProfiles?.map(p => [p.id, p.role]));

        const finalUpserts = profilesToUpsert.map(p => ({
            ...p,
            role: existingMap.get(p.id) || 'student' // Preserve or default
        }));

        const { error: upsertErr } = await supabase.from('profiles').upsert(finalUpserts);

        if (upsertErr) throw new Error(`Profile sync error: ${upsertErr.message}`);

        console.log(`Successfully synced ${finalUpserts.length} profiles.`);

        revalidatePath('/lms/admin', 'layout');

        return { success: true, count: finalUpserts.length, enrolledUserCount: enrolledUserIds.size };

    } catch (error: any) {
        console.error("Sync Action Failed:", error);
        throw new Error(error.message);
    }
}
