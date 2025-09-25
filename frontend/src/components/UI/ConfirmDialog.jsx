import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      confirmButton: 'btn-danger'
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg'
    },
    info: {
      icon: CheckCircle,
      iconColor: 'text-blue-600',
      confirmButton: 'btn-primary'
    }
  };

  const style = typeStyles[type];
  const Icon = style.icon;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content max-w-md">
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-2 rounded-full bg-${type === 'danger' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-100`}>
              <Icon className={`h-6 w-6 ${style.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-luxury-900">{title}</h3>
          </div>

          {/* Message */}
          <p className="text-luxury-600 mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={style.confirmButton}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
export { ConfirmDialog };