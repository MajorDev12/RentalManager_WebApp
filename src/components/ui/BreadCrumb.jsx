import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { useAuthContext } from "../../auth/AuthContext";
import '../../css/breadcrumb.css';

const BreadCrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user} = useAuthContext();
  const isHome = location.pathname === "/";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const greetingText = isAuthenticated && user
  ? `${getGreeting()}, ${user.name ?? "User"}`
  : getGreeting();


  const segmentNameMap = {
    home: 'home',
    properties: 'Properties',
    property: 'Properties',
    units: 'Units',
    utilitybill: 'Utility Bill'
  };


  const pathnames = location.pathname.split('/').filter(Boolean);

  const handleClick = (index) => {
    const path = '/' + pathnames.slice(0, index + 1).join('/');
    navigate(path);
  };

  return (
    <div id="breadCrumb">
      {isHome && (
        <h1 className="greetings">
          {greetingText}
        </h1>
      )}
      <div className="navigator">
        <p onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</p>
        {
        pathnames.length >= 1
        ? pathnames.map((name, index) => (
          <React.Fragment key={index}>
            <IoIosArrowForward className='icon' />
            <p
              onClick={() => handleClick(index)}
              className={index === pathnames.length - 1 ? 'active' : ''}
              style={{ cursor: index === pathnames.length - 1 ? 'text' : 'pointer' }}
            >
              {segmentNameMap[name.toLowerCase()] || decodeURIComponent(name)}
            </p>
          </React.Fragment>
        ))
        : 
        <>
          <IoIosArrowForward className='icon' /> 
        </>
      }
      </div>
    </div>
  );
};

export default BreadCrumb;
