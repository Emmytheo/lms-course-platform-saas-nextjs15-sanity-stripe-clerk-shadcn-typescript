declare module 'slugify';
declare module 'uuid';
declare module 'react-player';
declare module 'react-player/lazy';
declare module '@mediapipe/pose';
declare module '@mediapipe/camera_utils';

// Add environment variable types
declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_DB_PROVIDER: 'sanity' | 'supabase' | 'dummy';
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
        STRIPE_SECRET_KEY: string;
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
        CLERK_SECRET_KEY: string;
        NEXT_PUBLIC_SANITY_PROJECT_ID: string;
        NEXT_PUBLIC_SANITY_DATASET: string;
        SANITY_API_TOKEN: string;
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        SUPABASE_SERVICE_ROLE_KEY: string;
    }
}
