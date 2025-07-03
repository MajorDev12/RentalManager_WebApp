import React, { useState } from 'react';
import { toggleSidebar } from '../helpers/toggleSidebar';
import ThemeMode from '../components/ThemeToggle';
import "../css/topbar.css";
import ProfileImg from "../assets/profile.png";
import { FiMessageSquare } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import Badge from '@mui/material/Badge';
import { Link } from "react-router-dom"

import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import MenuButton from '@mui/joy/MenuButton';


const TopNav = ({ width, setWidth }) => {


  return (
    <div id="topBar">
      <GiHamburgerMenu className="icon Hamburger" onClick={() => toggleSidebar(setWidth)} />

      <div className="center">
        {/* Notification Dropdown */}
        <Dropdown anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}>
          <MenuButton 
            sx={{
              backgroundColor: 'transparent',
              padding: '0px',
              borderRadius: '8px',
              border: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Badge
              badgeContent={3}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              className="badge"
            >
              <IoNotificationsOutline className="icon Notification" />
            </Badge>
          </MenuButton>
          <Menu sx={{
            borderRadius: '10px',
            color: 'var(--textColor)',
            backgroundColor: 'var(--containerColor)',
            boxShadow: 'var(--shadow)',
            border: 'none',
            minWidth: '280px',
          }} className='menu'>
            <MenuItem className='menuItem'>New tenant added</MenuItem>
            <MenuItem className='menuItem'>Payment received</MenuItem>
            <MenuItem className='menuItem'>Unit marked vacant</MenuItem>
          </Menu>
        </Dropdown>





        {/* Message Dropdown */}
        <Dropdown className="dropdown">
          <MenuButton sx={{
              backgroundColor: 'transparent',
              borderRadius: '8px',
              border: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <Badge
              badgeContent={5}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              className="badge"
            >
              <FiMessageSquare className="icon Message" />
            </Badge>
          </MenuButton>
          <Menu sx={{
            borderRadius: '10px',
            color: 'var(--textColor)',
            backgroundColor: 'var(--containerColor)',
            boxShadow: 'var(--shadow)',
            border: 'none',
            minWidth: '280px',
          }} className='menu'>
            <MenuItem className='menuItem'>Message from John</MenuItem>
            <MenuItem className='menuItem'>Tenant inquiry</MenuItem>
            <MenuItem className='menuItem'>Support follow-up</MenuItem>
          </Menu>
        </Dropdown>
      </div>




      <div className="rightSide">
        <ThemeMode />
        {/* Profile Dropdown */}
        <Dropdown className="dropdown">
          <MenuButton sx={{
              backgroundColor: 'transparent',
              borderRadius: '8px',
              border: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <div className="profile">
              <img src={ProfileImg} alt="Profile" />
            </div>
          </MenuButton>
          <Menu sx={{
            borderRadius: '10px',
            color: 'var(--textColor)',
            backgroundColor: 'var(--containerColor)',
            boxShadow: 'var(--shadow)',
            border: 'none',
            minWidth: '180px',
          }} className='menu'>
            <MenuItem className='menuItem'>My Profile</MenuItem>
            <MenuItem className='menuItem'>Settings</MenuItem>
            <Link to="/Login" className='login'><MenuItem className='menuItem'>Login</MenuItem></Link>
          </Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopNav;
