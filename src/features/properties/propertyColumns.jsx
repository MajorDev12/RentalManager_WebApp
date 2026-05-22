import PropertyImage from "../../assets/PropertyImg.png";
import ActionCell from "../../components/ui/ActionCell";
import { Link } from "react-router-dom";
import Can from "../../auth/Can";

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
    enableSorting: true,

    cell: ({ row }) => {
      const { image } = row.original;

      return (
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "10px",
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: "var(--textColor)",
              fontSize: "12.5px",
            }}
          >
            {name}
          </p>

          <span
            style={{
              fontSize: "12px",
              color: "var(--lightTextColor)",
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              margin: 0,
              fontSize: "11.5px",
              fontWeight: 500,
              color: "var(--blue)",
            }}
          >
            {emailAddress}
          </p>

          <span
            style={{
              fontSize: "12px",
              color: "var(--lightTextColor)",
              marginTop: "2px",
            }}
          >
            {"+254 " + mobileNumber}
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
          background: "var(--backgroundColor)",
          boxShadow: "var(--shadow)",
          padding: "6px 10px",
          borderRadius: "8px",
          width: "fit-content",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--lightTextColor)",
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
          <Can permission="Property.Update">
            <li onClick={() => onEdit(rowId)} className="actionLink">
              Edit
            </li>
          </Can>

          <Can permission="Property.Read">
            <li className="actionLink">
              <Link to={`/${endpoint}/${rowId}`} className="view">
                View
              </Link>
            </li>
          </Can>

          <Can permission="Property.Delete">
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
