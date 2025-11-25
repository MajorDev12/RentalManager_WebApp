import '../css/tenant.css';

export const getColumns = () => [
  { header: 'Full Name', accessorKey: 'fullName' },
  { header: 'Property', accessorKey: 'propertyName' },
  { header: 'Unit', accessorKey: 'unitName' },
  { header: 'Category', accessorKey: 'categoryName' },
  { header: 'Charge', accessorKey: 'totalCharges' },
  { header: 'Payment', accessorKey: 'totalPayments' },
  { header: 'Balance', accessorKey: 'balance' }
];
