import { supabaseConfig } from './supabase-config.js';
export function connectionReady(config = supabaseConfig) {
  return Boolean(config.url && config.publishableKey);
}
export function publicConnection(config = supabaseConfig) {
  const url = new URL(config.url);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/') throw new Error('Invalid project URL.');
  const key = config.publishableKey;
  if (!key || key.startsWith('sb_secret_')) throw new Error('A public Supabase key is required.');
  if (!key.startsWith('sb_publishable_')) {
    try {
      const payload = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.role !== 'anon') throw new Error('Wrong role');
    } catch { throw new Error('Only publishable or anon keys are allowed in the browser.'); }
  }
  return { url: url.origin, key };
}
export function validateInquiry(input) {
  const limits = { full_name: 100, email: 180, business: 180, message: 1500 };
  const row = { id: input.id, track: input.track };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(row.id)) throw new Error('Please reload and try again.');
  if (!['Offline retailer', 'Online / D2C brand', 'Investor'].includes(row.track)) throw new Error('Choose an inquiry type.');
  for (const [field, max] of Object.entries(limits)) {
    row[field] = String(input[field] ?? '').trim();
    if (!row[field] || row[field].length > max) throw new Error('Please complete all fields within the displayed limits.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) throw new Error('Enter a valid email address.');
  row.contact_requested = true;
  return row;
}
export async function saveInquiry(input, { config = supabaseConfig, fetcher = fetch } = {}) {
  const row = validateInquiry(input);
  const { url, key } = publicConnection(config);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetcher(url + '/rest/v1/elluzion_website_inquiries', {
      method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row), signal: controller.signal
    });
    if (response.ok) return { saved: true };
    // Retries use the same UUID. A duplicate primary key means this exact submission was already received.
    if (response.status === 409) {
      const error = await response.json().catch(() => ({}));
      if (error.code === '23505' && /elluzion_website_inquiries_pkey/.test(error.message || '')) return { saved: true, duplicate: true };
    }
    throw new Error('We couldn’t save your inquiry. Please retry or email jayavardhan@elluzionai.com.');
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('Connection interrupted. Your form is still here—please retry.');
    throw error;
  } finally { clearTimeout(timeout); }
}
