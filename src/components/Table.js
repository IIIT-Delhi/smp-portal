import React from "react";

const Table = (props) => {
  const { headers, rows, searchable = false, sortable = false } = props;
  
  return (
    <div className="table-container" style={{
      backgroundColor: "var(--white)",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 12px var(--shadow-light)",
      border: "1px solid var(--border-light)"
    }}>
      {searchable && (
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-light)" }}>
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                style={{
                  border: "2px solid var(--border-light)",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-blue)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 85, 164, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-light)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div className="col-md-6 text-end">
              <button 
                className="btn"
                style={{
                  backgroundColor: "var(--orange-highlight)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  fontWeight: "500"
                }}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ overflowX: "auto" }}>
        <table className="table mb-0" style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <TableHeader headers={headers} sortable={sortable} />
          <TableBody headers={headers} rows={rows} />
        </table>
      </div>
    </div>
  );
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const TableHeader = (props) => {
  const { headers, sortable } = props;
  
  return (
    <thead key="header-1">
      <tr key="header-0" style={{
        backgroundColor: "var(--primary-dark-blue)",
        color: "var(--white)"
      }}>
        {headers &&
          headers.map((value, index) => {
            return (
              <th 
                key={index}
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "none",
                  cursor: sortable ? "pointer" : "default",
                  transition: "background-color 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  if (sortable) {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortable) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  {capitalizeFirstLetter(value)}
                  {sortable && (
                    <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>↕️</span>
                  )}
                </div>
              </th>
            );
          })}
      </tr>
    </thead>
  );
};

const TableBody = (props) => {
  const { headers, rows } = props;

  function buildRow(row, headers) {
    return (
      <tr key={row.id} style={{
        transition: "background-color 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--light-gray)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}>
        {headers.map((value, index) => {
          return (
            <td 
              key={index}
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border-light)",
                color: "var(--text-secondary)",
                fontSize: "0.875rem"
              }}
            >
              {row[value]}
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <tbody>
      {rows && rows.length > 0 ? (
        rows
      ) : (
        <tr>
          <td 
            colSpan={headers?.length || 1}
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.875rem"
            }}
          >
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
              <p className="mb-0">No data available</p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default Table;
