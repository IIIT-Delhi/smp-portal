import React from "react";

const Table = (props) => {
  const { headers, rows } = props;
  return (
    <div>
      <table className="table table-bordered table-hover">
        <TableHeader headers={headers}></TableHeader>
        <TableBody headers={headers} rows={rows}></TableBody>
      </table>
    </div>
  );
};
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const TableHeader = (props) => {
  const { headers } = props;
  return (
    <thead className="thead-dark" key="header-1">
      <tr key="header-0">
        {headers &&
          headers.map((value, index) => {
            return (
              <th key={index}>
                <div>{capitalizeFirstLetter(value)}</div>
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
      <tr key={row.id}>
        {headers.map((value, index) => {
          return <td key={index}>{row[value]}</td>;
        })}
      </tr>
    );
  }

  return (
    <tbody>
      {rows}
      {/* {rows &&
        rows.map((value) => {
          return buildRow(value, headers);
        })} */}
    </tbody>
  );
};

export default Table;
