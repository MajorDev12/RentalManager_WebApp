import { can } from "../../auth/rbac";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

// ─── Status badge config ────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active: {
    bg: "var(--greenFade)",
    color: "var(--green)",
    dot: "var(--green)",
  },
  Inactive: {
    bg: "var(--greyFade)",
    color: "var(--lightTextColor)",
    dot: "var(--lightTextColor)",
  },
  Evicted: { bg: "var(--redFade)", color: "var(--red)", dot: "var(--red)" },
  "On Notice": {
    bg: "var(--yellowFade)",
    color: "var(--yellow)",
    dot: "var(--yellow)",
  },
  Pending: { bg: "var(--blueFade)", color: "var(--blue)", dot: "var(--blue)" },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES["Inactive"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "var(--littleFontSize)",
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: style.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {status ?? "Unknown"}
    </span>
  );
};

// ─── Avatar (initials fallback, photo if available) ─────────────────────────
const TenantAvatar = ({ firstName, lastName, photoUrl }) => {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={initials}
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--borderColor)",
        }}
      />
    );
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "var(--lightHighlightColor)",
        color: "var(--darkHighlightColor)",
        fontWeight: 700,
        fontSize: "var(--littleFontSize)",
        flexShrink: 0,
        border: "2px solid var(--borderColor)",
      }}
    >
      {initials || "?"}
    </span>
  );
};

// ─── Action menu (three-dot) ─────────────────────────────────────────────────
const ActionMenu = ({
  rowId,
  activeRow,
  setActiveRow,
  onView,
  onEdit,
  onDelete,
  user,
}) => {
  const isOpen = activeRow === rowId;
  return (
    <div style={{ position: "relative" }}>
      <button
        className="actionBtn"
        onClick={(e) => {
          e.stopPropagation();
          setActiveRow(isOpen ? null : rowId);
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--iconColor)",
          padding: "4px 6px",
          borderRadius: "6px",
          transition: "background var(--trans-3)",
        }}
      >
        <BsThreeDotsVertical size={16} />
      </button>

      {isOpen && (
        <div
          className="dropdownMenu"
          style={{
            position: "absolute",
            right: 0,
            top: "110%",
            background: "var(--containerColor)",
            border: "1px solid var(--borderColor)",
            borderRadius: "10px",
            boxShadow: "var(--shadow)",
            zIndex: 100,
            minWidth: 140,
            overflow: "hidden",
          }}
        >
          <button
            className="menuItem"
            onClick={(e) => {
              e.stopPropagation();
              onView(rowId);
              setActiveRow(null);
            }}
            style={menuItemStyle}
          >
            <FaEye size={13} /> View
          </button>

          {can(user, "Tenant.Update") && (
            <button
              className="menuItem"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(rowId);
              }}
              style={menuItemStyle}
            >
              <MdEdit size={13} /> Edit
            </button>
          )}

          {can(user, "Tenant.Delete") && (
            <button
              className="menuItem danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(rowId);
              }}
              style={{ ...menuItemStyle, color: "var(--red)" }}
            >
              <RiDeleteBin6Line size={13} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  padding: "9px 14px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "var(--smallFontSize)",
  color: "var(--textColor)",
  textAlign: "left",
  transition: "background var(--trans-3)",
};

// ─── Column Definitions ──────────────────────────────────────────────────────
// Every column has an explicit `id` — TanStack requires this whenever
// `header` is JSX, a render function, or an empty/whitespace string.
export const getTenantColumns = ({
  user,
  activeRow,
  setActiveRow,
  onView,
  onEdit,
  onDelete,
}) => [
  {
    id: "avatar",
    key: "avatar",
    label: "Img",
    sortable: false,
    width: "50px",
    render: (row) => (
      <TenantAvatar
        firstName={row.firstName}
        lastName={row.lastName}
        photoUrl={row.profilePhotoUrl}
      />
    ),
  },
  {
    id: "fullName",
    key: "fullName",
    label: "Full Name",
    sortable: true,
    render: (row) => (
      <div>
        <span
          style={{
            fontWeight: 600,
            color: "var(--textColor)",
            fontSize: "var(--smallFontSize)",
          }}
        >
          {row.firstName} {row.lastName}
        </span>
        {row.nationalId && (
          <div
            style={{
              fontSize: "var(--littleFontSize)",
              color: "var(--lightTextColor)",
            }}
          >
            ID: {row.nationalId}
          </div>
        )}
      </div>
    ),
  },
  {
    id: "mobileNumber",
    key: "mobileNumber",
    label: "Phone",
    sortable: true,
    render: (row) => (
      <span
        style={{ fontSize: "var(--smallFontSize)", color: "var(--textColor)" }}
      >
        {row.mobileNumber ?? "—"}
      </span>
    ),
  },
  {
    id: "emailAddress",
    key: "emailAddress",
    label: "Email",
    sortable: true,
    render: (row) => (
      <span
        style={{
          fontSize: "var(--smallFontSize)",
          color: "var(--lightTextColor)",
        }}
      >
        {row.emailAddress ?? "—"}
      </span>
    ),
  },
  {
    id: "unitName",
    key: "unitName",
    label: "Unit",
    sortable: true,
    render: (row) => (
      <div>
        <span
          style={{
            fontSize: "var(--smallFontSize)",
            fontWeight: 500,
            color: "var(--textColor)",
          }}
        >
          {row.unitName ?? "—"}
        </span>
        {row.propertyName && (
          <div
            style={{
              fontSize: "var(--littleFontSize)",
              color: "var(--lightTextColor)",
            }}
          >
            {row.propertyName}
          </div>
        )}
      </div>
    ),
  },
  {
    id: "rentAmount",
    key: "rentAmount",
    label: "Rent",
    sortable: true,
    render: (row) => (
      <div>
        <span
          style={{
            fontWeight: 600,
            fontSize: "var(--smallFontSize)",
            color: "var(--textColor)",
          }}
        >
          {row.rentAmount
            ? `KES ${Number(row.rentAmount).toLocaleString()}`
            : "—"}
        </span>
        {row.billingCycle && (
          <div
            style={{
              fontSize: "var(--littleFontSize)",
              color: "var(--lightTextColor)",
            }}
          >
            /{row.billingCycle.toLowerCase()}
          </div>
        )}
      </div>
    ),
  },
  {
    id: "tenantStatus",
    key: "tenantStatus",
    label: "Status",
    sortable: true,
    render: (row) => <StatusBadge status={row.tenantStatus} />,
  },
  {
    id: "actions",
    key: "actions",
    label: "Action",
    sortable: false,
    width: "60px",
    render: (row) => (
      <ActionMenu
        rowId={row.id}
        activeRow={activeRow}
        setActiveRow={setActiveRow}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        user={user}
      />
    ),
  },
];
