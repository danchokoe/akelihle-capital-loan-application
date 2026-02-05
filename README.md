# 🏦 Akelihle Capital - Loan Application System

<div align="center">
  <img src="public/logo.png" alt="Akelihle Capital" width="200"/>
  
  **Professional Short-Term Loan Application Platform**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-8+-orange.svg)](https://www.mysql.com/)
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Akelihle Capital is a modern, full-stack loan application system designed for short-term lending. The platform provides a seamless experience for loan applicants and comprehensive management tools for administrators.

🚀 **Live Demo**: [https://main.d11901v661d27z.amplifyapp.com/](https://main.d11901v661d27z.amplifyapp.com/)

### 🎯 Key Highlights

- **Professional UI/UX** with dark theme and responsive design
- **Real-time loan calculator** with dynamic interest calculations
- **Automated email notifications** with professional templates
- **Secure file upload** system for required documents
- **Admin dashboard** for application management
- **Production-ready** with multiple deployment options

## ✨ Features

### 👤 For Applicants
- **Easy Registration & Login** - Secure user authentication
- **Interactive Loan Calculator** - Real-time calculations with sliders
- **Document Upload** - ID, proof of residence, and salary documents
- **Application Tracking** - Real-time status updates
- **User Dashboard** - View all applications and history

### 👨‍💼 For Administrators
- **Admin Dashboard** - Comprehensive application management
- **Application Review** - Approve, reject, or request more info
- **Email Notifications** - Automated professional email templates
- **System Monitoring** - Health checks and system status
- **Audit Logs** - Complete application history tracking

### 🔧 Technical Features
- **Responsive Design** - Works on all devices
- **Email Integration** - SMTP with HTML templates
- **File Management** - Secure document storage
- **Database Integration** - MySQL with Prisma ORM
- **Health Monitoring** - Built-in system health checks
- **Security** - JWT authentication, input validation, CORS protection

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma** - Database ORM
- **MySQL** - Database
- **Nodemailer** - Email service
- **JWT** - Authentication
- **Multer** - File uploads

### DevOps & Deployment
- **PM2** - Process management
- **Nginx** - Reverse proxy
- **Docker** - Containerization (optional)
- **cPanel** - Shared hosting support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL 8+ installed
- Git installed

### 1. Clone Repository
```bash
git clone https://github.com/your-username/akelihle-capital-loan-application.git
cd akelihle-capital-loan-application
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Setup Database
```bash
# Create database and user
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS akelihle_capital;"
sudo mysql -u root -e "CREATE USER IF NOT EXISTS 'akelihle'@'localhost' IDENTIFIED BY 'password123';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON akelihle_capital.* TO 'akelihle'@'localhost';"
sudo mysql -u root -e "FLUSH PRIVILEGES;"

# Run migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

### 4. Start Development Servers
```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Login**: `admin` / `password123`

## ⚙️ Configuration

### Environment Variables

The backend `.env` file is pre-configured with development settings:

```env
# Database
DATABASE_URL="mysql://akelihle:password123@localhost:3306/akelihle_capital"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$7MteCQG2qtzUm9GRuz9gJuZPUwohaJuUuRC2LVXD3AG4RgjxZ9OUK"

# Email Configuration (Update with your SMTP details)
EMAIL_HOST="mail.akelihlecap.co.za"
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER="loans@akelihlecap.co.za"
EMAIL_PASS="your-email-password"
EMAIL_FROM="Akelihle Capital <loans@akelihlecap.co.za>"

# Server
PORT=3001
NODE_ENV="development"
```

### Loan Configuration

- **Interest Rate**: 20% per annum
- **Loan Terms**: 30, 60, or 90 days
- **Loan Amount**: R500 - R5,000 (R100 increments)
- **Repayment Fees**: R150 (30d), R300 (60d), R450 (90d)

## 🚀 Deployment

### Option 1: cPanel Hosting (Recommended for Shared Hosting)

1. **Upload Files**:
   - Upload `akelihle-capital-cpanel.zip` to public_html
   - Extract the files

2. **Setup Database**:
   - Import `akelihle_capital_database.sql` via phpMyAdmin
   - Update `.env` with cPanel database credentials

3. **Configure**:
   - Edit `.env` file with your hosting details
   - Enable Node.js in cPanel (if supported)

📖 **Detailed Guide**: [CPANEL_QUICK_INSTALL.md](CPANEL_QUICK_INSTALL.md)

### Option 2: Ubuntu VPS

```bash
# Run automated deployment
./ubuntu-deploy.sh
```

📖 **Detailed Guide**: [UBUNTU_DEPLOYMENT.md](UBUNTU_DEPLOYMENT.md)

### Option 3: Production Build

```bash
# Build for production
./build-production.sh

# Start with PM2
pm2 start ecosystem.config.js --env production
```

📖 **Detailed Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📚 API Documentation

### Authentication Endpoints

```bash
# Admin Login
POST /api/auth/admin/login
{
  "username": "admin",
  "password": "password123"
}

# User Registration
POST /api/auth/applicant/signup
{
  "email": "user@example.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe"
}

# User Login
POST /api/auth/applicant/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### Application Endpoints

```bash
# Submit Application
POST /api/applications
# Requires: multipart/form-data with documents

# Get Applications (Admin)
GET /api/applications
# Requires: Admin JWT token

# Get User Applications
GET /api/applications/user/me
# Requires: User JWT token

# Update Status (Admin)
PATCH /api/applications/:id/status
{
  "status": "APPROVED" | "REJECTED" | "PENDING"
}

# Get Application by ID (Public)
GET /api/applications/:id

# Download Contract PDF
GET /api/applications/:id/contract
```

### Health Check Endpoints

```bash
# Basic Health
GET /api/health

# System Status (Admin)
GET /api/admin/system-status

# Database Health
GET /api/health/database
```

## 🧪 Testing

### Manual Testing

1. **User Flow**:
   - Register new account at http://localhost:3000
   - Calculate loan amount using sliders
   - Submit application with required documents
   - Check application status

2. **Admin Flow**:
   - Login as admin (`admin` / `password123`)
   - Review submitted applications
   - Approve/reject applications
   - Verify email notifications are sent

### API Testing

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test admin login
curl -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Test system status (requires admin token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/admin/system-status
```

## 📁 Project Structure

```
akelihle-capital-loan-application/
├── 📁 components/           # React components
│   ├── AdminDashboard.tsx   # Admin management interface
│   ├── ApplicationForm.tsx  # Loan application form
│   ├── LoanCalculator.tsx   # Interactive calculator
│   ├── Header.tsx           # Navigation header
│   └── Preloader.tsx        # Loading animation
├── 📁 contexts/            # React contexts
│   └── AppContext.tsx      # Global state management
├── 📁 services/            # API services
│   └── api.ts              # HTTP client
├── 📁 backend/             # Backend application
│   ├── 📁 src/
│   │   ├── 📁 routes/      # API routes
│   │   ├── 📁 services/    # Business logic
│   │   ├── 📁 middleware/  # Express middleware
│   │   └── 📁 utils/       # Utility functions
│   ├── 📁 prisma/          # Database schema & migrations
│   └── 📁 uploads/         # File uploads storage
├── 📁 public/              # Static assets
│   └── logo.png            # Akelihle Capital logo
├── 📁 cpanel/              # cPanel deployment files
├── 📄 akelihle_capital_database.sql  # Database schema
├── 📄 ecosystem.config.js  # PM2 configuration
├── 📄 ubuntu-deploy.sh     # Ubuntu deployment script
└── 📄 README.md            # This file
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Joi schema validation
- **File Upload Security** - Type and size restrictions
- **CORS Protection** - Configured origins
- **SQL Injection Prevention** - Prisma ORM protection
- **Security Headers** - Helmet middleware

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Follow existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

### Quick Links
- [Installation Guide](INSTALLATION.md)
- [cPanel Deployment](CPANEL_QUICK_INSTALL.md)
- [Ubuntu Deployment](UBUNTU_DEPLOYMENT.md)
- [Production Deployment](DEPLOYMENT_GUIDE.md)
- [System Status](CURRENT_STATUS.md)

### Contact Information
- **Email**: info@akelihlecap.co.za
- **WhatsApp**: +27 (071)-969-9412
- **Website**: https://akelihlecap.co.za

### Reporting Issues
If you encounter any issues, please [create an issue](https://github.com/your-username/akelihle-capital-loan-application/issues) with:
- Detailed description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Screenshots (if applicable)

---

<div align="center">
  <p><strong>Built with ❤️ for Akelihle Capital</strong></p>
  <p>© 2025 Akelihle Capital Pty Ltd. All rights reserved.</p>
  <p><em>Reg No: 2025/053404/07 | NCRCP Registration: NCRCP21550</em></p>
</div>