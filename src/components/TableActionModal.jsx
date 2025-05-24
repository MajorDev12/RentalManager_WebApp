import React from 'react'
import "../css/tableactionmodal.css"
import { Link } from 'react-router-dom';


const TableActionModal = ({ onEdit, viewId, onDelete }) => {
  return (
    <ul className="actionList">
      <li onClick={onEdit} className="actionLink">Edit</li>
      <li className="actionLink"><Link to={viewId} className="view">View</Link></li>
      <li className="actionLink">Print</li>
       <li onClick={onDelete} className="actionLink">Delete</li>
    </ul>
  );
};



export default TableActionModal