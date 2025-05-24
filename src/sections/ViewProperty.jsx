import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from '../components/BreadCrumb';
import NotFound from '../sections/NotFound';
import "../css/viewproperty.css";
import PropertyImage from "../assets/property.jpg";
import { getData } from '../helpers/getData'; 

const ViewProperty = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
    getData({
        endpoint: `Properties/${id}`,
        setData: setProperty,
        setLoading,
        setError
    });
    }, [id]);





  return (
    <div id='viewProperty'>
        <BreadCrumb greetings='' />
        <div id="Section">
            <div className="headerContainer">
                <h3 className='header'>Basic Information</h3>
            </div>
            <div className="basicInfo">
                <div className="propertyImg">
                    <img src={PropertyImage} alt="" />
                </div>
                <div className="details">
                    <div className="detail">
                        <label htmlFor="">Property Name :</label>
                        <p>{property ? property.name : "--"}</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Email Address :</label>
                        <p>{property ? property.emailAddress : ""}</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Mobile Number :</label>
                        <p>{property ? property.mobileNumber : ""}</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Country :</label>
                        <p>{property ? property.country : ""}</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">County :</label>
                        <p>{property ? property.county : ""}</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Area :</label>
                        <p>{property ? property.area : ""}</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Physical Address :</label>
                        <p>{property ? property.physicalAddress : ""}</p>
                    </div>
                       <div className="detail">
                        <label htmlFor="">Total Floors :</label>
                        <p>{property ? property.floor : ""}</p>
                    </div>
                </div>
            </div>

           
            <div className="headerContainer">
                <h3 className='header'>More Information</h3>
            </div>

            
            <div className="moreInfo">
                
                <div className="details">
                    <div className="detail">
                        <label htmlFor="">Total Units :</label>
                        <p>20 Units</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Status :</label>
                        <p className='red'>2 Vacants</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Unit Types :</label>
                        <p>Single, BedSitter, 1 BedRoom</p>
                    </div>
                     <div className="detail">
                        <label htmlFor="">Utility Bills :</label>
                        <p>Rent, Water, Electricity, Garbage Collection</p>
                    </div>
                </div>
            </div>

            <div className="headerContainer">
                <h3 className='header'>Payment Information</h3>
            </div>


            <div className="moreInfo">
                <div className="details">
                    <div className="detail">
                        <label htmlFor="">PayBill :</label>
                        <p>20234</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">DeadLine Date :</label>
                        <p>10th</p>
                    </div>
                </div>
            </div>


        </div>
    </div>
  )
}

export default ViewProperty