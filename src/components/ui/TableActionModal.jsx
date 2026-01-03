import React from 'react'
import "../../css/tableactionmodal.css"
import { Link } from 'react-router-dom';


const TableActionModal = ({ children }) => {
  return (
    <ul className="actionList">
      {children}
      {/* <li onClick={onEdit} className="actionLink">Edit</li>
      <li className="actionLink"><Link to={viewId} className="view">View</Link></li>
      <li className="actionLink">Print</li>
      <li className="actionLink">Pdf</li>
      <li className="actionLink">Excel</li>
      <li className="actionLink" show={false}>Assign House</li>
      <li className="actionLink" show={false}>Approve</li>
      <li className="actionLink" show={false}>Reject</li>
      <li onClick={onDelete} className="actionLink">Delete</li> */}
    </ul>
  );
};



export default TableActionModal