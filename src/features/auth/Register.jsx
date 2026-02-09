import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import PrimaryButton from "../../components/ui/PrimaryButton"
import PropertyImage from "../../assets/property.jpg";
import { validateMobileNumber } from '../../helpers/validateMobileNumber'; 
import { validateEmail } from '../../helpers/validateEmail'; 
import { Link } from 'react-router-dom';
import { handleFormSubmit } from "../../helpers/handleFormSubmit";
import { useApiRequest } from '../../hooks/useApiRequest';
import { useAuthContext } from '../../auth/AuthContext';
import  "../../css/login.css";



const Register = () =>{
    const navigate = useNavigate();
    const { execute, apiLoading } = useApiRequest();
    const { register } = useAuthContext();
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [formError, setFormError] = useState('');
    const [select, setSelect] = useState('');
    const EMPTY_FORM = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        mobileNumber: '',
        password: '',
        role: '',
    }
    const [formData, setFormData] = useState(EMPTY_FORM);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
        ...prev,
        [field]: value
        }));
    };


    const validateRegisterForm = () => {
        let { firstName, lastName, emailAddress, mobileNumber, password, role } = formData;
        
        
        if (!firstName || !lastName || !emailAddress || !mobileNumber || !password || !role) {
            return "Please fill in all fields.";
        }

        const isEmail = validateEmail(emailAddress);
        const isMobile = validateMobileNumber(mobileNumber, true);

        if (!isEmail) {
            return "Please enter a valid Email.";
        }

        if (!isMobile) {
            return "Please enter a valid Mobile Number.";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        return ''; // All good!
    };

  
    const handleSelect = (e) => {
        const { name, value } = e.target;
        setSelect(value);
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };
  
  
  
    const registerHandler = (e) => {
        handleFormSubmit({
            e,
            validateForm: validateRegisterForm,
            execute,
            request: () => register(formData),
            setFormError,
            setLoadingBtn,
            resetForm: () => setFormData(EMPTY_FORM),
            onSuccess: () => navigate("/login"),
        });
    };



    return(
        <div id="login">
            <div className="left">
                <img src={PropertyImage} alt="" />
            </div>
            <div className="right">
                <h1 className="header">Property Management System</h1>
                <form onSubmit={registerHandler}>
                    <div className="col">
                        <div className="row">
                            <Input
                                type="text"
                                name={"firstName" }
                                placeholder="First Name"
                                value={formData.firstName || ''}
                                labelName="First Name"
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name={"lastName" }
                                placeholder="Last Name"
                                value={formData.lastName || ''}
                                labelName="Last Name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="row">
                            <Input
                                type="text"
                                name={"emailAddress" }
                                placeholder="Email Address"
                                value={formData.emailAddress || ''}
                                labelName="Email Address"
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="mobileNumber"
                                placeholder="Enter Your Mobile Number"
                                value={formData.mobileNumber || ''}
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
                                passwordToggle
                            />

                            <Select
                                name="role"
                                labelName="Category"
                                value={formData.role || ''}
                                onChange={handleSelect}
                                options={[
                                    { value: 'Owner', label: 'Owner' },
                                    { value: 'Manager', label: 'Property Manager' },
                                ]}
                            />
                        </div>

                        <div className="row options">
                            <p>Forgot password ?</p>
                            <p>Remember Me</p>
                        </div>
                    </div>
                    {formError && <p className='errorMessage'>{formError}</p>}
                    <PrimaryButton 
                        name="Register" 
                        type="submit" 
                        disabled={loadingBtn}
                        loading={loadingBtn}
                    /> 
                    <p className='loginText'>Already have an Account? 
                        <span> <Link to={"/login"} className='link'>Login</Link></span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register