require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async ()=>{
  try {
    const res = await supabase.auth.admin.listUsers();
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('ERR', err);
  }
})();
