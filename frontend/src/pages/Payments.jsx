import React, { useState, useEffect } from 'react';
import { CreditCard, User, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

import { paymentService, studentService } from '../services';
import TableHeader from '../components/UI/TableHeader';
import DataTable from '../components/UI/DataTable';
import Modal from '../components/UI/Modal';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    mode: '',
    payment_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsResponse, studentsResponse] = await Promise.all([
        paymentService.getAll(),
        studentService.getAll()
      ]);
      setPayments(paymentsResponse.data || []);
      setStudents(studentsResponse.data || []);
    } catch (error) {
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id || !formData.amount) {
      toast.error('Student and amount are required');
      return;
    }

    try {
      await paymentService.create({
        student_id: formData.student_id,
        amount: parseFloat(formData.amount),
        mode: formData.mode || null,
        payment_date: formData.payment_date
      });
      toast.success('Payment recorded successfully');
      setShowAddModal(false);
      loadData();
    } catch (error) {
      toast.error('Failed to record payment: ' + error.message);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const columns = [
    {
      key: 'student_id',
      header: 'Student',
      render: (value) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-luxury-500" />
          {getStudentName(value)}
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => (
        <div className="flex items-center font-medium text-green-600">
          <DollarSign className="h-4 w-4 mr-1" />
          {parseFloat(value).toLocaleString()}
        </div>
      )
    },
    {
      key: 'mode',
      header: 'Payment Mode',
      render: (value) => (
        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
          {value || 'Not specified'}
        </span>
      )
    },
    {
      key: 'payment_date',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      <TableHeader
        title="Payments"
        description="Track and manage student fee payments"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => {
          setFormData({
            student_id: '',
            amount: '',
            mode: '',
            payment_date: new Date().toISOString().split('T')[0]
          });
          setShowAddModal(true);
        }}
        addButtonText="Record Payment"
      />

      <DataTable
        columns={columns}
        data={payments.filter(payment => 
          getStudentName(payment.student_id).toLowerCase().includes(searchTerm.toLowerCase())
        )}
        loading={loading}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Record New Payment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Student *</label>
            <select
              value={formData.student_id}
              onChange={(e) => setFormData({...formData, student_id: e.target.value})}
              className="form-input"
              required
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.class && `(${student.class})`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="form-label">Amount ($) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="form-label">Payment Mode</label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({...formData, mode: e.target.value})}
              className="form-input"
            >
              <option value="">Select payment mode</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Online">Online</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Payment Date</label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;