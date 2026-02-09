import ActionCell from "../../components/ui/ActionCell";
import { Link } from 'react-router-dom';

const endpoint = "Expenses";

export const getColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete
}) => [
  { header: 'propertyname', accessorKey: 'propertyName' },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Amount', accessorKey: 'amount' },
  { header: 'Notes', accessorKey: 'notes' },
  {
    header: 'Action',
    accessorKey: 'id',
    cell: info => {
      const rowData = info.row.original; 
      const rowId = info.getValue();

      const actions = (
        <>
          <li onClick={() => {onEdit(rowId)}} className="actionLink">Edit</li>

          <li onClick={() => {onDelete(rowId)}} className="actionLink">Delete</li>
        </>
      );

      return (
        <ActionCell
          rowIndex={info.row.index}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          rowId={rowId}
          actions={actions}
        />
      );
      
    },
  },
];
