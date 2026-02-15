import React from 'react';

const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  onAction, 
  icon, 
  className = "",
  showIcon = true 
}) => {
  const defaultIcon = (
    <svg 
      className="w-16 h-16 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1} 
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
      />
    </svg>
  );

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        {showIcon && (
          <div className="flex justify-center mb-4">
            {icon || defaultIcon}
          </div>
        )}
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-500 mb-6">
          {description}
        </p>
        
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
