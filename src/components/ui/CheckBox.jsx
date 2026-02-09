import React from "react";
import "../../css/checkbox.css";

const CheckBox = ({
    type = "checkbox",
    labelName,
    onChange,
    name,
    value
}) =>{

    return(
        <div className="CheckBoxContainer">
            <label htmlFor={name}>{labelName}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="Checkbox"
            />
        </div>
    )
}

export default CheckBox;