import { createClient } from '@supabase/supabase-js';
import { Literature } from './types';

const supabaseUrl = 'https://hxmmccddvrigfqfaezlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bW1jY2RkdnJpZ2ZxZmFlemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjA4MzEsImV4cCI6MjA3Njc5NjgzMX0.Go1_LDN4vL1JD_JJgbn6kDUadPcqtm59KRCeFgsMrrY';

if (!supabaseUrl || !supabaseAnonKey) {
  // This check is kept as a safeguard, but with hardcoded values, it should not be triggered.
  throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper type for Supabase operations
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = { error: { message: string } }