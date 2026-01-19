#!/bin/bash

# Akelihle Capital - Ubuntu Linux Deployment Script
echo "🐧 DEPLOYING AKELIHLE CAPITAL ON UBUNTU LINUX"
echo "=============================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Please don't run as root. Run as regular user with sudo access."
    exit 1
fi

# Update system
echo "📦 Updating Ubuntu system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
echo "📦 Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL Server
echo "🗄️  Installing MySQL Server..."
sudo apt install mysql-server -y

# Secure MySQL installation
echo "🔒 Securing MySQL..."
sudo mysql_secure_installation

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y

# Install PM2 globally
echo "⚙️  Installing PM2..."
sudo npm install -g pm2

# Install additional tools
echo "🛠️  Installing additional tools..."
sudo apt install ufw certbot python3-certbot-nginx -y

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
APP_DIR="/var/www/akelihle-capital"
echo "📁 Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files
echo "📋 Copying application files..."
cp -r dist/ $APP_DIR/
cp -r backend/dist/ $APP_DIR/backend/
cp -r backend/node_modules/ $APP_DIR/backend/
cp -r backend/prisma/ $APP_DIR/backend/
cp backend/package.json $APP_DIR/backend/
cp ecosystem.config.js $APP_DIR/
mkdir -p $APP_DIR/backend/uploads
mkdir -p $APP_DIR/logs

# Setup database
echo "🗄️  Setting up MySQL database..."
sudo mysql << EOF
CREATE DATABASE IF NOT EXISTS akelihle_capital;
CREATE USER IF NOT EXISTS 'akelihle'@'localhost' IDENTIFIED BY 'AkelihleDB2025!';
GRANT ALL PRIVILEGES ON akelihle_capital.* TO 'akelihle'@'localhost';
FLUSH PRIVILEGES;
EOF

# Copy production environment
echo "⚙️  Setting up environment..."
cp backend/.env.production.ready $APP_DIR/backend/.env

# Update database URL in .env
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"mysql://akelihle:AkelihleDB2025!@localhost:3306/akelihle_capital\"|" $APP_DIR/backend/.env

# Run database migrations
echo "🔄 Running database migrations..."
cd $APP_DIR/backend
npx prisma migrate deploy
cd -

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/akelihle-capital << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend - Serve React app
    location / {
        root /var/www/akelihle-capital/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for file uploads
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File uploads
    location /uploads {
        alias /var/www/akelihle-capital/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/akelihle-capital /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start services
echo "🚀 Starting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start application with PM2
cd $APP_DIR
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save

echo ""
echo "✅ DEPLOYMENT COMPLETED!"
echo "========================"
echo ""
echo "🌐 Your application is running at:"
echo "   - Frontend: http://your-server-ip"
echo "   - Backend API: http://your-server-ip/api"
echo "   - Health Check: http://your-server-ip/api/health"
echo ""
echo "🔐 Admin Credentials:"
echo "   - Username: admin"
echo "   - Password: AkelihleAdmin2025!"
echo ""
echo "📊 Management Commands:"
echo "   - Check status: pm2 status"
echo "   - View logs: pm2 logs"
echo "   - Restart: pm2 restart all"
echo "   - Stop: pm2 stop all"
echo ""
echo "🔒 To setup SSL (recommended):"
echo "   1. Point your domain to this server's IP"
echo "   2. Update server_name in /etc/nginx/sites-available/akelihle-capital"
echo "   3. Run: sudo certbot --nginx -d your-domain.com"
echo ""
echo "🧪 Test your deployment:"
echo "   curl http://your-server-ip/api/health"
echo ""
echo "🎉 Akelihle Capital is now live on Ubuntu!"