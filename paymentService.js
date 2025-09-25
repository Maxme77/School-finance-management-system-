import { BaseAPI, config } from './config.js';
import { StudentService } from './studentService.js';

/**
 * Payment management service
 */
export class PaymentService extends BaseAPI {
  constructor() {
    super();
    this.studentService = new StudentService();
  }

  /**
   * Record a fee payment
   * @param {object} payment - Payment data
   * @param {string} payment.student_id - Student ID (UUID, required)
   * @param {number} payment.amount - Payment amount (required)
   * @param {string} payment.mode - Payment mode (optional)
   * @param {string} payment.payment_date - Payment date (optional, defaults to today)
   * @returns {Promise<object>} Payment record
   */
  async addPayment(payment) {
    try {
      // Record the payment with exact database schema
      const dbPayment = {
        student_id: payment.student_id, // UUID required
        amount: payment.amount // Required
      };
      
      // Add optional fields based on exact schema
      if (payment.mode) dbPayment.mode = payment.mode;
      if (payment.payment_date) dbPayment.payment_date = payment.payment_date;
      
      const paymentResult = await this.request(config.endpoints.payments, {
        method: 'POST',
        body: JSON.stringify(dbPayment)
      });

      // Try to update student dues (if dues column exists and is updatable)
      try {
        const student = await this.studentService.getStudentById(payment.student_id);
        if (student && student.dues !== undefined) {
          const currentDues = parseFloat(student.dues) || 0;
          const newDues = Math.max(0, currentDues - payment.amount);
          
          await this.studentService.updateStudent(payment.student_id, {
            dues: newDues
          });
        }
      } catch (duesUpdateError) {
        // If dues update fails, log it but don't fail the payment
        console.warn('Failed to update student dues:', duesUpdateError.message);
      }

      return paymentResult;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  /**
   * Get all payments
   * @returns {Promise<Array>} List of payments
   */
  async getPayments() {
    return await this.request(config.endpoints.payments);
  }

  /**
   * Get payments for a specific student
   * @param {number} studentId - Student ID
   * @returns {Promise<Array>} List of student payments
   */
  async getStudentPayments(studentId) {
    return await this.request(`${config.endpoints.payments}?student_id=eq.${studentId}`);
  }
}