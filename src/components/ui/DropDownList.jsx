import { Link } from 'react-router-dom';

const DropDownList = ({ itemName, route, onSelect }) => (
  <ul className="dropDownList">
    <li>
      <Link to={route} onClick={onSelect}>
        {itemName}
      </Link>
    </li>
  </ul>
);

export default DropDownList;
