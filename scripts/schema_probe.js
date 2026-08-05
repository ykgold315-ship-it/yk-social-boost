require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const tables = ['services', 'providers', 'orders', 'automation_jobs'];
(async () => {
  for (const table of tables) {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name,data_type,is_nullable,udt_name')
      .eq('table_name', table)
      .order('ordinal_position', { ascending: true });
    console.log('TABLE', table);
    if (error) {
      console.error('ERROR', error);
    } else {
      console.log(data.map((r) => `${r.column_name} ${r.data_type} ${r.udt_name} ${r.is_nullable}`).join('\n'));
    }
    console.log('---');
  }
})();
