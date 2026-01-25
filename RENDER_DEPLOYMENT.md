# Frontend Deployment Guide for Render

## Prerequisites

✅ Backend deployed at: `https://univr-chatbot-backend.onrender.com`

---

## Deploy Frontend to Render (Free Tier)

### 1. Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"** (NOT Blueprint - to avoid payment card requirement)
3. Connect your GitHub account if not already connected
4. Select repository: `RAG-based-chatbot`
5. Select branch: `main`

### 2. Basic Settings

**Name:**
```
univr-chatbot-frontend
```

**Region:**
```
Oregon (US West)
```
(Same region as backend for better performance)

**Root Directory:**
```
univr-chatbot-front
```
⚠️ **Important:** Set this to your frontend folder name

**Branch:**
```
main
```

### 3. Build & Start Commands

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### 4. Instance Type

- Select **"Free"** (no payment card required)
- Free tier: 512 MB RAM, 0.1 CPU

### 5. Environment Variables

Add this environment variable in Render dashboard:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_API_URL` | `https://univr-chatbot-backend-1.onrender.com/api` |

⚠️ **Important:** 
- The variable name must start with `NEXT_PUBLIC_` for Next.js to expose it to the browser
- No trailing slash
- Include `/api` at the end

### 6. Deploy!

Click **"Create Web Service"** and Render will:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Build your Next.js app (`npm run build`)
4. Start the production server (`npm start`)
5. Provide a public URL (e.g., `https://univr-chatbot-frontend.onrender.com`)

---

## After Deployment

### Test Your Deployment

1. Visit your frontend URL: `https://univr-chatbot-frontend.onrender.com`
2. Test the connection:
   - Landing page should load
   - Click "Chatbot" → should load domains from backend
   - Select a domain → should be able to chat

### Verify Backend Connection

If you see errors, check:
1. Backend is running: `https://univr-chatbot-backend.onrender.com/health`
2. Environment variable is set correctly in Render dashboard
3. Check browser console for CORS or API errors

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check Root Directory is set to `univr-chatbot-front`
- Verify `package.json` exists in that directory

**Error: "Out of memory"**
- Free tier has 512 MB RAM limit
- Try optimizing your build or upgrade to Starter tier

### Frontend Can't Connect to Backend

**CORS Errors:**
- Backend already has CORS configured to allow all origins
- If issues persist, check backend logs

**404 Errors:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check that backend URL includes `/api` at the end
- Test backend directly: `https://univr-chatbot-backend-1.onrender.com/api/domains`

**Environment Variable Not Working:**
- Must start with `NEXT_PUBLIC_` prefix
- Rebuild after changing environment variables
- Check Render logs for build errors

### Service Won't Start

**Check Logs:**
- Go to Render dashboard → Your service → Logs
- Look for error messages
- Common issues: port conflicts, missing dependencies

---

## Free Tier Limitations

⚠️ **Important Notes:**

1. **Spin Down:** Services spin down after 15 minutes of inactivity
2. **Cold Start:** First request after spin-down takes 30-60 seconds
3. **Build Time:** Free tier has limited build time (may timeout on large builds)
4. **Bandwidth:** Limited bandwidth on free tier

**For Production:**
- Consider Starter tier ($7/month) for:
  - No spin-downs
  - Faster builds
  - Better performance
  - SSH access

---

## Update Backend URL (If Changed)

If your backend URL changes, update the environment variable:

1. Go to Render Dashboard → Your Frontend Service
2. Go to "Environment" tab
3. Update `NEXT_PUBLIC_API_URL` value
4. Click "Save Changes"
5. Render will automatically redeploy

---

## Local Development

For local development, create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

This will override the production default when running locally.

---

## Success Checklist

- [ ] Frontend deployed to Render
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set
- [ ] Frontend URL accessible
- [ ] Landing page loads
- [ ] Can connect to backend (domains load)
- [ ] Chat functionality works
- [ ] Admin panel accessible

🎉 **You're all set!** Your full-stack app is now deployed!
