import api from './api.js';

export const studentService = {
  // Get all students
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  // Get student by ID
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Create new student
  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  // Update student
  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

export const staffService = {
  // Get all staff
  getAll: async () => {
    const response = await api.get('/staff');
    return response.data;
  },

  // Get staff by ID
  getById: async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  // Create new staff
  create: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },

  // Update staff
  update: async (id, staffData) => {
    const response = await api.put(`/staff/${id}`, staffData);
    return response.data;
  },

  // Delete staff
  delete: async (id) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },
};

export const paymentService = {
  // Get all payments
  getAll: async (studentId = null) => {
    const url = studentId ? `/payments?student_id=${studentId}` : '/payments';
    const response = await api.get(url);
    return response.data;
  },

  // Get payment by ID
  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Create new payment
  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Get student payments
  getByStudent: async (studentId) => {
    const response = await api.get(`/payments?student_id=${studentId}`);
    return response.data;
  },
};

export const expenseService = {
  // Get all expenses
  getAll: async (params = {}) => {
    let url = '/expenses';
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  // Get expense by ID
  getById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  create: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Get expenses by category
  getByCategory: async (category) => {
    const response = await api.get(`/expenses?category=${category}`);
    return response.data;
  },

  // Get expenses by date range
  getByDateRange: async (startDate, endDate) => {
    const response = await api.get(`/expenses?start_date=${startDate}&end_date=${endDate}`);
    return response.data;
  },
};

export const salaryService = {
  // Get all salaries
  getAll: async (params = {}) => {
    let url = '/salaries';
    const queryParams = new URLSearchParams();
    
    if (params.staff_id) queryParams.append('staff_id', params.staff_id);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  // Get salary by ID
  getById: async (id) => {
    const response = await api.get(`/salaries/${id}`);
    return response.data;
  },

  // Create new salary
  create: async (salaryData) => {
    const response = await api.post('/salaries', salaryData);
    return response.data;
  },

  // Get staff salaries
  getByStaff: async (staffId) => {
    const response = await api.get(`/salaries?staff_id=${staffId}`);
    return response.data;
  },
};

export const reportService = {
  // Get financial reports
  getReports: async (params = {}) => {
    let url = '/reports';
    const queryParams = new URLSearchParams();
    
    if (params.month) queryParams.append('month', params.month);
    if (params.year) queryParams.append('year', params.year);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  // Get monthly report
  getMonthlyReport: async (month, year) => {
    const response = await api.get(`/reports?month=${month}&year=${year}`);
    return response.data;
  },
};

// Health check
export const healthService = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Export the main api object for direct use
export const api = {
  students: studentService,
  staff: staffService,
  payments: paymentService,
  expenses: expenseService,
  salaries: salaryService,
  reports: reportService,
  health: healthService
};