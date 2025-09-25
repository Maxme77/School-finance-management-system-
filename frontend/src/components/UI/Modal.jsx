import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-content ${sizeClasses[size]}`}>
        {/* Modal Header */}
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-semibold text-luxury-900">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-luxury-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-luxury-600" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="card-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
export { Modal };