import { StudentService } from './studentService.js';
import { PaymentService } from './paymentService.js';
import { ExpenseService } from './expenseService.js';
import { SalaryService } from './salaryService.js';
import { StaffService } from './staffService.js';
import { ReportService } from './reportService.js';

/**
 * Main application demonstrating the student management system
 */
async function main() {
  try {
    console.log('🎓 Student Management System Demo\n');

    // Initialize services
    const studentService = new StudentService();
    const paymentService = new PaymentService();
    const expenseService = new ExpenseService();
    const salaryService = new SalaryService();
    const staffService = new StaffService();
    const reportService = new ReportService();

    // Example: Get all students
    console.log('📋 Fetching all students...');
    const students = await studentService.getStudents();
    console.log(`Found ${students.length} students\n`);

    // Example: Add a new student (uncomment to test)
    /*
    console.log('➕ Adding a new student...');
    const newStudent = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      dues: 1000
    };
    const addedStudent = await studentService.addStudent(newStudent);
    console.log('Student added:', addedStudent);
    */

    // Example: Record a payment (uncomment to test)
    /*
    console.log('💰 Recording a payment...');
    const payment = {
      student_id: 1, // Replace with actual student ID
      amount: 500,
      date: new Date().toISOString().split('T')[0],
      description: 'Monthly fee payment'
    };
    const paymentRecord = await paymentService.addPayment(payment);
    console.log('Payment recorded:', paymentRecord);
    */

    // Example: Add an expense (uncomment to test)
    /*
    console.log('💸 Adding an expense...');
    const expense = {
      description: 'Office supplies',
      amount: 200,
      date: new Date().toISOString().split('T')[0],
      category: 'supplies'
    };
    const expenseRecord = await expenseService.addExpense(expense);
    console.log('Expense added:', expenseRecord);
    */

    // Example: Add salary record (uncomment to test)
    /*
    console.log('💵 Adding salary record...');
    const salary = {
      employee_name: 'Teacher Jane',
      amount: 3000,
      month: '12',
      year: '2024'
    };
    const salaryRecord = await salaryService.addSalary(salary);
    console.log('Salary recorded:', salaryRecord);
    */

    // Generate reports
    console.log('📊 Generating financial reports...');
    const reports = await reportService.getReports();
    
    console.log('\n=== FINANCIAL SUMMARY ===');
    console.log(`Total Fees Collected: $${reports.summary.totalFeesCollected.toFixed(2)}`);
    console.log(`Total Expenses: $${reports.summary.totalExpenses.toFixed(2)}`);
    console.log(`Total Salaries: $${reports.summary.totalSalaries.toFixed(2)}`);
    console.log(`Net Income: $${reports.summary.netIncome.toFixed(2)}`);
    console.log(`Profit Margin: ${reports.summary.profitMargin.toFixed(2)}%`);

    console.log('\n✅ Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error in demo:', error.message);
  }
}

// Export services for use in other modules
export {
  StudentService,
  PaymentService,
  ExpenseService,
  SalaryService,
  StaffService,
  ReportService
};

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}