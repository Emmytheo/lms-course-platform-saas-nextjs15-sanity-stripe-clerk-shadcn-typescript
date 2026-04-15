import { SanityAdapter } from './sanity-adapter';
import { SupabaseAdapter } from './supabase-adapter';
import { LMSDataProvider } from './interface';
import { DummyAdapter } from './dummy-adapter';

const dbProvider = process.env.NEXT_PUBLIC_DB_PROVIDER || 'sanity';

export const db: LMSDataProvider =
    dbProvider === 'supabase' ? new SupabaseAdapter() :
        dbProvider === 'dummy' ? new DummyAdapter() :
            new SanityAdapter();
