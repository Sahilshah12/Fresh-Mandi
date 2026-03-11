# Quick Admin Access Guide 🔐

## Current Status
✅ Admin registration is **BLOCKED** from public pages  
✅ Admin login credentials are **SECURED** (not shown in UI)  
✅ Only authorized backend scripts can create admin accounts

## How to Access Admin Dashboard

### Step 1: Create Admin Account (First Time Only)
```bash
cd backend
node create-admin.js
```

**Default Credentials Created**:
- Email: `admin@freshmandi.com`
- Password: `admin123`

### Step 2: Login as Admin
1. Go to: `http://localhost:5173/login`
2. Enter the admin credentials
3. Click "Login to FreshMandi"
4. You'll be automatically redirected to `/admin` dashboard

### Step 3: Change Password (Recommended)
After first login, change the default password for security.

## Security Features Implemented

### Frontend Security ✅
- ❌ No admin option in registration form
- ❌ No admin demo credentials button
- ✅ Only Consumer and Farmer roles visible

### Backend Security ✅
- ✅ API blocks admin role registration
- ✅ Returns 403 Forbidden error
- ✅ Only 'consumer' and 'farmer' allowed

## Testing the Security

### Test 1: Try to Register as Admin
Navigate to `/register` → Only Consumer/Farmer options available

### Test 2: Try API Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test","role":"admin"}'
```
Expected: `403 Forbidden`

### Test 3: Check Login Page  
Navigate to `/login` → Only Consumer and Farmer demo buttons visible

## Important Notes

⚠️ **RESTART BACKEND SERVER** after code changes:
```bash
# Stop current server (Ctrl+C)
cd backend
node server.js
# or
npm start
```

🔒 **Security Best Practices**:
1. Never commit admin credentials to git
2. Change default password in production
3. Use strong passwords (12+ characters)
4. Limit number of admin accounts
5. Use environment variables for sensitive data

## Need Help?

- **Can't login**: Run `node create-admin.js` again
- **Forgot password**: Delete admin from DB, run script again
- **Multiple admins needed**: Modify create-admin.js with different email

---
Last Updated: March 10, 2026
