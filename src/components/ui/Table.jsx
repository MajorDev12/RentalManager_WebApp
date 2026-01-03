import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import "../../css/table.css";
import Spinner from './Spinner';
import NoDataImage from "../../assets/NoData.png";

const Table = ({ data, columns, loading, onclickItem, error }) => {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
  <div className="TableContainer">
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {error ? (
          <tr>
            <td className="errorRow" colSpan={columns.length} style={{ textAlign: "center", color: "red" }}>
              <img src={NoDataImage} alt="No data" style={{ maxWidth: "350px", margin: "0 auto" }} />
              <p>{error}</p>
            </td>
          </tr>
        ) : loading ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              <Spinner />
            </td>
          </tr>
        ) : table.getRowModel().rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              <img src={NoDataImage} alt="No data" style={{ maxWidth: "350px", margin: "0 auto" }} />
              <p>No records Available</p>
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <tr 
              key={row.id}
              onClick={(e) => {
                if (e.target.closest('svg') || e.target.closest('a') || e.target.closest('li')) return;
                onclickItem?.(row);
              }}
              style={{ cursor: onclickItem ? "pointer" : "default" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

};

export default Table;
