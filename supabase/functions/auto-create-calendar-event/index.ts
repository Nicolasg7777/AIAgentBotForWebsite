// Auto-Create Google Calendar Event when booking is created
// This edge function is triggered via database webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "gen-lang-client-0152018377",
  "private_key_id": "2ac9075a546bbb4ae261ddce05794c18430ef617",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDYITU8sXgclg1L\nPLdb9zifUMvw777V09m62v1uRqk0Iza8Lc3LCj3LTTTPtgOSEAIOuJpVH2Jyb35E\nQDuxTfM570ikcLLJbGN1/iscFrAu56vCo3g0oT/vwG8/O0aCF4BeNXz9SPqYA0aH\nkdSPpqJws6OSrF2HAVM5uKkKESui8/FvcsJhNwq9TqnZR80nLAvTM12rP5uiX1yb\nSM9mwnmnWRZypvvss+Hw/HiMZ8EktfrrZrfGONMqQJGZTGr9pbRkWFcgMyidY3Kh\nsEa+Fq98L181BaoR7YDdBxsGZKZcbw6A6MF01oO8p26KKfzFPil23BmN4rEjj/Rk\nxu64MJYvAgMBAAECggEARDgHI8cokG1UeOELRz37Y14PYVdrNvcNjIs+3yXyloBe\n8HrMsD/lTVxrRPzAl8Pxwk/GdwPXASPsCQL1VHu0QB8lILJp3GYX5tB5Lv6CUevS\nLTeH46TaF4T4GE9PbBSa8iGT+Cam4oB2LKh9HXKNZ2FsSgmZ49kpOdjtkj3lNiOR\nHBZODgd5Ve5cBNxo6yBni3eH2pmhhwdG2VU43+u0BPulvb5Aqs4IDXcvzx8RF+YY\niSzR4M2g1X7Jes/mHoLTGcAke48ECGVlBrDm9cSXKNctu40XHWoZs2ORG52fzllG\nI3aAnpuCAeMkQ4m+G22UkXphsLVg/uRtoVolGs4AsQKBgQDtRlPsA8+2QpdexRDy\nn4/56/uP18LKC2UXThiSkFUVVtUBQBDmtrbjZFBu1LiZjQZjmupA+SnqDc4cjCk1\n2eh6LTU9MphtljnyEpre6RgkjlUXBOZUty1FKofSA1iDNnH9nSKHFVXvDvbsJ/J9\nGU6UKIeQxkqeLKkBON/hiaG/FQKBgQDpL6/NbPP/fdz3CLl3tF4vHGtea4oiGMMa\nJyUr3nbY9Sn65RDqzJ1L1BaTTgLcKgYqMjLqavOEA5O152y05j7z0PlklLrJyXCr\nJ4ayBv85Z/6vBP7zaIwE+qF8KFzoN2y2PgiPTg0cDKUfOPtCUvWyYBb2yNfWH4BA\nWRNy/vKxMwKBgQDn28ZcJilOF+pk4Ds8a3G8rb3IBPXCi7oAOP9IESQjUxOYQiuB\n1+AFelwiwVmWKrmokZQBY7lyjoTvXoNSrRpAcXbJ02wiAh+jjkyqMKq35iH9+Xq+\nI7VoFjRco4pVxdlEE83OpKmxjjT59ds+JYGkw6odbbcys79+gz463UwiNQKBgQDV\nmG/BjL6H1kOUKPKyeo4XO0ICUCFMkEAOcbLz1ygoHZHhlveDDAA9WD2BmuC1yOyy\ntB69aVA8KYahBiYmIg2iClaXUkEy2wkQTflsk0ovzFmW+c2LKsWvPeCzuMk5kKNM\n38+5bLZHbjHGQsyseQ9D4A7I6ToDkgFJcA6HtI6bzwKBgQCvSQwrw0/M5p+cj8wC\nr/bHpB/DCmaYpx7qDLA2uL0rYiRm17cvkMh7cb351n3Dhx0pOeOH6YaXGtapitr7\nenK86sA3tjCkSYVpX/z+osYyKdfxbjwHnlzvbrSCOtaqWK3VZh1JnL8s1DiSpm0B\n4C2p4mENnI5GujDFBUUtQb4Wgw==\n-----END PRIVATE KEY-----\n",
  "client_email": "experimentemail@gen-lang-client-0152018377.iam.gserviceaccount.com"
};

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: SERVICE_ACCOUNT.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payload = btoa(JSON.stringify(claim))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const signatureInput = header + '.' + payload;
  
  // Import private key
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = SERVICE_ACCOUNT.private_key
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\\n/g, '')
    .replace(/\s/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signatureInput)
  );
  
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = signatureInput + '.' + signatureBase64;
  
  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }).toString()
  });
  
  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

serve(async (req) => {
  try {
    const { record } = await req.json();
    
    // Get booking details
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, profiles(*)')
      .eq('id', record.id)
      .single();
    
    if (!booking || !booking.scheduled_for) {
      return new Response(JSON.stringify({ error: 'No scheduled time' }), { status: 400 });
    }
    
    // Get Google Calendar access token
    const accessToken = await getAccessToken();
    
    // Create calendar event
    const eventTime = new Date(booking.scheduled_for);
    const endTime = new Date(eventTime.getTime() + 30 * 60000);
    
    const event = {
      summary: `Meeting with ${booking.profiles?.full_name || 'Customer'}`,
      description: `Chat Support Booking\n\nName: ${booking.profiles?.full_name}\nEmail: ${booking.profiles?.email}\nPhone: ${booking.profiles?.phone}\n\nReason: ${booking.message || 'N/A'}`,
      start: { dateTime: eventTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees: [{ email: booking.profiles?.email }],
      conferenceData: {
        createRequest: {
          requestId: `booking-${booking.id}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };
    
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Calendar API error:', error);
      return new Response(JSON.stringify({ error }), { status: 400 });
    }
    
    const calendarEvent = await response.json();
    
    // Update booking with calendar event ID
    await supabase
      .from('bookings')
      .update({ calendar_event_id: calendarEvent.id })
      .eq('id', booking.id);
    
    return new Response(
      JSON.stringify({ success: true, event_id: calendarEvent.id }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
