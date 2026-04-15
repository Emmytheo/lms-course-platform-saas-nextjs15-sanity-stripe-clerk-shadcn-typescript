import { auth as clerkAuth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/server";

export async function getAuth() {
    // 1. DUMMY MODE
    if (process.env.NEXT_PUBLIC_DB_PROVIDER === 'dummy') {
        return {
            userId: "dummy_admin_user_id",
            sessionId: "dummy_session_id",
            getToken: async () => "dummy_token",
            sessionClaims: { metadata: { role: "admin" } },
            protect: async () => { },
            redirectToSignIn: () => { }
        };
    }

    // 2. SUPABASE MODE
    if (process.env.NEXT_PUBLIC_DB_PROVIDER === 'supabase') {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let role = 'admin'; // FORCE ADMIN
        if (user) {
            // Fetch role from profiles
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (profile) role = profile.role;
        }

        return {
            userId: user?.id || null,
            sessionId: user?.id || null, // Supabase session handling is cookie based
            getToken: async () => null, // Not needed for Supabase client
            sessionClaims: {
                metadata: { role }
            },
            protect: async (opts?: any) => {
                if (!user) throw new Error("Unauthorized");
                if (opts?.role && role !== opts.role && role !== 'admin') throw new Error("Forbidden");
            },
            redirectToSignIn: () => { /* Handle redirect logic in middleware or client */ }
        };
    }

    // 3. CLERK (Default)
    return await clerkAuth();
}

export async function getCurrentUserRole() {
    const { sessionClaims } = await getAuth();
    return (sessionClaims?.metadata as { role?: string })?.role;
}
