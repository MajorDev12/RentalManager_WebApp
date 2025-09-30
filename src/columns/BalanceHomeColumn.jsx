import '../css/tenant.css';

export const getColumns = () => [
  { header: 'Full Name', accessorKey: 'fullName' },
  { header: 'Property', accessorKey: 'propertyName' },
  { header: 'Unit', accessorKey: 'unitName' },
  { header: 'Rent', accessorKey: 'totalCharges' },
  { header: 'Balance', accessorKey: 'balance' }
];
