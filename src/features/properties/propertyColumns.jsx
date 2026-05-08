// src/columns/propertyColumns.js

import PropertyImage from "../../assets/PropertyImg.png";
import ActionCell from "../../components/ui/ActionCell";
import { Link } from "react-router-dom";

const endpoint = "Properties";

export const getPropertyColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete,
}) => [
  {
    header: "Img",
    accessorKey: "image",
    enableSorting: false,

    cell: ({ row }) => {
      const { image } = row.original;

      return (
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "10px",
            overflow: "hidden",
            background: "rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={image || PropertyImage}
            alt="property"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      );
    },
  },

  {
    header: "Property",
    accessorKey: "name",
    enableSorting: true,

    cell: ({ row }) => {
      const { name, area } = row.original;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              color: "#1a2e1a",
              fontSize: "12.5px",
            }}
          >
            {name}
          </p>

          <span
            style={{
              fontSize: "12px",
              color: "#7fa37f",
              marginTop: "2px",
            }}
          >
            {area}
          </span>
        </div>
      );
    },
  },

  {
    header: "Contact",
    accessorKey: "emailAddress",
    enableSorting: true,

    cell: ({ row }) => {
      const { emailAddress, mobileNumber } = row.original;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11.5px",
              fontWeight: 500,
              color: "#2277cc",
            }}
          >
            {emailAddress}
          </p>

          <span
            style={{
              fontSize: "12px",
              color: "#7fa37f",
              marginTop: "2px",
            }}
          >
            {"+254 " + "  " + mobileNumber}
          </span>
        </div>
      );
    },
  },

  {
    header: "Country",
    accessorKey: "country",
    enableSorting: true,
  },

  {
    header: "County",
    accessorKey: "county",
    enableSorting: true,
  },

  {
    header: "Floors",
    accessorKey: "floor",
    enableSorting: true,

    cell: (info) => (
      <div
        style={{
          background: "rgba(0,0,0,0.06)",
          padding: "6px 10px",
          borderRadius: "8px",
          width: "fit-content",
          fontSize: "13px",
          fontWeight: 600,
          color: "1f5e1f",
        }}
      >
        {info.getValue()}
      </div>
    ),
  },

  {
    header: "Action",
    accessorKey: "id",
    enableSorting: false,

    cell: (info) => {
      const rowId = info.getValue();

      const actions = (
        <>
          <li onClick={() => onEdit(rowId)} className="actionLink">
            Edit
          </li>

          <li className="actionLink">
            <Link to={`/${endpoint}/${rowId}`} className="view">
              View
            </Link>
          </li>

          <li onClick={() => onDelete(rowId)} className="actionLink">
            Delete
          </li>
        </>
      );

      return (
        <ActionCell
          rowIndex={info.row.index}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          actions={actions}
        />
      );
    },
  },
];
