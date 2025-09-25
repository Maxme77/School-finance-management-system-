import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading = false,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  emptyMessage = 'No data available',
  className = ''
}) => {
  const handleSort = (columnKey) => {
    if (onSort) {
      const direction = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(columnKey, direction);
    }
  };

  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return null;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="animate-pulse">
            <div className="h-4 bg-luxury-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-luxury-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${className}`}>
      <div className="overflow-x-auto">
        <table className="table-luxury">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.sortable ? 'cursor-pointer hover:bg-luxury-100 select-none' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="text-luxury-500">
                    <p className="text-lg font-medium mb-2">No Data Found</p>
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={onRowClick ? 'cursor-pointer' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? 
                        column.render(row[column.key], row) : 
                        row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
export { DataTable };