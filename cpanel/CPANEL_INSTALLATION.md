# 🚀 Akelihle Capital - cPanel Installation Guide

## Step 1: Database Setup
1. Login to your cPanel
2. Go to "MySQL Databases"
3. Create a new database (e.g., `your_username_akelihle`)
4. Create a database user with full privileges
5. Import the `akelihle_capital_database.sql` file using phpMyAdmin

## Step 2: Upload Files
1. Upload the entire `cpanel` folder contents to your domain's public_html directory
2. Or upload the `akelihle-capital-cpanel.zip` and extract it

## Step 3: Configure Environment
1. Edit the `.env` file with your database details:
   ```
   DATABASE_URL="mysql://your_db_user:your_db_password@localhost:3306/your_db_name"
   FRONTEND_URL="https://your-domain.com"
   BACKEND_URL="https://your-domain.com/api"
   ```

## Step 4: Enable Node.js (if supported)
1. In cPanel, go to "Node.js Selector" or "Node.js Apps"
2. Create a new Node.js app
3. Set the startup file to `server.js`
4. Install dependencies: `npm install`

## Step 5: Alternative - PHP Proxy (if Node.js not supported)
If your host doesn't support Node.js, use the included PHP proxy files.

## Step 6: Test Installation
1. Visit: `https://your-domain.com`
2. Test admin login: `admin` / `AkelihleAdmin2025!`
3. Check health: `https://your-domain.com/api/health`

## Admin Credentials
- Username: `admin`
- Password: `AkelihleAdmin2025!`

## Support
- Email system is pre-configured and working
- Database schema is ready
- All files are included and configured

## File Structure
```
public_html/
├── index.html          # Frontend
├── server.js           # Backend server
├── .env               # Configuration
├── .htaccess          # Apache config
├── routes/            # API routes
├── services/          # Email, contracts
├── uploads/           # File uploads
└── node_modules/      # Dependencies
```

Your Akelihle Capital application is ready to go live! 🎉
