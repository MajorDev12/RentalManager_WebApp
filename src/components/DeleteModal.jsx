import React from 'react';
import { FaXmark } from "react-icons/fa6";
import PrimaryButton from './PrimaryButton';
import '../css/modal.css';

const DeleteModal = ({ isOpen, title, onClose, onSubmit, loadingBtn }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="header">
          <h2 className='headerName'>{title}</h2>
          <FaXmark onClick={onClose} className='cancelIcon' />
        </div>

        <form onSubmit={onSubmit} className="modalForm">
          <h3>Are you sure you want to delete this item?</h3>
          <div className="modalActions">
            <button type="button" onClick={onClose} className="cancelBtn">Cancel</button>

            <PrimaryButton 
              name="Delete Item" 
              type="submit" 
              disabled={loadingBtn}
              loading={loadingBtn} 
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal;
