#!/bin/bash

# Akelihle Capital - Credentials Setup Script
echo "🔧 Akelihle Capital - Setting up Email and SMS Credentials"
echo "=========================================================="

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found!"
    exit 1
fi

echo ""
echo "📧 EMAIL CONFIGURATION"
echo "----------------------"
echo "Current email settings:"
echo "- Server: mail.akelihlecap.co.za:465 (SSL/TLS)"
echo "- Account: loans@akelihlecap.co.za"
echo ""

read -p "Enter the email password for loans@akelihlecap.co.za: " -s EMAIL_PASSWORD
echo ""

if [ -n "$EMAIL_PASSWORD" ]; then
    # Update email password in .env file
    if grep -q "EMAIL_PASS=" backend/.env; then
        sed -i "s/EMAIL_PASS=.*/EMAIL_PASS=\"$EMAIL_PASSWORD\"/" backend/.env
        echo "✅ Email password updated in backend/.env"
    else
        echo "EMAIL_PASS=\"$EMAIL_PASSWORD\"" >> backend/.env
        echo "✅ Email password added to backend/.env"
    fi
else
    echo "⚠️  Email password not provided - skipping email setup"
fi

echo ""
echo "📱 SMS CONFIGURATION (Twilio)"
echo "-----------------------------"
echo "You need a Twilio account with:"
echo "- Account SID (starts with 'AC')"
echo "- Auth Token"
echo "- Phone Number (format: +27xxxxxxxxx)"
echo ""

read -p "Do you have Twilio credentials? (y/n): " HAS_TWILIO

if [ "$HAS_TWILIO" = "y" ] || [ "$HAS_TWILIO" = "Y" ]; then
    read -p "Enter Twilio Account SID (starts with AC): " TWILIO_SID
    read -p "Enter Twilio Auth Token: " -s TWILIO_TOKEN
    echo ""
    read -p "Enter Twilio Phone Number (+27xxxxxxxxx): " TWILIO_PHONE
    
    if [ -n "$TWILIO_SID" ] && [ -n "$TWILIO_TOKEN" ] && [ -n "$TWILIO_PHONE" ]; then
        # Update Twilio credentials in .env file
        sed -i "s/TWILIO_ACCOUNT_SID=.*/TWILIO_ACCOUNT_SID=\"$TWILIO_SID\"/" backend/.env
        sed -i "s/TWILIO_AUTH_TOKEN=.*/TWILIO_AUTH_TOKEN=\"$TWILIO_TOKEN\"/" backend/.env
        sed -i "s/TWILIO_PHONE_NUMBER=.*/TWILIO_PHONE_NUMBER=\"$TWILIO_PHONE\"/" backend/.env
        echo "✅ Twilio credentials updated in backend/.env"
    else
        echo "⚠️  Incomplete Twilio credentials - skipping SMS setup"
    fi
else
    echo "ℹ️  To set up SMS later:"
    echo "   1. Create account at https://www.twilio.com"
    echo "   2. Get Account SID, Auth Token, and Phone Number"
    echo "   3. Update backend/.env file"
fi

echo ""
echo "🧪 TESTING"
echo "----------"
echo "After updating credentials, test the system:"
echo ""
echo "1. Restart the backend server (it should auto-restart)"
echo "2. Test system status:"
echo "   curl -H \"Authorization: Bearer YOUR_ADMIN_TOKEN\" http://localhost:3001/api/admin/system-status"
echo ""
echo "3. Test email (replace YOUR_ADMIN_TOKEN and test email):"
echo "   curl -H \"Authorization: Bearer YOUR_ADMIN_TOKEN\" \\"
echo "     -X POST http://localhost:3001/api/admin/test-email \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\":\"your-test@example.com\"}'"
echo ""
echo "4. Test SMS (if configured):"
echo "   curl -H \"Authorization: Bearer YOUR_ADMIN_TOKEN\" \\"
echo "     -X POST http://localhost:3001/api/admin/test-sms \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"phone\":\"+27123456789\"}'"
echo ""
echo "🚀 Ready for production deployment after successful testing!"
echo ""
echo "📖 See PRODUCTION_DEPLOYMENT.md for deployment guide"
echo "📊 See CURRENT_STATUS.md for detailed status"