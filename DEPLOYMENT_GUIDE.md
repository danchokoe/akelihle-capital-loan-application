# 🚀 Akelihle Capital - Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

#### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
npm run build
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend-url.railway.app
```

#### Deploy Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway dashboard:
# All variables from backend/.env.production
```

### Option 2: DigitalOcean App Platform

```bash
# Create app.yaml
cat > app.yaml << EOF
name: akelihle-capital
services:
- name: frontend
  source_dir: /
  github:
    repo: your-username/akelihle-capital
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  
- name: backend
  source_dir: /backend
  github:
    repo: your-username/akelihle-capital
    branch: main
  run_command: npm run start:production
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  # Add other environment variables

databases:
- name: akelihle-db
  engine: MYSQL
  version: "8"
EOF

# Deploy using DigitalOcean CLI or web interface
```

### Option 3: VPS/Cloud Server (Ubuntu)

```bash
# Server setup script
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2

# Clone and setup application
git clone https://github.com/your-username/akelihle-capital.git
cd akelihle-capital

# Build application
./build-production.sh

# Setup database
mysql -u root -p << EOF
CREATE DATABASE akelihle_capital;
CREATE USER 'akelihle'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON akelihle_capital.* TO 'akelihle'@'localhost';
FLUSH PRIVILEGES;
EOF

# Update environment variables
cp backend/.env.production backend/.env
# Edit backend/.env with production values

# Run database migrations
cd backend
npx prisma migrate deploy

# Start with PM2
cd ..
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Configure Nginx
sudo tee /etc/nginx/sites-available/akelihle-capital << EOF
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/akelihle-capital/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/akelihle-capital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Environment Variables Setup

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```bash
# Database
DATABASE_URL="mysql://username:password@host:3306/akelihle_capital"

# JWT
JWT_SECRET="your-32-char-production-secret"
JWT_EXPIRES_IN="7d"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$your-production-hash"

# Email (Already configured)
EMAIL_HOST="mail.akelihlecap.co.za"
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER="loans@akelihlecap.co.za"
EMAIL_PASS="oDu%_B2$75Dz"
EMAIL_FROM="Akelihle Capital <loans@akelihlecap.co.za>"

# Server
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://your-domain.com"
BACKEND_URL="https://your-backend-url.com"
```

## Post-Deployment Verification

### 1. Health Checks
```bash
# Basic health
curl https://your-domain.com/api/health

# Detailed health
curl https://your-domain.com/api/health/detailed

# System status (requires admin token)
curl -H "Authorization: Bearer TOKEN" https://your-domain.com/api/admin/system-status
```

### 2. Test Application Flow
1. Visit https://your-domain.com
2. Register new user
3. Submit loan application
4. Login as admin
5. Approve/reject application
6. Verify email notifications

### 3. Monitor Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure database exists

2. **Email Not Sending**
   - Verify EMAIL_PASS is correct
   - Check firewall allows port 465
   - Test with: `curl -X POST /api/admin/test-email`

3. **CORS Errors**
   - Update FRONTEND_URL in backend .env
   - Check CORS configuration in server.ts

4. **File Upload Issues**
   - Check uploads directory permissions
   - Verify MAX_FILE_SIZE setting

### Support Commands
```bash
# Restart services
pm2 restart all

# Check service status
pm2 status

# View system resources
pm2 monit

# Database backup
mysqldump -u username -p akelihle_capital > backup.sql
```

---

## 🎯 Quick Start Commands

```bash
# 1. Build for production
./build-production.sh

# 2. Deploy to Railway (backend)
railway login && railway init && railway up

# 3. Deploy to Vercel (frontend)
vercel --prod

# 4. Update environment variables in hosting dashboards
# 5. Test deployment with health checks
```

Your Akelihle Capital application is now ready for production! 🎉