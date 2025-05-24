import React from 'react';
import "../css/select.css"

const Select = ({ name, labelName, value, onChange, options = [] }) => {
  return (
    <div className="selectContainer">
      <label htmlFor={name}>{labelName}</label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className='select'
      >
        <option value="">-- Select --</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
