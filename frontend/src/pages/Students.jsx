import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Phone, Mail, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

import { studentService } from '../services';
import TableHeader from '../components/UI/TableHeader';
import DataTable from '../components/UI/DataTable';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    roll_no: '',
    parent_contact: '',
    fee_structure: '',
    dues: ''
  });

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAll();
      setStudents(response.data || []);
    } catch (error) {
      toast.error('Failed to load students: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      class: '',
      roll_no: '',
      parent_contact: '',
      fee_structure: '',
      dues: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || '',
      class: student.class || '',
      roll_no: student.roll_no || '',
      parent_contact: student.parent_contact || '',
      fee_structure: student.fee_structure || '',
      dues: student.dues || ''
    });
    setShowEditModal(true);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Student name is required');
      return;
    }

    try {
      const studentData = {
        name: formData.name.trim(),
        class: formData.class.trim() || null,
        roll_no: formData.roll_no.trim() || null,
        parent_contact: formData.parent_contact.trim() || null,
        fee_structure: formData.fee_structure ? parseFloat(formData.fee_structure) : null,
        dues: formData.dues ? parseFloat(formData.dues) : 0
      };

      if (showEditModal) {
        await studentService.update(selectedStudent.id, studentData);
        toast.success('Student updated successfully');
        setShowEditModal(false);
      } else {
        await studentService.create(studentData);
        toast.success('Student added successfully');
        setShowAddModal(false);
      }
      
      loadStudents();
    } catch (error) {
      toast.error('Operation failed: ' + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await studentService.delete(selectedStudent.id);
      toast.success('Student deleted successfully');
      loadStudents();
    } catch (error) {
      toast.error('Failed to delete student: ' + error.message);
    }
  };

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Filter and sort students
  const filteredStudents = students
    .filter(student => 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      const modifier = sortDirection === 'asc' ? 1 : -1;
      return aVal.toString().localeCompare(bVal.toString()) * modifier;
    });

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-luxury-900">{value}</div>
          <div className="text-sm text-luxury-500">{row.roll_no || 'No Roll No.'}</div>
        </div>
      )
    },
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
          {value || 'Not Assigned'}
        </span>
      )
    },
    {
      key: 'parent_contact',
      header: 'Contact',
      render: (value) => value ? (
        <div className="flex items-center text-sm text-luxury-600">
          <Phone className="h-4 w-4 mr-1" />
          {value}
        </div>
      ) : (
        <span className="text-luxury-400">No contact</span>
      )
    },
    {
      key: 'fee_structure',
      header: 'Fee Structure',
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
      key: 'dues',
      header: 'Outstanding Dues',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-sm rounded-full ${
          parseFloat(value) > 0 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          ${parseFloat(value || 0).toLocaleString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
            className="p-2 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="p-2 hover:bg-gold-100 text-gold-600 rounded-lg transition-colors"
            title="Edit Student"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Delete Student"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <TableHeader
        title="Students"
        description="Manage student records, enrollment, and academic information"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAdd}
        addButtonText="Add Student"
      />

      {/* Students Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        loading={loading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="No students found. Add your first student to get started."
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input"
                placeholder="Enter student name"
                required
              />
            </div>
            <div>
              <label className="form-label">Class</label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="form-input"
                placeholder="Enter class"
              />
            </div>
            <div>
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                value={formData.roll_no}
                onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                className="form-input"
                placeholder="Enter roll number"
              />
            </div>
            <div>
              <label className="form-label">Parent Contact</label>
              <input
                type="tel"
                value={formData.parent_contact}
                onChange={(e) => setFormData({...formData, parent_contact: e.target.value})}
                className="form-input"
                placeholder="Enter parent contact"
              />
            </div>
            <div>
              <label className="form-label">Fee Structure ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.fee_structure}
                onChange={(e) => setFormData({...formData, fee_structure: e.target.value})}
                className="form-input"
                placeholder="Enter fee amount"
              />
            </div>
            <div>
              <label className="form-label">Outstanding Dues ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.dues}
                onChange={(e) => setFormData({...formData, dues: e.target.value})}
                className="form-input"
                placeholder="Enter outstanding dues"
              />
            </div>
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
              Add Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Student"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input"
                placeholder="Enter student name"
                required
              />
            </div>
            <div>
              <label className="form-label">Class</label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="form-input"
                placeholder="Enter class"
              />
            </div>
            <div>
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                value={formData.roll_no}
                onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                className="form-input"
                placeholder="Enter roll number"
              />
            </div>
            <div>
              <label className="form-label">Parent Contact</label>
              <input
                type="tel"
                value={formData.parent_contact}
                onChange={(e) => setFormData({...formData, parent_contact: e.target.value})}
                className="form-input"
                placeholder="Enter parent contact"
              />
            </div>
            <div>
              <label className="form-label">Fee Structure ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.fee_structure}
                onChange={(e) => setFormData({...formData, fee_structure: e.target.value})}
                className="form-input"
                placeholder="Enter fee amount"
              />
            </div>
            <div>
              <label className="form-label">Outstanding Dues ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.dues}
                onChange={(e) => setFormData({...formData, dues: e.target.value})}
                className="form-input"
                placeholder="Enter outstanding dues"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Student
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-luxury-600">Name</label>
                <p className="text-lg font-semibold text-luxury-900">{selectedStudent.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-luxury-600">Class</label>
                <p className="text-lg text-luxury-900">{selectedStudent.class || 'Not assigned'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-luxury-600">Roll Number</label>
                <p className="text-lg text-luxury-900">{selectedStudent.roll_no || 'Not assigned'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-luxury-600">Parent Contact</label>
                <p className="text-lg text-luxury-900">{selectedStudent.parent_contact || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-luxury-600">Fee Structure</label>
                <p className="text-lg text-luxury-900">
                  {selectedStudent.fee_structure ? `$${parseFloat(selectedStudent.fee_structure).toLocaleString()}` : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-luxury-600">Outstanding Dues</label>
                <p className={`text-lg font-semibold ${
                  parseFloat(selectedStudent.dues) > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${parseFloat(selectedStudent.dues || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-luxury-600">Created At</label>
                <p className="text-lg text-luxury-900">
                  {new Date(selectedStudent.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Students;