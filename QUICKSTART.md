# 🎓 Student Management System - Quick Start Guide

## 🚀 Complete Setup in 3 Steps

### Step 1: Run the Automated Setup
Choose your operating system:

**Windows:**
```batch
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh && ./setup.sh
```

### Step 2: Configure Your Database

1. **Set up Supabase:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Update backend/.env:**
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Create the database tables:**
   Run the SQL commands from the schema file in your Supabase SQL editor.

### Step 3: Start the Application

**Open 2 terminals:**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## 🌐 Access Your Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

## 📋 Database Schema

Create these tables in your Supabase project:

```sql
-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  phone VARCHAR(20),
  address TEXT,
  course VARCHAR(100),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  position VARCHAR(100),
  department VARCHAR(100),
  hire_date DATE DEFAULT CURRENT_DATE,
  salary DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  fee_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salaries table
CREATE TABLE salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  bonus DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Features

### ✅ Complete Student Management
- Add, edit, delete students
- Track enrollment and academic info
- Contact management

### ✅ Staff Management
- Employee profiles
- Position tracking
- Salary management

### ✅ Financial Management
- Payment tracking
- Expense categorization
- Salary processing
- Financial reports

### ✅ Professional Design
- Luxurious UI/UX
- Responsive layout
- Smooth animations
- Modern components

## 🔧 Troubleshooting

### Common Issues:

1. **Port conflicts:**
   - Backend default: 3000
   - Frontend default: 5173
   - Change ports in .env files if needed

2. **CORS errors:**
   - Ensure frontend URL is set in backend .env
   - Check backend CORS configuration

3. **Database connection:**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure tables are created

### PowerShell Execution Policy (Windows):
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your .env configuration
3. Ensure all dependencies are installed
4. Check that both servers are running

## 🎉 You're Ready!

Your Student Management System is now running with:
- **Modern React frontend** with professional design
- **Express.js backend** with REST API
- **Supabase database** integration
- **Full CRUD operations** for all entities
- **Financial reporting** with charts and analytics

**Happy managing! 🚀**