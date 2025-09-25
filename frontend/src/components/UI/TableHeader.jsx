import React from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';

const TableHeader = ({
  title,
  description,
  searchValue,
  onSearchChange,
  onAddClick,
  addButtonText = 'Add New',
  showAddButton = true,
  showSearch = true,
  showFilter = false,
  onFilterClick,
  showExport = false,
  onExportClick,
  children
}) => {
  return (
    <div className="card mb-6">
      <div className="card-header">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Title and description */}
          <div>
            <h2 className="text-xl font-semibold text-luxury-900">{title}</h2>
            {description && (
              <p className="text-sm text-luxury-600 mt-1">{description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="form-input pl-10 w-full sm:w-64"
                />
              </div>
            )}

            {/* Filter */}
            {showFilter && (
              <button
                onClick={onFilterClick}
                className="btn-secondary flex items-center justify-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            )}

            {/* Export */}
            {showExport && (
              <button
                onClick={onExportClick}
                className="btn-secondary flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            )}

            {/* Custom children */}
            {children}

            {/* Add button */}
            {showAddButton && (
              <button
                onClick={onAddClick}
                className="btn-primary flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;