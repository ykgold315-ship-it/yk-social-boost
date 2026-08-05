require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const tables = ['services','provider_services','providers','orders','automation_jobs','credits'];
(async ()=>{
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      console.log('TABLE:', table);
      if (error) {
        console.log('  ERROR:', error.message);
        continue;
      }
      if (!data || data.length === 0) {
        console.log('  no rows');
      } else {
        const row = data[0];
        Object.keys(row).forEach(k => {
          const v = row[k];
          console.log(`  ${k}: ${v === null ? 'null' : typeof v}`);
        });
      }
    } catch (err) {
      console.error('ERR', table, err.message || err);
    }
    console.log('---');
  }
})();
