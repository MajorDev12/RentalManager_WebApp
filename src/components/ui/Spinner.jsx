import React from 'react'
import { ImSpinner3 } from "react-icons/im";
import "../../css/spinner.css";

const Spinner = () => {
  return (
    <div className='spinnerContainer'>
        <ImSpinner3 className='spinnerIcon' />
    </div>
  )
}

export default Spinner