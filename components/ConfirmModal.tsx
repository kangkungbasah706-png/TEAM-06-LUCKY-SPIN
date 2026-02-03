
import React from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onConfirm, onCancel, confirmText = "YES, RESET" }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"></div>
      
      <div className="relative w-full max-w-sm glass-effect border border-white/10 rounded-[2rem] p-10 text-center animate-in zoom-in duration-300">
        <h3 className="luxury-text text-xl font-bold text-white mb-4 tracking-wider uppercase">{title}</h3>
        <p className="text-white/60 text-sm mb-10 leading-relaxed">{message}</p>
        
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-red-600/20 hover:bg-red-600 border border-red-500/50 rounded-xl font-bold text-white uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/10"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white/80 uppercase tracking-widest text-xs transition-all"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
