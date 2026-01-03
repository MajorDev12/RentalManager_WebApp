// src/columns/propertyColumns.js
import PropertyImage from "../assets/PropertyImg.png";
import ActionCell from "../components/ui/ActionCell";
import { Link } from 'react-router-dom';

export const getPropertyColumns = ({
  endpoint,
  activeRow,
  setActiveRow,
  setSelectedId,
  setIsEditMode,
  setDeleteModalOpen,
  setFormData,
  setOriginalData,
  setShowModal,
  properties,
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
          <li onClick={() => {
            setIsEditMode(true);
            const item = properties.find(i => i.id === rowId);
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
          items={properties}
          actions={actions}
        />
      );
    },
  },
];
