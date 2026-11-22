import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

let supabaseClient: SupabaseClient | null = null;

if (config.hasSupabase) {
  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('⚡ [Supabase] Connected successfully to:', config.supabaseUrl);
  } catch (err) {
    console.warn('⚠️ [Supabase] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('ℹ️ [Database] Running with memory/local store. To connect to Supabase, provide SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
}

export const supabase = supabaseClient;

export function isSupabaseConnected(): boolean {
  return supabaseClient !== null;
}
