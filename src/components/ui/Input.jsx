import { forwardRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';

const Input = forwardRef(({
    label,
    error,
    helperText,
    tooltip,
    className = '',
    containerClassName = '',
    required = false,
    type = 'text',
    disabled = false,
    readOnly = false,
    ...props
}, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const inputClasses = `
    w-full h-12 px-4 
    border rounded-lg 
    text-gray-900 text-base
    placeholder:text-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${readOnly ? 'bg-blue-50 border-blue-200 cursor-not-allowed' : ''}
    ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300'}
    ${className}
  `;

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-900">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {tooltip && (
                        <div className="relative">
                            <button
                                type="button"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                onFocus={() => setShowTooltip(true)}
                                onBlur={() => setShowTooltip(false)}
                                className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                                tabIndex={-1}
                            >
                                <HelpCircle size={14} />
                            </button>
                            {showTooltip && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap max-w-xs">
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
                                    {tooltip}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <input
                ref={ref}
                type={type}
                className={inputClasses}
                disabled={disabled}
                readOnly={readOnly}
                {...props}
            />
            {(error || helperText) && (
                <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

