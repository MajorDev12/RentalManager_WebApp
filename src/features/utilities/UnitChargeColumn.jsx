import ActionCell from "../../components/ui/ActionCell";
import Can from "../../auth/Can";

const badgeStyles = {
  metered: {
    background: "rgba(59, 130, 246, 0.12)",
    color: "var(--blue)",
    boxShadow: "var(--shadow)",
  },

  fixed: {
    background: "var(--backgroundColor)",
    color: "var(--lightTextColor)",
    boxShadow: "var(--shadow)",
  },

  monthly: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "var(--highlightColor)",
  },

  weekly: {
    background: "rgba(245, 158, 11, 0.12)",
    color: "var(--yellow)",
  },

  yearly: {
    background: "rgba(139, 92, 246, 0.12)",
    color: "#8B5CF6",
  },

  default: {
    background: "rgba(99, 102, 241, 0.10)",
    color: "var(--blue)",
  },
};

const cellTextStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--textColor)",
};

const secondaryTextStyle = {
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--lightTextColor)",
};

const badgeBaseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "capitalize",
  letterSpacing: "0.3px",
};

export const getColumns = ({ activeRow, setActiveRow, onEdit, onDelete }) => [
  {
    header: "Property",
    accessorKey: "propertyName",
    enableSorting: true,

    cell: ({ row }) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <span
          style={{
            ...cellTextStyle,
            fontWeight: 600,
          }}
        >
          {row.original.propertyName}
        </span>
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
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: "rgba(99, 102, 241, 0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "13px",
            color: "var(--blue)",
            flexShrink: 0,
          }}
        >
          {row.original.name?.charAt(0)?.toUpperCase()}
        </div>

        <div
          style={{
            ...cellTextStyle,
            fontWeight: 600,
          }}
        >
          {row.original.name}
        </div>
      </div>
    ),
  },

  {
    header: "Unit",
    accessorKey: "unitName",
    enableSorting: true,

    cell: ({ row }) => {
      const unit = row.original.unitName;

      return unit ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: "8px",
            background: "rgba(99, 102, 241, 0.08)",
            color: "var(--purple)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          🏠 {unit}
        </div>
      ) : (
        <div
          style={{
            fontSize: "12px",
            color: "var(--lightTextColor)",
            fontWeight: 500,
            fontStyle: "italic",
          }}
        >
          Entire Property
        </div>
      );
    },
  },

  {
    header: "Billing Cycle",
    accessorKey: "billingCycleName",
    enableSorting: true,

    cell: ({ row }) => {
      const billingCycle = row.original.billingCycleName?.toLowerCase();

      return (
        <div
          style={{
            ...badgeBaseStyle,
            ...(badgeStyles[billingCycle] || badgeStyles.default),
          }}
        >
          {row.original.billingCycleName}
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
          ...cellTextStyle,
          fontWeight: 700,
          fontSize: "13px",
        }}
      >
        KES {Number(row.original.amount).toLocaleString()}
      </div>
    ),
  },

  {
    header: "Metering",
    accessorKey: "isMetered",
    enableSorting: true,

    cell: ({ row }) => {
      const isMetered = row.original.isMetered;

      return (
        <div
          style={{
            ...badgeBaseStyle,
            ...(isMetered ? badgeStyles.metered : badgeStyles.fixed),
          }}
        >
          {isMetered ? "Metered" : "Fixed"}
        </div>
      );
    },
  },

  {
    header: "",
    accessorKey: "id",
    enableSorting: false,
    size: 60,

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
            <li onClick={() => onDelete(rowId)} className="actionLink danger">
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
