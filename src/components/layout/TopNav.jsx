import React, { useState, useEffect } from "react";
import { toggleSidebar } from "../../helpers/toggleSidebar";
import ThemeMode from "../../components/ui/ThemeToggle";
import "../../css/topbar.css";
import ProfileImg from "../../assets/profile.png";
import { FiMessageSquare } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";

import Dropdown from "@mui/joy/Dropdown";
import Input from "../../components/ui/Input";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";

import { useAuthContext } from "../../auth/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { getData } from "../../helpers/getData";
import { formatDate } from "../../helpers/formatDate";
import { notificationService } from "../../features/notifications/notificationService";
import { useApiRequest } from "../../hooks/useApiRequest";

const TopNav = ({ width, setWidth }) => {
  const { isAuthenticated, logout, user } = useAuthContext();
  const { search, setSearch } = useSearch();
  const { execute, apiLoading } = useApiRequest();
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    await getData({
      execute,
      request: () => notificationService.getUnRead(user.id),
      setData: setNotifications,
      setLoading: setNotificationLoading,
    });
  };

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = async () => {
    navigate("/Notifications");
  };

  return (
    <div id="topBar">
      <GiHamburgerMenu
        className="icon Hamburger"
        onClick={() => toggleSidebar(setWidth)}
      />

      <div className="center">
        <Input
          name="searchTerm"
          value={search}
          onChange={(f, value) => setSearch(value)}
          placeholder="Search anything..."
        />
      </div>

      <div className="rightSide">
        {/* Notification Dropdown */}
        <Dropdown
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuButton
            sx={{
              backgroundColor: "transparent",
              padding: "0px",
              borderRadius: "8px",
              border: "none",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Badge
              badgeContent={unreadCount}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              className="badge"
            >
              <IoNotificationsOutline className="icon Notification" />
            </Badge>
          </MenuButton>
          <Menu
            sx={{
              borderRadius: "10px",
              color: "var(--textColor)",
              backgroundColor: "var(--containerColor)",
              boxShadow: "var(--shadow)",
              border: "none",
              minWidth: "280px",
            }}
            className="menu"
          >
            {notifications.length === 0 && (
              <MenuItem className="menuItem empty">No notifications</MenuItem>
            )}

            {notifications.map((n) => (
              <MenuItem
                key={n.id}
                className={`menuItem ${!n.isRead ? "unread" : ""}`}
                onClick={() => handleNotificationClick()}
              >
                <div className="title">{n.title}</div>
                <div className="message">{n.message}</div>
                <small className="time">{formatDate(n.createdAt)}</small>
              </MenuItem>
            ))}
          </Menu>
        </Dropdown>

        {/* Theme toggle */}
        <ThemeMode />

        {/* Profile Dropdown */}
        <Dropdown className="dropdown">
          <MenuButton
            sx={{
              backgroundColor: "transparent",
              borderRadius: "8px",
              border: "none",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <div className="profile">
              <img src={ProfileImg} alt="Profile" />
            </div>
          </MenuButton>
          <Menu
            sx={{
              borderRadius: "10px",
              color: "var(--textColor)",
              backgroundColor: "var(--containerColor)",
              boxShadow: "var(--shadow)",
              border: "none",
              minWidth: "180px",
            }}
            className="menu"
          >
            <MenuItem className="menuItem">My Profile</MenuItem>
            <MenuItem className="menuItem">Settings</MenuItem>

            {!isAuthenticated ? (
              <Link to="/login" className="login">
                <MenuItem className="menuItem">Login</MenuItem>
              </Link>
            ) : (
              <MenuItem className="menuItem" onClick={handleLogout}>
                Logout
              </MenuItem>
            )}
          </Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopNav;
