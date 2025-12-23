import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
    toast: {
        success: (msg: string) => void;
        error: (msg: string) => void;
        info: (msg: string) => void;
        warning: (msg: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    const toastHelpers = {
        success: (msg: string) => addToast(msg, 'success'),
        error: (msg: string) => addToast(msg, 'error'),
        info: (msg: string) => addToast(msg, 'info'),
        warning: (msg: string) => addToast(msg, 'warning'),
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, toast: toastHelpers }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};

// Internal Component for rendering the list
const ToastContainer: React.FC<{ toasts: Toast[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`pointer-events-auto min-w-[300px] max-w-sm bg-white rounded-lg shadow-lg border p-4 flex items-start gap-3 animate-in slide-in-from-right-10 fade-in duration-300 ${t.type === 'success' ? 'border-green-100 bg-green-50/50' :
                            t.type === 'error' ? 'border-red-100 bg-red-50/50' :
                                t.type === 'warning' ? 'border-yellow-100 bg-yellow-50/50' : 'border-blue-100 bg-blue-50/50'
                        }`}
                >
                    <div className="shrink-0 mt-0.5">
                        {t.type === 'success' && <CheckCircle size={18} className="text-green-600" />}
                        {t.type === 'error' && <AlertCircle size={18} className="text-red-600" />}
                        {t.type === 'warning' && <AlertTriangle size={18} className="text-amber-600" />}
                        {t.type === 'info' && <Info size={18} className="text-blue-600" />}
                    </div>
                    <p className={`flex-1 text-sm font-medium ${t.type === 'success' ? 'text-green-800' :
                            t.type === 'error' ? 'text-red-800' :
                                t.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                        }`}>
                        {t.message}
                    </p>
                    <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
