# FreshMandi Deployment Checklist

Use these exact values to make the live site connect correctly.

## Frontend (Netlify)

- Site URL: `https://tourmaline-sunshine-87f232.netlify.app`
- API base env var: `VITE_API_BASE=https://freshmandi-backend.onrender.com/api`
- SPA fallback: already configured in `netlify.toml`

## Local Backend + MongoDB Compass

Set these environment variables in `backend/.env`:

- `MONGO_URI=mongodb://127.0.0.1:27017/freshmandi`
- `JWT_SECRET=24bbd6f7ea749c22d638a9755975adb93a7021f761b9278ee7b5e8d493c1f`
- `CLIENT_URL=https://tourmaline-sunshine-87f232.netlify.app`
- `NODE_ENV=production`

Important:

- Make sure the local MongoDB server is running on port `27017`.
- Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`.
- The app already listens on `process.env.PORT || 5000`.

If MongoDB is not running locally, Mongoose will buffer queries and login will fail with:

`Operation users.findOne() buffering timed out after 10000ms`

## What should work after deployment

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/profile`
- product images from the deployed backend host
- React Router paths like `/login` and `/register`

## Quick verification order

1. Update Render env vars.
2. Redeploy backend.
3. Verify Atlas network access.
4. Open the Netlify site and test register/login again.
