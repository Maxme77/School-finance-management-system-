# Student Management System

A complete, modern student management system with a luxurious professional interface. Built with Express.js backend and React frontend, integrated with Supabase database.

![Student Management System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![Express.js](https://img.shields.io/badge/Express.js-4.18+-red)

## 🌟 Features

### 👥 **Student Management**
- Complete student profiles with contact information
- Course enrollment tracking
- Academic record management
- Search and filter capabilities

### 👨‍🏫 **Staff Management**
- Employee profiles and contact details
- Position and department tracking
- Salary history and compensation
- Performance management

### 💰 **Financial Management**
- Student fee payment tracking
- Expense management by category
- Staff salary and payroll management
- Comprehensive financial reporting

### 📊 **Reports & Analytics**
- Revenue and expense analytics
- Profit/loss statements
- Visual charts and graphs
- Monthly/yearly financial reports
- Key performance indicators

### 🎨 **User Experience**
- Luxurious, professional design
- Responsive layout (desktop/tablet)
- Smooth animations and transitions
- Intuitive navigation and workflow
- Real-time data updates

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```batch
# Run the automated setup script
setup.bat
```

**Linux/Mac:**
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd student-management-system
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 📋 Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Supabase** account and project
- Modern web browser

## 🗄️ Database Schema

The system uses Supabase with the following tables:

### Students Table
```sql
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
```

### Staff Table
```sql
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
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  fee_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Salaries Table
```sql
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

## 🏗️ Architecture

```
📁 student-management-system/
├── 📁 backend/                 # Express.js API Server
│   ├── 📁 routes/             # API route handlers
│   ├── 📁 services/           # Business logic layer
│   ├── 📁 middleware/         # Custom middleware
│   ├── 📁 config/             # Configuration files
│   └── 📄 server.js           # Main server file
├── 📁 frontend/               # React Application
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 services/       # API service layer
│   │   └── 📄 App.jsx         # Main app component
│   └── 📄 package.json
├── 📄 setup.bat              # Windows setup script
├── 📄 setup.sh               # Linux/Mac setup script
└── 📄 README.md
```

## 🔧 Configuration

### Backend Configuration (.env)
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration (.env)
```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Development Mode
VITE_DEV_MODE=true
```

## 🛠️ API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Staff
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create new staff member
- `GET /api/staff/:id` - Get staff member by ID
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/:id` - Get payment by ID
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Salaries
- `GET /api/salaries` - Get all salaries
- `POST /api/salaries` - Create new salary record
- `GET /api/salaries/:id` - Get salary by ID
- `PUT /api/salaries/:id` - Update salary
- `DELETE /api/salaries/:id` - Delete salary

### Reports
- `GET /api/reports` - Get financial reports
- `GET /api/reports?month=X&year=Y` - Get reports for specific period

## 🎨 Design System

The application features a luxury design system with:

- **Color Palette**: Custom luxury gold/brown theme
- **Typography**: Modern, professional fonts
- **Components**: Consistent UI components
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 🔄 Development Workflow

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Access Application**: http://localhost:5173
4. **API Documentation**: http://localhost:3000/api

## 📦 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables
2. Deploy from repository
3. Update CORS settings

### Frontend Deployment (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Configure environment variables

## 🔍 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Test all API endpoints
npm run test:integration
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend URL in backend .env

2. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Component Guide](./frontend/README.md)
- [Database Schema](./docs/schema.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🚀 What's Next

- [ ] Mobile app version
- [ ] Advanced reporting features
- [ ] Integration with external systems
- [ ] Multi-language support
- [ ] Role-based access control

---

**Built with ❤️ for educational institutions worldwide**"# School-finance-management-system-" 
