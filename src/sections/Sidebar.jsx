import React, { useEffect, useState } from "react";
import { adjustSidebarWidth } from '../helpers/adjustSidebarWidth';
import "../css/sidebar.css";
import NavLink from '../components/NavLink';
import DropDownList from '../components/DropDownList';
import { MdDashboard } from "react-icons/md";
import { BsBuildingFill } from "react-icons/bs";
import { FaHouse, FaBuildingUser, FaUsers, FaMoneyCheckDollar, FaXmark } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { IoIosNotifications, IoMdSettings } from "react-icons/io";

const Sidebar = ({ width, setWidth }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const initialWidth = 260;

  useEffect(() => {
    const handleResize = () => adjustSidebarWidth(setWidth);
    adjustSidebarWidth(setWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setWidth]);

  // Closes sidebar
  const handleCloseSidebar = () => {
    if (window.innerWidth <= 768){
      setWidth(0);
      setActiveIndex(null);
    }
  };

  return (
    <>
      {/* Dark overlay when sidebar is open on mobile */}
      {width === initialWidth && window.innerWidth <= 768 && (
        <div
          className="sidebar-overlay"
          onClick={handleCloseSidebar}
        ></div>
      )}

      <div id="sidebar" style={{ width: `${width}px` }}>
        <div className="header">
          <div className="header-left">
            <MdDashboard className="logoIcon" />
            {width === initialWidth && <h3 className="logoName">REAL ESTATE</h3>}
          </div>

          {/* Close Icon for mobile */}
          {window.innerWidth <= 768 && width === initialWidth && (
            <FaXmark className="closeIcon" onClick={handleCloseSidebar} />
          )}
        </div>

        <ul className="navLinks">
          <NavLink
            route={"/"}
            icon={<MdDashboard className="navLinkIcon" />}
            name="Dashboard"
            isOpen={width === initialWidth}
            index={0}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          />

          <NavLink
            icon={<BsBuildingFill className="navLinkIcon" />}
            name="Properties"
            arrow={true}
            isOpen={width === initialWidth}
            index={1}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          >
            <DropDownList itemName="All Properties" route={"/Properties"} />
            <DropDownList itemName="Utility Bills" route={"/UtilityBill"} />
            <DropDownList itemName="Add Unit Type" route={"/UnitType"} />
          </NavLink>

          <NavLink
            icon={<FaHouse className="navLinkIcon" />}
            name="Houses"
            arrow={true}
            isOpen={width === initialWidth}
            index={2}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          >
            <DropDownList itemName="All Houses" route={"/units"} />
            <DropDownList itemName="Vacants" route={"/units"} />
          </NavLink>

          <NavLink
            icon={<FaUsers className="navLinkIcon" />}
            name="Tenants"
            arrow={true}
            isOpen={width === initialWidth}
            index={3}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          >
            <DropDownList itemName="All Tenants" route={"/Tenants"} />
            <DropDownList itemName="Assign House" route={"/AssignUnit"} />
            <DropDownList itemName="Vacated" route={"/units"} />
          </NavLink>

          <NavLink
            route={"/Properties"}
            icon={<FaBuildingUser className="navLinkIcon" />}
            name="Landlords"
            isOpen={width === initialWidth}
            index={4}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          />

          <NavLink
            icon={<FaMoneyCheckDollar className="navLinkIcon" />}
            name="Payments"
            arrow={true}
            isOpen={width === initialWidth}
            index={5}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          >
            <DropDownList itemName="All Transactions" route={"/Transactions"} />
            <DropDownList itemName="Unpaid Tenants" route={"/UnpaidTenants"} />
            <DropDownList itemName="Expense" route={"/Expenses"} />
          </NavLink>

          <NavLink
            route={"/Reports"}
            icon={<BiSolidReport className="navLinkIcon" />}
            name="Reports"
            isOpen={width === initialWidth}
            index={6}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          />

          <NavLink
            icon={<IoIosNotifications className="navLinkIcon" />}
            name="Notifications"
            arrow={true}
            isOpen={width === initialWidth}
            index={7}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          >
            <DropDownList itemName="Email" route={"/units"} />
            <DropDownList itemName="Sms" route={"/units"} />
          </NavLink>

          <NavLink
            icon={<IoMdSettings className="navLinkIcon" />}
            name="Management"
            arrow={true}
            isOpen={width === initialWidth}
            index={8}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          >
            <DropDownList itemName="Profile" route={"/units"} />
            <DropDownList itemName="Settings" route={"/units"} />
            <DropDownList itemName="System Logs" route={"/units"} />
          </NavLink>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
