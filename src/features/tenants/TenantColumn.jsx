import ActionCell from "../../components/ui/ActionCell";
import ProfileImg from "../../assets/profile.png";

import { Link } from 'react-router-dom';
import '../../css/tenant.css';

const endpoint = "Tenants";

export const getColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete,
  addInvoice,
  addPayment,
  tenantStatus,
  assignUnit
}) => [
  {
    header: 'Img',
    accessorKey: 'profilePhotoUrl',
    cell: info => (
      <img
        src={info.getValue() || ProfileImg}
        alt="property"
        width="25"
        height="25"
        style={{ borderRadius: "8px" }}
      />
    ),
  },
  { header: 'Full Names', accessorKey: 'fullName' },
  { header: 'Email Address', accessorKey: 'emailAddress' },
  { header: 'Mobile Number', accessorKey: 'mobileNumber' },
  { header: 'Property Name', accessorKey: 'user.propertyName' },
  { header: 'unit', accessorKey: 'unit' },
  { 
    header: 'Status',
    accessorKey: 'tenantStatus',
    cell: info => {
    const status = info.getValue();
    let colorClass = '';

    switch (status?.toLowerCase()) {
      case 'active':
        colorClass = 'status-green';
        break;
      case 'pending':
        colorClass = 'status-yellow';
        break;
      case 'evicted':
        colorClass = 'status-red';
        break;
      default:
        colorClass = 'status-red';
    }

    return <span className={`status-tag ${colorClass}`} style={{ fontWeight: 700 }}>{status}</span>;
   },
  },
  {
    header: 'Action',
    accessorKey: 'id',
    cell: info => {
      const rowData = info.row.original; 
      const rowId = info.getValue();

      const actions = (
        <>
          <li onClick={() => onEdit(rowId)} className="actionLink">Edit</li>

          <li className="actionLink">
            <Link to={`/${endpoint}/${rowId}`} className="view">View</Link>
          </li>

          <li onClick={() => assignUnit(rowId, rowData)} className="actionLink">Assign House</li>

          <li onClick={() => addInvoice(rowId, rowData)} className="actionLink">Add Invoice</li>

          <li onClick={() => addPayment(rowId)} className="actionLink">Add Payment</li>

          <li onClick={() => tenantStatus(rowId, rowData)} className="actionLink">Status</li>

          <li onClick={() => onDelete(rowId)} className="actionLink">Delete</li>
        </>
      );

      return (
        <ActionCell
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          rowId={rowId}
          actions={actions}
        />
      );
      
    },
  },
];
