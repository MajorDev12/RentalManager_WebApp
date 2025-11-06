import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import { getPropertyColumns } from "../columns/propertyColumns";
import Modal from '../components/Modal'; 
import DeleteModal from '../components/DeleteModal'; 
import Input from '../components/Input';
import { getData } from '../helpers/getData'; 
import { addData } from '../helpers/addData';
import { updateData } from '../helpers/updateData';
import { handleDelete } from '../helpers/deleteData';
import { validateTextInput } from '../helpers/validateTextInput'; 
import { validateEmail } from '../helpers/validateEmail';
import '../css/property.css';
import Textarea from '../components/Textarea';
import Select from '../components/Select';

const Property = () => {
  const navigate = useNavigate();
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState('');
  const [select, setSelect] = useState('');
  const [showMoreInputs, setshowMoreInputs] = useState(false);

    const handleSelect = (e) => {
    const { name, value } = e.target;
      setSelect(value);
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    emailAddress: '',
    mobileNumber: '',
    country: '',
    county: '',
    area: '',
    notes: '',
    floor: ''
  });


  const handleCloseModal = () => {
    setFormError('');
    setIsEditMode(false);
    setFormData({});
    setShowModal(false);
  };



useEffect(() => {
  getData({
    endpoint: 'Properties',
    setData: setProperties,
    setLoading,
    setError
  });
}, []);


  

const columns = getPropertyColumns({
  endpoint: "Properties",
  activeRow,
  setActiveRow,
  setSelectedId,
  setIsEditMode,
  setDeleteModalOpen,
  setFormData,
  setOriginalData,
  setShowModal,
  properties,
});



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



 const validateForm = () => {
    const { name, emailAddress, mobileNumber, country, county, floor, area, notes} = formData;
    if (!name || !emailAddress || !mobileNumber || !country || !county || !floor || !area) {
      return "Please fill in all required fields.";
    }
    if(!validateTextInput(name, true)){
      return "Property Name cannot be empty";
    }
    if(!validateEmail(emailAddress)){
      return "Please enter a valid email";
    }
    return '';
  };


  const handleFormSubmit = (e) => {
     addData({
    e,
    validateForm,
    formData,
    endpoint: 'Property',
    setFormError,
    setLoadingBtn,
    setFormData,
    setShowModal,
    setData: setProperties,
    getdata: true,
    setLoading,
  });
  };

const handleUpdateSubmit = (e) => {
  updateData({
    e,
    validateForm,
    formData,
    originalData,
    endpoint: 'Property',
    setFormError,
    setLoadingBtn,
    setFormData,
    setShowModal,
    setIsEditMode,
    setData: setProperties,
    setLoading,
  });
};



 const toggleShowMoreButton = (e) => {
  e.preventDefault();
  if(showMoreInputs){
    setshowMoreInputs(false);
    return;
  }
  else{
    setshowMoreInputs(true);
    return;
  }
 }

  const handleRowClick = (row) => {
      navigate(`/properties/${row.id}`);
  };





  return (
    <>
      <BreadCrumb greetings="" />
      <div id="Section">
        <div className="header">
          <h3>List of all Properties</h3>
          <PrimaryButton
            name="Add New"
            onClick={() => setShowModal(true)}
          />
        </div>

        <div className="TableContainer">
          <Table data={properties} onclickItem={handleRowClick} columns={columns} loading={loading}  error={error}/>
        </div>



        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete Property"
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={(e) => handleDelete({
            e,
            id: selectedId,
            endpoint: 'Property',
            setLoadingBtn,
            setDeleteModalOpen,
            setData: setProperties,
            setLoading,
          })}

          loadingBtn={loadingBtn}
        />


         <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={isEditMode ? handleUpdateSubmit : handleFormSubmit}
          errorMessage={formError}
          title={isEditMode ? "Update Property" : "Add Property"}
          loadingBtn={loadingBtn}
          isEditMode={isEditMode}
        >
          <div className="col">
            <div className="row">
              <Input
                type="text"
                name="name"
                placeholder="Enter Property Name"
                value={formData.name || ''}
                labelName="Property Name"
                onChange={handleInputChange}
              />

              <Input
                type="email"
                name="emailAddress"
                placeholder="Enter Email Address"
                value={formData.emailAddress || ''}
                labelName="Email"
                onChange={handleInputChange}
              />

              <Input
                type="tel"
                name="mobileNumber"
                placeholder="Enter Mobile Number"
                value={formData.mobileNumber || ''}
                labelName="Mobile"
                onChange={handleInputChange}
              />
            </div>

            <div className="row">
              <Input
                type="text"
                name="physicalAddress"
                placeholder="Enter physical Address"
                value={formData.physicalAddress || ''}
                labelName="physical Address"
                onChange={handleInputChange}
              />

              <Input
                type="text"
                name="country"
                placeholder="Enter Country"
                value={formData.country || ''}
                labelName="Country"
                onChange={handleInputChange}
              />

              <Input
                type="text"
                name="county"
                placeholder="Enter County"
                value={formData.county || ''}
                labelName="County"
                onChange={handleInputChange}
              />

            </div>

            <div className="row">
              <Input
                type="text"
                name="area"
                placeholder="Enter Area"
                value={formData.area || ''}
                labelName="Area"
                onChange={handleInputChange}
              />

              <Select
                name="floor"
                labelName="Floor (s)"
                value={formData.floor}
                onChange={handleSelect}
                options={[
                  { value: '0', label: 'Ground Floor' },
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                  { value: '7', label: '7' },
                  { value: '8', label: '8' },
                  { value: '9', label: '9' },
                  { value: '10', label: '10' },
                  { value: '11', label: '11' },
                  { value: '12', label: '12' },
                  { value: '13', label: '13' },
                  { value: '14', label: '14' },
                  { value: '15', label: '15' },
                  { value: '16', label: '16' },
                  { value: '17', label: '17' },
                  { value: '18', label: '18' },
                  { value: '19', label: '19' },
                  { value: '20', label: '20' },
                ]}
              />


              <Textarea
                type="text"
                name="notes"
                placeholder="Enter description"
                value={formData.notes || ''}
                labelName="Notes"
                onChange={handleInputChange}
              />

            </div>
            <button className='showMoreBtn' onClick={toggleShowMoreButton}>Show more {showMoreInputs ? <MdArrowCircleUp className='downIcon' /> : <MdArrowCircleDown className='topIcon' />}</button>
          
          


          {showMoreInputs && (
            <>

              <div className="row">
                <p className='headerTitle'>Utilitiy Bills <span>(Optional)</span></p>
              </div>
              <div className="row">
                <Input
                  type="text"
                  name="utility"
                  placeholder="Enter Amount"
                  value={formData.utility || 100}
                  labelName="Water (per unit)"
                  onChange={handleInputChange}
                />

                <Input
                  type="email"
                  name="emailAddress"
                  placeholder="Enter Electricity Bill"
                  value={formData.emailAddress || 0}
                  labelName="Electricity Bill"
                  onChange={handleInputChange}
                />
              </div>

              {/* <div className="row">
                <p className='headerTitle'>Payment For Mpesa <span>(Optional)</span></p>
              </div>


              <div className="row">
                <Input
                  type="radio"
                  name="emailAddress"
                  placeholder=""
                  value={formData.emailAddress || ''}
                  labelName="Paybill"
                  onChange={handleInputChange}
                />

                <Input
                  type="radio"
                  name="emailAddress"
                  placeholder=""
                  value={formData.emailAddress || ''}
                  labelName="Till Number"
                  onChange={handleInputChange}
                />
              </div> */}
            </>

          )}


      </div>



        </Modal>
      </div>
    </>
  );
};

export default Property;
