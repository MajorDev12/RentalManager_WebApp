import React from "react";
import "../../css/checkbox.css";

const CheckBox = ({ labelName, onChange, name, checked }) => {
  return (
    <div className="CheckBoxContainer">
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        onChange={(e) => onChange(name, e.target.checked)}
        className="Checkbox"
      />

      <label htmlFor={name} className="CheckboxLabel">
        {labelName}
      </label>
    </div>
  );
};

export default CheckBox;
