# 🎭 Demo Credentials for AWS Amplify

## 🌐 Live Demo Site
**URL**: https://main.d2jaijkly282aq.amplifyapp.com/

## 🔐 Demo Credentials

### 👨‍💼 Admin Access
```
Username: admin
Password: demo123
```

**Admin Features:**
- View all loan applications
- Approve/reject applications
- Send notifications to applicants
- View system statistics
- Generate contracts for approved loans

### 👤 User Access

**Option 1: Pre-created Demo User**
```
Email: demo@akelihlecap.co.za
Password: demo123
```

**Option 2: Create New Account**
- Click "Login / Sign Up" → "Sign Up"
- Use any email and password
- All data is stored locally (demo mode)

**User Features:**
- Apply for loans using the calculator
- Upload documents (simulated)
- Track application status
- View application history
- Download contracts (for approved loans)

## 📊 Demo Data Included

### Sample Applications
- **5 pre-loaded applications** with different statuses:
  - 2 Pending applications
  - 2 Approved applications  
  - 1 Rejected application

### Sample Users
- Multiple demo users with different profiles
- Various employment statuses and income levels
- Different loan amounts and terms

## ✨ Demo Features

### Fully Functional
- ✅ User registration and login
- ✅ Admin authentication
- ✅ Loan calculator with real-time calculations
- ✅ Application submission with file uploads (simulated)
- ✅ Status tracking and updates
- ✅ Admin dashboard with full management
- ✅ Email notifications (simulated)
- ✅ Contract generation (demo PDFs)
- ✅ Responsive design for all devices

### Demo Limitations
- 🔄 Data resets on page refresh (stored in browser memory)
- 📧 Emails are simulated (not actually sent)
- 📁 File uploads are simulated (files not actually stored)
- 💾 No persistent database (all data is temporary)

## 🎯 Testing Scenarios

### User Journey
1. **Register**: Create new account or use demo credentials
2. **Calculate**: Use loan calculator to determine loan amount
3. **Apply**: Submit application with required documents
4. **Track**: Check application status
5. **Contract**: Download contract if approved

### Admin Journey
1. **Login**: Use admin credentials
2. **Review**: View all submitted applications
3. **Decide**: Approve or reject applications
4. **Notify**: Send notifications to applicants
5. **Monitor**: View system statistics

## 🚀 How Demo Mode Works

The application automatically detects when running on AWS Amplify and switches to demo mode:

- **Frontend-only**: No backend server required
- **Local storage**: All data stored in browser
- **Simulated APIs**: All API calls return demo data
- **Real functionality**: All features work as in production

## 💡 For Developers

To test locally with backend:
```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
npm run dev
```

Local version uses real database and API endpoints.

## 📞 Support

For questions about the demo or to discuss implementation:
- **Email**: info@akelihlecap.co.za
- **WhatsApp**: +27 (071)-969-9412

---

**Note**: This demo showcases the complete loan application system functionality. In production, it would connect to a real backend with database, email service, and file storage.