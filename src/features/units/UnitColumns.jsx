import ActionCell from "../../components/ui/ActionCell";
import { Link } from "react-router-dom";
import Can from "../../auth/Can";

const endpoint = "Units";

export const getColumns = ({ activeRow, setActiveRow, onEdit, onDelete }) => [
  {
    header: "Property",
    accessorKey: "propertyName",
    enableSorting: true,

    cell: ({ row }) => {
      const { propertyName } = row.original;

      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: "var(--textColor)",
              fontSize: "var(--littleFontSize)",
            }}
          >
            {propertyName}
          </p>
        </div>
      );
    },
  },

  {
    header: "Unit",
    accessorKey: "name",
    enableSorting: true,

    cell: ({ row }) => {
      const { name, unitType } = row.original;

      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: "var(--textColor)",
              fontSize: "var(--smallFontSize)",
            }}
          >
            {name}
          </p>

          <span
            style={{
              fontSize: "var(--littleFontSize)",
              color: "var(--lightTextColor)",
              marginTop: "2px",
            }}
          >
            {unitType}
          </span>
        </div>
      );
    },
  },

  {
    header: "Amount",
    accessorKey: "amount",
    enableSorting: true,

    cell: (info) => (
      <div
        style={{
          background: "var(--backgroundColor)",
          boxShadow: "var(--shadow)",
          padding: "6px 10px",
          borderRadius: "8px",
          width: "fit-content",
          fontSize: "var(--littleFontSize)",
          fontWeight: 600,
          color: "var(--lightTextColor)",
        }}
      >
        {info.getValue()}
      </div>
    ),
  },

  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,

    cell: ({ row }) => {
      const { status } = row.original;

      return (
        <div
          style={{
            background:
              status?.toLowerCase() === "occupied"
                ? "var(--greenFade)"
                : "var(--yellowFade)",

            color:
              status?.toLowerCase() === "occupied"
                ? "var(--green)"
                : "var(--yellow)",

            padding: "6px 12px",
            borderRadius: "20px",
            width: "fit-content",
            fontSize: "var(--littleFontSize)",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {status}
        </div>
      );
    },
  },

  {
    header: "Action",
    accessorKey: "id",
    enableSorting: false,

    cell: (info) => {
      const rowId = info.getValue();

      const actions = (
        <>
          <Can permission="Unit.Update">
            <li onClick={() => onEdit(rowId)} className="actionLink">
              Edit
            </li>
          </Can>

          <Can permission="Unit.Read">
            <li className="actionLink">
              <Link to={`/${endpoint}/${rowId}`} className="view">
                View
              </Link>
            </li>
          </Can>

          <Can permission="Unit.Delete">
            <li onClick={() => onDelete(rowId)} className="actionLink">
              Delete
            </li>
          </Can>
        </>
      );

      return (
        <ActionCell
          rowId={info.row.original.id}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          actions={actions}
        />
      );
    },
  },
];
