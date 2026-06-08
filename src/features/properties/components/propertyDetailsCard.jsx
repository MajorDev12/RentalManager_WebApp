import React, { useState, useEffect, useCallback, useMemo } from "react";
import DetailCard from "../../../components/ui/DetailCard";
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

const PropertyDetailsCard = ({ state, detail }) => {
  const data = [
    {
      icon: <FiHome />,
      label: "Property Name",
      value: state === "success" ? detail.name : "__",
    },
    {
      icon: <FiMapPin />,
      label: "Physical address",
      value: state === "success" ? detail.physicalAddress : "__",
    },
    {
      icon: <FiMail />,
      label: "Email address",
      value: state === "success" ? detail.emailAddress : "__",
    },
    {
      icon: <FiPhone />,
      label: "Mobile number",
      value: state === "success" ? detail.mobileNumber : "__",
    },
    {
      icon: <FiFlag />,
      label: "Country",
      value: state === "success" ? detail.country : "__",
    },
    {
      icon: <FiMap />,
      label: "County",
      value: state === "success" ? detail.county : "__",
    },
    {
      icon: <FiMapPin />,
      label: "Area",
      value: state === "success" ? detail.area : "__",
    },
    {
      icon: <FiLayers />,
      label: "Total floors",
      value: state === "success" ? detail.floor : "__",
    },
  ];

  return (
    <>
      <DetailCard title="Property Details" state={state} details={data} />
    </>
  );
};

export default PropertyDetailsCard;
