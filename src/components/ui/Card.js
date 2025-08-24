import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  headerTitle = null,
  headerColor = 'primary',
  ...props 
}) => {
  const getHeaderColor = () => {
    switch (headerColor) {
      case 'primary':
        return 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--accent-blue) 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, var(--accent-blue) 0%, #004494 100%)';
      case 'success':
        return 'linear-gradient(135deg, var(--success) 0%, #229954 100%)';
      case 'warning':
        return 'linear-gradient(135deg, var(--warning) 0%, #d68910 100%)';
      case 'danger':
        return 'linear-gradient(135deg, var(--error) 0%, #c0392b 100%)';
      case 'orange':
        return 'linear-gradient(135deg, var(--orange-highlight) 0%, #e55a00 100%)';
      default:
        return 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--accent-blue) 100%)';
    }
  };

  const cardStyles = {
    backgroundColor: 'var(--white)',
    borderRadius: '12px',
    boxShadow: '0 2px 12px var(--shadow-light)',
    border: '1px solid var(--border-light)',
    overflow: 'hidden',
    transition: 'all var(--transition-normal)',
    ...(gradient && {
      background: 'linear-gradient(135deg, var(--white) 0%, #fafbfc 100%)',
      borderLeft: '4px solid var(--orange-highlight)'
    })
  };

  const handleMouseEnter = (e) => {
    if (hover) {
      e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-medium)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }
  };

  const handleMouseLeave = (e) => {
    if (hover) {
      e.currentTarget.style.boxShadow = '0 2px 12px var(--shadow-light)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  return (
    <div
      className={`card ${className}`}
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {headerTitle && (
        <div className="card-header" style={{
          background: getHeaderColor(),
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 className="mb-0" style={{ color: 'white', fontWeight: '600' }}>
            {headerTitle}
          </h5>
        </div>
      )}
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', padding = 'default', ...props }) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return '1rem';
      case 'lg':
        return '2rem';
      default:
        return '1.5rem';
    }
  };

  return (
    <div 
      className={`card-body ${className}`} 
      style={{ padding: getPadding() }}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', color = 'primary', ...props }) => {
  const getHeaderColor = () => {
    switch (color) {
      case 'primary':
        return 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--accent-blue) 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, var(--accent-blue) 0%, #004494 100%)';
      case 'success':
        return 'linear-gradient(135deg, var(--success) 0%, #229954 100%)';
      case 'warning':
        return 'linear-gradient(135deg, var(--warning) 0%, #d68910 100%)';
      case 'danger':
        return 'linear-gradient(135deg, var(--error) 0%, #c0392b 100%)';
      case 'orange':
        return 'linear-gradient(135deg, var(--orange-highlight) 0%, #e55a00 100%)';
      default:
        return 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--accent-blue) 100%)';
    }
  };

  return (
    <div 
      className={`card-header ${className}`} 
      style={{
        background: getHeaderColor(),
        color: 'white',
        border: 'none',
        padding: '1rem 1.5rem'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`card-footer ${className}`} 
      style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--light-gray)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Attach sub-components
Card.Body = CardBody;
Card.Header = CardHeader;
Card.Footer = CardFooter;

export default Card;
