# Update Supabase Schema for Google Calendar

Google Calendar integration requires one small database change to track calendar event IDs.

## Quick Setup (2 minutes)

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy this SQL:

```sql
ALTER TABLE bookings ADD COLUMN calendar_event_id TEXT;
```

6. Click the **"Run"** button (⚡ icon)
7. You should see "Success" message

### Option 2: Using PostgreSQL Terminal

If you have `psql` installed:

```bash
psql -h your-project.supabase.co -U postgres -d postgres -c "
ALTER TABLE bookings ADD COLUMN calendar_event_id TEXT;
"
```

## Verify it Worked

After running the SQL:

1. Go to **"Table Editor"** in Supabase
2. Click the **"bookings"** table
3. Scroll right to see the new **"calendar_event_id"** column
4. It should be empty (NULL) for all existing bookings

## What This Column Does

- **Stores**: The Google Calendar event ID when an event is created
- **Used by**: Dashboard to show calendar event status
- **Displayed as**: "✓ Created" or "Create" button in bookings table
- **Allows**: Linking meetings to calendar events

## Already Done?

If you get an error "column already exists", the update is already applied - no action needed!

## Troubleshooting

**"Permission denied" error:**
- Make sure you're logged in as the project owner
- Check your database credentials

**Can't find SQL Editor:**
- Make sure you're in the right Supabase project
- Look for "SQL Editor" in left sidebar (not "Query")

**Column not showing after running:**
- Refresh the page
- Click "Table Editor" again
- Scroll to the right in the bookings table

## Undo (If Needed)

To remove the column:

```sql
ALTER TABLE bookings DROP COLUMN IF EXISTS calendar_event_id;
```

---

**That's it!** Now Google Calendar integration is fully configured.
