const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE env vars. Check .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // Start mock JAP server
  const port = 3005;
  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => body += chunk);
      req.on('end', () => {
        // respond with JSON containing an order id
        const providerOrderId = 'JAP-' + Math.floor(Math.random() * 1000000);
        const payload = { order: providerOrderId };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise((resolve) => server.listen(port, resolve));
  console.log('Mock JAP listening on port', port);

  // Create test provider
  const providerRes = await supabase
    .from('providers')
    .insert([{ name: 'mock-jap', api_url: `http://localhost:${port}`, api_key: 'mock', status: 'Active', priority: -999 }])
    .select()
    .maybeSingle();

  if (providerRes.error) {
    console.error('Failed to insert provider', providerRes.error);
    process.exit(1);
  }
  const provider = providerRes.data;
  console.log('Provider created id=', provider.id);

  // Create provider_service mapping (provider_services table)
  const provSvcRes = await supabase
    .from('provider_services')
    .insert([{ provider_id: provider.id, provider_service_id: 'svc-123', platform: 'test', service_name: 'e2e-mapped', rate: 1, min: 1, max: 10000 }])
    .select()
    .maybeSingle();

  if (provSvcRes.error) {
    console.error('Failed to insert provider_service', provSvcRes.error);
    process.exit(1);
  }
  const provSvc = provSvcRes.data;
  console.log('Provider service mapping id=', provSvc.id);

  // Create test service and point to provider_services.id
  const serviceRes = await supabase
    .from('services')
    .insert([{ name: 'e2e-test-service', category: 'General', description: '', price: 1000, min_order: 1, max_order: 100000, active: true, delivery_time: 'Instant', status: 'Active', platform: 'generic', provider: provider.name, provider_service_id: provSvc.id, provider_id: provider.id, selling_price: null }])
    .select()
    .maybeSingle();

  if (serviceRes.error) {
    console.error('Failed to insert service', serviceRes.error);
    process.exit(1);
  }
  const service = serviceRes.data;
  console.log('Service created id=', service.id);

  // Create test user credits row
  // Use an existing user from Supabase auth to satisfy FK constraints
  const usersRes = await supabase.auth.admin.listUsers();
  if (usersRes.error || !usersRes.data || !usersRes.data.users || usersRes.data.users.length === 0) {
    console.error('No existing users available to attach credits to.');
    process.exit(1);
  }
  const userId = usersRes.data.users[0].id;
  // Ensure the user has sufficient credits: update if exists, insert if not
  const existingCredits = await supabase.from('credits').select('id,credits').eq('user_id', userId).maybeSingle();
  if (existingCredits.error) {
    console.error('Failed to query credits', existingCredits.error);
    process.exit(1);
  }
  if (existingCredits.data) {
    const newAmount = Number(existingCredits.data.credits) + 1000;
    const upd = await supabase.from('credits').update({ credits: newAmount }).eq('id', existingCredits.data.id);
    if (upd.error) { console.error('Failed to update credits', upd.error); process.exit(1); }
    console.log('Credits topped up for user', userId);
  } else {
    const creditsRes = await supabase
      .from('credits')
      .insert([{ user_id: userId, credits: 1000 }])
      .select()
      .maybeSingle();
    if (creditsRes.error) { console.error('Failed to insert credits', creditsRes.error); process.exit(1); }
    console.log('Credits created for user', userId);
  }

  // Place order (simulate user creating order)
  const quantity = 100;
  const servicePrice = service.selling_price != null ? Number(service.selling_price) : Number(service.price);
  const charge = Number(((servicePrice * quantity) / 1000).toFixed(2));

  const orderRes = await supabase
    .from('orders')
    .insert([{ user_id: userId, service_id: service.id, link: 'http://example.com', quantity, charge, status: 'Pending', progress: 0, remains: quantity, start_count: 0 }])
    .select()
    .maybeSingle();

  if (orderRes.error) {
    console.error('Failed to create order', orderRes.error);
    process.exit(1);
  }
  const order = orderRes.data;
  console.log('Order created id=', order.id);

  const jobRes = await supabase
    .from('automation_jobs')
    .insert([{ order_id: order.id, user_id: userId, service_id: service.id, status: 'Queued', progress: 0 }])
    .select()
    .maybeSingle();

  if (jobRes.error) {
    console.error('Failed to create job', jobRes.error);
    process.exit(1);
  }
  const job = jobRes.data;
  console.log('Automation job queued id=', job.id);

  // Run worker logic: process the job we just created (avoid older queued jobs)
  const jobToProcess = job;
  console.log('Processing job', jobToProcess.id);

  const orderRow = await supabase
    .from('orders')
    .select('id, user_id, service_id, link, quantity')
    .eq('id', jobToProcess.order_id)
    .single();

  if (orderRow.error || !orderRow.data) {
    console.error('Order not found', orderRow.error);
    process.exit(1);
  }

  const serviceRow = await supabase
    .from('services')
    .select('id, provider_service_id, active')
    .eq('id', orderRow.data.service_id)
    .single();

  if (serviceRow.error || !serviceRow.data) {
    console.error('Service not found', serviceRow.error);
    process.exit(1);
  }

  const providerServiceId = String(serviceRow.data.provider_service_id ?? '').trim();
  if (!providerServiceId) {
    console.error('provider_service_id missing');
    process.exit(1);
  }

  const providerRow = await supabase
    .from('providers')
    .select('id, api_url, api_key')
    .eq('status', 'Active')
    .order('priority', { ascending: true })
    .limit(1)
    .single();

  if (providerRow.error || !providerRow.data) {
    console.error('Provider not available', providerRow.error);
    process.exit(1);
  }

  const providerInfo = providerRow.data;

  // Update job -> Processing
  await supabase.from('automation_jobs').update({ status: 'Processing', progress: 20, started_at: new Date().toISOString() }).eq('id', jobToProcess.id);
  await supabase.from('orders').update({ status: 'Processing', progress: 10 }).eq('id', orderRow.data.id);

  // Send to JAP
  const form = new URLSearchParams({ key: providerInfo.api_key, action: 'add', service: providerServiceId, link: orderRow.data.link, quantity: String(orderRow.data.quantity) });

  const resp = await fetch(providerInfo.api_url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form });
  const text = await resp.text();
  let payload;
  try { payload = JSON.parse(text); } catch { payload = text; }

  if (!resp.ok) {
    console.error('Provider returned non-OK', text);
    await supabase.from('automation_jobs').update({ status: 'Failed', progress: 0, error: 'Provider failure' }).eq('id', jobToProcess.id);
    process.exit(1);
  }

  // extract provider order id
  const providerOrderId = payload.order ?? payload.order_id ?? payload.id ?? payload.request_id ?? null;
  if (!providerOrderId) {
    console.error('No provider order id in response', payload);
    await supabase.from('automation_jobs').update({ status: 'Failed', progress: 0, error: 'Invalid provider response' }).eq('id', jobToProcess.id);
    process.exit(1);
  }

  // Save to order and mark job completed
  await supabase.from('orders').update({ status: 'Processing', progress: 50, provider_id: providerInfo.id, provider_order_id: String(providerOrderId) }).eq('id', orderRow.data.id);

  await supabase.from('automation_jobs').update({ status: 'Completed', progress: 100, completed_at: new Date().toISOString(), error: null }).eq('id', jobToProcess.id);

  // Simulate JAP later reporting completion -> update order progress and status
  await supabase.from('orders').update({ status: 'Completed', progress: 100 }).eq('id', orderRow.data.id);

  // Verify DB rows
  const finalOrder = await supabase.from('orders').select('*').eq('id', orderRow.data.id).single();
  const finalJob = await supabase.from('automation_jobs').select('*').eq('id', jobToProcess.id).single();

  console.log('Final order:', finalOrder.data);
  console.log('Final job:', finalJob.data);
  console.log('Provider response:', payload);

  // Shutdown server
  server.close();

  // Done
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
