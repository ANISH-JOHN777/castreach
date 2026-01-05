import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />,
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-message">{message}</div>
            <button onClick={onClose} className="toast-close">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
