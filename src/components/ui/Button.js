import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--orange-highlight)',
          color: 'var(--white)',
          border: '2px solid var(--orange-highlight)',
          ':hover': {
            backgroundColor: '#e55a00',
            borderColor: '#e55a00'
          }
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--accent-blue)',
          color: 'var(--white)',
          border: '2px solid var(--accent-blue)',
          ':hover': {
            backgroundColor: '#004494',
            borderColor: '#004494'
          }
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--accent-blue)',
          border: '2px solid var(--accent-blue)',
          ':hover': {
            backgroundColor: 'var(--accent-blue)',
            color: 'var(--white)'
          }
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none',
          ':hover': {
            backgroundColor: 'var(--light-gray)',
            color: 'var(--text-primary)'
          }
        };
      case 'danger':
        return {
          backgroundColor: 'var(--error)',
          color: 'var(--white)',
          border: '2px solid var(--error)',
          ':hover': {
            backgroundColor: '#c0392b',
            borderColor: '#c0392b'
          }
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.375rem 0.75rem',
          fontSize: '0.875rem'
        };
      case 'lg':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1.125rem'
        };
      default:
        return {
          padding: '0.5rem 1rem',
          fontSize: '1rem'
        };
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '8px',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: disabled || loading ? 0.6 : 1,
    ...getSizeStyles(),
    ...getVariantStyles()
  };

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    
    switch (variant) {
      case 'primary':
        e.target.style.backgroundColor = '#e55a00';
        e.target.style.borderColor = '#e55a00';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(255, 111, 0, 0.3)';
        break;
      case 'secondary':
        e.target.style.backgroundColor = '#004494';
        e.target.style.borderColor = '#004494';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 85, 164, 0.3)';
        break;
      case 'outline':
        e.target.style.backgroundColor = 'var(--accent-blue)';
        e.target.style.color = 'var(--white)';
        e.target.style.transform = 'translateY(-1px)';
        break;
      case 'ghost':
        e.target.style.backgroundColor = 'var(--light-gray)';
        e.target.style.color = 'var(--text-primary)';
        break;
      case 'danger':
        e.target.style.backgroundColor = '#c0392b';
        e.target.style.borderColor = '#c0392b';
        e.target.style.transform = 'translateY(-1px)';
        break;
      default:
        break;
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    
    switch (variant) {
      case 'primary':
        e.target.style.backgroundColor = 'var(--orange-highlight)';
        e.target.style.borderColor = 'var(--orange-highlight)';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
        break;
      case 'secondary':
        e.target.style.backgroundColor = 'var(--accent-blue)';
        e.target.style.borderColor = 'var(--accent-blue)';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
        break;
      case 'outline':
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = 'var(--accent-blue)';
        e.target.style.transform = 'translateY(0)';
        break;
      case 'ghost':
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = 'var(--text-secondary)';
        break;
      case 'danger':
        e.target.style.backgroundColor = 'var(--error)';
        e.target.style.borderColor = 'var(--error)';
        e.target.style.transform = 'translateY(0)';
        break;
      default:
        break;
    }
  };

  return (
    <button
      type={type}
      className={className}
      style={baseStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="spinner" style={{ width: '16px', height: '16px' }} />
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
