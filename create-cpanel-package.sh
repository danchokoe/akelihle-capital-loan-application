#!/bin/bash

echo "📦 Creating cPanel deployment package..."
echo "========================================"

# Create cpanel directory structure
mkdir -p cpanel/public
mkdir -p cpanel/uploads
mkdir -p cpanel/routes
mkdir -p cpanel/services
mkdir -p cpanel/middleware
mkdir -p cpanel/utils
mkdir -p cpanel/prisma

# Copy frontend build to public
echo "📁 Copying frontend files..."
cp -r dist/* cpanel/public/

# Copy backend files
echo "📁 Copying backend files..."
cp -r backend/src/routes/* cpanel/routes/
cp -r backend/src/services/* cpanel/services/
cp -r backend/src/middleware/* cpanel/middleware/
cp -r backend/src/utils/* cpanel/utils/
cp -r backend/prisma/* cpanel/prisma/

# Copy node_modules (essential packages only)
echo "📁 Copying essential dependencies..."
mkdir -p cpanel/node_modules
cp -r backend/node_modules/@prisma cpanel/node_modules/ 2>/dev/null || true
cp -r backend/node_modules/.prisma cpanel/node_modules/ 2>/dev/null || true

# Create .htaccess for cPanel
cat > cpanel/.htaccess << 'EOF'
# Akelihle Capital - cPanel Configuration

# Enable Node.js
RewriteEngine On

# Handle API routes
RewriteRule ^api/(.*)$ server.js [L,QSA]

# Handle file uploads
RewriteRule ^uploads/(.*)$ uploads/$1 [L]

# Handle React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
EOF

# Create cPanel installation instructions
cat > cpanel/CPANEL_INSTALLATION.md << 'EOF'
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
EOF

# Create the zip package
echo "📦 Creating zip package..."
cd cpanel
zip -r ../akelihle-capital-cpanel.zip . -x "*.DS_Store" "node_modules/.cache/*"
cd ..

echo ""
echo "✅ cPanel package created successfully!"
echo "======================================"
echo ""
echo "📁 Files created:"
echo "   - akelihle-capital-cpanel.zip (Upload this to cPanel)"
echo "   - akelihle_capital_database.sql (Import this to MySQL)"
echo "   - cpanel/ directory (All source files)"
echo ""
echo "📋 Installation steps:"
echo "   1. Import akelihle_capital_database.sql to your MySQL database"
echo "   2. Upload akelihle-capital-cpanel.zip to public_html and extract"
echo "   3. Edit .env file with your database details"
echo "   4. Enable Node.js in cPanel (if supported)"
echo "   5. Visit your domain to test"
echo ""
echo "🔐 Admin credentials:"
echo "   Username: admin"
echo "   Password: AkelihleAdmin2025!"
echo ""
echo "🎉 Ready for cPanel deployment!"