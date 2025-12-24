const Card = ({
    children,
    className = '',
    padding = 'p-6',
    hover = false,
    onClick,
    ...props
}) => {
    const baseClasses = 'bg-white rounded-xl border border-gray-200';
    const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

    return (
        <div
            className={`${baseClasses} ${padding} ${hoverClasses} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

Card.Header = ({ children, className = '' }) => (
    <div className={`pb-4 border-b border-gray-100 ${className}`}>
        {children}
    </div>
);

Card.Title = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h3>
);

Card.Description = ({ children, className = '' }) => (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
        {children}
    </p>
);

Card.Content = ({ children, className = '' }) => (
    <div className={`py-4 ${className}`}>
        {children}
    </div>
);

Card.Footer = ({ children, className = '' }) => (
    <div className={`pt-4 border-t border-gray-100 ${className}`}>
        {children}
    </div>
);

export default Card;
