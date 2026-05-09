import React from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import "../css/notfound.css";

const NotFound = ({
  title = "Page Not Found",
  message = "The page you’re looking for doesn’t exist or has been moved.",
  showHomeLink = true,
}) => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <IoSearchOutline className="notfound-icon" />

        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">{title}</h2>

        <p className="notfound-message">{message}</p>

        {showHomeLink && (
          <Link to="/" className="notfound-button">
            Go Back Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
