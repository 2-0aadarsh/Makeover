import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

// Test component to verify all components work
const ComponentTest = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Component Test</h1>
      
      {/* LoadingSpinner Test */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">LoadingSpinner</h2>
        <div className="flex space-x-4">
          <LoadingSpinner size="small" />
          <LoadingSpinner size="medium" text="Loading..." />
          <LoadingSpinner size="large" color="green" />
        </div>
      </div>
      
      {/* ErrorMessage Test */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">ErrorMessage</h2>
        <ErrorMessage 
          message="This is a test error message" 
          onRetry={() => alert('Retry clicked!')}
        />
      </div>
      
      {/* EmptyState Test */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">EmptyState</h2>
        <EmptyState 
          title="No booking details"
          description="This is a test empty state message"
          actionText="Test Action"
          onAction={() => alert('Action clicked!')}
        />
      </div>
    </div>
  );
};

export default ComponentTest;
