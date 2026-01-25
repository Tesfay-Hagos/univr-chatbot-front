# Environment Variable Setup Guide

## Backend API URL Configuration

The frontend uses the `NEXT_PUBLIC_API_URL` environment variable to connect to the backend.

### Current Backend URL
```
https://univr-chatbot-backend-1.onrender.com/api
```

## How It Works

The frontend code in `lib/api.ts` uses:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://univr-chatbot-backend-1.onrender.com/api';
```

This means:
1. **First priority**: Uses `NEXT_PUBLIC_API_URL` if set
2. **Fallback**: Uses the hardcoded production URL if not set

## Setup for Render Deployment

### In Render Dashboard:

1. Go to your frontend service → **Environment** tab
2. Add environment variable:

   **Name:** `NEXT_PUBLIC_API_URL`
   
   **Value:** `https://univr-chatbot-backend-1.onrender.com/api`

3. **Important:** 
   - Variable name MUST start with `NEXT_PUBLIC_` (Next.js requirement)
   - Include `/api` at the end of the URL
   - No trailing slash after `/api`

4. Save and redeploy

## Setup for Local Development

1. Create `.env.local` file in the frontend root directory:
   ```bash
   cd univr-chatbot-front
   cp .env.example .env.local
   ```

2. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. Restart your Next.js dev server

## Verify It's Working

### Check in Browser Console:

1. Open your deployed frontend
2. Open browser DevTools (F12)
3. Go to Console tab
4. Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
5. Should show your backend URL

### Test API Connection:

1. Visit: `https://your-frontend.onrender.com`
2. Click "Chatbot"
3. Should load domains from backend
4. If you see errors, check:
   - Environment variable is set correctly
   - Backend is running: `https://univr-chatbot-backend-1.onrender.com/health`
   - CORS is configured (backend already has this)

## Troubleshooting

### Environment Variable Not Working

**Problem:** Frontend still uses old URL or localhost

**Solutions:**
1. ✅ Variable name must be `NEXT_PUBLIC_API_URL` (exact spelling)
2. ✅ Rebuild after setting environment variable (Render does this automatically)
3. ✅ Check Render logs for build errors
4. ✅ Clear browser cache and hard refresh (Ctrl+Shift+R)

### CORS Errors

**Problem:** Browser shows CORS errors

**Solution:** Backend already has CORS configured. If issues persist:
- Check backend is running
- Verify backend URL is correct
- Check browser console for exact error message

### 404 Errors

**Problem:** API calls return 404

**Solutions:**
1. Verify backend URL includes `/api` at the end
2. Test backend directly: `https://univr-chatbot-backend-1.onrender.com/api/domains`
3. Check backend logs in Render dashboard

## Quick Reference

| Environment | Variable Value |
|------------|----------------|
| **Production (Render)** | `https://univr-chatbot-backend-1.onrender.com/api` |
| **Local Development** | `http://localhost:8000/api` |

## Notes

- ✅ Next.js automatically exposes `NEXT_PUBLIC_*` variables to the browser
- ✅ No need to modify `next.config.mjs` for this
- ✅ Environment variables are baked into the build at build time
- ✅ Changes require a rebuild (Render does this automatically when you update env vars)
