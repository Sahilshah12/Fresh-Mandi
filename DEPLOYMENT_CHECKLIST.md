# FreshMandi Deployment Checklist

Use these exact values to make the live site connect correctly.

## Frontend (Netlify)

- Site URL: `https://tourmaline-sunshine-87f232.netlify.app`
- API base env var: `VITE_API_BASE=https://freshmandi-backend.onrender.com/api`
- SPA fallback: already configured in `netlify.toml`

## Backend (Render)

Set these environment variables in the Render service:

- `MONGO_URI=mongodb+srv://sahilshah8219_db_user:Sahil123@cluster0.hho5vkh.mongodb.net/?appName=Cluster0`
- `JWT_SECRET=24bbd6f7ea749c22d638a9755975adb93a7021f41f761b9278ee7b5e8d493c1f`
- `CLIENT_URL=https://tourmaline-sunshine-87f232.netlify.app`
- `NODE_ENV=production`

Important:

- Do **not** hardcode `PORT=5000` on Render unless you know the service is configured for it.
- The app already listens on `process.env.PORT || 5000`.
- Render must redeploy after any env var change.

## MongoDB Atlas

The app will not log in if Atlas blocks the backend connection.

Do this in Atlas:

1. Open **Network Access**.
2. Add the outbound IP that Render uses, or temporarily allow `0.0.0.0/0` for development.
3. Wait for the allowlist change to take effect.
4. Verify the database user exists in **Database Access**.

If Atlas is still blocking the connection, Mongoose will buffer queries and login will fail with:

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
