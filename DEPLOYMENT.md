# Deployment Checklist

## Pre-Deployment
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] SQL schema executed in Supabase
- [ ] Calendly account created
- [ ] Calendly event type configured
- [ ] Calendly scheduling link copied

## Configuration
- [ ] `web/wpcode-snippet.html` updated with:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] CALENDLY_LINK
  - [ ] SUPPORT_AGENT_NAME
- [ ] `web/chat-widget.js` updated (if using separate files)

## WordPress Deployment
- [ ] WPCode plugin installed on WordPress
- [ ] New JavaScript snippet created
- [ ] Code pasted from `web/wpcode-snippet.html`
- [ ] Location set to Footer
- [ ] Priority set to 1
- [ ] Snippet activated
- [ ] Tested on live website

## Dashboard Deployment
- [ ] Cloudflare Pages account created OR Hostinger access confirmed
- [ ] Repository connected to Cloudflare Pages OR files uploaded to Hostinger
- [ ] Dashboard accessible via URL
- [ ] Dashboard can connect to Supabase
- [ ] Sessions and bookings visible in dashboard

## Optional: Email Reminders
- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] Resend API key obtained
- [ ] Supabase Edge Function created
- [ ] Environment variables set in Edge Function
- [ ] Cron job scheduled in Supabase
- [ ] Test email sent successfully

## Optional: SMS Reminders
- [ ] Twilio account created
- [ ] Twilio phone number obtained
- [ ] Twilio credentials (SID, Auth Token) copied
- [ ] Edge Function updated with SMS code
- [ ] Environment variables set
- [ ] Test SMS sent successfully

## Testing
- [ ] Chat widget appears on website bottom-right
- [ ] Widget opens when clicked
- [ ] Can send messages
- [ ] Messages logged in Supabase
- [ ] Profile created in database
- [ ] Calendly link works
- [ ] Booking recorded in database
- [ ] Dashboard shows sessions
- [ ] Dashboard shows bookings
- [ ] (Optional) Email reminder received
- [ ] (Optional) SMS reminder received

## Performance
- [ ] Widget loads within 2 seconds
- [ ] Handles concurrent users (test with multiple browser tabs)
- [ ] Database queries optimized
- [ ] Rate limiting considered (Supabase free tier: 500MB database, 2GB bandwidth/month)

## Security
- [ ] Row Level Security (RLS) enabled on Supabase tables (optional but recommended)
- [ ] Dashboard access restricted (password protect if on Hostinger)
- [ ] API keys not exposed in client-side code (using anon key only)
- [ ] HTTPS enabled on all endpoints

## Go Live
- [ ] All items above checked
- [ ] Monitoring set up (Supabase logs, Cloudflare analytics)
- [ ] Support team notified
- [ ] Documentation shared with team
- [ ] Phone number, email verified for contact
