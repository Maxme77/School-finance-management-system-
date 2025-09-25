@echo off

REM Student Management System - Complete Setup Script for Windows
REM This script sets up both backend and frontend for the Student Management System

echo 🎓 Student Management System - Complete Setup
echo =============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js version 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Setup Backend
echo.
echo 🚀 Setting up Backend...
echo ------------------------

cd backend
if %errorlevel% neq 0 (
    echo ❌ Backend directory not found
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating backend .env file...
    (
        echo # Supabase Configuration
        echo SUPABASE_URL=your_supabase_url_here
        echo SUPABASE_ANON_KEY=your_supabase_anon_key_here
        echo.
        echo # Server Configuration
        echo PORT=3000
        echo NODE_ENV=development
        echo.
        echo # CORS Configuration
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo ⚠️  Please update the .env file with your Supabase credentials
) else (
    echo ✅ Backend .env file already exists
)

REM Setup Frontend
echo.
echo 🎨 Setting up Frontend...
echo -------------------------

cd ..\frontend
if %errorlevel% neq 0 (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating frontend .env file...
    (
        echo # Backend API URL
        echo VITE_API_URL=http://localhost:3000/api
        echo.
        echo # Development Mode
        echo VITE_DEV_MODE=true
    ) > .env
    echo ✅ Frontend .env file created
) else (
    echo ✅ Frontend .env file already exists
)

REM Go back to root directory
cd ..

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Next steps:
echo 1. Update backend\.env with your Supabase credentials
echo 2. Start the backend: cd backend ^&^& npm start
echo 3. Start the frontend: cd frontend ^&^& npm run dev
echo.
echo 📱 Frontend will be available at: http://localhost:5173
echo 🔧 Backend API will be available at: http://localhost:3000
echo.
echo 📚 Check the README files for detailed documentation
echo.
pause