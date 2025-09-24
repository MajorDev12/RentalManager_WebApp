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
  { 
    header: 'Type', 
    accessorKey: 'transactionType',
    cell: info => {
      const status = info.getValue();
      let Icon = null;
      let iconColor = '';

      switch (status?.toLowerCase()) {
        case 'charge':
          Icon = TiArrowDown;
          iconColor = 'red';
          break;
        case 'payment':
          Icon = TiArrowUp;
          iconColor = 'green';
          break;
        default:
          Icon = null;
      }

      return (
        <span className="status-tag">
          {status}{" "}
          {Icon && <Icon style={{ color: iconColor, fontSize: "18px", float: "right", verticalAlign: "middle" }} />}
        </span>
      );
    }
  },
  { header: 'Category', accessorKey: 'transactionCategory' },
  { header: 'Amount', accessorKey: 'amount' },
  { header: 'Month For', accessorKey: 'monthFor' },
  { header: 'Year For', accessorKey: 'yearFor' },
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
