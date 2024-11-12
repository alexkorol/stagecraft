const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                );
            case 'error':
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <div
            className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg text-white ${getBackgroundColor()} shadow-lg transition-all duration-300 ease-in-out`}
            role="alert"
        >
            {getIcon()}
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-2 hover:opacity-80"
                aria-label="Close"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

// Toast Container Component to manage multiple toasts
const ToastContainer = () => {
    const [toasts, setToasts] = React.useState([]);

    const addToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Expose addToast method globally
    React.useEffect(() => {
        window.showToast = addToast;
        return () => {
            delete window.showToast;
        };
    }, []);

    return (
        <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export { Toast, ToastContainer };