# ⚠️  SECURITY SETUP GUIDE

## CRITICAL: Secrets Exposure

**The server/.env or server/.env.local file contains sensitive credentials that MUST NEVER be committed to git.**

If credentials have been exposed in git history:

1. **Immediately rotate ALL credentials:**
   - ❌ Delete/recreate MongoDB Atlas cluster
   - ❌ Generate new Cloudinary API keys
   - ❌ Create new OpenRouter API key
   - ❌ Regenerate JWT_SECRET

2. **Clean git history:**
   ```bash
   git filter-branch --tree-filter 'rm -f server/.env' HEAD
   git push --force-with-lease
   ```

3. **Prevent future exposure:**
   - Verify `.gitignore` includes `.env` and `.env.local`
   - Use `.env.example` to document structure only
   - Enable git hooks to prevent commits with secrets

## Setup Instructions

### 1. Server Configuration (server/.env.local)

Copy `server/.env.example` to `server/.env.local` and fill in credentials:

```bash
cp server/.env.example server/.env.local
```

> The server supports both `server/.env.local` and `server/.env`, but `.env.local` is preferred for local secret storage.

#### MongoDB Atlas Setup
- Create cluster: https://www.mongodb.com/cloud/atlas
- Get connection string from "Connect → Drivers"
- Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- Update `MONGO_URI_CORE` and `MONGO_URI_AI`

#### JWT Secret
Generate strong random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Cloudinary API Keys
- Go to https://cloudinary.com/console
- Copy API Key and API Secret
- Update `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

#### OpenRouter API Key
- Visit https://makersuite.google.com/app/apikey
- Create API key for your project
- Update `OPENROUTER_API_KEY`

### 2. Client Configuration (client/.env)

Copy `client/.env.example` to `client/.env`:

```bash
cp client/.env.example client/.env
```

**DO NOT PUT SECRETS IN CLIENT ENV** - Frontend secrets are exposed to users.

#### Cloudinary Unsigned Upload Preset
1. Go to https://cloudinary.com/console/settings/upload
2. Under "Upload presets" → Create unsigned upload preset
3. Set upload preset mode: **UNSIGNED** (important!)
4. Enable "Auto-tag" → Folder: `resqnet/scanner`
5. Restrictions:
   - Allowed image types: jpg, png, webp
   - Max file size: 12MB
6. Copy preset name to `VITE_CLOUDINARY_UPLOAD_PRESET`

### 3. Verification

Test that configuration is correct:

```bash
# Server startup
cd server && npm start

# Client build
cd client && npm run build
```

Check API health endpoint:
```bash
curl http://localhost:5000/api/health
```

---

## Security Best Practices

✅ **DO:**
- Store secrets in environment variables
- Use `.env.example` to document structure
- Rotate credentials regularly
- Use strong random values (32+ chars)
- Keep `.env` in `.gitignore`
- Use separate credentials per environment (dev/prod)

❌ **DON'T:**
- Commit `.env` files to git
- Hardcode secrets in source code
- Use default/simple secrets
- Share credentials in email/chat
- Leave API keys in frontend code
- Commit git history with secrets

---

## Pre-commit Hook (Optional)

Prevent accidental commits with secrets:

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
if git diff --cached | grep -E 'MONGO_URI|JWT_SECRET|CLOUDINARY_API_SECRET|OPENROUTER_API_KEY'; then
  echo "⚠️  ERROR: Detected secrets in commit!"
  echo "Make sure .env files are in .gitignore"
  exit 1
fi
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Production Deployment

### Environment Variables

Set these on your hosting platform (Render, Railway, Vercel, etc.):

**Backend (server/.env.local or server/.env → environment variables):**
- `PORT`
- `CLIENT_URL`
- `MONGO_URI_CORE`
- `MONGO_URI_AI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `OPENROUTER_API_KEY`
- `DNS_SERVERS`

**Frontend (client/.env → build-time variables):**
- `VITE_API_URL` (production API endpoint)
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_CLOUDINARY_FOLDER`

### Security Headers

Configure server to use:
- CORS properly configured for production domain
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

---

For questions: See server/.env.example and client/.env.example for field descriptions.

