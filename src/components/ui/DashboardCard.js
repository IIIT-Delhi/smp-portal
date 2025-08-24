import React from 'react';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'var(--accent-blue)', 
  trend = null,
  subtitle = null,
  onClick = null,
  className = ''
}) => {
  const cardStyles = {
    backgroundColor: 'var(--white)',
    borderRadius: '12px',
    boxShadow: '0 2px 12px var(--shadow-light)',
    border: '1px solid var(--border-light)',
    overflow: 'hidden',
    transition: 'all var(--transition-normal)',
    cursor: onClick ? 'pointer' : 'default',
    height: '100%'
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-medium)';
    e.currentTarget.style.transform = 'translateY(-4px)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = '0 2px 12px var(--shadow-light)';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`dashboard-card ${className}`}
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="card-body text-center p-4">
        {/* Icon */}
        <div 
          className="mb-3"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '1.5rem'
          }}
        >
          {icon}
        </div>

        {/* Value */}
        <h3 className="h2 mb-1" style={{ 
          color: color, 
          fontWeight: '600',
          fontSize: '2rem'
        }}>
          {value}
        </h3>

        {/* Title */}
        <p className="text-muted mb-0 small" style={{ fontWeight: '500' }}>
          {title}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-muted mb-0" style={{ 
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            opacity: 0.8 
          }}>
            {subtitle}
          </p>
        )}

        {/* Trend Indicator */}
        {trend && (
          <div className="mt-2">
            <span 
              className={`badge ${trend.type === 'up' ? 'badge-success' : trend.type === 'down' ? 'badge-error' : 'badge-info'}`}
              style={{
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem'
              }}
            >
              {trend.type === 'up' && '↗️'}
              {trend.type === 'down' && '↘️'}
              {trend.type === 'neutral' && '➡️'}
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
