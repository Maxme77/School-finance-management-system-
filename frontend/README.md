# Student Management System - Frontend

A modern, luxurious frontend application for managing students, staff, payments, expenses, salaries, and financial reports. Built with React, Vite, and Tailwind CSS.

## Features

- **Student Management**: Add, edit, delete, and view student records
- **Staff Management**: Manage teaching and administrative staff
- **Payment Tracking**: Track student fee payments with linking
- **Expense Management**: Monitor school expenses by category
- **Salary Management**: Handle staff compensation and payroll
- **Financial Reports**: Comprehensive analytics with charts and metrics
- **Responsive Design**: Works on desktop and tablet devices
- **Professional UI**: Luxurious, clean interface with smooth animations

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Running Express.js backend (see backend setup instructions)

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   └── UI/
│   │       ├── ConfirmDialog.jsx
│   │       ├── DataTable.jsx
│   │       ├── Modal.jsx
│   │       └── TableHeader.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Staff.jsx
│   │   ├── Payments.jsx
│   │   ├── Expenses.jsx
│   │   ├── Salaries.jsx
│   │   └── Reports.jsx
│   ├── services/
│   │   └── index.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Integration

The frontend connects to your Express.js backend through the following endpoints:

### Students API
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Staff API
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create new staff member
- `GET /api/staff/:id` - Get staff member by ID
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

### Payments API
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/:id` - Get payment by ID
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Expenses API
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Salaries API
- `GET /api/salaries` - Get all salaries
- `POST /api/salaries` - Create new salary record
- `GET /api/salaries/:id` - Get salary by ID
- `PUT /api/salaries/:id` - Update salary
- `DELETE /api/salaries/:id` - Delete salary

### Reports API
- `GET /api/reports` - Get financial reports
- `GET /api/reports?month=X&year=Y` - Get reports for specific period

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Optional: Enable development features
VITE_DEV_MODE=true
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with luxury color palette:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        luxury: {
          50: '#faf7f0',
          100: '#f4ede0',
          200: '#e8dbc1',
          300: '#dbc89e',
          400: '#ccb474',
          500: '#c2a354',
          600: '#b49749',
          700: '#96813e',
          800: '#7a6a38',
          900: '#655730',
        },
      },
      // ... other configurations
    },
  },
  plugins: [],
};
```

## Deployment

### Build for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Set environment variables in Vercel dashboard

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend has proper CORS configuration
2. **API Connection Failed**: Check that backend is running on correct port
3. **Build Errors**: Clear node_modules and reinstall dependencies
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Development Tips

1. Use browser developer tools to debug API calls
2. Check console for error messages
3. Verify backend endpoints are responding correctly
4. Use React Developer Tools for component debugging

## Features Overview

### Dashboard
- Quick statistics and metrics
- Recent activity overview
- Quick action buttons

### Student Management
- Complete CRUD operations
- Search and filter capabilities
- Modal forms with validation
- Responsive data table

### Staff Management
- Staff member profiles
- Position and contact management
- Salary history tracking

### Payment Tracking
- Student payment records
- Fee type categorization
- Payment status tracking
- Receipt management

### Expense Management
- Expense categorization
- Date-based filtering
- Budget tracking
- Vendor management

### Salary Management
- Staff compensation tracking
- Bonus and deduction handling
- Monthly payroll management
- Period-based reporting

### Financial Reports
- Revenue and expense analytics
- Visual charts and graphs
- Key performance indicators
- Profit/loss statements
- Monthly/yearly comparisons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a Student Management System solution.