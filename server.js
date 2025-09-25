import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  StudentService,
  PaymentService,
  ExpenseService,
  SalaryService,
  StaffService,
  ReportService
} from './index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Initialize services
const studentService = new StudentService();
const paymentService = new PaymentService();
const expenseService = new ExpenseService();
const salaryService = new SalaryService();
const staffService = new StaffService();
const reportService = new ReportService();

// Error handler middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateRequired = (fields) => (req, res, next) => {
  const missingFields = fields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Student Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== STUDENT ROUTES ====================

// GET /students - Get all students
app.get('/students', asyncHandler(async (req, res) => {
  const students = await studentService.getStudents();
  res.json({
    success: true,
    data: students,
    count: students.length
  });
}));

// POST /students - Create a new student
app.post('/students', 
  validateRequired(['name']), // Only name is required in actual DB schema
  asyncHandler(async (req, res) => {
    const studentData = {
      name: req.body.name, // Required
      class: req.body.class || null,
      roll_no: req.body.roll_no || null,
      parent_contact: req.body.parent_contact || null,
      fee_structure: req.body.fee_structure || null,
      dues: req.body.dues || 0 // Default dues to 0 if not provided
    };
    
    const student = await studentService.addStudent(studentData);
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  })
);

// GET /students/:id - Get student by ID
app.get('/students/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid student ID format. Expected UUID.'
    });
  }
  
  const student = await studentService.getStudentById(id);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  res.json({
    success: true,
    data: student
  });
}));

// PUT /students/:id - Update student
app.put('/students/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid student ID format. Expected UUID.'
    });
  }
  
  // Check if student exists
  const existingStudent = await studentService.getStudentById(id);
  if (!existingStudent) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  const updatedStudent = await studentService.updateStudent(id, req.body);
  res.json({
    success: true,
    message: 'Student updated successfully',
    data: updatedStudent
  });
}));

// DELETE /students/:id - Delete student (soft delete by setting active: false)
app.delete('/students/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid student ID format. Expected UUID.'
    });
  }
  
  // Check if student exists
  const existingStudent = await studentService.getStudentById(id);
  if (!existingStudent) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  // Soft delete by updating active status (if column exists)
  await studentService.updateStudent(id, { active: false });
  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
}));

// ==================== PAYMENT ROUTES ====================

// GET /payments - Get all payments
app.get('/payments', asyncHandler(async (req, res) => {
  const { student_id } = req.query;
  
  let payments;
  if (student_id) {
    payments = await paymentService.getStudentPayments(parseInt(student_id));
  } else {
    payments = await paymentService.getPayments();
  }
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
}));

// POST /payments - Record a new payment
app.post('/payments',
  validateRequired(['student_id', 'amount']),
  asyncHandler(async (req, res) => {
    // Validate that student_id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.body.student_id)) {
      return res.status(400).json({
        success: false,
        error: 'student_id must be a valid UUID format'
      });
    }
    
    const paymentData = {
      student_id: req.body.student_id, // Must be UUID
      amount: req.body.amount // Required
    };
    
    // Add optional fields if they exist in database
    if (req.body.description) paymentData.description = req.body.description;
    if (req.body.date) paymentData.date = req.body.date;
    if (req.body.payment_date) paymentData.payment_date = req.body.payment_date;
    
    const payment = await paymentService.addPayment(paymentData);
    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  })
);

// GET /payments/:id - Get payment by ID
app.get('/payments/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payments = await paymentService.getPayments();
  const payment = payments.find(p => p.id === parseInt(id));
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found'
    });
  }
  
  res.json({
    success: true,
    data: payment
  });
}));

// ==================== EXPENSE ROUTES ====================

// GET /expenses - Get all expenses
app.get('/expenses', asyncHandler(async (req, res) => {
  const { category, start_date, end_date } = req.query;
  
  let expenses;
  if (category) {
    expenses = await expenseService.getExpensesByCategory(category);
  } else if (start_date && end_date) {
    expenses = await expenseService.getExpensesByDateRange(start_date, end_date);
  } else {
    expenses = await expenseService.getExpenses();
  }
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
}));

// POST /expenses - Add a new expense
app.post('/expenses',
  // No required fields based on exact schema - all are optional
  asyncHandler(async (req, res) => {
    const expenseData = {};
    
    // Add fields based on exact DB schema - all optional
    if (req.body.description) expenseData.description = req.body.description;
    if (req.body.amount !== undefined) expenseData.amount = req.body.amount;
    if (req.body.category) expenseData.category = req.body.category;
    if (req.body.expense_date) expenseData.expense_date = req.body.expense_date;
    
    const expense = await expenseService.addExpense(expenseData);
    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    });
  })
);

// GET /expenses/:id - Get expense by ID
app.get('/expenses/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expenses = await expenseService.getExpenses();
  const expense = expenses.find(e => e.id === parseInt(id));
  
  if (!expense) {
    return res.status(404).json({
      success: false,
      error: 'Expense not found'
    });
  }
  
  res.json({
    success: true,
    data: expense
  });
}));

// ==================== STAFF ROUTES ====================

// GET /staff - Get all staff members
app.get('/staff', asyncHandler(async (req, res) => {
  const staff = await staffService.getStaff();
  res.json({
    success: true,
    data: staff,
    count: staff.length
  });
}));

// POST /staff - Create a new staff member
app.post('/staff',
  validateRequired(['name']), // Only name is required
  asyncHandler(async (req, res) => {
    const staffData = {
      name: req.body.name, // Required
      role: req.body.role || null,
      salary: req.body.salary || null
    };
    
    const staff = await staffService.addStaff(staffData);
    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: staff
    });
  })
);

// GET /staff/:id - Get staff member by ID
app.get('/staff/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid staff ID format. Expected UUID.'
    });
  }
  
  const staff = await staffService.getStaffById(id);
  
  if (!staff) {
    return res.status(404).json({
      success: false,
      error: 'Staff member not found'
    });
  }
  
  res.json({
    success: true,
    data: staff
  });
}));

// PUT /staff/:id - Update staff member
app.put('/staff/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid staff ID format. Expected UUID.'
    });
  }
  
  // Check if staff member exists
  const existingStaff = await staffService.getStaffById(id);
  if (!existingStaff) {
    return res.status(404).json({
      success: false,
      error: 'Staff member not found'
    });
  }
  
  const updatedStaff = await staffService.updateStaff(id, req.body);
  res.json({
    success: true,
    message: 'Staff member updated successfully',
    data: updatedStaff
  });
}));

// ==================== SALARY ROUTES ====================

// GET /salaries - Get all salaries
app.get('/salaries', asyncHandler(async (req, res) => {
  const { employee_name, month, year } = req.query;
  
  let salaries;
  if (employee_name) {
    salaries = await salaryService.getEmployeeSalaries(employee_name);
  } else if (month && year) {
    salaries = await salaryService.getSalariesByPeriod(month, year);
  } else {
    salaries = await salaryService.getSalaries();
  }
  
  res.json({
    success: true,
    data: salaries,
    count: salaries.length
  });
}));

// POST /salaries - Add a new salary record
app.post('/salaries',
  validateRequired(['staff_id', 'amount']), // Updated to match exact schema
  asyncHandler(async (req, res) => {
    // Validate that staff_id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.body.staff_id)) {
      return res.status(400).json({
        success: false,
        error: 'staff_id must be a valid UUID format'
      });
    }
    
    const salaryData = {
      staff_id: req.body.staff_id, // Required UUID
      amount: req.body.amount // Required
    };
    
    // Add optional fields
    if (req.body.paid_date) salaryData.paid_date = req.body.paid_date;
    
    const salary = await salaryService.addSalary(salaryData);
    res.status(201).json({
      success: true,
      message: 'Salary record added successfully', 
      data: salary
    });
  })
);

// GET /salaries/:id - Get salary by ID
app.get('/salaries/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const salaries = await salaryService.getSalaries();
  const salary = salaries.find(s => s.id === parseInt(id));
  
  if (!salary) {
    return res.status(404).json({
      success: false,
      error: 'Salary record not found'
    });
  }
  
  res.json({
    success: true,
    data: salary
  });
}));

// ==================== REPORT ROUTES ====================

// GET /reports - Get comprehensive financial reports
app.get('/reports', asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  
  let reports;
  if (month && year) {
    reports = await reportService.getMonthlyReport(month, year);
  } else {
    reports = await reportService.getReports();
  }
  
  res.json({
    success: true,
    data: reports
  });
}));

// ==================== ERROR HANDLING ====================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Student Management System API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}`);
  console.log('\n📖 Available Endpoints:');
  console.log('  GET    /health');
  console.log('  GET    /students');
  console.log('  POST   /students');
  console.log('  GET    /students/:id');
  console.log('  PUT    /students/:id');
  console.log('  DELETE /students/:id');
  console.log('  GET    /staff');
  console.log('  POST   /staff');
  console.log('  GET    /staff/:id');
  console.log('  PUT    /staff/:id');
  console.log('  GET    /payments');
  console.log('  POST   /payments');
  console.log('  GET    /payments/:id');
  console.log('  GET    /expenses');
  console.log('  POST   /expenses');
  console.log('  GET    /expenses/:id');
  console.log('  GET    /salaries');
  console.log('  POST   /salaries');
  console.log('  GET    /salaries/:id');
  console.log('  GET    /reports');
});

export default app;