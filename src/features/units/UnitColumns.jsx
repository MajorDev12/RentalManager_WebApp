import ActionCell from "../../components/ui/ActionCell";
import { Link } from 'react-router-dom';

export const getColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete
}) => [
  { header: 'Property Name', accessorKey: 'propertyName' },
  { header: 'Unit Name', accessorKey: 'name' },
  { header: 'Unit Type', accessorKey: 'unitType' },
  { header: 'Amount', accessorKey: 'amount' },
  { header: 'Status', accessorKey: 'status' },
  {
    header: 'Action',
    accessorKey: 'id',
    cell: info => {
      const rowId = info.getValue();
      
      const actions = (
        <>
          <li onClick={() => onEdit(rowId)} className="actionLink">Edit</li>

          <li onClick={() => onDelete(rowId)} className="actionLink">Delete</li>
        </>
      );

      return (
        <ActionCell
          rowId={rowId}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          actions={actions}
        />
      );
  },
  },
];
