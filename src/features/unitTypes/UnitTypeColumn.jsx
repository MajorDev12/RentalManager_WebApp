import { Link } from 'react-router-dom';
import ActionCell from "../../components/ui/ActionCell";

const endpoint = "UnitTypes";

export const getColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete
}) => [
  { header: 'Property Name', accessorKey: 'propertyName' },
  { header: 'Unit Type', accessorKey: 'name' },
  { header: 'Notes', accessorKey: 'notes' },
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
          rowIndex={info.row.index}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          actions={actions}
        />
      );
  },
  },
];
