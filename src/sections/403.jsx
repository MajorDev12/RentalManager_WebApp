import React from "react";
import { Link } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import "../css/unauthorized.css";

const UnAuthorized = ({
  message = "You don't have permission to access this page",
  showHomeLink = true,
}) => {
  return (
    <div className="unauth-container">
      <div className="unauth-card">
        <IoLockClosedOutline size={90} className="unauth-icon" />

        <h2 className="unauth-title">Access Restricted</h2>

        <p className="unauth-message">{message}</p>

        {showHomeLink && (
          <Link to="/" className="unauth-button">
            Return to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default UnAuthorized;
