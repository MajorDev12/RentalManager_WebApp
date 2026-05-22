import React from "react";
import "../../css/button.css";
import Spinner from "./Spinner";

const PrimaryButton = ({
  name,
  onClick,
  type,
  disabled,
  loading,
  isActive = true,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      id="primaryBtn"
      className={isActive ? "activeBtn" : "inactiveBtn"}
    >
      {loading ? <Spinner /> : name}
    </button>
  );
};

export default PrimaryButton;
