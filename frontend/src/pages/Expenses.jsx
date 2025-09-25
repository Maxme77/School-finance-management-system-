import React, { useState, useEffect } from 'react';
import { Receipt, Tag, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

import { expenseService } from '../services';
import TableHeader from '../components/UI/TableHeader';
import DataTable from '../components/UI/DataTable';
import Modal from '../components/UI/Modal';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    expense_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAll();
      setExpenses(response.data || []);
    } catch (error) {
      toast.error('Failed to load expenses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const expenseData = {};
      if (formData.description.trim()) expenseData.description = formData.description.trim();
      if (formData.amount) expenseData.amount = parseFloat(formData.amount);
      if (formData.category.trim()) expenseData.category = formData.category.trim();
      if (formData.expense_date) expenseData.expense_date = formData.expense_date;

      await expenseService.create(expenseData);
      toast.success('Expense added successfully');
      setShowAddModal(false);
      loadExpenses();
    } catch (error) {
      toast.error('Failed to add expense: ' + error.message);
    }
  };

  const columns = [
    {
      key: 'description',
      header: 'Description',
      render: (value) => (
        <div className="flex items-center">
          <Receipt className="h-4 w-4 mr-2 text-luxury-500" />
          {value || 'No description'}
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (value) => (
        <span className="px-2 py-1 bg-gold-100 text-gold-800 text-sm rounded-full">
          {value || 'Uncategorized'}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => value ? (
        <div className="flex items-center font-medium text-red-600">
          <DollarSign className="h-4 w-4 mr-1" />
          {parseFloat(value).toLocaleString()}
        </div>
      ) : (
        <span className="text-luxury-400">Not specified</span>
      )
    },
    {
      key: 'expense_date',
      header: 'Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'No date'
    }
  ];

  return (
    <div className="space-y-6">
      <TableHeader
        title="Expenses"
        description="Track and manage institutional expenses"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => {
          setFormData({
            description: '',
            amount: '',
            category: '',
            expense_date: new Date().toISOString().split('T')[0]
          });
          setShowAddModal(true);
        }}
        addButtonText="Add Expense"
      />

      <DataTable
        columns={columns}
        data={expenses.filter(expense => 
          expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        loading={loading}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Expense"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="form-input"
              placeholder="Enter expense description"
            />
          </div>
          
          <div>
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="form-input"
              placeholder="Enter amount"
            />
          </div>
          
          <div>
            <label className="form-label">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="form-input"
            >
              <option value="">Select category</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Utilities">Utilities</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Equipment">Equipment</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Expense Date</label>
            <input
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
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
              Add Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;