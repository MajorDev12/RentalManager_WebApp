import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import '../../css/breadcrumb.css';

const BreadCrumb = ({ greetings = "Good Morning, Admin" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const segmentNameMap = {
    home: 'home',
    properties: 'Properties',
    property: 'Properties',
    units: 'Units',
    utilitybill: 'Utility Bill'
  };


  const pathnames = location.pathname.split('/').filter(Boolean); // Removes empty strings

  const handleClick = (index) => {
    const path = '/' + pathnames.slice(0, index + 1).join('/');
    navigate(path);
  };

  return (
    <div id="breadCrumb">
      <h1 className="greetings">{greetings}</h1>
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
