import { BaseAPI, config } from './config.js';

/**
 * Staff management service
 */
export class StaffService extends BaseAPI {
  /**
   * Fetch all staff members
   * @returns {Promise<Array>} List of staff members
   */
  async getStaff() {
    return await this.request('/rest/v1/staff');
  }

  /**
   * Add a new staff member
   * @param {object} staff - Staff data
   * @param {string} staff.name - Staff name (required)
   * @param {string} staff.role - Staff role (optional)
   * @param {number} staff.salary - Staff salary (optional)
   * @returns {Promise<object>} Created staff data
   */
  async addStaff(staff) {
    // Map to exact database schema
    const dbStaff = {
      name: staff.name // Required field
    };
    
    // Add optional fields
    if (staff.role) dbStaff.role = staff.role;
    if (staff.salary !== undefined) dbStaff.salary = staff.salary;
    
    return await this.request('/rest/v1/staff', {
      method: 'POST',
      body: JSON.stringify(dbStaff)
    });
  }

  /**
   * Update staff information
   * @param {string} staffId - Staff ID (UUID)
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated staff data
   */
  async updateStaff(staffId, updates) {
    return await this.request(`/rest/v1/staff?id=eq.${staffId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Get staff member by ID
   * @param {string} staffId - Staff ID (UUID)
   * @returns {Promise<object>} Staff data
   */
  async getStaffById(staffId) {
    const staff = await this.request(`/rest/v1/staff?id=eq.${staffId}`);
    return staff.length > 0 ? staff[0] : null;
  }
}