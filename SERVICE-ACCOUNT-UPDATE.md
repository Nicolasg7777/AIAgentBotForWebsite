# Google Calendar - Service Account Update

## What Changed?

Switched from **OAuth 2.0 flow** to **Service Account** for simpler Google Calendar integration.

## Why Service Account is Better

### Before (OAuth):
❌ Complex redirect URI setup  
❌ User must click through Google auth every time  
❌ Tokens expire frequently  
❌ Client ID + Client Secret + redirect URIs configuration  
❌ "Authorization Error" issues with domain validation  

### After (Service Account):
✅ One-time JSON key setup  
✅ No user authentication needed  
✅ Long-lived access  
✅ Just paste JSON and share calendar  
✅ No redirect URI errors  

## Setup Steps (5 minutes)

1. **Create Service Account** in Google Cloud Console
2. **Download JSON key** file
3. **Share your Google Calendar** with the service account email
4. **Deploy edge function** (`supabase/functions/google-calendar-token`)
5. **Paste JSON** in dashboard
6. Done! ✅

Full guide: See [GOOGLE-CALENDAR-SETUP.md](GOOGLE-CALENDAR-SETUP.md)

## What You Need to Do

1. **Deploy the edge function**:
   ```bash
   cd supabase/functions
   # Copy web/edge-google-calendar-token.js to supabase/functions/google-calendar-token/index.ts
   supabase functions deploy google-calendar-token
   ```

2. **Follow setup guide** in dashboard or [GOOGLE-CALENDAR-SETUP.md](GOOGLE-CALENDAR-SETUP.md)

3. **Share your Google Calendar** with the service account email (critical step!)

## Files Changed

- `web/dashboard.js` - Service account authentication
- `web/dashboard.html` - Updated setup modal with new instructions
- `web/edge-google-calendar-token.js` - JWT token generator edge function
- `GOOGLE-CALENDAR-SETUP.md` - Updated with service account steps

## Security

- Service account private key is handled server-side in edge function
- More secure than exposing OAuth client secrets in browser
- No user credentials stored

## Testing

1. Open dashboard
2. Click "Google Calendar Setup"
3. Paste your service account JSON
4. Create a test calendar event from bookings table
5. Check Google Calendar!
