# Admin Password Reset Guide

## Problem
You forgot the password for: **admin@yarukhelqoomi.com**

## Solution: Reset Password via Supabase Dashboard

### Method 1: Send Password Reset Email (Easiest)
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/jcjcsalrigithndwqfkb
2. Click on **Authentication** (left sidebar)
3. Click on **Users**
4. Find user: `admin@yarukhelqoomi.com`
5. Click the **three dots** (...) on the right side
6. Select **"Send password reset email"**
7. Check your email inbox for reset link
8. Click the link and set new password

### Method 2: Manually Set New Password (Faster)
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/jcjcsalrigithndwqfkb
2. Click on **Authentication** (left sidebar)
3. Click on **Users**
4. Find user: `admin@yarukhelqoomi.com`
5. Click on the email to open user details
6. Scroll down to **"User Management"** section
7. Click **"Reset Password"** or **"Update user"**
8. Enter new password: `YQT@Admin2024`
9. Click **Save**

### Method 3: SQL Query (Advanced)
Run this in Supabase SQL Editor:

```sql
-- Update password for admin user
UPDATE auth.users
SET 
  encrypted_password = crypt('YQT@Admin2024', gen_salt('bf')),
  updated_at = now()
WHERE email = 'admin@yarukhelqoomi.com';
```

## New Admin Credentials (After Reset)
- **Email**: admin@yarukhelqoomi.com
- **Password**: YQT@Admin2024

## Login URL
- Admin Panel: http://localhost:3000/admin/login

## All System Credentials Summary

### Main Admin Panel
- Email: admin@yarukhelqoomi.com
- Password: YQT@Admin2024 (after reset)
- Access: Full CRUD for Leaders and Shura Members

### Funds Manager (Full Access)
- Email: funds.manager@yarukhelqoomi.com
- Password: YQT@Manager2024
- Access: Add/Edit/Delete transactions, manage persons, view reports

### Funds Viewer (Read Only)
- Email: funds.viewer@yarukhelqoomi.com
- Password: YQT@Viewer2024
- Access: View transactions and reports only

## Supabase Project Details
- Project Name: yqtpro
- Project ID: jcjcsalrigithndwqfkb
- URL: https://jcjcsalrigithndwqfkb.supabase.co

## Notes
- All passwords follow the pattern: YQT@[Role]2024
- Passwords are case-sensitive
- Make sure to save passwords in a secure location
