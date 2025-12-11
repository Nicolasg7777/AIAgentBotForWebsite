# Configuration Template

## Step 1: Copy this file
Save this as `config.txt` and fill in your actual values.

## Step 2: Fill in your credentials

### Supabase (Get from https://supabase.com/dashboard/project/_/settings/api)
```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### Calendly (Get from https://calendly.com/event_types)
```
CALENDLY_LINK=https://calendly.com/yourname/15min
```

### Bot Configuration
```
SUPPORT_AGENT_NAME=Support Bot
```

### Optional: Email Reminders (Get from https://resend.com/api-keys)
```
RESEND_API_KEY=re_xxxxxxxxxxxx
REMINDER_FROM_EMAIL=support@yourdomain.com
```

### Optional: SMS Reminders (Get from https://console.twilio.com)
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 3: Update files with your values

### For WordPress (WPCode):
1. Open `web/wpcode-snippet.html`
2. Find and replace:
   - `YOUR_SUPABASE_URL` → your SUPABASE_URL
   - `YOUR_SUPABASE_ANON_KEY` → your SUPABASE_ANON_KEY
   - `https://calendly.com/yourname/15min` → your CALENDLY_LINK
   - `Support Bot` → your SUPPORT_AGENT_NAME (optional)

### For Supabase Edge Function (Optional - Email Reminders):
1. Open `web/edge-send-reminders.js`
2. No changes needed to the file
3. Set environment variables in Supabase Dashboard → Edge Functions → send-reminders → Settings:
   - Add `RESEND_API_KEY`
   - Add `REMINDER_FROM_EMAIL`
   - (Optional for SMS) Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

### For Dashboard:
No file changes needed! Enter credentials directly in the dashboard interface after deployment.

## Step 4: Quick Find & Replace (PowerShell)

Run this in PowerShell after filling in your values:

```powershell
# Navigate to your repo
cd "c:\Users\garci\RepositoryFolder\AIAgentBotForWebsite"

# Set your values here
$SUPABASE_URL = "https://your-project.supabase.co"
$SUPABASE_ANON_KEY = "your-anon-key-here"
$CALENDLY_LINK = "https://calendly.com/yourname/15min"
$SUPPORT_AGENT_NAME = "Support Bot"

# Update wpcode-snippet.html
(Get-Content "web/wpcode-snippet.html") `
  -replace 'YOUR_SUPABASE_URL', $SUPABASE_URL `
  -replace 'YOUR_SUPABASE_ANON_KEY', $SUPABASE_ANON_KEY `
  -replace 'https://calendly.com/yourname/15min', $CALENDLY_LINK `
  -replace 'Support Bot', $SUPPORT_AGENT_NAME |
  Set-Content "web/wpcode-snippet.html"

# Update chat-widget.js
(Get-Content "web/chat-widget.js") `
  -replace 'YOUR_SUPABASE_URL', $SUPABASE_URL `
  -replace 'YOUR_SUPABASE_ANON_KEY', $SUPABASE_ANON_KEY `
  -replace 'https://calendly.com/yourname/15min', $CALENDLY_LINK `
  -replace 'Support Bot', $SUPPORT_AGENT_NAME |
  Set-Content "web/chat-widget.js"

Write-Host "Configuration updated! Check web/wpcode-snippet.html and web/chat-widget.js"
```

## Step 5: Verify
Open the updated files and verify all placeholders are replaced with real values.

## Security Notes
- NEVER commit your actual API keys to GitHub
- Add `config.txt` to `.gitignore` if you save credentials locally
- Use environment variables for sensitive data in production
- The SUPABASE_ANON_KEY is safe for client-side use (it's meant to be public)
- Keep SUPABASE_SERVICE_ROLE_KEY private (only use in Edge Functions)
