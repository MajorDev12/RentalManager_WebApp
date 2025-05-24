import React from 'react'
import "../css/input.css"

const Input = ({ type, name, labelName, placeholder, value, onChange }) => {
  return (
    <div className="inputContainer">
      <label htmlFor={name}>{labelName}</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className='Input'
      />
    </div>
  );
};

export default Input