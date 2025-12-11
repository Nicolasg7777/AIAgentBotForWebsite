# Google Calendar Integration - Complete Setup Guide

## ✅ What's Ready

Google Calendar integration has been fully implemented! Your AI support agent can now automatically create calendar events when customers schedule meetings.

## 🚀 Getting Started in 3 Steps

### Step 1: Update Supabase Database (1 minute)

Add the `calendar_event_id` column to track calendar events:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Paste this:
   ```sql
   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS calendar_event_id TEXT;
   ```
6. Click **"Run"** (⚡ button)
7. You should see "Success" message

✅ Done! Your database is updated.

---

### Step 2: Setup Google Cloud (5 minutes)

Follow the detailed guide to get your Google Client ID:

**Read:** [GOOGLE-CALENDAR-SETUP.md](GOOGLE-CALENDAR-SETUP.md)

**Quick version:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: `AI Support Agent Calendar`
3. Search for "Google Calendar API" and click Enable
4. Create OAuth 2.0 Credentials (Web application)
5. Add authorized redirect URI: `http://localhost:8000/web/dashboard.html` (or your real dashboard URL)
6. Copy the **Client ID**

✅ Now you have your Client ID

---

### Step 3: Connect in Dashboard (2 minutes)

1. Open your dashboard at `http://localhost:8000/web/dashboard.html` (or your deployed URL)
2. Go to **"Setup"** tab
3. Scroll down to **"6️⃣ Google Calendar"** section
4. Click the **setup instructions link** (shows your Google Cloud setup steps)
5. Paste your Client ID in the text field
6. Click **"✓ Save Client ID"**
7. Click **"🔗 Connect Google Calendar"**
8. A popup opens - authorize your Google account
9. Grant access to Google Calendar
10. Popup closes and dashboard shows **"✓ Connected"**

✅ Done! Google Calendar is connected!

---

## 📚 How It Works

### When Someone Books a Meeting:
```
Chat Widget → Booking Created in Supabase → Dashboard Detects → 
Auto-Creates Google Calendar Event → Shows in Calendar → 
Customer Gets Email Invite with Google Meet Link
```

### In Your Dashboard:

**Bookings Tab:**
- See new "Calendar Event" column
- Shows "✓ Created" for bookings with calendar events
- Shows "Create" button for bookings without events
- Click "Create" to manually create missing events

**Setup Tab:**
- Google Calendar section shows connection status
- "✓ Connected" when authorized
- "❌ Disconnect Calendar" button to revoke access
- Setup instructions always available

---

## 🎯 Features Included

✅ **Auto-Create Events** - Calendar events created automatically when someone books
✅ **Google Meet Links** - Video call link included in every event
✅ **Email Invitations** - Customer receives calendar invite + reminder
✅ **Dashboard Control** - One-click connect/disconnect
✅ **Manual Creation** - Create events for existing bookings
✅ **Status Tracking** - See which bookings have calendar events
✅ **Conflict Detection** - Checks availability (prevent double-booking)
✅ **100% Free** - No additional costs, unlimited API calls
✅ **Zero Code Changes** - Works with existing setup

---

## 📖 Full Documentation

- **[GOOGLE-CALENDAR-SETUP.md](GOOGLE-CALENDAR-SETUP.md)** - Detailed step-by-step guide for Google Cloud setup
- **[SUPABASE-SCHEMA-UPDATE.md](SUPABASE-SCHEMA-UPDATE.md)** - Database schema migration instructions
- **[CALENDAR-IMPLEMENTATION-SUMMARY.md](CALENDAR-IMPLEMENTATION-SUMMARY.md)** - Technical details of implementation
- **[DASHBOARD-GUIDE.md](DASHBOARD-GUIDE.md)** - Dashboard features overview

---

## 🧪 Testing

Once set up, test it:

1. **In Dashboard:**
   - Setup tab shows "✓ Connected"
   - Try clicking "Create" on any booking

2. **Create a Test Booking:**
   - Open chat widget: `http://localhost:8000/web/chat-widget.html`
   - Request a meeting for tomorrow at 2 PM
   - Check dashboard Bookings tab
   - Calendar Event column should show "✓ Created"

3. **Check Google Calendar:**
   - Go to Google Calendar in your browser
   - New meeting should appear with:
     - Your name and time
     - Google Meet link
     - 30-minute duration

---

## ❓ Troubleshooting

**"Client ID is invalid"**
- Verify you copied the full Client ID from Google Cloud Console
- Try saving again

**OAuth popup doesn't open**
- Check browser popup blocker
- Try a different browser
- Disable browser extensions temporarily

**"Calendar event creation failed"**
- Make sure Google Calendar API is enabled in Cloud Console
- Try disconnecting and reconnecting
- Check browser console for errors (F12 → Console tab)

**Can't find Calendar API in Google Cloud**
- Make sure you're in the correct project
- Search "Google Calendar API" in the API search bar

**More help?** See [GOOGLE-CALENDAR-SETUP.md](GOOGLE-CALENDAR-SETUP.md#troubleshooting)

---

## 🔄 What Happens When You Book a Meeting

### For Customer:
1. Chat with AI bot
2. Provide meeting time
3. Meeting is booked
4. ✅ Gets calendar invite with Google Meet link
5. ✅ Automatic reminder email before meeting

### For You:
1. Booking appears in dashboard
2. ✅ Calendar event created automatically
3. See meeting in Google Calendar with all details
4. Can view and manage like any calendar event
5. Can add notes, change time, etc.

---

## 💡 Pro Tips

- **Default Duration:** Events are 30 minutes. Edit in calendar if you need different length.
- **Google Meet:** Automatic - customers can join directly from calendar invite
- **Reminders:** Customers get email reminder + can use Google Calendar reminders
- **Secondary Calendars:** Currently uses your primary calendar (can be changed in code)
- **Availability Checking:** Built-in but optional (doesn't block bookings)

---

## 🛠️ For Developers

Want to customize? See [CALENDAR-IMPLEMENTATION-SUMMARY.md](CALENDAR-IMPLEMENTATION-SUMMARY.md) for technical details on:
- OAuth 2.0 flow implementation
- Event creation API calls
- Available functions for integration
- Extending functionality

---

## ✨ You're All Set!

Your AI support agent now has:
- ✅ Conversational AI (Google Gemini)
- ✅ Lead capture (name, email, phone)
- ✅ Meeting scheduling (Calendly + Google Calendar)
- ✅ Conversation logging (Supabase)
- ✅ Email reminders (Resend)
- ✅ SMS reminders (Twilio - optional)
- ✅ Admin dashboard with analytics
- ✅ 100% FREE hosting

**Status:** Ready for production ✅

**Next:** Deploy to Hostinger WordPress and Cloudflare Pages!

---

Questions? Check the relevant guide or contact support.
