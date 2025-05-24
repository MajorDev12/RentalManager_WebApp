// src/columns/propertyColumns.js
import PropertyImage from "../assets/PropertyImg.png";
import ActionCell from "../components/ActionCell";

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
    cell: info => (
      <ActionCell
        endpoint={endpoint}
        rowIndex={info.row.index}
        activeRow={activeRow}
        setActiveRow={setActiveRow}
        rowId={info.getValue()}
        setSelectedId={setSelectedId}
        setIsEditMode={setIsEditMode}
        setDeleteModalOpen={setDeleteModalOpen}
        setFormData={setFormData}
        setOriginalData={setOriginalData}
        setShowModal={setShowModal}
        items={properties}
      />
    ),
  },
];
