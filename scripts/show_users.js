require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async ()=>{
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) { console.error('ERROR', error); process.exit(1); }
  if (!data || data.length === 0) { console.log('no users'); process.exit(0); }
  console.log(data[0]);
})();
