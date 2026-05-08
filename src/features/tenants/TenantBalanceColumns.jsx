import '../../css/tenant.css';

export const getBalancesColumns = () => [
//   { header: 'Full Name', accessorKey: 'fullName' },
//   { header: 'Property', accessorKey: 'propertyName' },
//   { header: 'Unit', accessorKey: 'unitName' },
  { header: 'Category', accessorKey: 'categoryName' },
  { header: 'Month', accessorKey: 'month' },
  { header: 'Year', accessorKey: 'year' },
  { header: 'Charge', accessorKey: 'totalCharges' },
  { header: 'Payment', accessorKey: 'totalPayments' },
  { header: 'Balance', accessorKey: 'balance' }
];
