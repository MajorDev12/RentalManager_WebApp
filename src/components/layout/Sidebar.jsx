import React, { useEffect, useState } from "react";
import { adjustSidebarWidth } from '../../helpers/adjustSidebarWidth';
import "../../css/sidebar.css";
import NavLink from '../ui/NavLink';
import DropDownList from '../ui/DropDownList';
import { MdDashboard } from "react-icons/md";
import { BsBuildingFill } from "react-icons/bs";
import { FaHouse, FaBuildingUser, FaUsers, FaMoneyCheckDollar, FaXmark } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import { useAuthContext } from "../../auth/AuthContext";


const Sidebar = ({ width, setWidth }) => {
  const { user } = useAuthContext();
  const roles = user?.roles ?? [];
  const [activeIndex, setActiveIndex] = useState(null);
  const initialWidth = 260;

  const hasRole = (...allowed) =>
  roles.some(r => allowed.includes(r));


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
          { width >= 68 &&
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
        }

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
          {hasRole("Owner", "Manager") && (
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
              <DropDownList itemName="Add Unit Type" route={"/UnitTypes"} />
            </NavLink>
          )}

        {hasRole("Owner", "Manager", "Landlord") && (
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
            <DropDownList itemName="All Houses" route={"/Units"} />
            <DropDownList itemName="Vacants" route={"/Units"} />
            {hasRole("Owner", "Manager") && (
              <DropDownList itemName="Maintenance" route={"/Maintenance"} />
            )}
          </NavLink>
        )}


        {hasRole("Owner", "Manager", "Landlord") && (
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
            {hasRole("Tenant") && (
              <DropDownList itemName="Profile" route={"/Profile"} />
            )}
            <DropDownList itemName="All Tenants" route={"/Tenants"} />
            <DropDownList itemName="Assign House" route={"/AssignUnit"} />
            <DropDownList itemName="Vacated" route={"/units"} />
          </NavLink>
        )}

        {hasRole("Tenant") && (
          <NavLink
            icon={<FaUsers className="navLinkIcon" />}
            name="Profile"
            arrow={false}
            isOpen={width === initialWidth}
            index={3}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          ></NavLink>
        )}

        {hasRole("Owner", "Manager", "Landlord") && (
          <NavLink
            icon={<FaMoneyCheckDollar className="navLinkIcon" />}
            name="Transactions"
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
        )}

        {hasRole("Tenant") && (
          <NavLink
            icon={<FaUsers className="navLinkIcon" />}
            name="Transactions"
            arrow={false}
            isOpen={width === initialWidth}
            index={3}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          ></NavLink>
        )}

        {hasRole("Owner", "Manager", "Landlord", "Tenant") && (
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
        )}



        {hasRole("Owner", "Manager", "Landlord") && (
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
            <DropDownList itemName="System" route={"/Notifications"} />
            <DropDownList itemName="Sms" route={"/Sms"} />
            <DropDownList itemName="Email" route={"/Email"} />
            <DropDownList itemName="WhatsApp" route={"/WhatsApp"} />
          </NavLink>
        )}

        {hasRole("Tenant") && (
          <NavLink
            icon={<IoIosNotifications className="navLinkIcon" />}
            name="Notifications"
            arrow={false}
            isOpen={width === initialWidth}
            index={7}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleCloseSidebar}
          >
            <DropDownList itemName="System" route={"/Notifications"} />
          </NavLink>
        )}


        {hasRole("Owner", "Manager", "Landlord") && (
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
            <DropDownList itemName="Profile" route={"/Profile"} />
            <DropDownList itemName="Settings" route={"/Settings"} />
            <DropDownList itemName="System Logs" route={"/units"} />
          </NavLink>
        )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
