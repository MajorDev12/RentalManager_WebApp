import ActionCell from "../../components/ui/ActionCell";
import { Link } from 'react-router-dom';

const endpoint = "UtilityBill";

export const getColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete
}) => [
  { header: 'Property Name', accessorKey: 'propertyName' },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Amount', accessorKey: 'amount' },
  { header: 'isReccuring', accessorKey: 'isReccuring' },
  {
    header: 'Action',
    accessorKey: 'id',
    cell: info => {
      const rowId = info.getValue();

      const actions = (
        <>
          <li onClick={() => onEdit(rowId)} className="actionLink">Edit</li>

          <li className="actionLink">
            <Link to={`/${endpoint}/${rowId}`} className="view">View</Link>
          </li>

          <li className="actionLink">Print</li>

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
