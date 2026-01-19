# 🚀 Akelihle Capital - cPanel Quick Install Guide

## 📦 What You Have

1. **`akelihle-capital-cpanel.zip`** - Complete application package
2. **`akelihle_capital_database.sql`** - Database schema to import
3. **Admin credentials**: `admin` / `AkelihleAdmin2025!`

## ⚡ 5-Minute Installation

### Step 1: Database Setup (2 minutes)
1. Login to your **cPanel**
2. Go to **"MySQL Databases"**
3. Create new database: `your_username_akelihle`
4. Create database user with **full privileges**
5. Go to **"phpMyAdmin"**
6. Select your database
7. Click **"Import"** tab
8. Upload **`akelihle_capital_database.sql`**
9. Click **"Go"** ✅

### Step 2: Upload Application (2 minutes)
1. Go to **"File Manager"** in cPanel
2. Navigate to **`public_html`**
3. Upload **`akelihle-capital-cpanel.zip`**
4. **Extract** the zip file
5. Delete the zip file ✅

### Step 3: Configure Database (1 minute)
1. Edit the **`.env`** file in public_html
2. Update this line with your database details:
   ```
   DATABASE_URL="mysql://your_db_user:your_db_password@localhost:3306/your_db_name"
   ```
3. Update domain URLs:
   ```
   FRONTEND_URL="https://your-domain.com"
   BACKEND_URL="https://your-domain.com/api"
   ```
4. Save the file ✅

### Step 4: Enable Node.js (if supported)
1. Look for **"Node.js Selector"** or **"Node.js Apps"** in cPanel
2. If available:
   - Create new Node.js app
   - Set startup file: `server.js`
   - Click **"Run NPM Install"**
3. If not available, the app will run as static files ✅

### Step 5: Test Installation
1. Visit: **`https://your-domain.com`**
2. You should see the Akelihle Capital homepage
3. Test admin login: **`admin`** / **`AkelihleAdmin2025!`**
4. Test health check: **`https://your-domain.com/api/health`** ✅

## 🎉 You're Live!

Your Akelihle Capital loan application system is now running with:
- ✅ **Email notifications** working (loans@akelihlecap.co.za)
- ✅ **Database** connected and ready
- ✅ **Admin panel** accessible
- ✅ **File uploads** working
- ✅ **Secure authentication**

## 🔧 Admin Access

- **URL**: `https://your-domain.com`
- **Username**: `admin`
- **Password**: `AkelihleAdmin2025!`

## 📧 Email System

The email system is **pre-configured** and working:
- **Server**: mail.akelihlecap.co.za
- **Account**: loans@akelihlecap.co.za
- **Status**: ✅ Ready to send notifications

## 🆘 Troubleshooting

### Database Connection Error
- Check your `.env` file database URL
- Verify database user has full privileges
- Test database connection in phpMyAdmin

### 404 Errors
- Make sure `.htaccess` file is uploaded
- Check if mod_rewrite is enabled on your host

### Email Not Working
- Email is pre-configured and should work immediately
- Check spam folder for test emails

### Node.js Not Supported
- The app will still work as static files
- Some advanced features may be limited

## 📞 Support

If you need help:
1. Check the `CPANEL_INSTALLATION.md` file for detailed instructions
2. Verify all files are uploaded correctly
3. Test the database connection
4. Contact your hosting provider for Node.js support

---

## 🎯 Quick Summary

1. **Import** `akelihle_capital_database.sql` to MySQL
2. **Upload & Extract** `akelihle-capital-cpanel.zip` to public_html
3. **Edit** `.env` with your database details
4. **Visit** your domain to test
5. **Login** as admin: `admin` / `AkelihleAdmin2025!`

**Your professional loan application system is ready! 🚀**