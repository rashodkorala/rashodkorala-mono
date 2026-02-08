# Service Role Key Setup Guide

## Step 1: Get Your Supabase Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Find the **service_role** key (NOT the anon/publishable key)
5. Copy it - you'll need it in the next steps

⚠️ **Important**: Keep this key secret! Never commit it to git or expose it publicly. This key has admin access and bypasses RLS.

## Step 2: Set Up Local Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add this variable:

```bash
# Your existing variables (keep these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Service role key (from Step 1) - server-side only, never exposed to client
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Save the file

## Step 3: No RLS Policy Changes Needed!

Since we're using the service_role key, it bypasses RLS entirely. Your existing RLS policies will still protect direct database access, but the server-side code can read photos using the service role key.

## Step 4: Test Locally

1. Restart your dev server:
   ```bash
   pnpm dev
   ```

2. Open your browser to `http://localhost:3000`
3. Check the gallery - photos should load
4. Check your terminal for logs:
   - Should see: `Successfully fetched X photos for category: all`
   - If you see errors, check the console output

## Step 5: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

   **Variable:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste your service role key from Step 1)
   - Environment: Select all (Production, Preview, Development)
   - Click **Save**

5. Redeploy your site:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**

## Step 6: Verify Production

1. After deployment completes, visit your live site
2. Check that photos load correctly
3. Check Vercel Function Logs:
   - Go to **Deployments** → Click on the latest deployment
   - Go to **Functions** tab
   - Look for logs showing: `Successfully fetched X photos`

## Troubleshooting

### Photos not loading locally?
- Check that `.env.local` has all required variables
- Restart your dev server after adding env vars
- Check terminal for error messages

### Photos not loading in production?
- Verify `SUPABASE_SERVICE_ROLE_KEY` environment variable is set in Vercel
- Check that you selected all environments (Production, Preview, Development)
- Redeploy after adding the environment variable
- Check Vercel Function Logs for errors

### "Invalid API key" or authentication errors?
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is correct (not the anon key)
- Verify you copied the entire key (it's very long)
- Check that there are no extra spaces or line breaks
- The service_role key should start with `eyJ...` (it's a JWT token)

## Security Checklist

✅ Service role key is only in environment variables (never in code)
✅ `.env.local` is in `.gitignore` (never committed)
✅ Service role key bypasses RLS but is server-side only
✅ Database stays private - no public read access needed
✅ Client never sees the service role key - only receives photo data

## How It Works

- **Service Role Key**: Has admin access, bypasses RLS
- **Server-Side Only**: Key is never sent to the client
- **Client Receives**: Only the photo data (JSON), never the key
- **RLS Still Protects**: Direct database access is still protected by your RLS policies

