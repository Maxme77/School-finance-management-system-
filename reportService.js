import { PaymentService } from './paymentService.js';
import { ExpenseService } from './expenseService.js';
import { SalaryService } from './salaryService.js';

/**
 * Reporting service for financial data
 */
export class ReportService {
  constructor() {
    this.paymentService = new PaymentService();
    this.expenseService = new ExpenseService();
    this.salaryService = new SalaryService();
  }

  /**
   * Get comprehensive financial reports
   * @returns {Promise<object>} Financial report data
   */
  async getReports() {
    try {
      const [feesCollected, expenses, salaries] = await Promise.all([
        this.paymentService.getPayments(),
        this.expenseService.getExpenses(),
        this.salaryService.getSalaries()
      ]);

      return {
        feesCollected,
        expenses,
        salaries,
        summary: this.calculateSummary(feesCollected, expenses, salaries)
      };
    } catch (error) {
      console.error('Failed to generate reports:', error);
      throw error;
    }
  }

  /**
   * Calculate financial summary
   * @param {Array} payments - Payment records
   * @param {Array} expenses - Expense records
   * @param {Array} salaries - Salary records
   * @returns {object} Financial summary
   */
  calculateSummary(payments, expenses, salaries) {
    const totalFeesCollected = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const totalSalaries = salaries.reduce((sum, salary) => sum + (salary.amount || 0), 0);
    const totalOutgoing = totalExpenses + totalSalaries;
    const netIncome = totalFeesCollected - totalOutgoing;

    return {
      totalFeesCollected,
      totalExpenses,
      totalSalaries,
      totalOutgoing,
      netIncome,
      profitMargin: totalFeesCollected > 0 ? (netIncome / totalFeesCollected) * 100 : 0
    };
  }

  /**
   * Get monthly report
   * @param {string} month - Month (1-12)
   * @param {string} year - Year (YYYY)
   * @returns {Promise<object>} Monthly report data
   */
  async getMonthlyReport(month, year) {
    try {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = `${year}-${month.padStart(2, '0')}-31`;

      const [payments, expenses, salaries] = await Promise.all([
        this.paymentService.getPayments(),
        this.expenseService.getExpensesByDateRange(startDate, endDate),
        this.salaryService.getSalariesByPeriod(month, year)
      ]);

      // Filter payments by date (assuming payments have a date field)
      const monthlyPayments = payments.filter(payment => {
        if (!payment.date) return false;
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() + 1 === parseInt(month) && 
               paymentDate.getFullYear() === parseInt(year);
      });

      return {
        month,
        year,
        payments: monthlyPayments,
        expenses,
        salaries,
        summary: this.calculateSummary(monthlyPayments, expenses, salaries)
      };
    } catch (error) {
      console.error('Failed to generate monthly report:', error);
      throw error;
    }
  }
}