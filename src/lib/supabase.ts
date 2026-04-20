/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const viteSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const viteSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = viteSupabaseUrl || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = viteSupabaseAnonKey || 'placeholder-anon-key';

export const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'https://placeholder-project.supabase.co' && supabaseUrl.trim() !== '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
