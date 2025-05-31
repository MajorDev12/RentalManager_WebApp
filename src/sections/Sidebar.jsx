import React, { useEffect, useState } from "react";
import { adjustSidebarWidth } from '../helpers/adjustSidebarWidth';
import "../css/sidebar.css"
import NavLink from '../components/NavLink'
import DropDownList from '../components/DropDownList'
import { MdDashboard } from "react-icons/md";
import { BsBuildingFill } from "react-icons/bs";
import { FaHouse } from "react-icons/fa6";
import { FaBuildingUser } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";

const Sidebar = ({width, setWidth}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const initialWidth = 260;


    useEffect(() => {
    const handleResize = () => adjustSidebarWidth(setWidth);
    adjustSidebarWidth(setWidth); // Run on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Clean up
  }, []);


  return (
    <div id="sidebar" style={{width: `${width}px`}}>
        <div className="header">
          <MdDashboard className="logoIcon"/>
           {width === initialWidth && <h3 className="logoName">REAL ESTATE</h3>}
        </div>



        <ul className="navLinks">
            <NavLink route={"/"} icon={<MdDashboard className="navLinkIcon"/>}
             name="Dashboard"
              isOpen={width === initialWidth}
              index={0}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}/>

            <NavLink icon={<BsBuildingFill className="navLinkIcon" />}
              name="Properties"
              arrow={true}
              isOpen={width === initialWidth}
              index={1}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}>
              <DropDownList itemName="All Properties" route={"/Properties"} />
              <DropDownList itemName="Utility Bills" route={"/UtilityBill"} />
              </NavLink>

            <NavLink icon={<FaHouse className="navLinkIcon" />}
              name="Houses"
              arrow={true}
              isOpen={width === initialWidth}
              index={2}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}>
              <DropDownList itemName="All Houses" route={"/units"} />
              <DropDownList itemName="Vacants" route={"/units"} />
              <DropDownList itemName="Add Unit Type" route={"/UnitType"} />
            </NavLink>

             <NavLink icon={<FaUsers className="navLinkIcon" />}
              name="Tenants"
              arrow={true}
              isOpen={width === initialWidth}
              index={3}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}>
              <DropDownList itemName="All Tenants" route={"/units"} />
              <DropDownList itemName="Vacated" route={"/units"} />
            </NavLink>

             <NavLink route={"/Properties"}  icon={<FaBuildingUser className="navLinkIcon" />}
              name="Landlords"
               isOpen={width === initialWidth}
               index={4}
               activeIndex={activeIndex}
               setActiveIndex={setActiveIndex}></NavLink>

             <NavLink icon={<FaMoneyCheckDollar className="navLinkIcon" />}
                name="Payments"
                arrow={true}
                isOpen={width === initialWidth}
                index={5}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}>
                <DropDownList itemName="All Transactions" route={"/units"} />
                <DropDownList itemName="Unpaid Tenants" route={"/units"} />
                <DropDownList itemName="Payment Methods" route={"/units"} />
              </NavLink>

            <NavLink icon={<BiSolidReport className="navLinkIcon" />}
                name="Reports"
                arrow={true}
                isOpen={width === initialWidth}
                index={6}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}>
              <DropDownList itemName="Expense" route={"/units"} />
              <DropDownList itemName="Revenue" route={"/units"} />
              <DropDownList itemName="Expense Vs Revenue" route={"/units"} />
            </NavLink>

             <NavLink icon={<IoIosNotifications className="navLinkIcon" />}
                name="Notifications"
                arrow={true}
                isOpen={width === initialWidth}
                index={7}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}>
              <DropDownList itemName="Email" route={"/units"} />
              <DropDownList itemName="Sms" route={"/units"} />
              <DropDownList itemName="Invoices" route={"/units"} />
            </NavLink>

            <NavLink icon={<IoMdSettings className="navLinkIcon" />}
                name="Management"
                arrow={true}
                isOpen={width === initialWidth}
                index={8}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}>
              <DropDownList itemName="Profile" route={"/units"} />
              <DropDownList itemName="Settings" route={"/units"} />
              <DropDownList itemName="System Logs" route={"/units"} />
            </NavLink>

           </ul>
    </div>
  )
}

export default Sidebar