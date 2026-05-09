import React, { useEffect, useState } from "react";
import { adjustSidebarWidth } from "../../helpers/adjustSidebarWidth";
import "../../css/sidebar.css";

import NavLink from "../ui/NavLink";
import DropDownList from "../ui/DropDownList";

import { MdDashboard } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";

import { useAuthContext } from "../../auth/AuthContext";
import { can } from "../../auth/rbac";
import { sidebarConfig } from "../../config/sidebarConfig";

const Sidebar = ({ width, setWidth }) => {
  const { user } = useAuthContext();

  const [activeIndex, setActiveIndex] = useState(null);

  const initialWidth = 260;

  useEffect(() => {
    const handleResize = () => adjustSidebarWidth(setWidth);

    adjustSidebarWidth(setWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setWidth]);

  const handleCloseSidebar = () => {
    if (window.innerWidth <= 768) {
      setWidth(0);
      setActiveIndex(null);
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {width === initialWidth && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={handleCloseSidebar} />
      )}

      <div id="sidebar" style={{ width: `${width}px` }}>
        {/* HEADER */}
        {width >= 68 && (
          <div className="header">
            <div className="header-left">
              <MdDashboard className="logoIcon" />

              {width === initialWidth && (
                <h3 className="logoName">REAL ESTATE</h3>
              )}
            </div>

            {window.innerWidth <= 768 && width === initialWidth && (
              <FaXmark className="closeIcon" onClick={handleCloseSidebar} />
            )}
          </div>
        )}

        {/* NAVIGATION */}
        <ul className="navLinks">
          {sidebarConfig.map((item, index) => {
            if (item.permission && !can(user, item.permission)) {
              return null;
            }

            // SINGLE LINK
            if (!item.children) {
              return (
                <NavLink
                  key={item.label}
                  route={item.route}
                  icon={<item.icon className="navLinkIcon" />}
                  name={item.label}
                  isOpen={width === initialWidth}
                  index={index}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  onItemClick={handleCloseSidebar}
                />
              );
            }

            // DROPDOWN
            return (
              <NavLink
                key={item.label}
                icon={<item.icon className="navLinkIcon" />}
                name={item.label}
                arrow={true}
                isOpen={width === initialWidth}
                index={index}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onItemClick={handleCloseSidebar}
              >
                {item.children.map((child) => {
                  if (child.permission && !can(user, child.permission)) {
                    return null;
                  }

                  return (
                    <DropDownList
                      key={child.route}
                      itemName={child.label}
                      route={child.route}
                    />
                  );
                })}
              </NavLink>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
