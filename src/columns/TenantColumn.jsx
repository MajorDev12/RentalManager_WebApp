import ActionCell from "../components/ActionCell";
import { Link } from 'react-router-dom';
import '../css/tenant.css';

export const getColumns = ({
  endpoint,
  activeRow,
  setActiveRow,
  setSelectedId,
  setIsEditMode,
  setDeleteModalOpen,
  setAssignUnitModal,
  setFormData,
  setOriginalData,
  setShowModal,
  data,
  setActiveTenant,
}) => [
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

    return <span className={`status-tag ${colorClass}`}>{status}</span>;
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
          <li onClick={() => {
            setIsEditMode(true);
            setFormData(rowData);
            setOriginalData(rowData);
            setShowModal(true);
            setActiveRow(null);
          }} className="actionLink">Edit</li>

          <li className="actionLink">
            <Link to={`/${endpoint}/${rowId}`} className="view">View</Link>
          </li>

          <li onClick={() => {
            setAssignUnitModal(true);
            setActiveRow(null);
            setActiveTenant(rowData);
            setSelectedId(rowId);
          }} className="actionLink">Assign House</li>

          <li onClick={() => {
            setSelectedId(rowId);
            setDeleteModalOpen(true);
            setActiveRow(null);
          }} className="actionLink">Delete</li>
        </>
      );

      return (
        <ActionCell
          endpoint={endpoint}
          rowIndex={info.row.index}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          rowId={rowId}
          setSelectedId={setSelectedId}
          setIsEditMode={setIsEditMode}
          setDeleteModalOpen={setDeleteModalOpen}
          setFormData={setFormData}
          setOriginalData={setOriginalData}
          setShowModal={setShowModal}
          items={data}
          actions={actions}
        />
      );
      
    },
  },
];
