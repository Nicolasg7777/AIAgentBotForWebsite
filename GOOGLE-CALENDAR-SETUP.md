# Google Calendar Integration Setup Guide

This guide walks you through setting up Google Calendar integration for automatic meeting event creation.

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
   - Easy connect/disconnect button

## Prerequisites

- A Google account (Gmail)
- Google Cloud Console access (free)
- Dashboard credentials configured

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** dropdown at the top
3. Click **"New Project"**
4. Name it: `AI Support Agent Calendar`
5. Click **"Create"** and wait 1-2 minutes for setup

### Step 2: Enable Google Calendar API

1. In the Cloud Console, search for **"Google Calendar API"** in the search bar
2. Click the result
3. Click **"Enable"** button
4. Wait for the API to be enabled (show spinning icon)

### Step 3: Create OAuth 2.0 Credentials

1. Click **"Credentials"** in the left sidebar
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. You may see a popup about "Consent Screen" - click **"Configure Consent Screen"**

#### Configure Consent Screen:
1. Select **"External"** user type
2. Click **"Create"**
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
