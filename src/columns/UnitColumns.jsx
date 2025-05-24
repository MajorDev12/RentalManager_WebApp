import ActionCell from "../components/ActionCell";

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
  charges,
}) => [
  { header: 'Property Name', accessorKey: 'propertyName' },
  { header: 'Unit Name', accessorKey: 'name' },
  { header: 'Unit Type', accessorKey: 'unitType' },
  { header: 'Status', accessorKey: 'status' },
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
        items={charges}
      />
    ),
  },
];
