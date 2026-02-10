import ActionCell from "../../components/ui/ActionCell";
import { TiArrowDown } from "react-icons/ti";
import { TiArrowUp } from "react-icons/ti";
import { Link } from 'react-router-dom';
import '../../css/tenant.css';

const endpoint = "Transactions";

export const getColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete
}) => [
  { header: 'Tenant Names', accessorKey: 'userName' },
  { 
    header: 'Type', 
    accessorKey: 'transactionType',
    cell: info => {
      var status = info.getValue();
      let Icon = null;
      let iconColor = '';

      switch (status?.toLowerCase()) {
        case 'charge':
          Icon = TiArrowDown;
          iconColor = 'red';
          status = "Invoice";
          break;
        case 'payment':
          Icon = TiArrowUp;
          iconColor = 'green';
          break;
        case 'expense':
          Icon = TiArrowDown;
          iconColor = 'red';
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
  { 
    header: 'Category',
    accessorKey: 'transactionCategory',
    // cell: info => {
    //   const rowData = info.row.original; 
    //   var category = info.getValue();

    //   switch (category?.toLowerCase()) {
    //     case 'expense':
    //       category = "category";
    //       break;
    //     case 'payment':
    //       category = "category";
    //       break;
    //     case 'expense':
    //       category = "category";
    //       break;
    //     default:
    //       category = "category";
    //   }
  
    // }
  },
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
          <li onClick={() => {onEdit(rowId)}} className="actionLink">Edit</li>

          <li className="actionLink">
            <Link to={`/${endpoint}/${rowId}`} className="view">Print</Link>
          </li>

          <li onClick={() => {onDelete(rowId)}} className="actionLink">Delete</li>
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
