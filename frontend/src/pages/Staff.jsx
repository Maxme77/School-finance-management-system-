import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Phone, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

import { staffService } from '../services';
import TableHeader from '../components/UI/TableHeader';
import DataTable from '../components/UI/DataTable';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    salary: ''
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      setStaff(response.data || []);
    } catch (error) {
      toast.error('Failed to load staff: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Staff name is required');
      return;
    }

    try {
      const staffData = {
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        salary: formData.salary ? parseFloat(formData.salary) : null
      };

      if (showEditModal) {
        await staffService.update(selectedStaff.id, staffData);
        toast.success('Staff updated successfully');
        setShowEditModal(false);
      } else {
        await staffService.create(staffData);
        toast.success('Staff added successfully');
        setShowAddModal(false);
      }
      
      loadStaff();
    } catch (error) {
      toast.error('Operation failed: ' + error.message);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-luxury-900">{value}</div>
          <div className="text-sm text-luxury-500">{row.role || 'No role assigned'}</div>
        </div>
      )
    },
    {
      key: 'salary',
      header: 'Salary',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center text-sm font-medium text-luxury-900">
          <DollarSign className="h-4 w-4 mr-1" />
          {parseFloat(value).toLocaleString()}
        </div>
      ) : (
        <span className="text-luxury-400">Not set</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedStaff(row);
              setFormData({
                name: row.name || '',
                role: row.role || '',
                salary: row.salary || ''
              });
              setShowEditModal(true);
            }}
            className="p-2 hover:bg-gold-100 text-gold-600 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setSelectedStaff(row);
              setShowDeleteDialog(true);
            }}
            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredStaff = staff.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TableHeader
        title="Staff"
        description="Manage staff members and their information"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => {
          setFormData({ name: '', role: '', salary: '' });
          setShowAddModal(true);
        }}
        addButtonText="Add Staff"
      />

      <DataTable
        columns={columns}
        data={filteredStaff}
        loading={loading}
        emptyMessage="No staff members found."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={showEditModal ? "Edit Staff Member" : "Add New Staff Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Salary ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {showEditModal ? 'Update' : 'Add'} Staff
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          try {
            await staffService.delete(selectedStaff.id);
            toast.success('Staff deleted successfully');
            loadStaff();
          } catch (error) {
            toast.error('Failed to delete staff: ' + error.message);
          }
        }}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${selectedStaff?.name}?`}
        type="danger"
      />
    </div>
  );
};

export default Staff;