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
    const [units, setUnits] = useState(null);
    const [unitTypes, setUnitTypes] = useState(null);
    const [utilityBills, setUtilityBills] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        getData({
            endpoint: `Properties/${id}`,
            setData: setProperty,
            setLoading,
            setError
        });

        getData({
            endpoint: `Unit/By-Property/${id}`,
            setData: setUnits,
            setLoading,
            setError
        });

        getData({
            endpoint: `UnitType/By-Property/${id}`,
            setData: setUnitTypes,
            setLoading,
            setError
        });

        getData({
            endpoint: `UtilityBill/By-Property/${id}`,
            setData: setUtilityBills,
            setLoading,
            setError
        });

    }, [id]);

    const totalUnits = units ? units.length : 0;
    const vacantUnits = units ? units.filter(unit => unit.status === "Vacant").length : 0;
    const UnitTypesDisplay = unitTypes?.length
    ? unitTypes.map(type => type.name).join(", ")
    : "No Unit Types Available";
    const billsDisplay = utilityBills?.length
    ? utilityBills.map(bill => bill.name).join(", ")
    : "No Utility Bills Available";




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
                        <p>{totalUnits}</p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Status :</label>
                        <p className={vacantUnits > 0 ? 'red' : ''}>
                            {vacantUnits} Vacant{vacantUnits !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="detail">
                        <label htmlFor="">Unit Types :</label>
                        <p>{UnitTypesDisplay}</p>
                    </div>
                     <div className="detail">
                        <label htmlFor="">Utility Bills :</label>
                        <p>{billsDisplay}</p>
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