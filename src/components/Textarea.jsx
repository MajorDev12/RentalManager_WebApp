import React from 'react'
import "../css/input.css"

const Textarea = ({type, labelName, name, placeholder, value, onChange}) => {
  return (
    <div className="inputContainer">
        <label htmlFor={name}>{labelName}</label>
        <textarea 
            type={type} 
            name={name}
            placeholder={placeholder} 
            value={value} 
            onChange={(e) => onChange(name, e.target.value)}
            className='Textarea'>
        </textarea>
    </div>
  )
}

export default Textarea