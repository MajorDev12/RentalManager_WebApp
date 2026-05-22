import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import "../../css/table.css";
import Spinner from "./Spinner";
import NoDataImage from "../../assets/NoData.png";
// import 500ErorImage from "../../assets/500Eror.png";

const Table = ({
  data,
  columns,
  loading,
  onclickItem,
  error,
  onSort,
  sortBy,
  isDescending,
  getRowId,
}) => {
  const safeData = Array.isArray(data) ? data : [];

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowId
      ? (row, index) => String(getRowId(row, index))
      : undefined,
  });

  return (
    <div className="TableContainer">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnId = header.column.id;
                const enableSorting = header.column.columnDef.enableSorting;

                return (
                  <th
                    key={header.id}
                    onClick={() => {
                      if (enableSorting) {
                        onSort?.(columnId);
                      }
                    }}
                    title={enableSorting ? "Click to sort" : undefined}
                    style={{
                      cursor: enableSorting ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {enableSorting && (
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 0.7,
                            marginLeft: "4px",
                          }}
                        >
                          <MdKeyboardArrowUp
                            size={16}
                            color={
                              sortBy === columnId && !isDescending
                                ? "var(--textColor)"
                                : "var(--greyColor)"
                            }
                          />

                          <MdKeyboardArrowDown
                            size={16}
                            color={
                              sortBy === columnId && isDescending
                                ? "var(--textColor)"
                                : "var(--greyColor)"
                            }
                            style={{ marginTop: "-6px" }}
                          />
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {error ? (
            <tr>
              <td
                className="errorRow"
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                  color: "var(--red)",
                }}
              >
                <img
                  src={NoDataImage}
                  alt="Server Error"
                  style={{
                    maxWidth: "350px",
                    margin: "0 auto",
                  }}
                />

                <p>{error}</p>
              </td>
            </tr>
          ) : loading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                <Spinner />
              </td>
            </tr>
          ) : safeData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                <img
                  src={NoDataImage}
                  alt="No data"
                  style={{
                    maxWidth: "350px",
                    margin: "0 auto",
                  }}
                />

                <p>No records Available</p>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onDoubleClick={(e) => {
                  if (e.target.closest(".actionCell")) return;
                  onclickItem?.(row.original);
                }}
                style={{
                  cursor: onclickItem ? "pointer" : "default",
                }}
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
