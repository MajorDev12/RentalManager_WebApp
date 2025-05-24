import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const NavLink = ({
  icon,
  name,
  arrow = false,
  route,
  isOpen,
  children,
  index,
  activeIndex,
  setActiveIndex,
}) => {
  const [hovered, setHovered] = useState(false);

  const toggleDropdown = () => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const showDropdown = activeIndex === index || (!isOpen && hovered);

  return (
    <div
      className="navLink"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <li className="link" onClick={arrow ? toggleDropdown : undefined}>
        <Link to={route}>
          {icon}
          {isOpen && <h3 className="name">{name}</h3>}
        </Link>

        {isOpen && arrow && (
          <div className="arrow">
            {activeIndex === index ? (
              <IoIosArrowDown className="navLinkIcon" />
            ) : (
              <IoIosArrowForward className="navLinkIcon" />
            )}
          </div>
        )}
      </li>

      <div className={`dropdownContainer ${showDropdown ? "open" : ""} ${!isOpen ? "hoverMode" : ""}`}>
        <h3 className="headerName">{name}</h3>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            onSelect: () => setActiveIndex(null), 
          })
        )}
      </div>
    </div>
  );
};


export default NavLink;
