# Auto-Create Calendar Events Setup

## What This Does
Automatically creates Google Calendar events when bookings are made through the chat widget!

## Quick Setup (5 minutes)

### Step 1: Deploy Edge Function via Supabase Dashboard

1. Go to [your Supabase project](https://supabase.com/dashboard/project/wbwbaycycjlnrifecuje)
2. Click **Edge Functions** in the left sidebar
3. Click **"Create a new function"**
4. Name it: `auto-create-calendar-event`
5. Copy the contents of `supabase/functions/auto-create-calendar-event/index.ts`
6. Paste it into the function editor
7. Click **"Deploy"**

### Step 2: Create Database Webhook

1. In Supabase Dashboard, go to **Database** → **Webhooks**
2. Click **"Create a new webhook"**
3. Configure:
   - **Name**: Auto Create Calendar Event
   - **Table**: `bookings`
   - **Events**: Check ✅ **INSERT**
   - **Type**: HTTP Request
   - **Method**: POST
   - **URL**: `https://wbwbaycycjlnrifecuje.supabase.co/functions/v1/auto-create-calendar-event`
   - **HTTP Headers**:
     - Key: `Authorization`
     - Value: `Bearer YOUR_SERVICE_ROLE_KEY` (get from Project Settings → API)
4. Click **"Create webhook"**

### Step 3: Share Google Calendar

Make sure your Google Calendar is shared with:
```
experimentemail@gen-lang-client-0152018377.iam.gserviceaccount.com
```

1. Open [Google Calendar](https://calendar.google.com)
2. Click 3 dots next to your calendar → **Settings and sharing**
3. Scroll to **Share with specific people**
4. Click **Add people**
5. Paste the email above
6. Set permission to **"Make changes to events"**
7. Click **Send**

## How It Works

1. User chats with bot → Provides booking details
2. Chat widget creates booking in Supabase
3. Database webhook triggers edge function
4. Edge function creates Google Calendar event (with Google Meet)
5. Customer gets email invite automatically!

## Testing

1. Chat with your bot on your website
2. Provide name, email, phone, and preferred time
3. Check your Google Calendar - event should appear!
4. Check your dashboard - booking should show calendar event ID

## Troubleshooting

**No calendar event created?**
- Check Supabase Edge Functions logs
- Verify webhook is active
- Confirm calendar is shared with service account email

**Permission denied?**
- Make sure calendar sharing permission is "Make changes to events"
- Wait a few minutes after sharing for permissions to propagate

**Edge function error?**
- Check the Logs tab in Edge Functions
- Verify the service account JSON is correct

## Alternative: Manual Edge Function Deployment

If you can't deploy via dashboard, install Supabase CLI:

```bash
# Install (if you have npm/scoop/brew)
npm install -g supabase

# Login
supabase login

# Deploy
supabase functions deploy auto-create-calendar-event --project-ref wbwbaycycjlnrifecuje
```

