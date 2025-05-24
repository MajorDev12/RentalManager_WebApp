import React from 'react';
import '../css/button.css';
import Spinner from '../components/Spinner'; 

const PrimaryButton = ({ name, onClick, type, disabled, loading }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      id="primaryBtn"
    >
      {loading ? (
        <Spinner />
      ) : (
        name
      )}
    </button>
  );
};

export default PrimaryButton;
