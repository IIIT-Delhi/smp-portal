import React from 'react';

const Loading = ({ 
  size = 'md', 
  color = 'var(--accent-blue)', 
  text = null, 
  overlay = false,
  fullScreen = false
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return '20px';
      case 'lg':
        return '60px';
      default:
        return '40px';
    }
  };

  const spinnerStyles = {
    width: getSize(),
    height: getSize(),
    border: '4px solid var(--border-light)',
    borderTop: `4px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    ...(overlay && {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999
    }),
    ...(fullScreen && !overlay && {
      minHeight: '100vh'
    })
  };

  return (
    <div style={containerStyles}>
      <div style={spinnerStyles} className="spinner" />
      {text && (
        <p style={{ 
          color: 'var(--text-secondary)', 
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {text}
        </p>
      )}
    </div>
  );
};

// Spinner only component
const Spinner = ({ size = 'md', color = 'var(--accent-blue)' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return '16px';
      case 'lg':
        return '48px';
      default:
        return '32px';
    }
  };

  return (
    <div 
      className="spinner" 
      style={{
        width: getSize(),
        height: getSize(),
        border: '3px solid var(--border-light)',
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  );
};

// Skeleton loading component
const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '' 
}) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--border-light)',
        background: 'linear-gradient(90deg, var(--border-light) 25%, #f0f0f0 50%, var(--border-light) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite'
      }}
    />
  );
};

// Add CSS animations to the document if not already present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  
  if (!document.head.querySelector('style[data-loading-animations]')) {
    style.setAttribute('data-loading-animations', 'true');
    document.head.appendChild(style);
  }
}

Loading.Spinner = Spinner;
Loading.Skeleton = Skeleton;

export default Loading;
