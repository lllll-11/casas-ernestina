import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xteghqnlmokceemoameg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1IovWGPE0wG1AgMEWCX3Jw_fUc89xSD';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
