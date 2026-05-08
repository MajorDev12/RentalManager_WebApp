import ActionCell from "../../components/ui/ActionCell";


export const getColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete
}) => [
  { header: 'Property Name', accessorKey: 'propertyName' },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Amount', accessorKey: 'amount' },
  { header: 'IsReccuring', accessorKey: 'isReccurring' },
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
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          rowId={rowId}
          actions={actions}
        />
      );
      
    },
  },
];
