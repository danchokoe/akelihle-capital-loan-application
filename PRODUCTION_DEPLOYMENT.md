# Akelihle Capital - Production Deployment Guide

## Pre-Deployment Checklist

### 1. Email Configuration ✅
- **SMTP Server**: mail.akelihlecap.co.za
- **Port**: 465 (SSL/TLS)
- **Email Account**: loans@akelihlecap.co.za
- **Status**: Configured, needs password

**Required Action**: Set the actual email password in `backend/.env`:
```bash
EMAIL_PASS="your-actual-email-password"
```

### 2. SMS Configuration ⚠️
- **Service**: Twilio
- **Status**: Needs credentials

**Required Action**: Get Twilio credentials and update `backend/.env`:
```bash
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+27xxxxxxxxx"
```

### 3. Database Configuration ✅
- **Type**: MySQL
- **Status**: Configured for development
- **Production**: Needs production database URL

### 4. Security Configuration ⚠️
**Required Actions**:
- Generate strong JWT secret for production
- Update admin password hash
- Set secure environment variables

## Testing Before Deployment

### 1. Test Email System
```bash
# Test SMTP connection (admin panel)
GET /api/admin/test-smtp-connection

# Send test email
POST /api/admin/test-email
{
  "email": "test@example.com"
}
```

### 2. Test SMS System
```bash
# Test Twilio connection
GET /api/admin/test-twilio-connection

# Send test SMS
POST /api/admin/test-sms
{
  "phone": "+27123456789"
}
```

### 3. Test Full Application Flow
1. Register new user
2. Submit loan application
3. Admin approve/reject application
4. Verify email and SMS notifications sent

## Production Environment Setup

### 1. Environment Variables (.env)
```bash
# Database (Production)
DATABASE_URL="mysql://username:password@production-host:3306/akelihle_capital"

# JWT (Production - Generate new secret)
JWT_SECRET="your-super-secure-production-jwt-secret-min-32-chars"
JWT_EXPIRES_IN="7d"

# Admin (Production - Generate new hash)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$new-production-password-hash"

# Email (Production)
EMAIL_HOST="mail.akelihlecap.co.za"
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER="loans@akelihlecap.co.za"
EMAIL_PASS="production-email-password"
EMAIL_FROM="Akelihle Capital <loans@akelihlecap.co.za>"

# SMS (Production)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="production-twilio-auth-token"
TWILIO_PHONE_NUMBER="+27xxxxxxxxx"

# File Upload
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=5242880

# Server (Production)
PORT=3001
NODE_ENV="production"

# Production URLs
FRONTEND_URL="https://your-domain.com"
BACKEND_URL="https://api.your-domain.com"
```

### 2. Database Migration
```bash
# Run database migrations in production
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 3. Build Applications
```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build
```

## Deployment Options

### Option 1: VPS/Cloud Server (Recommended)
1. **Server Requirements**:
   - Ubuntu 20.04+ or similar
   - Node.js 18+
   - MySQL 8.0+
   - Nginx (reverse proxy)
   - SSL certificate

2. **Deployment Steps**:
   ```bash
   # Install dependencies
   sudo apt update
   sudo apt install nodejs npm mysql-server nginx certbot
   
   # Setup MySQL database
   sudo mysql_secure_installation
   
   # Clone and setup application
   git clone <your-repo>
   cd akelihle-capital-loan-application
   npm install
   cd backend && npm install
   
   # Setup environment variables
   cp .env.example .env
   # Edit .env with production values
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Build applications
   npm run build
   cd backend && npm run build
   
   # Setup PM2 for process management
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   
   # Setup Nginx reverse proxy
   # Configure SSL with Let's Encrypt
   ```

### Option 2: Docker Deployment
```dockerfile
# Dockerfile example provided separately
```

### Option 3: Cloud Platforms
- **Vercel** (Frontend) + **Railway/Heroku** (Backend)
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

## Security Considerations

### 1. SSL/TLS
- Use HTTPS for all communications
- Secure email with SSL/TLS
- Validate certificates

### 2. Environment Variables
- Never commit secrets to version control
- Use secure secret management
- Rotate secrets regularly

### 3. Database Security
- Use strong passwords
- Enable SSL connections
- Regular backups
- Access control

### 4. File Upload Security
- Validate file types
- Scan for malware
- Limit file sizes
- Secure storage

## Monitoring and Maintenance

### 1. Logging
- Application logs
- Error tracking
- Performance monitoring

### 2. Backups
- Database backups (daily)
- File upload backups
- Configuration backups

### 3. Updates
- Security patches
- Dependency updates
- Feature updates

## Support and Troubleshooting

### Common Issues
1. **Email not sending**: Check SMTP credentials and firewall
2. **SMS not sending**: Verify Twilio credentials and phone number format
3. **Database connection**: Check connection string and network access
4. **File uploads**: Verify upload directory permissions

### Logs Location
- Application: `logs/app.log`
- Error: `logs/error.log`
- Access: `logs/access.log`

### Health Check Endpoints
- **System Status**: `GET /api/admin/system-status`
- **Database**: `GET /api/health/database`
- **Email**: `GET /api/admin/test-smtp-connection`
- **SMS**: `GET /api/admin/test-twilio-connection`

---

## Next Steps

1. ✅ Set email password in `.env`
2. ⚠️ Configure Twilio credentials
3. 🧪 Test email and SMS functionality
4. 🚀 Choose deployment platform
5. 🔒 Setup production environment
6. 📊 Configure monitoring
7. 🎯 Go live!