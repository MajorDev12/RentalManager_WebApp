import ActionCell from "../components/ActionCell";
import { Link } from 'react-router-dom';

export const getColumns = ({
  endpoint,
  activeRow,
  setActiveRow,
  setSelectedId,
  setIsEditMode,
  setDeleteModalOpen,
  setFormData,
  setOriginalData,
  setShowModal,
  charges,
}) => [
  { header: 'Property Name', accessorKey: 'propertyName' },
  { header: 'Unit Name', accessorKey: 'name' },
  { header: 'Unit Type', accessorKey: 'unitType' },
  { header: 'Status', accessorKey: 'status' },
  {
    header: 'Action',
    accessorKey: 'id',
    cell: info => {
      const rowId = info.getValue();
      
      const actions = (
        <>
          <li onClick={() => {
            setIsEditMode(true);
            const item = charges.find(i => i.id === rowId);
            setFormData(item);
            setOriginalData(item);
            setShowModal(true);
            setActiveRow(null);
          }} className="actionLink">Edit</li>

          <li className="actionLink">
            <Link to={`/${endpoint}/${rowId}`} className="view">View</Link>
          </li>

          <li className="actionLink">Print</li>

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
          items={charges}
          actions={actions}
        />
      );
  },
  },
];
