import React from "react";
import "../../css/checkbox.css";

const CheckBox = ({
    type = "checkbox",
    labelName,
    onChange,
    name,
    checked
}) =>{

    return(
        <div className="CheckBoxContainer">
            <label htmlFor={name}>{labelName}</label>
            <input
                type={type}
                name={name}
                id={name}
                checked={checked}
                onChange={(e) => onChange(name, e.target.checked)}
                className="Checkbox"
            />
        </div>
    )
}

export default CheckBox;