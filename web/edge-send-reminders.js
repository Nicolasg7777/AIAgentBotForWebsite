// Supabase Edge Function example (JavaScript)
// Deploy via Supabase functions and schedule daily cron.
// Sends reminder emails using Resend API.

export default async (req) => {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const resendKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('REMINDER_FROM_EMAIL');

  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(url, serviceKey);

  const today = new Date();
  const soon = new Date(today.getTime() + 24*60*60*1000);
  const soonISO = soon.toISOString();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, scheduled_for, reminder_email_sent, profiles:profile_id(full_name,email)')
    .lte('scheduled_for', soonISO)
    .eq('reminder_email_sent', false);

  const results = [];
  for (const b of (bookings||[])) {
    const to = b.profiles?.email; if(!to) continue;
    const html = `<p>Reminder: You have a meeting scheduled for ${b.scheduled_for}.<br/>Reply to this email if you need to reschedule.</p>`;
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ from: fromEmail, to, subject: 'Meeting Reminder', html })
    });
    if (resp.ok) {
      await supabase.from('bookings').update({ reminder_email_sent: true }).eq('id', b.id);
      results.push({ id: b.id, status: 'sent' });
    } else {
      results.push({ id: b.id, status: 'error', code: resp.status });
    }
  }

  return new Response(JSON.stringify({ results }), { headers: { 'Content-Type':'application/json' } });
};
