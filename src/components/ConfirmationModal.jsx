import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { STYLES } from '../utils/styles';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {isDanger && <AlertTriangle size={20} className="text-red-500" />}
                        {title}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-300 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-800/30 border-t border-slate-800">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-lg ${isDanger
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
