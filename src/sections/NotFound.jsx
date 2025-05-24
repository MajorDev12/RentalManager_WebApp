import React from 'react';
import { Link } from 'react-router-dom';
import { IoAlertCircleOutline } from 'react-icons/io5';
import '../css/notfound.css';

const NotFound = ({ message = "Page Not Found", showHomeLink = true }) => {
  return (
    <div className="notfound-container">
      <IoAlertCircleOutline size={80} className="notfound-icon" />
      <h2 className="notfound-title">{message}</h2>
      {showHomeLink && (
        <Link to="/" className="notfound-link">
          Go Back Home
        </Link>
      )}
    </div>
  );
};

export default NotFound;
