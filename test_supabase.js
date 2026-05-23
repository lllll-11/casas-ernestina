const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xteghqnlmokceemoameg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1IovWGPE0wG1AgMEWCX3Jw_fUc89xSD';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  console.log('TEST_START');
  try {
    const { data, error } = await supabase.from('propiedades').select('*');
    if (error) {
      console.log('TEST_ERROR:', error.message);
      return;
    }
    console.log('TEST_SUCCESS_COUNT:', data.length);
    console.log('TEST_DATA:', JSON.stringify(data[0] || {}, null, 2));
  } catch (err) {
    console.log('TEST_EXCEPTION:', err.message);
  }
}

test();
