import React from "react";
import "../styles/table.css";

const Table = ({ data, columns, onEdit, onDelete }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key}>{item[col.key]}</td>
            ))}
            <td>
              <button className="btn-edit" onClick={() => onEdit(item)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;