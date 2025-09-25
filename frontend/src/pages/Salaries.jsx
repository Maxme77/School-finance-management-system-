import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Modal } from '../components/UI/Modal';
import { DataTable } from '../components/UI/DataTable';
import { ConfirmDialog } from '../components/UI/ConfirmDialog';
import { api } from '../services';

export const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [deletingSalary, setDeletingSalary] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  
  const [formData, setFormData] = useState({
    staff_id: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    bonus: 0,
    deductions: 0,
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSalaries();
    fetchStaff();
  }, []);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await api.salaries.getAll();
      setSalaries(response.data || []);
    } catch (error) {
      console.error('Error fetching salaries:', error);
      showNotification('Failed to load salaries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await api.staff.getAll();
      setStaff(response.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.staff_id) newErrors.staff_id = 'Staff member is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.month || formData.month < 1 || formData.month > 12) newErrors.month = 'Valid month is required';
    if (!formData.year || formData.year < 2020) newErrors.year = 'Valid year is required';
    if (formData.bonus < 0) newErrors.bonus = 'Bonus cannot be negative';
    if (formData.deductions < 0) newErrors.deductions = 'Deductions cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const salaryData = {
        ...formData,
        amount: parseFloat(formData.amount),
        bonus: parseFloat(formData.bonus) || 0,
        deductions: parseFloat(formData.deductions) || 0,
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      };

      if (editingSalary) {
        await api.salaries.update(editingSalary.id, salaryData);
        showNotification('Salary updated successfully');
      } else {
        await api.salaries.create(salaryData);
        showNotification('Salary added successfully');
      }
      
      fetchSalaries();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving salary:', error);
      showNotification('Failed to save salary', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingSalary) return;
    
    try {
      await api.salaries.delete(deletingSalary.id);
      showNotification('Salary deleted successfully');
      fetchSalaries();
    } catch (error) {
      console.error('Error deleting salary:', error);
      showNotification('Failed to delete salary', 'error');
    } finally {
      setShowConfirmDialog(false);
      setDeletingSalary(null);
    }
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary);
    setFormData({
      staff_id: salary.staff_id,
      amount: salary.amount.toString(),
      month: salary.month,
      year: salary.year,
      bonus: salary.bonus || 0,
      deductions: salary.deductions || 0,
      notes: salary.notes || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSalary(null);
    setFormData({
      staff_id: '',
      amount: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      bonus: 0,
      deductions: 0,
      notes: ''
    });
    setErrors({});
  };

  const getStaffName = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : 'Unknown Staff';
  };

  const filteredSalaries = salaries.filter(salary => {
    const staffName = getStaffName(salary.staff_id).toLowerCase();
    const matchesSearch = staffName.includes(searchTerm.toLowerCase());
    const matchesMonth = !filterMonth || salary.month.toString() === filterMonth;
    const matchesYear = !filterYear || salary.year.toString() === filterYear;
    
    return matchesSearch && matchesMonth && matchesYear;
  });

  const months = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const columns = [
    {
      key: 'staff_name',
      header: 'Staff Member',
      render: (salary) => (
        <div className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-luxury-600" />
          <span className="font-medium">{getStaffName(salary.staff_id)}</span>
        </div>
      )
    },
    {
      key: 'month_year',
      header: 'Period',
      render: (salary) => (
        <span className="text-sm">
          {months.find(m => m.value === salary.month.toString())?.label || salary.month}/{salary.year}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Base Salary',
      render: (salary) => (
        <div className="flex items-center space-x-1">
          <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-700">${salary.amount.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'bonus',
      header: 'Bonus',
      render: (salary) => (
        <span className={`font-medium ${salary.bonus > 0 ? 'text-green-600' : 'text-gray-500'}`}>
          ${salary.bonus?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      key: 'deductions',
      header: 'Deductions',
      render: (salary) => (
        <span className={`font-medium ${salary.deductions > 0 ? 'text-red-600' : 'text-gray-500'}`}>
          ${salary.deductions?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      key: 'net_amount',
      header: 'Net Salary',
      render: (salary) => {
        const net = salary.amount + (salary.bonus || 0) - (salary.deductions || 0);
        return (
          <span className="font-bold text-luxury-700">${net.toLocaleString()}</span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (salary) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(salary)}
            className="p-2 text-luxury-600 hover:text-luxury-800 hover:bg-luxury-50 rounded-lg transition-colors"
            title="Edit salary"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setDeletingSalary(salary);
              setShowConfirmDialog(true);
            }}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete salary"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
          <p className="text-gray-600 mt-1">Manage staff salaries and compensation</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-luxury-600 text-white rounded-lg hover:bg-luxury-700 focus:outline-none focus:ring-2 focus:ring-luxury-500 focus:ring-offset-2 transition-colors shadow-sm"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Salary
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by staff name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMonth('');
                setFilterYear(new Date().getFullYear().toString());
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Salaries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          data={filteredSalaries}
          columns={columns}
          loading={loading}
          emptyMessage="No salaries found"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingSalary ? 'Edit Salary' : 'Add New Salary'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff Member *
              </label>
              <select
                value={formData.staff_id}
                onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500 ${
                  errors.staff_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a staff member</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name} - {member.position}
                  </option>
                ))}
              </select>
              {errors.staff_id && <p className="text-red-500 text-sm mt-1">{errors.staff_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Salary *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter base salary"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bonus
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.bonus}
                onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500 ${
                  errors.bonus ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter bonus amount"
              />
              {errors.bonus && <p className="text-red-500 text-sm mt-1">{errors.bonus}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deductions
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500 ${
                  errors.deductions ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter deduction amount"
              />
              {errors.deductions && <p className="text-red-500 text-sm mt-1">{errors.deductions}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month *
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500 ${
                  errors.month ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {months.slice(1).map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500 ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter year"
              />
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500"
                placeholder="Additional notes (optional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-luxury-600 text-white rounded-lg hover:bg-luxury-700 focus:outline-none focus:ring-2 focus:ring-luxury-500 transition-colors"
            >
              {editingSalary ? 'Update Salary' : 'Add Salary'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDelete}
        title="Delete Salary Record"
        message={`Are you sure you want to delete this salary record for ${deletingSalary ? getStaffName(deletingSalary.staff_id) : ''}? This action cannot be undone.`}
      />

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Salaries;