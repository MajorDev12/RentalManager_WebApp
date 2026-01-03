import React, { useState } from 'react';
import Input from "../components/ui/Input"
import PrimaryButton from "../components/ui/PrimaryButton"
import  "../css/login.css";
import PropertyImage from "../assets/property.jpg";
import { validateTextInput } from '../helpers/validateTextInput'; 
import { validateMobileNumber } from '../helpers/validateMobileNumber'; 
import { validateEmail } from '../helpers/validateEmail'; 
import { addData } from '../helpers/addData';




const Register = () =>{
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [charges, setCharges] = useState([]);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        loginIdentifier: '',
        password: '',
    });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


    const validateForm = () => {
    let { loginIdentifier, password } = formData;

    if (!loginIdentifier || !password) {
        return "Please enter all fields.";
    }

    const isEmail = validateEmail(loginIdentifier);
    const isMobile = validateMobileNumber(loginIdentifier, true);

    if (!isEmail && !isMobile) {
        return "Please enter a valid Email or Mobile Number.";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }

    return ''; // All good!
    };

  
  
  
  
  
  const handleFormSubmit = (e) => {
    const isEmail = validateEmail(formData.loginIdentifier);
    const payload = isEmail
    ? { emailAddress: formData.loginIdentifier, password: formData.password }
    : { mobileNumber: formData.loginIdentifier, password: formData.password };


    addData({
    e,
    validateForm,
    formData: payload,
    endpoint: 'Login',
    setFormError,
    setLoadingBtn,
    setFormData,
    setData: setCharges,
    setLoading,
    });
    };



    return(
        <div id="login">
            <div className="left">
                <img src={PropertyImage} alt="" />
            </div>
            <div className="right">
                <h1 className="header">Property Management System</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="col">
                        <div className="row">
                            <Input
                                type="text"
                                name={"loginIdentifier" }
                                placeholder="First Name"
                                value={formData.loginIdentifier || ''}
                                labelName="First Name"
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name={"loginIdentifier" }
                                placeholder="Last Name"
                                value={formData.loginIdentifier || ''}
                                labelName="Last Name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="row">
                            <Input
                                type="text"
                                name={"loginIdentifier" }
                                placeholder="Email Address"
                                value={formData.loginIdentifier || ''}
                                labelName="Email Address"
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="password"
                                placeholder="Enter Your Mobile Number"
                                value={formData.password || ''}
                                labelName="Mobile Number"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="row">
                            <Input
                            type="password"
                            name="password"
                            placeholder="Enter Your Password"
                            value={formData.password || ''}
                            labelName="Password"
                            onChange={handleInputChange}
                        />

                        <Input
                            type="password"
                            name="password"
                            placeholder="Confirm Your Password"
                            value={formData.password || ''}
                            labelName="Confirm Password"
                            onChange={handleInputChange}
                        />
                        </div>
                        <div className="row options">
                            <p>Forgot password ?</p>
                            <p>Remember Me</p>
                        </div>
                    </div>
                    {formError && <p className='errorMessage'>{formError}</p>}
                    <PrimaryButton 
                        name="Login" 
                        type="submit" 
                        disabled={loadingBtn}
                        loading={loadingBtn}
                    /> 
                    <p className='loginText'>Already Registered?  <span> Login Here</span></p>
                </form>
            </div>
        </div>
    )
}

export default Register