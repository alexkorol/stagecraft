import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, Info } from 'lucide-react';

const VARIANTS = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

const ICONS = {
    [VARIANTS.SUCCESS]: Check,
    [VARIANTS.ERROR]: X,
    [VARIANTS.WARNING]: AlertTriangle,
    [VARIANTS.INFO]: Info
};

const COLORS = {
    [VARIANTS.SUCCESS]: 'bg-green-100 text-green-800 border-green-200',
    [VARIANTS.ERROR]: 'bg-red-100 text-red-800 border-red-200',
    [VARIANTS.WARNING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [VARIANTS.INFO]: 'bg-blue-100 text-blue-800 border-blue-200'
};

const Toast = ({ 
    message, 
    variant = VARIANTS.INFO, 
    duration = 3000,
    onClose 
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!duration) return;

        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateProgress = () => {
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            const newProgress = (remaining / duration) * 100;

            if (newProgress <= 0) {
                setIsVisible(false);
                onClose?.();
            } else {
                setProgress(newProgress);
                requestAnimationFrame(updateProgress);
            }
        };

        const animationFrame = requestAnimationFrame(updateProgress);

        return () => cancelAnimationFrame(animationFrame);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const Icon = ICONS[variant];

    return (
        <div 
            className={`
                fixed bottom-4 right-4 max-w-sm w-full shadow-lg rounded-lg 
                border ${COLORS[variant]} p-4 transform transition-all duration-300
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
            `}
            role="alert"
        >
            <div className="flex items-start">
                {Icon && (
                    <div className="flex-shrink-0">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium">
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        className={`
                            inline-flex rounded-md p-1.5 
                            focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${COLORS[variant].replace('bg-', 'hover:bg-').replace('100', '200')}
                        `}
                        onClick={() => {
                            setIsVisible(false);
                            onClose?.();
                        }}
                    >
                        <span className="sr-only">Close</span>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {duration > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 ${COLORS[variant].replace('100', '400')}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
};

// Toast container to manage multiple toasts
const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, options = {}) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, ...options }]);
        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Expose methods globally
    useEffect(() => {
        window.toast = {
            success: (message, options) => addToast(message, { ...options, variant: VARIANTS.SUCCESS }),
            error: (message, options) => addToast(message, { ...options, variant: VARIANTS.ERROR }),
            warning: (message, options) => addToast(message, { ...options, variant: VARIANTS.WARNING }),
            info: (message, options) => addToast(message, { ...options, variant: VARIANTS.INFO })
        };

        return () => {
            delete window.toast;
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none flex flex-col items-end justify-end p-4 space-y-4">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export { Toast, ToastContainer, VARIANTS as TOAST_VARIANTS };
