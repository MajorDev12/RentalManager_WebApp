import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../components/ui/BreadCrumb";
import PropertyImage from "../../assets/property.jpg";
import { getData } from "../../helpers/getData";
import { propertyService } from "./propertyService";
import { unitService } from "../units/unitService";
import { unitTypeService } from "../unitTypes/unitTypeService";
import { utilityService } from "../utilities/utilityService";
import { useApiRequest } from "../../hooks/useApiRequest";
import "../../css/viewproperty.css";
import {
  FiEdit,
  FiPlus,
  FiTrash2,
  FiBarChart2,
  FiHome,
  FiUsers,
  FiGrid,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
  FiFlag,
  FiMap,
  FiLayers,
  FiMail,
  FiPhone,
  FiDroplet,
  FiZap,
  FiWifi,
  FiCheckCircle,
} from "react-icons/fi";

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
  const [unitTypeLoading, setUnitTypeLoading] = useState(true);
  const [unitTypesError, setUnitTypesError] = useState(false);
  const [utilityBills, setUtilityBills] = useState(null);
  const [utilityLoading, setUtilityLoading] = useState(true);
  const [utilityError, setUtilityError] = useState(false);

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
      setError: setPropertyError,
    });
  };
  const fetchUnits = async () => {
    await getData({
      execute,
      request: () => unitService.getByPropertyId(id),
      setData: setUnits,
      setLoading: setUnitLoading,
      setError: setUnitError,
    });
  };
  const fetchUnitTypes = async () => {
    await getData({
      execute,
      request: () => unitTypeService.byProperty(id),
      setData: setUnitTypes,
      setLoading: setUnitTypeLoading,
      setError: setUnitTypesError,
    });
  };
  const fetchUtilities = async () => {
    await getData({
      execute,
      request: () => utilityService.getByPropertyId(id),
      setData: setUtilityBills,
      setLoading: setUtilityLoading,
      setError: setUtilityError,
    });
  };

  const resolveData = (loading, error, data, formatter) => {
    if (loading) return null;
    if (error || !data) return null;
    return formatter ? formatter(data) : data;
  };

  const totalUnits = resolveData(
    unitLoading,
    unitError,
    units,
    (d) => d.length,
  );
  const occupiedUnits = resolveData(
    unitLoading,
    unitError,
    units,
    (d) => d.filter((u) => u.status !== "Vacant").length,
  );
  const vacantUnits = resolveData(
    unitLoading,
    unitError,
    units,
    (d) => d.filter((u) => u.status === "Vacant").length,
  );
  const unitTypeList = resolveData(
    unitTypeLoading,
    unitTypesError,
    unitTypes,
    (d) => d,
  );
  const utilityList = resolveData(
    utilityLoading,
    utilityError,
    utilityBills,
    (d) => d,
  );

  const propertyState = propertyLoading
    ? "loading"
    : propertyError
      ? "error"
      : property
        ? "success"
        : "empty";

  const utilityIcons = {
    Water: <FiDroplet />,
    Electricity: <FiZap />,
    Internet: <FiWifi />,
    Garbage: <FiDroplet />,
  };

  return (
    <div id="viewProperty">
      <BreadCrumb greetings="" />

      <div id="Section" className="vpPage">
        {/* ── HERO ── */}
        <div className="card vpHero">
          <div className="vpHeroImg">
            {propertyState === "success" ? (
              <img src={PropertyImage} alt={property.name} />
            ) : (
              <FiHome />
            )}
          </div>

          <div className="vpHeroBody">
            {propertyState === "loading" && (
              <p className="vpMuted">Loading property…</p>
            )}
            {propertyState === "error" && (
              <p className="vpMuted vpError">Failed to load property.</p>
            )}

            {propertyState === "success" && (
              <>
                <div className="vpHeroBadges">
                  <span className="badge badgeGreen">
                    <FiCheckCircle /> Active
                  </span>
                  {property.floor && (
                    <span className="badge badgeGray">
                      {property.floor} Floors
                    </span>
                  )}
                </div>
                <h1 className="vpHeroName">{property.name || "—"}</h1>
                <div className="vpHeroMeta">
                  <span>
                    <FiMapPin />{" "}
                    {[property.area, property.county, property.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
                <div className="vpHeroMeta">
                  {property.emailAddress && (
                    <span>
                      <FiMail /> {property.emailAddress}
                    </span>
                  )}
                  {property.mobileNumber && (
                    <span>
                      <FiPhone /> {property.mobileNumber}
                    </span>
                  )}
                </div>
                <div className="vpHeroActions">
                  <button className="btnPrimary">
                    <FiEdit /> Edit property
                  </button>
                  <button className="btnSecondary">
                    <FiPlus /> Add unit
                  </button>
                  <button className="btnSecondary">
                    <FiBarChart2 /> Reports
                  </button>
                  <button className="btnDanger">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── STAT STRIP ── */}
        <div className="vpStatStrip">
          <div className="vpStatBox">
            <div className="statIcon iconGreen">
              <FiHome />
            </div>
            <div>
              <p className="statVal">
                {unitLoading ? "…" : (totalUnits ?? "—")}
              </p>
              <p className="statLbl">Total units</p>
            </div>
          </div>
          <div className="vpStatBox">
            <div className="statIcon iconBlue">
              <FiUsers />
            </div>
            <div>
              <p className="statVal">
                {unitLoading ? "…" : (occupiedUnits ?? "—")}
              </p>
              <p className="statLbl">Occupied</p>
            </div>
          </div>
          <div className="vpStatBox">
            <div
              className={`statIcon ${vacantUnits > 0 ? "iconAmber" : "iconGreen"}`}
            >
              <FiHome />
            </div>
            <div>
              <p className={`statVal ${vacantUnits > 0 ? "textAmber" : ""}`}>
                {unitLoading ? "…" : (vacantUnits ?? "—")}
              </p>
              <p className="statLbl">Vacant</p>
            </div>
          </div>
          <div className="vpStatBox">
            <div className="statIcon iconTeal">
              <FiGrid />
            </div>
            <div>
              <p className="statVal">
                {unitTypeLoading ? "…" : (unitTypeList?.length ?? "—")}
              </p>
              <p className="statLbl">Unit types</p>
            </div>
          </div>
        </div>

        {/* ── MAIN TWO-COL ── */}
        <div className="vpTwoCol">
          {/* LEFT — property details */}
          <div className="card sectionCard">
            <div className="sectionHeader">
              <h3>Property details</h3>
            </div>
            {propertyState === "loading" && <p className="vpMuted">Loading…</p>}
            {propertyState === "error" && (
              <p className="vpMuted vpError">Something went wrong.</p>
            )}
            {propertyState === "success" && (
              <div className="detailList">
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiHome /> Property name
                  </span>
                  <span className="detailVal">{property.name || "—"}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiMapPin /> Physical address
                  </span>
                  <span className="detailVal">
                    {property.physicalAddress || "—"}
                  </span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiFlag /> Country
                  </span>
                  <span className="detailVal">{property.country || "—"}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiMap /> County
                  </span>
                  <span className="detailVal">{property.county || "—"}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiMapPin /> Area
                  </span>
                  <span className="detailVal">{property.area || "—"}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiMail /> Email address
                  </span>
                  <span className="detailVal detailBlue">
                    {property.emailAddress || "—"}
                  </span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiPhone /> Mobile number
                  </span>
                  <span className="detailVal">
                    {property.mobileNumber || "—"}
                  </span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiLayers /> Total floors
                  </span>
                  <span className="detailVal">{property.floor ?? "—"}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — payment + unit types + utilities */}
          <div className="vpRightCol">
            {/* PAYMENT */}
            <div className="card sectionCard">
              <div className="sectionHeader">
                <h3>Payment information</h3>
              </div>
              <div className="detailList">
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiCreditCard /> Paybill number
                  </span>
                  <span className="detailVal">12072025</span>
                </div>
                <div className="detailRow">
                  <span className="detailLbl">
                    <FiCalendar /> Payment deadline
                  </span>
                  <span className="detailVal">
                    <span className="badge badgeAmber">10th of month</span>
                  </span>
                </div>
              </div>
            </div>

            {/* UNIT TYPES */}
            <div className="card sectionCard">
              <div className="sectionHeader">
                <h3>Unit types</h3>
              </div>
              {unitTypeLoading ? (
                <p className="vpMuted">Loading…</p>
              ) : unitTypeList?.length ? (
                <div className="tagWrap">
                  {unitTypeList.map((type, i) => (
                    <span key={i} className="vpTag">
                      <FiGrid /> {type.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="vpMuted">No unit types added yet.</p>
              )}

              <div className="sectionHeader" style={{ marginTop: "18px" }}>
                <h3>Utility bills</h3>
              </div>
              {utilityLoading ? (
                <p className="vpMuted">Loading…</p>
              ) : utilityList?.length ? (
                <div className="tagWrap">
                  {utilityList.map((bill, i) => (
                    <span key={i} className="vpTag">
                      {utilityIcons[bill.name] || <FiZap />} {bill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="vpMuted">No utility bills added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProperty;
