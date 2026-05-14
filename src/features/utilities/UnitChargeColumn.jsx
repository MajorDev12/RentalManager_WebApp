import ActionCell from "../../components/ui/ActionCell";
import Can from "../../auth/Can";

const statusStyles = {
  true: {
    color: "var(--highlightColor)",
  },
  false: {
    color: "var(--red)",
  },
};

export const getColumns = ({ activeRow, setActiveRow, onEdit, onDelete }) => [
  {
    header: "Property",
    accessorKey: "propertyName",
    enableSorting: true,

    cell: ({ row }) => (
      <div
        style={{
          fontWeight: 600,
          color: "var(--lightTextColor)",
          fontSize: "13px",
        }}
      >
        {row.original.propertyName}
      </div>
    ),
  },

  {
    header: "Utility",
    accessorKey: "name",
    enableSorting: true,

    cell: ({ row }) => (
      <div
        style={{
          fontWeight: 600,
          color: "var(--textColor)",
          fontSize: "13px",
        }}
      >
        {row.original.name}
      </div>
    ),
  },

  {
    header: "Recurring",
    accessorKey: "isReccurring",
    enableSorting: true,

    cell: ({ row }) => {
      const isRecurring = row.original.isReccurring;

      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "var(--littleFontSize)",
            fontWeight: 600,
            width: "fit-content",
            textTransform: "capitalize",
            ...statusStyles[isRecurring],
          }}
        >
          {isRecurring ? "Recurring" : "One-Time"}
        </div>
      );
    },
  },

  {
    header: "Amount",
    accessorKey: "amount",
    enableSorting: true,

    cell: ({ row }) => (
      <div
        style={{
          fontWeight: 700,
          color: "var(--textColor)",
          fontSize: "13px",
        }}
      >
        KES {Number(row.original.amount).toLocaleString()}
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
          <Can permission="UtilityBill.Update">
            <li onClick={() => onEdit(rowId)} className="actionLink">
              Edit
            </li>
          </Can>

          <Can permission="UtilityBill.Delete">
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
