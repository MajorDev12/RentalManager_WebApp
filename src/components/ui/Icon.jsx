import { iconRegistry } from "../../config/iconRegistry";

const Icon = ({ name, color, size = 16 }) => {
  const Component = iconRegistry[name];

  if (!Component) return null;

  return <Component size={size} color={color} />;
};

export default Icon;
