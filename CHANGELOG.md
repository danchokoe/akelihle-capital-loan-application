# Changelog

All notable changes to the Akelihle Capital Loan Application System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions CI/CD pipeline
- Comprehensive documentation
- Contributing guidelines

## [1.0.0] - 2025-01-13

### Added
- Complete loan application system
- React frontend with TypeScript
- Node.js backend with Express
- MySQL database integration with Prisma ORM
- JWT authentication system
- Admin dashboard for application management
- User dashboard for applicants
- Interactive loan calculator with real-time calculations
- File upload system for required documents
- Email notification system with professional templates
- PDF contract generation
- Application status tracking
- Audit logging system
- Health monitoring endpoints
- Responsive design with Tailwind CSS
- Dark theme UI/UX
- Preloader with company logo
- Multiple deployment options (cPanel, Ubuntu VPS, Cloud)
- Production-ready configuration
- Security features (CORS, Helmet, input validation)

### Features
- **Loan Calculator**: Interactive sliders for amount, term selection
- **Document Upload**: ID, proof of residence, salary documents
- **Email Integration**: SMTP with HTML templates and attachments
- **Admin Panel**: Application review, approval/rejection workflow
- **User Management**: Registration, login, dashboard
- **Status Tracking**: Real-time application status updates
- **PDF Generation**: Automated contract creation
- **Audit Trail**: Complete application history logging
- **Health Checks**: System monitoring and status endpoints
- **Multi-deployment**: cPanel, VPS, and cloud deployment options

### Technical Specifications
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js 18+, Express, TypeScript, Prisma
- **Database**: MySQL 8+ with proper relationships and indexes
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Multer with type and size validation
- **Email**: Nodemailer with SMTP integration
- **Process Management**: PM2 configuration
- **Web Server**: Nginx reverse proxy configuration
- **Security**: Input validation, CORS, security headers

### Deployment Options
- **cPanel Hosting**: Complete package with installation guide
- **Ubuntu VPS**: Automated deployment script
- **Cloud Platforms**: Vercel, Railway, DigitalOcean support
- **Docker**: Container configuration (optional)

### Documentation
- Comprehensive README with setup instructions
- API documentation with examples
- Deployment guides for multiple platforms
- Troubleshooting and support documentation
- Contributing guidelines
- License and legal information

## [0.9.0] - 2025-01-12

### Added
- Email system integration with Akelihle Capital SMTP
- Professional email templates with HTML formatting
- Contract attachment system for approved applications
- System status monitoring endpoints
- Production environment configuration

### Fixed
- Application submission validation issues
- Admin panel button functionality
- Email authentication configuration
- Database schema optimization

## [0.8.0] - 2025-01-11

### Added
- Admin dashboard with application management
- Application approval/rejection workflow
- Email notification system
- PDF contract generation
- Audit logging system

### Fixed
- User authentication flow
- File upload validation
- Database relationship constraints

## [0.7.0] - 2025-01-10

### Added
- User dashboard for applicants
- Application status tracking
- File upload system for documents
- Input validation with Joi schemas

### Changed
- Improved UI/UX with dark theme
- Enhanced responsive design
- Better error handling

## [0.6.0] - 2025-01-09

### Added
- Interactive loan calculator
- Real-time interest calculations
- Loan term selection (30, 60, 90 days)
- Amount slider with R100 increments

### Fixed
- Calculation accuracy
- UI responsiveness on mobile devices

## [0.5.0] - 2025-01-08

### Added
- User registration and authentication
- JWT token system
- Password hashing with bcrypt
- Protected routes

### Security
- Input sanitization
- CORS configuration
- Security headers with Helmet

## [0.4.0] - 2025-01-07

### Added
- MySQL database integration
- Prisma ORM setup
- Database migrations
- User and application models

### Changed
- Improved database schema design
- Added proper relationships and constraints

## [0.3.0] - 2025-01-06

### Added
- Express.js backend setup
- TypeScript configuration
- Basic API routes structure
- Error handling middleware

### Fixed
- CORS issues
- Route organization

## [0.2.0] - 2025-01-05

### Added
- React frontend with TypeScript
- Vite build configuration
- Tailwind CSS styling
- Basic component structure

### Changed
- Improved component organization
- Enhanced styling system

## [0.1.0] - 2025-01-04

### Added
- Initial project setup
- Basic project structure
- Package.json configurations
- Development environment setup

---

## Legend

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes