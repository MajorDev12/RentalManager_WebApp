import React, { useEffect, useState, useMemo } from "react";
import Input from "../../components/ui/Input";
import PrimaryButton from '../../components/ui/PrimaryButton';
import CustomTab from '../../components/ui/Tab';
import BreadCrumb from '../../components/ui/BreadCrumb';
import { validateTextInput } from '../../helpers/validateTextInput'; 
import { validateEmail } from '../../helpers/validateEmail'; 
import { handleFormSubmit } from '../../helpers/handleFormSubmit';
import { getData } from '../../helpers/getData';
import { profileService } from "./profileService";
import { useAuthContext } from "../../auth/AuthContext";
import { useApiRequest } from '../../hooks/useApiRequest';
import "../../css/profile.css";

const Profile = () => {
  const { isAuthenticated, logout, user} = useAuthContext();
  const { execute, apiLoading } = useApiRequest(); 
  const generalProfile_EmptyForm = {
    profilePhotoUrl: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
  }
  const [originalGeneralData, setOriginalGeneralData] = useState(generalProfile_EmptyForm);
  const [generalloadingBtn, setGeneralloadingBtn] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [generalFormData, setGeneralFormData] = useState(generalProfile_EmptyForm);
  const [passwordData, setPasswordData] = useState({});


  useEffect(() => {
      fetchGeneralData();
  }, []);

  useEffect(() => {
  if (originalGeneralData) {
    setGeneralFormData({
      firstName: originalGeneralData.firstName || "",
      lastName: originalGeneralData.lastName || "",
      userName: originalGeneralData.userName || "",
      email: originalGeneralData.email || "",
      profilePhotoUrl: originalGeneralData.profilePhotoUrl || "",
    });
  }
  }, [originalGeneralData]);


  const fetchGeneralData = async () => {
    await getData({
    execute,
    request: () => profileService.getUserData(user.id),
    setData: setOriginalGeneralData,
    setLoading: setGeneralloadingBtn,
    });
  };


  const handleInputChange = (name, value) => {

    const generalForFields = ['firstName', 'lastName', 'userName', 'email'];

    if (generalForFields.includes(name)) {
      setGeneralFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

  };

  const validateGeneralForm = () => {
    var { firstName, lastName, userName,  email} = generalFormData;

    if (!firstName || !lastName || !userName || !email) {
      return "Please fill in all required fields.";
    }

    if (!validateTextInput(firstName, true) || !validateTextInput(lastName, true) || !validateTextInput(userName, true)) {
      return "Names cannot be empty.";
    }

    if (!validateEmail(email)) {
      return "Please enter a valid Email Address.";
    }

    if(originalGeneralData != null){
      return validateChange(originalGeneralData, generalFormData);
    }

    return '';
  };


  const validateChange = (originalData, updatedData) => {
    const isSame = JSON.stringify(updatedData) === JSON.stringify(originalData);
    if (isSame) return "No Changes Made";
    return '';
  };

  const handleProfileChange = async (e) =>{
    var userId = user.id;

    const payload = {
      firstName: generalFormData.firstName,
      lastName: generalFormData.lastName,
      emailAddress: generalFormData.email,
      userName: generalFormData.userName,
    };

    await handleFormSubmit({
      e,
      validateForm: validateGeneralForm,
      execute,
      request: () => profileService.updateGeneralData(userId, payload),
      setFormError: setGeneralError,
      setLoadingBtn: setGeneralloadingBtn,
      resetForm: () => setOriginalGeneralData(generalProfile_EmptyForm),
      onSuccess: () => fetchGeneralData(),
    });
  }

  const tabData = useMemo(
    () => [
      { 
        label: "General",
        content: 
        (
          <div id="section">
            <div className="profileForm">
              <div className="col">
                <div className="row">
                  <div className="profileAvatar">
                    <img
                      src={generalFormData.profilePhotoUrl || "/default-avatar.png"}
                      alt="Profile"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="row">

                  <Input
                    labelName="First Name"
                    name="firstName"
                    placeholder="Enter First Name"
                    value={generalFormData.firstName}
                    onChange={handleInputChange}
                  />

                  <Input
                    labelName="Last Name"
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={generalFormData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="row">
                  <Input
                    labelName="UserName"
                    name="userName"
                    placeholder="Enter Username"
                    value={generalFormData.userName || ""}
                    onChange={handleInputChange}
                    disabled
                  />

                  <Input
                    labelName="Email"
                    name="email"
                    placeholder="Enter Email Address"
                    value={generalFormData.email}
                    onChange={handleInputChange}
                    disabled
                  />

                </div>
                <div className="row">
                  {generalError && <p className='errorMessage'>{generalError}</p>}
                </div>
                <div className="row">
                  <PrimaryButton
                    name="Save Changes"
                    onClick={handleProfileChange}
                    disabled={generalloadingBtn}
                    loading={generalloadingBtn}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      },
      { 
        label: "Authentication",
        content:
        (

          <div className="passwordSection">
            <div className="col">
              <div className="row">
                <Input
                  type="password"
                  placeholder="Enter Password"
                  labelName="Current Password"
                  name="currentPassword"
                  onChange={handleProfileChange}
                  passwordToggle
                />

                <Input
                  type="password"
                  placeholder="Enter New Password" 
                  labelName="New Password"
                  name="newPassword"
                  onChange={handleProfileChange}
                  value={''} 
                  passwordToggle
                />
              </div>
              <div className="row">
                <Input
                  type="password"
                  labelName="Confirm New Password"
                  placeholder="Confirm New Password"
                  name="confirmPassword"
                  onChange={handleProfileChange}
                  passwordToggle
                />

              </div>
              <div className="row">
                <PrimaryButton
                  name="Save Changes"
                  onClick={handleProfileChange}
                />
              </div>
            </div>



          </div>
        )
      },
      { label: "Change Password", content: <div>Document uploads here</div> },
      { label: "2FA Authentication", content: <div>Document uploads here</div> },
    ],
    [generalError, generalFormData, originalGeneralData, generalloadingBtn]
  );

  return (
    <>
      <BreadCrumb  greetings="" />
      <section className="profileSection">
        <div className="topMenu">
          <CustomTab tabs={tabData} />
        </div>
        
        

        
        
      </section>
    </>
  );
};

export default Profile;
