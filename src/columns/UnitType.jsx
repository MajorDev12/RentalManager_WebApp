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
  { header: 'Unit Type', accessorKey: 'name' },
  { header: 'Amount', accessorKey: 'amount' },
  { header: 'Notes', accessorKey: 'notes' },
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
