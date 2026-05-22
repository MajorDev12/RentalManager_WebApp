import Input from "../../components/ui/Input";

export const getColumns = (onChange) => [
  {
    header: "Unit Name",
    accessorKey: "unitName",
  },
  {
    header: "Previous Reading",
    accessorKey: "previousReading",
  },

  {
    header: "Current Reading",
    accessorKey: "currentReading",
    cell: ({ row }) => (
      <Input
        type="number"
        name="currentReading"
        value={row.original.currentReading || ""}
        onChange={(name, value) => onChange(row.original.unitId, name, value)}
      />
    ),
  },
];
