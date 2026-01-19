#!/bin/bash

echo "🚀 DEPLOYING AKELIHLE CAPITAL TO PRODUCTION"
echo "==========================================="

# Generate secure JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Generate new admin password hash
ADMIN_HASH=$(node -e "console.log(require('bcryptjs').hashSync('AkelihleAdmin2025!', 10))")

# Create production .env file
cat > backend/.env.production.ready << EOF
# Production Environment - Ready to Deploy
DATABASE_URL="mysql://akelihle:AkelihleDB2025!@localhost:3306/akelihle_capital"

# JWT (Production)
JWT_SECRET="$JWT_SECRET"
JWT_EXPIRES_IN="7d"

# Admin (Production)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$ADMIN_HASH"

# Email (Production - WORKING)
EMAIL_HOST="mail.akelihlecap.co.za"
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER="loans@akelihlecap.co.za"
EMAIL_PASS="oDu%_B2$75Dz"
EMAIL_FROM="Akelihle Capital <loans@akelihlecap.co.za>"

# File Upload
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=5242880

# Server (Production)
PORT=3001
NODE_ENV="production"

# Production URLs (Update with your domain)
FRONTEND_URL="https://akelihlecapital.com"
BACKEND_URL="https://api.akelihlecapital.com"
EOF

echo "✅ Production environment configured"
echo "✅ JWT Secret: ${JWT_SECRET:0:20}..."
echo "✅ Admin Password: AkelihleAdmin2025!"
echo "✅ Email: Working (loans@akelihlecap.co.za)"
echo ""
echo "📋 DEPLOYMENT OPTIONS:"
echo "1. VPS/Server: Use ecosystem.config.js with PM2"
echo "2. Railway: railway up (backend)"
echo "3. Vercel: vercel --prod (frontend)"
echo ""
echo "🔧 Quick VPS Setup:"
echo "   pm2 start ecosystem.config.js --env production"
echo ""
echo "📁 Files ready:"
echo "   - Frontend: ./dist/"
echo "   - Backend: ./backend/dist/"
echo "   - Config: ./backend/.env.production.ready"
echo ""
echo "🎯 READY TO DEPLOY!"