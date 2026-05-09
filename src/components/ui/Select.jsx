// src/components/ui/Select.jsx

import React from "react";
import "../../css/select.css";

const Select = ({
  text = "-- Select --",
  name,
  labelName,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  className = "",
}) => {
  return (
    <div className={`selectContainer ${className}`}>
      {labelName && (
        <label htmlFor={name} className="selectLabel">
          {labelName}
          {required && <span className="required">*</span>}
        </label>
      )}

      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="select"
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
