import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fzmobjedwfpjwblofuxb.supabase.co';
const supabaseAnonKey = 'sb_publishable_pKxogAc-zgvboHBCgCbg-A_ekr-1GT0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
