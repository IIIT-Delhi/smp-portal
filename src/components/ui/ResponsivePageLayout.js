import React from 'react';

const ResponsivePageLayout = ({
    children,
    title,
    subtitle,
    backgroundColor = "var(--light-gray)"
}) => {
    return (
        <div style={{ backgroundColor, minHeight: "100vh" }}>
            <div
                className="main-content"
                style={{
                    marginLeft: "70px",
                    padding: "20px",
                    transition: "margin-left 0.3s ease"
                }}
            >
                <div className="container-fluid">
                    {title && (
                        <div className="page-header">
                            <h3 style={{ color: "var(--primary-dark-blue)" }}>{title}</h3>
                            {subtitle && <p className="text-muted">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ResponsivePageLayout;
