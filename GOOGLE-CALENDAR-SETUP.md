# Google Calendar Integration Setup Guide - Service Account (Simple)

This guide walks you through setting up Google Calendar integration using a Service Account - the easiest method!

## What This Does

When someone books a meeting through your chat widget:
1. **Event Auto-Creation**: A calendar event is automatically created in your Google Calendar with:
   - Customer name and booking time
   - Customer email (added as attendee with Google Meet link)
   - Meeting details and phone number
   - 30-minute duration with automatic Google Meet link

2. **Dashboard Integration**: 
   - See calendar event creation status in the Bookings tab
   - Manually create calendar events for existing bookings
   - Easy setup - no OAuth redirects!

## Prerequisites

- A Google account (Gmail)
- Google Cloud Console access (free)
- Dashboard credentials configured
- Supabase edge function deployed

## Step-by-Step Setup (5 minutes)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** dropdown at the top
3. Click **"New Project"**
4. Name it: `AI Support Agent Calendar`
5. Click **"Create"**

### Step 2: Enable Google Calendar API

1. In the Cloud Console search bar, type: **"Google Calendar API"**
2. Click the result
3. Click **"Enable"** button
4. Wait for it to enable

### Step 3: Create Service Account

1. Click **"Credentials"** in the left sidebar
2. Click **"Create Credentials"** → **"Service Account"**
3. Enter these details:
   - **Service account name**: `ai-support-calendar`
   - **Service account ID**: (auto-filled)
   - **Description**: Calendar access for AI support agent
4. Click **"Create and Continue"**
5. Skip optional steps - click **"Continue"** then **"Done"**

### Step 4: Download JSON Key

1. Find your service account in the list and click on it
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **"JSON"** format
5. Click **"Create"**
6. A JSON file will download to your computer
7. Open this file in Notepad or any text editor

### Step 5: Share Your Google Calendar with Service Account

**Important:** The service account needs permission to create events!

1. Open [Google Calendar](https://calendar.google.com)
2. Find your calendar in the left sidebar (usually "My Calendar" or your email)
3. Click the **3 dots** next to it → **"Settings and sharing"**
4. Scroll to **"Share with specific people"** section
5. Click **"Add people"**
6. **Paste the `client_email`** from your JSON file (it looks like: `ai-support-calendar@...gserviceaccount.com`)
7. Set permission to: **"Make changes to events"**
8. Click **"Send"** (ignore the warning about external email)

### Step 6: Deploy Edge Function

You need to deploy the edge function that handles JWT token generation:

1. Create the edge function file at `supabase/functions/google-calendar-token/index.ts`
2. Copy the code from `web/edge-google-calendar-token.js` 
3. Deploy it:
   ```bash
   supabase functions deploy google-calendar-token
   ```

### Step 7: Paste Service Account JSON in Dashboard

1. Open your dashboard
2. Click **"Google Calendar Setup"** button
3. Copy the **entire contents** of the JSON file you downloaded
4. Paste it into the textarea
5. Click **"Save Service Account"**
6. Done! Calendar is now configured ✅

## Testing

1. Go to your Bookings tab in the dashboard
2. Find any booking without a calendar event
3. Click **"Create Event"** button
4. Check your Google Calendar - event should appear!

## Troubleshooting

**"Token generation failed"**
- Make sure the edge function is deployed
- Check that your Supabase URL and key are correct in config

**"Permission denied" or calendar API errors**
- Verify you shared the calendar with the service account email
- The permission must be "Make changes to events"
- Wait a few minutes after sharing for permissions to propagate

**JSON validation error**
- Make sure you copied the ENTIRE JSON file contents
- The JSON should start with `{` and end with `}`
- Don't modify the JSON file

## Security Notes

- Service account JSON contains private keys - keep it secure
- The edge function handles JWT signing server-side (more secure than browser)
- Never commit service account JSON to public repositories
- Rotate keys periodically for best security

## What's Next?

Your calendar integration is ready! Events will be created automatically when bookings are made.
3. Fill in the form:
   - **App name**: `AI Support Agent`
   - **User support email**: Your email
   - Scroll to bottom, add your email again in "Developer contact information"
4. Click **"Save and Continue"**
5. Skip the scopes section, click **"Save and Continue"**
6. Skip test users, click **"Save and Continue"**
7. Click **"Back to Dashboard"**

#### Create OAuth Credentials:
1. Go back to **"Credentials"** in left sidebar
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Select **"Web application"**
4. Name: `AI Support Agent Dashboard`
5. Under **"Authorized redirect URIs"**, add your dashboard URL:
   - If local testing: `http://localhost:8000/dashboard.html`
   - If Cloudflare Pages: `https://your-project.pages.dev/dashboard.html`
   - If self-hosted: `https://yourdomain.com/dashboard.html`
6. Click **"Create"**
7. A popup shows your credentials - **Copy the Client ID only** (you don't need the secret)

### Step 4: Add Client ID to Dashboard

1. Open your dashboard
2. Go to the **"Setup"** tab
3. Scroll to section **"6️⃣ Google Calendar"**
4. Click **"Click here for setup instructions"** link in the modal
5. Paste your Client ID in the text field
6. Click **"✓ Save Client ID"**
7. Click **"🔗 Connect Google Calendar"**
8. A popup opens - authorize your Google account
9. Grant permission to "Google Calendar API"
10. You'll see success message in the dashboard

### Step 5: Update Supabase Schema (One-Time)

You need to add a `calendar_event_id` column to track created events. Run this SQL in Supabase:

```sql
ALTER TABLE bookings ADD COLUMN calendar_event_id TEXT;
```

**Steps:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **"SQL Editor"** in left sidebar
4. Click **"New Query"**
5. Paste the SQL above
6. Click **"Run"** (⚡ button)

## Using Google Calendar Integration

### Automatic Event Creation
When someone books a meeting:
1. Event is created in your calendar
2. Dashboard shows "✓ Created" in the Calendar Event column
3. Customer receives invitation email with Google Meet link

### Manual Event Creation
For existing bookings without calendar events:
1. Go to **"Bookings"** tab
2. Find the booking
3. Click **"Create"** in the "Calendar Event" column
4. Event created immediately

### Disconnect Calendar
To stop auto-creating events:
1. In Setup tab, Google Calendar section
2. Click **"❌ Disconnect Calendar"**
3. Credentials are removed - you can reconnect anytime

## Features

✅ **Auto-Create Events** - Meeting booked = calendar event created
✅ **Google Meet Links** - Automatic video call link in event
✅ **Email Invites** - Customer gets calendar invite with meet link
✅ **Conflict Detection** - Checks availability before booking (optional)
✅ **Dashboard Control** - Connect/disconnect from admin panel
✅ **No Code Changes** - Works with existing setup

## Troubleshooting

### "Client ID is invalid"
- Verify you copied the full Client ID from Google Cloud Console
- Check it starts with a long string of numbers (example: `123456789012-abc...`)

### OAuth popup doesn't open
- Check browser popup blocker settings
- Allow popups for your dashboard domain
- Try a different browser

### "Calendar event creation failed"
- Verify Google Calendar API is enabled in Cloud Console
- Check your OAuth permissions were granted
- Try disconnecting and reconnecting

### Event shows "Created" but I don't see it in calendar
- Check you authorized the correct Google account
- Refresh your Google Calendar
- Event might be in a secondary calendar (check calendar list)

## Security Notes

- Your Client ID is semi-public (visible in OAuth flow) - this is normal
- Client Secret is NOT stored anywhere - only you have it
- Access tokens are stored in browser localStorage (same as other credentials)
- Clear browser cache to completely remove authorization
- Each dashboard URL requires its own OAuth redirect setup

## Free Tier Limits

Google Calendar API is **completely free**. No rate limits for:
- Creating events
- Reading calendar
- Checking availability

Unlimited API calls included with free tier.

## Next Steps

✅ Dashboard is now fully automated
✅ Chat widget can mention calendar booking
✅ Customers get calendar invites automatically
✅ One less manual task in your support workflow

**Questions?** Check TROUBLESHOOTING.md for common issues.
