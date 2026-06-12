import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-t-3xl sm:rounded-3xl shadow-warm-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-slide-up`}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-primary/10">
            <h2 className="text-xl font-display font-bold text-text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="touch-target rounded-full hover:bg-bg-secondary transition-colors"
            >
              <X className="w-6 h-6 text-text-secondary" />
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
