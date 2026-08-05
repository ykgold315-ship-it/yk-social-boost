require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async ()=>{
  try {
    const { data: providers } = await supabase.from('providers').select('*').eq('name','mock-jap');
    console.log('providers:', (providers||[]).map(p=>p.id));

    const { data: provSvcs } = await supabase.from('provider_services').select('*').or('service_name.eq.e2e-mapped');
    console.log('provider_services:', (provSvcs||[]).map(s=>s.id));

    const { data: services } = await supabase.from('services').select('*').or('name.eq.e2e-test-service');
    console.log('services:', (services||[]).map(s=>s.id));

    const { data: orders } = await supabase.from('orders').select('*').eq('link','http://example.com');
    console.log('orders:', (orders||[]).map(o=>o.id));

    const { data: jobs } = await supabase.from('automation_jobs').select('*').in('order_id',(orders||[]).map(o=>o.id));
    console.log('jobs:', (jobs||[]).map(j=>j.id));

    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
})();
