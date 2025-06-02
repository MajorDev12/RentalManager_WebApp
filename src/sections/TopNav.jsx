import React from 'react';
import { toggleSidebar } from '../helpers/toggleSidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import "../css/topbar.css";
import ProfileImg from "../assets/profile.png";
import { IoNotificationsSharp } from "react-icons/io5";
import { BiSolidMessageRounded } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";

const TopNav = ({ width, setWidth }) => {

  return (
    <div id="topBar">
      <GiHamburgerMenu className="icon Hamburger" onClick={() => toggleSidebar(setWidth)} />
        <ThemeToggle />
      <div className="rightSide">
        <IoNotificationsSharp className="icon Notification" />
        <BiSolidMessageRounded className="icon Message" />
        <div className="profile">
          <img src={ProfileImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
