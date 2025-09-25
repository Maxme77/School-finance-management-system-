import { BaseAPI, config } from './config.js';

/**
 * Student management service
 */
export class StudentService extends BaseAPI {
  /**
   * Fetch all students
   * @returns {Promise<Array>} List of students
   */
  async getStudents() {
    return await this.request(config.endpoints.students);
  }

  /**
   * Add a new student
   * @param {object} student - Student data
   * @param {string} student.name - Student name (required)
   * @param {string} student.class - Student class (optional)
   * @param {string} student.roll_no - Student roll number (optional)
   * @param {string} student.parent_contact - Parent contact (optional)
   * @param {number} student.fee_structure - Fee structure (optional)
   * @param {number} student.dues - Student dues (optional)
   * @returns {Promise<object>} Created student data
   */
  async addStudent(student) {
    // Map the API request to match exact database schema
    const dbStudent = {
      name: student.name // Required field
    };
    
    // Add optional fields based on exact schema
    if (student.class) dbStudent.class = student.class;
    if (student.roll_no) dbStudent.roll_no = student.roll_no;
    if (student.parent_contact) dbStudent.parent_contact = student.parent_contact;
    if (student.fee_structure !== undefined) dbStudent.fee_structure = student.fee_structure;
    if (student.dues !== undefined) dbStudent.dues = student.dues;
    
    return await this.request(config.endpoints.students, {
      method: 'POST',
      body: JSON.stringify(dbStudent)
    });
  }

  /**
   * Update student information
   * @param {string} studentId - Student ID (UUID)
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated student data
   */
  async updateStudent(studentId, updates) {
    return await this.request(`${config.endpoints.students}?id=eq.${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Get student by ID
   * @param {string} studentId - Student ID (UUID)
   * @returns {Promise<object>} Student data
   */
  async getStudentById(studentId) {
    const students = await this.request(`${config.endpoints.students}?id=eq.${studentId}`);
    return students.length > 0 ? students[0] : null;
  }
}