/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const viteSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fzmobjedwfpjwblofuxb.supabase.co';
const viteSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bW9iamVkd2ZwandibG9mdXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzE3MjAsImV4cCI6MjA5MDQ0NzcyMH0.AhHZmhIkLBUU4ov86KtnJAH9NO9msXpXAFQgYKxdnas';

const supabaseUrl = viteSupabaseUrl;
const supabaseAnonKey = viteSupabaseAnonKey;

export const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'https://placeholder-project.supabase.co' && supabaseUrl.trim() !== '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
