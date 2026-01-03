import React from 'react';
import { FaXmark } from "react-icons/fa6";
import PrimaryButton from './PrimaryButton'; // adjust path if needed
import '../css/modal.css';

const Modal = ({ isOpen, onClose, onSubmit, isEditMode, children, title = "Add Item", errorMessage = "", loadingBtn = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="header">
          <h2 className='headerName'>{title}</h2>
          <FaXmark onClick={onClose} className='cancelIcon' />
        </div>

        <form onSubmit={onSubmit} className="modalForm">
          {children}
          <p className="caution">Only inputs with asterik (*) are mandatory</p>
          {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
          <div className="modalActions">
            <button type="button" onClick={onClose} className="cancelBtn">Cancel</button>

            <PrimaryButton 
              name={isEditMode ? "Update" : "Add New"} 
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

export default Modal;
