import React from 'react';
import "../css/select.css"

const Select = ({ text = "--Select--", name, labelName, value, onChange, options = [], disabled }) => {
  return (
    <div className="selectContainer">
      <label htmlFor={name}>{labelName}</label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className='select'
        disabled={disabled}
      >
        <option value="">{text}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
