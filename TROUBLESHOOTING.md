# Troubleshooting Guide

## Widget Not Appearing

### Issue: Chat button doesn't show on website
**Solutions:**
1. Check browser console for JavaScript errors (F12 → Console)
2. Verify WPCode snippet is Active (WP Admin → WPCode)
3. Check snippet location is set to Footer or Header
4. Clear browser cache and refresh
5. Check if another plugin is blocking scripts
6. Verify z-index isn't being overridden by theme CSS

### Issue: Widget appears but doesn't open
**Solutions:**
1. Check console for Supabase loading errors
2. Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
3. Check if Content Security Policy (CSP) is blocking CDN scripts
4. Try loading Supabase library manually in browser console

## Database Issues

### Issue: Messages not logging to Supabase
**Solutions:**
1. Verify SQL schema was executed correctly
2. Check Supabase table permissions (RLS might be blocking inserts)
3. Add RLS policy to allow anonymous inserts:
```sql
-- In Supabase SQL Editor
alter table messages enable row level security;
create policy "Allow anonymous inserts" on messages
  for insert with check (true);

alter table sessions enable row level security;
create policy "Allow anonymous inserts" on sessions
  for insert with check (true);

alter table profiles enable row level security;
create policy "Allow anonymous inserts" on profiles
  for insert with check (true);

alter table bookings enable row level security;
create policy "Allow anonymous inserts" on bookings
  for insert with check (true);
```
4. Check Supabase logs: Dashboard → Logs → API
5. Verify network requests in browser DevTools (Network tab)

### Issue: Dashboard can't connect to Supabase
**Solutions:**
1. Check CORS settings in Supabase (should allow your domain)
2. Verify URL and anon key are correct
3. Check browser console for authentication errors
4. Ensure Supabase project is not paused (free tier auto-pauses after inactivity)

## Performance Issues

### Issue: Widget loads slowly
**Solutions:**
1. Optimize by hosting Supabase JS library locally instead of CDN
2. Implement lazy loading (load widget script only when needed)
3. Minify JavaScript and CSS
4. Use browser caching headers
5. Consider upgrading Supabase plan if hitting rate limits

### Issue: Can't handle 20-25 concurrent users
**Solutions:**
1. Check Supabase connection pooling settings
2. Monitor Supabase resource usage (Database → Database → Pooler)
3. Implement message queuing for high traffic
4. Consider upgrading to Supabase Pro plan ($25/mo for better limits)
5. Add client-side throttling/debouncing for rapid messages

## Integration Issues

### Issue: Calendly link not working
**Solutions:**
1. Verify Calendly link is public (not private)
2. Check if Calendly account is active
3. Test link in incognito/private window
4. Ensure link format is correct (https://calendly.com/username/eventtype)

### Issue: Email reminders not sending
**Solutions:**
1. Verify Resend API key is valid
2. Check email domain is verified in Resend
3. Review Supabase Edge Function logs
4. Verify REMINDER_FROM_EMAIL is authorized in Resend
5. Check spam folder
6. Verify cron job is running (Supabase → Database → Cron Jobs)
7. Test Edge Function manually via Supabase dashboard

### Issue: SMS reminders not sending (Twilio)
**Solutions:**
1. Check Twilio account balance (trial accounts have limits)
2. Verify phone number format (+1234567890)
3. Check if recipient number is verified (trial restriction)
4. Review Twilio logs: https://console.twilio.com/monitor/logs
5. Verify Twilio credentials (SID, Auth Token)
6. Check if phone number has SMS capability

## WordPress/WPCode Issues

### Issue: WPCode snippet not saving
**Solutions:**
1. Check WordPress memory limit (increase in wp-config.php)
2. Disable other optimization plugins temporarily
3. Verify user has admin permissions
4. Try shorter code first, then expand
5. Check for PHP errors in WordPress debug log

### Issue: Chat widget conflicts with theme
**Solutions:**
1. Adjust z-index in CSS (increase from 9999)
2. Change button position (bottom-left instead of bottom-right)
3. Modify colors to match theme
4. Add !important to critical CSS rules
5. Load widget last (increase snippet priority number)

## Hosting Issues

### Issue: Cloudflare Pages build fails
**Solutions:**
1. Check build settings (should be static, no build command)
2. Verify `web` folder structure
3. Check file paths are correct (case-sensitive on Linux)
4. Review build logs in Cloudflare dashboard
5. Try manual upload instead of Git integration

### Issue: Hostinger upload fails
**Solutions:**
1. Check file size limits
2. Verify file permissions
3. Use File Manager instead of FTP
4. Check disk quota
5. Try uploading one file at a time

## Getting Help

1. Check Supabase documentation: https://supabase.com/docs
2. Calendly help center: https://help.calendly.com
3. Resend docs: https://resend.com/docs
4. Post in Supabase Discord: https://discord.supabase.com
5. Review browser console and network logs
6. Check this repo's Issues page
7. Contact support with:
   - Browser and version
   - Error messages (console + network)
   - Steps to reproduce
   - Screenshots
   - Supabase project ID (not keys!)
