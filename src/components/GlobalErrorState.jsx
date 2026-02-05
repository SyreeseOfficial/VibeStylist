import React from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

const GlobalErrorState = ({ error, resetErrorBoundary }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-gray-800 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Style Emergency!</h1>
                <p className="text-slate-400 mb-6">
                    Something went wrong while curating your vibe. It's not you, it's us.
                </p>

                {error && (
                    <div className="bg-black/30 rounded-lg p-3 mb-6 text-left overflow-hidden">
                        <p className="font-mono text-xs text-red-300 break-words">
                            {error.message || "Unknown Error"}
                        </p>
                    </div>
                )}

                <button
                    onClick={resetErrorBoundary}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 group"
                >
                    <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Try a Quick Fix
                </button>
            </div>
        </div>
    );
};

export default GlobalErrorState;
