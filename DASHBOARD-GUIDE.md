# 🎯 One-Click Dashboard Setup Guide

## ✨ Your New Dashboard Can Do EVERYTHING!

No more editing files manually! The enhanced dashboard now handles ALL configuration automatically.

---

## 🚀 How It Works

### 1. Open the Dashboard
- Deploy [web/dashboard.html](web/dashboard.html) to Cloudflare Pages (or host on Hostinger)
- OR open it locally: Right-click → Open with Browser

### 2. Go to "Setup" Tab
You'll see 5 sections where you enter credentials:

---

## 📋 Fill In Your Credentials (One Time)

### 1️⃣ **Supabase** (Required)
- **Supabase URL:** From Supabase Dashboard → Settings → API
- **Anon Key:** From same page
- Click **"Test Connection"** ✅
- If successful, you're connected!

### 2️⃣ **Google Gemini AI** (Free - Highly Recommended)
- Get free key: https://aistudio.google.com/app/apikey
- Paste API key
- Click **"Test AI"** ✅
- Should respond with "AI test successful"

### 3️⃣ **Calendly** (Required for Scheduling)
- Go to https://calendly.com → Event Types
- Copy your scheduling link (e.g., `https://calendly.com/yourname/15min`)
- Enter your bot name (e.g., "Support Bot")

### 4️⃣ **Resend** (Optional - Email Reminders)
- Get free API key: https://resend.com/api-keys
- Enter API key
- Enter "From" email (must be verified in Resend)
- Click **"Send Test Email"** ✅
- Check your inbox!

### 5️⃣ **Twilio** (Optional - SMS Reminders)
- Get credentials: https://console.twilio.com
- Enter Account SID, Auth Token, Phone Number
- Click **"Send Test SMS"** ✅
- Check your phone!

---

## 💾 Click "Save Configuration"

All your credentials are saved to browser localStorage (safe, local only).

---

## 🚀 Click "Generate WordPress Code"

The dashboard automatically:
1. Creates a fully-configured WordPress snippet
2. Inserts YOUR credentials
3. Enables AI if you have Gemini key
4. Switches you to "Get Code" tab

---

## 📋 Copy & Paste to WordPress

### From the "Get Code" Tab:

1. Click **"📋 Copy"** button
2. Go to WordPress Admin → WPCode → Add Snippet
3. Choose "JavaScript Snippet"
4. Paste the code (Ctrl+V)
5. Location: **Footer**, Priority: **1**
6. Toggle **Active**
7. Click **"Save Snippet"**

**That's it! Your AI chat widget is live!** 🎉

---

## 📊 View Analytics

### Switch to "Analytics" Tab:
- See all sessions
- View active conversations
- Track user profiles

### Switch to "Bookings" Tab:
- See scheduled meetings
- Send email reminders manually (click "Send Email")
- Delete bookings if needed

---

## ✅ What You Get

### Automated Setup:
✅ No more editing `wpcode-snippet.html` manually  
✅ No more searching for placeholder text  
✅ No PowerShell scripts needed  
✅ All credentials stored securely in browser  

### Test Before Deploy:
✅ Test Supabase connection  
✅ Test AI responses  
✅ Send test emails  
✅ Send test SMS  
✅ Verify everything works BEFORE going live  

### One-Click Generation:
✅ Generates WordPress code with YOUR credentials  
✅ Copy to clipboard with one click  
✅ Paste into WPCode and activate  

### Real-Time Management:
✅ View all sessions and bookings  
✅ Send reminders manually  
✅ Monitor traffic  
✅ Delete old bookings  

---

## 🔧 Example Workflow

### Initial Setup (5 minutes):
1. Open dashboard
2. Fill in Supabase credentials → Test ✅
3. Fill in Gemini key → Test ✅
4. Fill in Calendly link
5. (Optional) Fill in Resend → Test email ✅
6. (Optional) Fill in Twilio → Test SMS ✅
7. Click "Save Configuration"
8. Click "Generate WordPress Code"
9. Copy code
10. Paste into WordPress WPCode
11. Activate
12. **Done! Chat widget is live!**

### Daily Use:
1. Open dashboard
2. Check "Analytics" for new sessions
3. Check "Bookings" for scheduled meetings
4. Send reminders as needed
5. Monitor traffic patterns

---

## 💡 Pro Tips

### Tip 1: Bookmark the Dashboard
Once deployed, bookmark the URL for quick access.

### Tip 2: Test Everything
Use the test buttons to verify connections before deploying.

### Tip 3: Re-generate Anytime
If you change credentials:
1. Update in Setup tab
2. Click "Save Configuration"
3. Click "Generate WordPress Code" again
4. Replace old code in WPCode

### Tip 4: Multiple Sites
Use the same dashboard for multiple WordPress sites:
- Generate code
- Copy to Site 1's WPCode
- Copy to Site 2's WPCode (if desired)
- Same backend, multiple frontends!

### Tip 5: Manual Reminders
In Bookings tab, click "Send Email" for any meeting to send a reminder manually.

---

## 🛠️ Troubleshooting

### "Test Connection" Fails
- Verify Supabase URL is correct (https://yourproject.supabase.co)
- Check anon key is complete (starts with `eyJ...`)
- Make sure SQL schema was run (see QUICKSTART.md)
- Check Supabase project isn't paused (free tier)

### "Test AI" Fails
- Verify Gemini API key (starts with `AIzaSy...`)
- Check you have quota remaining (free tier: 1,500/day)
- Test key at https://aistudio.google.com

### "Send Test Email" Fails
- Verify email is verified in Resend dashboard
- Check API key is active
- Ensure "From" email matches verified domain

### "Send Test SMS" Fails
- Check Twilio account has balance/credits
- Verify phone number format (+1234567890)
- On trial: recipient must be verified in Twilio

### Code Won't Copy
- Manually select text in code block
- Right-click → Copy
- Or use Ctrl+A then Ctrl+C

---

## 📱 Mobile Access

The dashboard works on mobile browsers:
- Save credentials on your phone
- Check bookings on the go
- Send reminders from anywhere

---

## 🔒 Security

### Credentials Storage:
- Stored in browser localStorage (client-side only)
- Never sent to any server except Supabase/Gemini/etc.
- Clear browser data to remove credentials

### API Keys:
- Supabase anon key: Safe for client-side use
- Gemini API key: Can restrict to your domain
- Resend/Twilio: Only used in dashboard (not in chat widget)

### Best Practices:
- Don't share dashboard URL publicly
- Host on HTTPS (Cloudflare Pages does this automatically)
- Clear localStorage if using shared computer

---

## 🎊 You Now Have

✅ **One-click setup** - No file editing  
✅ **Test buttons** - Verify before deploy  
✅ **Auto-generation** - WordPress code ready to paste  
✅ **Real-time analytics** - See sessions and bookings  
✅ **Manual controls** - Send reminders anytime  
✅ **Mobile-friendly** - Check stats on the go  

**Total setup time: 5 minutes**  
**Total cost: $0/month**  

---

## 🚀 Quick Start Commands

### Deploy Dashboard to Cloudflare Pages:

```powershell
# Push to GitHub (if you haven't already)
git remote add origin https://github.com/YOUR-USERNAME/AIAgentBotForWebsite.git
git push -u origin main

# Then:
# 1. Go to https://pages.cloudflare.com
# 2. Connect GitHub repo
# 3. Deploy
# 4. Access dashboard at yourproject.pages.dev
```

### Or Use Locally:

```powershell
# Just open in browser
cd c:\Users\garci\RepositoryFolder\AIAgentBotForWebsite\web
start dashboard.html
```

---

## 📚 Related Docs

- [QUICKSTART.md](../QUICKSTART.md) - First-time setup walkthrough
- [AI-GUIDE.md](../AI-GUIDE.md) - AI configuration details
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Common issues

---

**🎉 Your AI support agent is now fully automated!**
