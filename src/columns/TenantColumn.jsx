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
  { header: 'Full Names', accessorKey: 'fullName' },
  { header: 'Email Address', accessorKey: 'emailAddress' },
  { header: 'Mobile Number', accessorKey: 'mobileNumber' },
  { header: 'Property Name', accessorKey: 'user.propertyName' },
  { header: 'unit', accessorKey: 'unit' },
  { header: 'Status', accessorKey: 'tenantStatus' },
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
