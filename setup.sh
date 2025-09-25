#!/bin/bash

# Student Management System - Complete Setup Script
# This script sets up both backend and frontend for the Student Management System

echo "🎓 Student Management System - Complete Setup"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (version 18+) first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Setup Backend
echo ""
echo "🚀 Setting up Backend..."
echo "------------------------"

cd backend || exit 1

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOL
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
EOL
    echo "⚠️  Please update the .env file with your Supabase credentials"
else
    echo "✅ Backend .env file already exists"
fi

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
echo "-------------------------"

cd ../frontend || exit 1

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << EOL
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Development Mode
VITE_DEV_MODE=true
EOL
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

# Go back to root directory
cd ..

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Supabase credentials"
echo "2. Start the backend: cd backend && npm start"
echo "3. Start the frontend: cd frontend && npm run dev"
echo ""
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend API will be available at: http://localhost:3000"
echo ""
echo "📚 Check the README files for detailed documentation"