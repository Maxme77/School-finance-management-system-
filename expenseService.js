import { BaseAPI, config } from './config.js';

/**
 * Expense management service
 */
export class ExpenseService extends BaseAPI {
  /**
   * Add a new expense
   * @param {object} expense - Expense data
   * @param {string} expense.description - Expense description (optional)
   * @param {number} expense.amount - Expense amount (optional)
   * @param {string} expense.category - Expense category (optional)
   * @param {string} expense.expense_date - Expense date (optional)
   * @returns {Promise<object>} Created expense data
   */
  async addExpense(expense) {
    // Map to exact database schema - all fields are optional in the schema
    const dbExpense = {};
    
    // Add fields if provided
    if (expense.description) dbExpense.description = expense.description;
    if (expense.amount !== undefined) dbExpense.amount = expense.amount;
    if (expense.category) dbExpense.category = expense.category;
    if (expense.expense_date) dbExpense.expense_date = expense.expense_date;
    
    return await this.request(config.endpoints.expenses, {
      method: 'POST',
      body: JSON.stringify(dbExpense)
    });
  }

  /**
   * Get all expenses
   * @returns {Promise<Array>} List of expenses
   */
  async getExpenses() {
    return await this.request(config.endpoints.expenses);
  }

  /**
   * Get expenses by category
   * @param {string} category - Expense category
   * @returns {Promise<Array>} List of expenses in category
   */
  async getExpensesByCategory(category) {
    return await this.request(`${config.endpoints.expenses}?category=eq.${category}`);
  }

  /**
   * Get expenses within date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} List of expenses in date range
   */
  async getExpensesByDateRange(startDate, endDate) {
    return await this.request(`${config.endpoints.expenses}?expense_date=gte.${startDate}&expense_date=lte.${endDate}`);
  }
}