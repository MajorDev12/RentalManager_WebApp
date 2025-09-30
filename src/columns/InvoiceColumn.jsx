import ActionCell from "../components/ActionCell";
import { TiArrowDown } from "react-icons/ti";
import { TiArrowUp } from "react-icons/ti";
import { Link } from 'react-router-dom';
import '../css/tenant.css';

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
  data
}) => [
  { header: 'Invoice Number', accessorKey: 'invoiceNumber' },
  { header: 'totalAmount', accessorKey: 'totalAmount' },
  { 
    header: 'Month For', 
    accessorKey: 'transactions.transactionDate',
    cell: info => {
      const date = info.getValue();
      <p>{date}</p>
    }
  },
  { header: 'Status', accessorKey: 'status' },
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
            <Link to={`/${endpoint}/${rowId}`} className="view">Print</Link>
          </li>

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
