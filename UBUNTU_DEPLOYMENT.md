# 🐧 Ubuntu Linux Deployment Guide

## Quick Deployment (Automated)

```bash
# Run the automated deployment script
./ubuntu-deploy.sh
```

## Manual Deployment Steps

### 1. System Setup
```bash
# Update Ubuntu
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx and PM2
sudo apt install nginx -y
sudo npm install -g pm2

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 2. Database Setup
```bash
# Create database and user
sudo mysql << EOF
CREATE DATABASE akelihle_capital;
CREATE USER 'akelihle'@'localhost' IDENTIFIED BY 'AkelihleDB2025!';
GRANT ALL PRIVILEGES ON akelihle_capital.* TO 'akelihle'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### 3. Application Deployment
```bash
# Create application directory
sudo mkdir -p /var/www/akelihle-capital
sudo chown $USER:$USER /var/www/akelihle-capital

# Copy built files
cp -r dist/ /var/www/akelihle-capital/
cp -r backend/dist/ /var/www/akelihle-capital/backend/
cp -r backend/node_modules/ /var/www/akelihle-capital/backend/
cp -r backend/prisma/ /var/www/akelihle-capital/backend/
cp backend/package.json /var/www/akelihle-capital/backend/
cp ecosystem.config.js /var/www/akelihle-capital/

# Create directories
mkdir -p /var/www/akelihle-capital/backend/uploads
mkdir -p /var/www/akelihle-capital/logs

# Setup environment
cp backend/.env.production.ready /var/www/akelihle-capital/backend/.env

# Run database migrations
cd /var/www/akelihle-capital/backend
npx prisma migrate deploy
```

### 4. Nginx Configuration
```bash
# Create Nginx config
sudo tee /etc/nginx/sites-available/akelihle-capital << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/akelihle-capital/dist;
        try_files $uri $uri/ /index.html;
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
    }

    # File uploads
    location /uploads {
        alias /var/www/akelihle-capital/backend/uploads;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/akelihle-capital /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Start Application
```bash
# Start with PM2
cd /var/www/akelihle-capital
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

## SSL Setup (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (after pointing domain to server)
sudo certbot --nginx -d your-domain.com
```

## Management Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart all

# Stop application
pm2 stop all

# Check Nginx status
sudo systemctl status nginx

# Check MySQL status
sudo systemctl status mysql
```

## Testing Deployment

```bash
# Test health endpoint
curl http://your-server-ip/api/health

# Test admin login
curl -X POST http://your-server-ip/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"AkelihleAdmin2025!"}'

# Test system status (with admin token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://your-server-ip/api/admin/system-status
```

## File Locations

- **Application**: `/var/www/akelihle-capital/`
- **Nginx Config**: `/etc/nginx/sites-available/akelihle-capital`
- **Environment**: `/var/www/akelihle-capital/backend/.env`
- **Logs**: `/var/www/akelihle-capital/logs/`
- **Uploads**: `/var/www/akelihle-capital/backend/uploads/`

## Troubleshooting

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs

# Check environment variables
cat /var/www/akelihle-capital/backend/.env

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u akelihle -p akelihle_capital

# Check database exists
sudo mysql -e "SHOW DATABASES;"
```

### Email Not Working
```bash
# Test email from admin panel
# Check firewall allows port 465
sudo ufw status

# Check logs for email errors
pm2 logs | grep -i email
```

## Server Requirements

- **OS**: Ubuntu 20.04+ LTS
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB minimum
- **CPU**: 1 core minimum (2 cores recommended)
- **Network**: Port 80, 443, 22 open

## Security Checklist

- ✅ Firewall configured (UFW)
- ✅ MySQL secured
- ✅ Nginx security headers
- ✅ SSL certificate (after domain setup)
- ✅ Regular updates scheduled
- ✅ Strong passwords used

---

## 🎉 Your Ubuntu server is ready to host Akelihle Capital!

Run `./ubuntu-deploy.sh` for automated deployment or follow the manual steps above.