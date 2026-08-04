const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

(async ()=>{
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Find an active service with provider_service_id
    const { data: service } = await supabase
      .from('services')
      .select('id, provider_service_id, active')
      .neq('provider_service_id', null)
      .neq('provider_service_id', '')
      .neq('provider_service_id', '0')
      .eq('active', true)
      .limit(1)
      .single();

    if (!service) {
      console.error('No suitable service found.');
      process.exit(1);
    }

    // Find any user
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (!user) {
      console.error('No user profile found.');
      process.exit(1);
    }

    const quantity = 100;
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        service_id: service.id,
        link: 'https://example.com/test',
        quantity,
        charge: 1.0,
        status: 'Pending',
        progress: 0,
        remains: quantity,
        start_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Failed to insert order', orderError);
      process.exit(1);
    }

    const { error: jobError } = await supabase
      .from('automation_jobs')
      .insert({
        order_id: order.id,
        user_id: order.user_id,
        service_id: order.service_id,
        status: 'Queued',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (jobError) {
      console.error('Failed to insert automation job', jobError);
      process.exit(1);
    }

    console.log('Inserted test order and queued job', order.id);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
