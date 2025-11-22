// 🔄 Reusable component for empty/no data states
// Fixes Problem #11: Duplicate Code
import React from 'react';

const EmptyState = ({ 
  icon = "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  title = "No data found",
  message = "Try again later",
  buttonText = "Retry",
  onButtonClick,
  isLoading = false
}) => {
  return (
    <div className="text-center py-5">
      {icon.startsWith('http') ? (
        <img
          src={icon}
          alt={title}
          className="mb-3"
          style={{ width: 80, opacity: 0.7 }}
        />
      ) : (
        <div style={{ fontSize: "60px" }}>{icon}</div>
      )}
      
      <h3>{title}</h3>
      <p className="text-muted">{message}</p>
      
      {onButtonClick && (
        <button 
          className="btn btn-primary" 
          onClick={onButtonClick}
          disabled={isLoading}
        >
          {isLoading ? '🔄 Loading...' : buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
