import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showClose = true,
    footer,
    className = ''
}) => {
    const modalRef = useRef(null);

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] h-[90vh]'
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={`
          relative w-full ${sizes[size]} mx-4
          bg-white rounded-2xl shadow-2xl
          animate-slideIn
          flex flex-col
          ${size === 'full' ? '' : 'max-h-[90vh]'}
          ${className}
        `}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-start justify-between p-6 border-b border-gray-100">
                        <div>
                            {title && (
                                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                            )}
                            {description && (
                                <p className="text-sm text-gray-500 mt-1">{description}</p>
                            )}
                        </div>
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
