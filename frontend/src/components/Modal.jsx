import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 border"
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;