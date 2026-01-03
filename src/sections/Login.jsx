import React, { useState } from 'react';
import Input from "../components/ui/Input"
import PrimaryButton from "../components/ui/PrimaryButton"
import PropertyImage from "../assets/property.jpg";
import { validateTextInput } from '../helpers/validateTextInput'; 
import { validateMobileNumber } from '../helpers/validateMobileNumber'; 
import { validateEmail } from '../helpers/validateEmail'; 
import { addData } from '../helpers/addData';
import  "../css/login.css";
import { useApiRequest } from '../hooks/useApiRequest';
import { useAuthContext } from '../auth/AuthContext';




const Login = () =>{
    const { execute, loading } = useApiRequest();
    const { login } = useAuthContext();
    const [loadingBtn, setLoadingBtn] = useState(false);
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

  
  
  
  
  
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const isEmail = validateEmail(formData.loginIdentifier);
        const payload = isEmail
        ? { Email: formData.loginIdentifier, Password: formData.password }
        : { mobileNumber: formData.loginIdentifier, password: formData.password };


        await execute({
            request: () => login(payload),
            successMessage: "Login successful",
        });
        
    };



    return(
        <div id="login">
            <div className="left">
                <img src={PropertyImage} alt="" />
            </div>
            <div className="right">
                <h1 className="header">Login</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="col">
                        <div className="row">
                            <Input
                                type="text"
                                name={"loginIdentifier" }
                                placeholder="Email Address"
                                value={formData.loginIdentifier || ''}
                                labelName="Email Address"
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
                        </div>
                        <div className="row options">
                            <p>Forgot password ?</p>
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

export default Login