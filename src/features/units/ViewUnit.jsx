import React from "react";
import BreadCrumb from "../../components/ui/BreadCrumb";
import UnitGallery from "./components/UnitGallery"; // adjust path as needed

import {
  //   FiBed,
  FiDroplet,
  FiMaximize,
  FiZap,
  FiStar,
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiPlus,
  FiEdit,
  FiEye,
  FiPrinter,
  FiUnlock,
  FiExternalLink,
  FiMessageSquare,
  FiUserMinus,
  FiCreditCard,
  FiTool,
  FiFilePlus,
  FiList,
  FiWifi,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import "../../css/unitView.css";

const ViewUnit = () => {
  const unit = {
    name: "A-203",
    property: "Greenwood Residency",
    location: "Kilimani, Nairobi",
    status: "Occupied",
    rent: 25000,
    bedrooms: 2,
    bathrooms: 1,
    size: "950 sqft",
    floor: 2,
    lastPaid: "1 May 2025",
    nextDue: "1 Jun 2025",

    tenant: {
      name: "John Kamau",
      initials: "JK",
      email: "john@example.com",
      phone: "+254 712 345 678",
      idNumber: "32456789",
      nationality: "Kenyan",
      since: "Jan 2025",
    },

    utilities: [
      {
        name: "Water",
        provider: "Nairobi Water Co.",
        icon: <FiDroplet />,
        color: "blue",
      },
      {
        name: "Electricity",
        provider: "KPLC · Token meter",
        icon: <FiZap />,
        color: "amber",
      },
      {
        name: "Fibre internet",
        provider: "Safaricom Home",
        icon: <FiWifi />,
        color: "teal",
      },
      {
        name: "Garbage",
        provider: "County collection",
        icon: <FiTrash2 />,
        color: "green",
      },
    ],

    features: [
      { label: "Parking", icon: <FiMapPin /> },
      { label: "Balcony", icon: <FiMaximize /> },
      { label: "Modern kitchen", icon: <FiStar /> },
      { label: "CCTV security", icon: <FiEye /> },
      { label: "Built-in wardrobes", icon: <FiList /> },
      { label: "Lounge area", icon: <FiUser /> },
    ],

    leases: [
      {
        id: 1,
        tenant: "John Kamau",
        start: "01 Jan 2025",
        end: "31 Dec 2025",
        rent: 25000,
        status: "Active",
      },
      {
        id: 2,
        tenant: "Grace Wambui",
        start: "01 Jan 2024",
        end: "31 Dec 2024",
        rent: 23000,
        status: "Expired",
      },
      {
        id: 3,
        tenant: "Peter Otieno",
        start: "15 Mar 2023",
        end: "14 Mar 2024",
        rent: 22000,
        status: "Expired",
      },
    ],

    activeLease: {
      start: "01 Jan 2025",
      end: "31 Dec 2025",
      duration: "12 months",
      deposit: 50000,
      status: "Active",
      renewal: "Due in 7 months",
    },
  };

  return (
    <>
      <BreadCrumb greetings="Unit Details" />

      <div className="unitPage">
        {/* HERO */}
        <div className="unitHero card">
          <div className="unitHeroLeft">
            <div className="unitHeroBadges">
              <span className="badge badgeGreen">
                <FiCheckCircle /> {unit.status}
              </span>
              <span className="badge badgeGray">Floor {unit.floor}</span>
            </div>
            <h1>{unit.name}</h1>
            <p className="unitProperty">
              <FiMapPin /> {unit.property} &nbsp;·&nbsp; {unit.location}
            </p>
            <div className="unitHeroActions">
              <button className="btnPrimary">
                <FiEdit /> Edit unit
              </button>
              <button className="btnSecondary">
                <FiFileText /> View lease
              </button>
              <button className="btnSecondary">
                <FiPrinter /> Print
              </button>
              <button className="btnDanger">
                <FiUnlock /> Mark vacant
              </button>
            </div>
          </div>
          <div className="unitHeroRight">
            <h2>KES {unit.rent.toLocaleString()}</h2>
            <span className="rentLabel">Monthly rent</span>
            <div className="paymentMeta">
              Last paid <strong className="textGreen">{unit.lastPaid}</strong>
            </div>
            <div className="paymentMeta">
              Next due <strong className="textAmber">{unit.nextDue}</strong>
            </div>
          </div>
        </div>

        {/* STAT STRIP */}
        <div className="statsGrid">
          <div className="statCard card">
            <div className="statIcon iconGreen">{/* <FiBed /> */}</div>
            <div>
              <h3>{unit.bedrooms}</h3>
              <p>Bedrooms</p>
            </div>
          </div>
          <div className="statCard card">
            <div className="statIcon iconBlue">
              <FiDroplet />
            </div>
            <div>
              <h3>{unit.bathrooms}</h3>
              <p>Bathroom</p>
            </div>
          </div>
          <div className="statCard card">
            <div className="statIcon iconTeal">
              <FiMaximize />
            </div>
            <div>
              <h3>{unit.size}</h3>
              <p>Unit size</p>
            </div>
          </div>
          <div className="statCard card">
            <div className="statIcon iconAmber">
              <FiZap />
            </div>
            <div>
              <h3>{unit.utilities.length}</h3>
              <p>Utilities</p>
            </div>
          </div>
          <div className="statCard card">
            <div className="statIcon iconPurple">
              <FiStar />
            </div>
            <div>
              <h3>{unit.features.length}</h3>
              <p>Features</p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mainGrid">
          {/* LEFT COLUMN */}
          <div className="leftColumn">
            <UnitGallery />
            {/* ABOUT */}
            {/* <div className="card sectionCard">
              <div className="sectionHeader">
                <h3>About this unit</h3>
              </div>
              <p className="aboutText">
                Spacious and well-lit apartment on the second floor with natural
                cross-ventilation, modern kitchen finishes, secure allocated
                parking, and high-speed fibre internet. Ideal for a small family
                or working professional.
              </p>
            </div> */}
            {/* UTILITIES */}
            <div className="card sectionCard">
              <div className="sectionHeader">
                <h3>Utilities</h3>
                <button className="addBtn">
                  <FiPlus /> Add utility
                </button>
              </div>
              <div className="utilityGrid">
                {unit.utilities.map((util, i) => (
                  <div key={i} className="utilityItem">
                    <div
                      className={`utilIcon icon${util.color.charAt(0).toUpperCase() + util.color.slice(1)}`}
                    >
                      {util.icon}
                    </div>
                    <div>
                      <p className="utilName">{util.name}</p>
                      <p className="utilMeta">{util.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* FEATURES */}
            <div className="card sectionCard">
              <div className="sectionHeader">
                <h3>Features</h3>
                <button className="addBtn">
                  <FiPlus /> Add feature
                </button>
              </div>
              <div className="featuresWrap">
                {unit.features.map((feat, i) => (
                  <span key={i} className="featureTag">
                    {feat.icon} {feat.label}
                  </span>
                ))}
              </div>
            </div>
            {/* LEASE HISTORY */}
            <div className="card sectionCard">
              <div className="sectionHeader">
                <h3>Lease history</h3>
                <button className="addBtn">
                  <FiPlus /> New lease
                </button>
              </div>
              <div className="activeBanner">
                <FiCheckCircle />1 active lease
              </div>
              <div className="leaseList">
                {unit.leases.map((lease) => (
                  <div
                    key={lease.id}
                    className={`leaseItem ${lease.status === "Active" ? "leaseActive" : ""}`}
                  >
                    <div className="leaseLeft">
                      <div className="leaseTenantRow">
                        {lease.status === "Active" && (
                          <span className="activeDot" />
                        )}
                        <span className="leaseTenantName">{lease.tenant}</span>
                        <span
                          className={`badge ${lease.status === "Active" ? "badgeGreen" : "badgeGray"} badgeSm`}
                        >
                          {lease.status}
                        </span>
                      </div>
                      <div className="leaseDates">
                        <FiCalendar />
                        {lease.start} → {lease.end}
                      </div>
                    </div>
                    <div className="leaseRight">
                      <span className="leaseRent">
                        KES {lease.rent.toLocaleString()} / mo
                      </span>
                      <div className="leaseActions">
                        <button className="btnSecondary btnSm">
                          <FiEye /> View
                        </button>
                        {lease.status === "Active" && (
                          <button className="btnSecondary btnSm">
                            <FiEdit /> Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="rightColumn">
            {/* TENANT */}
            <div className="card sectionCard">
              <div className="sectionHeader">
                <h3>Current tenant</h3>
                <button className="addBtn">
                  <FiExternalLink /> Profile
                </button>
              </div>
              <div className="tenantWrap">
                <div className="tenantAvatar">{unit.tenant.initials}</div>
                <div>
                  <p className="tenantName">{unit.tenant.name}</p>
                  <p className="tenantSince">
                    Tenant since {unit.tenant.since}
                  </p>
                </div>
              </div>
              <div className="detailList">
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiMail /> Email
                  </span>
                  <span className="detailVal detailBlue">
                    {unit.tenant.email}
                  </span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiPhone /> Phone
                  </span>
                  <span className="detailVal">{unit.tenant.phone}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiUser /> ID / KRA
                  </span>
                  <span className="detailVal">{unit.tenant.idNumber}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiMapPin /> Nationality
                  </span>
                  <span className="detailVal">{unit.tenant.nationality}</span>
                </div>
              </div>
              <div className="tenantActions">
                <button className="btnSecondary btnBlock">
                  <FiMessageSquare /> Message
                </button>
                <button className="btnDanger btnBlock">
                  <FiUserMinus /> Vacate
                </button>
              </div>
            </div>

            {/* ACTIVE LEASE SUMMARY */}
            <div className="card sectionCard">
              <p className="sectionLabel">Active lease summary</p>
              <div className="detailList">
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiCalendar /> Start date
                  </span>
                  <span className="detailVal">{unit.activeLease.start}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiCalendar /> End date
                  </span>
                  <span className="detailVal">{unit.activeLease.end}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiClock /> Duration
                  </span>
                  <span className="detailVal">{unit.activeLease.duration}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiDollarSign /> Deposit
                  </span>
                  <span className="detailVal">
                    KES {unit.activeLease.deposit.toLocaleString()}
                  </span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiFileText /> Status
                  </span>
                  <span className="detailVal">
                    <span className="badge badgeGreen badgeSm">
                      {unit.activeLease.status}
                    </span>
                  </span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">
                    <FiAlertCircle /> Renewal
                  </span>
                  <span className="detailVal textAmber">
                    {unit.activeLease.renewal}
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card sectionCard">
              <p className="sectionLabel">Quick actions</p>
              <div className="quickActions">
                <button className="btnSecondary btnBlock">
                  <FiCreditCard /> Record payment
                </button>
                <button className="btnSecondary btnBlock">
                  <FiTool /> Log maintenance
                </button>
                <button className="btnSecondary btnBlock">
                  <FiFilePlus /> Generate invoice
                </button>
                <button className="btnSecondary btnBlock">
                  <FiRefreshCw /> Payment history
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewUnit;
