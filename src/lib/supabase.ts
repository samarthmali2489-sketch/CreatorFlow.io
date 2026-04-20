/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder-project.supabase.co' && supabaseUrl.trim() !== '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
