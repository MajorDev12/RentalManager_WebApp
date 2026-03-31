import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from '../../components/ui/BreadCrumb';
import NotFound from '../../sections/NotFound';
import PropertyImage from "../../assets/property.jpg";
import { getData } from '../../helpers/getData'; 
import { propertyService } from "./propertyService";
import { unitService } from "../units/unitService";
import { unitTypeService } from "../unitTypes/unitTypeService";
import { utilityService } from "../utilities/utilityService";
import { useApiRequest } from '../../hooks/useApiRequest';
import "../../css/viewproperty.css";
import { FaEthereum } from 'react-icons/fa';

const ViewProperty = () => {
    const { id } = useParams();
    const { execute, apiLoading } = useApiRequest();
    const [property, setProperty] = useState(null);
    const [propertyLoading, setPropertyLoading] = useState(true);
    const [propertyError, setPropertyError] = useState(false);
    const [units, setUnits] = useState(null);
    const [unitLoading, setUnitLoading] = useState(true);
    const [unitError, setUnitError] = useState(false);
    const [unitTypes, setUnitTypes] = useState(null);
    const [unitTypeLoading, setunitTypeLoading] = useState(true);
    const [unitTypesError, setunitTypeError] = useState(false);
    const [utilityBills, setUtilityBills] = useState(null);
    const [utilityLoading, setutilityLoading] = useState(true);
    const [utilityError, setutilityError] = useState(false);


    useEffect(() => {
        fetchProperty();
        fetchUnits();
        fetchUnitTypes();
        fetchUtilities();
    }, [id]);


    const fetchProperty = async () => {
        await getData({
        execute,
        request: () => propertyService.getById(id),
        setData: setProperty,
        setLoading: setPropertyLoading,
        setError: setPropertyError
        });
    };

    const fetchUnits = async () => {
        await getData({
        execute,
        request: () => unitService.getByPropertyId(id),
        setData: setUnits,
        setLoading: setUnitLoading,
        setError: setUnitError
        });
    };

    const fetchUnitTypes = async () => {
        await getData({
        execute,
        request: () => unitTypeService.byProperty(id),
        setData: setUnitTypes,
        setLoading: setunitTypeLoading,
        setError: setunitTypeError
        });
    };

    const fetchUtilities = async () => {
        await getData({
            execute,
            request: () => utilityService.getByPropertyId(id),
            setData: setUtilityBills,
            setLoading: setutilityLoading,
            setError: setutilityError
        });
    };

    const resolveData = (loading, error, data, formatter) => {
        if (loading) return "Loading...";
        if (error) return "Something went wrong";
        if (!data) return "No data available";
        return formatter ? formatter(data) : data;
    };

    const propertyState = propertyLoading
        ? "loading"
        : propertyError
        ? "error"
        : property
        ? "success"
        : "empty";


    const totalUnits = resolveData(
    unitLoading,
    unitError,
    units,
    (data) => data.length
    );

    const vacantUnits = resolveData(
    unitLoading,
    unitError,
    units,
    (data) => data.filter(u => u.status === "Vacant").length
    );

    const UnitTypesDisplay = resolveData(
    unitTypeLoading,
    unitTypesError,
    unitTypes,
    (data) => data.length
        ? data.map(type => type.name).join(", ")
        : "No Unit Types Available"
    );

    const billsDisplay = resolveData(
    utilityLoading,
    utilityError,
    utilityBills,
    (data) => data.length
        ? data.map(bill => bill.name).join(", ")
        : "No Utility Bills Available"
    );





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

                    {propertyState === "loading" && <p>Loading property details...</p>}
                    {propertyState === "error" && <p>Something went wrong loading property.</p>}

                    {propertyState === "success" && (
                        <>
                        <div className="detail">
                            <label>Property Name :</label>
                            <p>{property.name || "--"}</p>
                        </div>

                        <div className="detail">
                            <label>Email Address :</label>
                            <p>{property.emailAddress || "--"}</p>
                        </div>

                        <div className="detail">
                            <label>Mobile Number :</label>
                            <p>{property.mobileNumber || "--"}</p>
                        </div>

                        <div className="detail">
                            <label>Country :</label>
                            <p>{property.country || "--"}</p>
                        </div>

                        <div className="detail">
                            <label>County :</label>
                            <p>{property.county || "--"}</p>
                        </div>

                        <div className="detail">
                            <label>Area :</label>
                            <p>{property.area || "--"}</p>
                        </div>

                        <div className="detail">
                            <label>Physical Address :</label>
                            <p>{property.physicalAddress || "--"}</p>
                        </div>

                        <div className="detail">
                            <label>Total Floors :</label>
                            <p>{property.floor ?? "--"}</p>
                        </div>
                        </>
                    )}

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
                        <p>12072025</p>
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