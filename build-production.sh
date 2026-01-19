#!/bin/bash

# Akelihle Capital - Production Build Script
echo "🏗️  Building Akelihle Capital for Production"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Create logs directory
mkdir -p logs

echo ""
echo "📦 Installing dependencies..."
echo "-----------------------------"

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

echo ""
echo "🔨 Building applications..."
echo "---------------------------"

# Build backend
echo "Building backend..."
npm run build

# Go back to root and build frontend
cd ..
echo "Building frontend..."
npm run build

echo ""
echo "🗄️  Database setup..."
echo "--------------------"

# Generate Prisma client and run migrations
cd backend
echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy

cd ..

echo ""
echo "✅ Production build completed!"
echo "==============================="
echo ""
echo "📁 Built files:"
echo "   - Frontend: ./dist/"
echo "   - Backend: ./backend/dist/"
echo ""
echo "🚀 To start in production:"
echo "   1. Set NODE_ENV=production"
echo "   2. Update .env with production values"
echo "   3. Run: npm start"
echo "   OR use PM2: pm2 start ecosystem.config.js"
echo ""
echo "📊 Health checks available at:"
echo "   - Basic: http://localhost:3001/api/health"
echo "   - Detailed: http://localhost:3001/api/health/detailed"
echo "   - System Status: http://localhost:3001/api/admin/system-status"