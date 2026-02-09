import React, { useState } from "react";
import "../../css/input.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({
  type = "text",
  name,
  labelName,
  placeholder,
  value,
  onChange,
  passwordToggle = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    passwordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="inputContainer">
      <label htmlFor={name}>{labelName}</label>

      <div className="inputWrapper">
        <input
          type={inputType}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="Input"
        />

        {passwordToggle && (
          <span
            className="eyeIcon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
