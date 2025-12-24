import { forwardRef } from 'react';

const Select = forwardRef(({
    label,
    error,
    helperText,
    options = [],
    placeholder = 'Selecione...',
    className = '',
    containerClassName = '',
    required = false,
    ...props
}, ref) => {
    const selectClasses = `
    w-full h-12 px-4 
    border rounded-lg 
    text-gray-900 text-base
    bg-white
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
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
            <select
                ref={ref}
                className={selectClasses}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {(error || helperText) && (
                <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
