// src/columns/propertyColumns.js
import PropertyImage from "../../assets/PropertyImg.png";
import ActionCell from "../../components/ui/ActionCell";
import { Link } from 'react-router-dom';

const endpoint = "Properties";


export const getPropertyColumns = ({
  activeRow,
  setActiveRow,
  onEdit,
  onDelete,
}) => [
  {
    header: 'Img',
    accessorKey: 'image',
    cell: info => (
      <img
        src={info.getValue() || PropertyImage}
        alt="property"
        width="18"
        height="18"
        style={{ borderRadius: "4px" }}
      />
    ),
  },
  { header: 'Property Name', accessorKey: 'name' },
  { header: 'Email Address', accessorKey: 'emailAddress' },
  { header: 'Mobile Number', accessorKey: 'mobileNumber' },
  { header: 'Country', accessorKey: 'country' },
  { header: 'Area', accessorKey: 'area' },
  { header: 'Floors', accessorKey: 'floor' },
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


