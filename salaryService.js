import { BaseAPI, config } from './config.js';

/**
 * Salary management service
 */
export class SalaryService extends BaseAPI {
  /**
   * Add a new salary record
   * @param {object} salary - Salary data
   * @param {string} salary.staff_id - Staff ID (UUID, required)
   * @param {number} salary.amount - Salary amount (required)
   * @param {string} salary.paid_date - Salary paid date (optional, defaults to today)
   * @returns {Promise<object>} Created salary data
   */
  async addSalary(salary) {
    // Map to exact database schema
    const dbSalary = {
      staff_id: salary.staff_id, // Required UUID
      amount: salary.amount // Required
    };
    
    // Add optional fields
    if (salary.paid_date) dbSalary.paid_date = salary.paid_date;
    
    return await this.request(config.endpoints.salaries, {
      method: 'POST',
      body: JSON.stringify(dbSalary)
    });
  }

  /**
   * Get all salary records
   * @returns {Promise<Array>} List of salary records
   */
  async getSalaries() {
    return await this.request(config.endpoints.salaries);
  }

  /**
   * Get salary records for a specific staff member
   * @param {string} staffId - Staff ID (UUID)
   * @returns {Promise<Array>} List of staff salary records
   */
  async getStaffSalaries(staffId) {
    return await this.request(`${config.endpoints.salaries}?staff_id=eq.${staffId}`);
  }

  /**
   * Get salary records for a specific date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} List of salary records for the period
   */
  async getSalariesByDateRange(startDate, endDate) {
    return await this.request(`${config.endpoints.salaries}?paid_date=gte.${startDate}&paid_date=lte.${endDate}`);
  }
}