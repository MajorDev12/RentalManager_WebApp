import ProfileImg from "../../assets/profile.png";
import '../../css/tenant.css';

export const getColumns = () => [
  {
    header: 'Img',
    accessorKey: 'profilePhotoUrl',
    cell: info => (
      <img
        src={info.getValue() || ProfileImg}
        alt="property"
        width="25"
        height="25"
        style={{ borderRadius: "8px" }}
      />
    ),
  },
  { header: 'Full Name', accessorKey: 'fullName' },
  { header: 'Property', accessorKey: 'propertyName' },
  { header: 'Unit', accessorKey: 'unitName' },
  { header: 'Rent', accessorKey: 'totalCharges' },
  { header: 'Balance', accessorKey: 'balance' }
];
