require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

(async ()=>{
  try {
    console.log('Looking up test providers named "mock-jap"');
    const { data: providers, error: provErr } = await supabase.from('providers').select('*').eq('name','mock-jap');
    if (provErr) throw provErr;
    if (!providers || providers.length === 0) {
      console.log('No test providers found.');
    }

    const providerIds = (providers || []).map(p => p.id);
    console.log('Found provider ids:', providerIds);

    // provider_services created by test have service_name 'e2e-mapped' or provider_id in providerIds
    console.log('Looking up provider_services with service_name "e2e-mapped" or provider_id in test providers');
    const { data: provSvcs } = await supabase
      .from('provider_services')
      .select('*')
      .or(`service_name.eq.e2e-mapped,provider_id.in.(${providerIds.join(',')})`);

    const provSvcIds = (provSvcs || []).map(s => s.id);
    console.log('Found provider_service ids:', provSvcIds);

    // services created by test have name 'e2e-test-service' or provider_service_id in provSvcIds
    console.log('Looking up services named "e2e-test-service"');
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .or(`name.eq.e2e-test-service,provider_service_id.in.(${provSvcIds.join(',')})`);

    const serviceIds = (services || []).map(s => s.id);
    console.log('Found service ids:', serviceIds);

    // Orders with link example.com and service_id in our services
    console.log('Looking up orders with link http://example.com and service_id in test services');
    let orders = [];
    if (serviceIds.length>0) {
      const { data: ords } = await supabase
        .from('orders')
        .select('*')
        .in('service_id', serviceIds)
        .eq('link','http://example.com');
      orders = ords || [];
    }
    console.log('Found orders:', orders.map(o=>o.id));

    const orderIds = orders.map(o=>o.id);

    // Automation jobs for those orders
    console.log('Looking up automation_jobs for test orders');
    let jobs = [];
    if (orderIds.length>0) {
      const { data: js } = await supabase.from('automation_jobs').select('*').in('order_id', orderIds);
      jobs = js || [];
    }
    console.log('Found jobs:', jobs.map(j=>j.id));

    // Delete automation_jobs
    if (jobs.length>0) {
      console.log('Deleting automation_jobs:', jobs.map(j=>j.id));
      const { error } = await supabase.from('automation_jobs').delete().in('id', jobs.map(j=>j.id));
      if (error) throw error;
      console.log('Deleted jobs.');
    }

    // Delete orders
    if (orderIds.length>0) {
      console.log('Deleting orders:', orderIds);
      const { error } = await supabase.from('orders').delete().in('id', orderIds);
      if (error) throw error;
      console.log('Deleted orders.');
    }

    // Delete services
    if (serviceIds.length>0) {
      console.log('Deleting services:', serviceIds);
      const { error } = await supabase.from('services').delete().in('id', serviceIds);
      if (error) throw error;
      console.log('Deleted services.');
    }

    // Delete provider_services
    if (provSvcIds.length>0) {
      console.log('Deleting provider_services:', provSvcIds);
      const { error } = await supabase.from('provider_services').delete().in('id', provSvcIds);
      if (error) throw error;
      console.log('Deleted provider_services.');
    }

    // Delete providers
    if (providerIds.length>0) {
      console.log('Deleting providers:', providerIds);
      const { error } = await supabase.from('providers').delete().in('id', providerIds);
      if (error) throw error;
      console.log('Deleted providers.');
    }

    console.log('Cleanup complete.');
    console.log('Summary: deleted providers', providerIds.length, 'provider_services', provSvcIds.length, 'services', serviceIds.length, 'orders', orderIds.length, 'jobs', jobs.length);
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err.message || err);
    process.exit(1);
  }
})();
