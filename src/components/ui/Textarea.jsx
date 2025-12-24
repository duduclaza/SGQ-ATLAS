import { forwardRef } from 'react';

const Textarea = forwardRef(({
    label,
    error,
    helperText,
    className = '',
    containerClassName = '',
    required = false,
    rows = 4,
    ...props
}, ref) => {
    const textareaClasses = `
    w-full px-4 py-3
    border rounded-lg 
    text-gray-900 text-base
    placeholder:text-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    resize-none
    ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300'}
    ${className}
  `;

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-sm font-medium text-gray-900">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={textareaClasses}
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

Textarea.displayName = 'Textarea';

export default Textarea;
