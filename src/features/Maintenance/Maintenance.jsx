import React, { useState } from "react";
import BreadCrumb from "../../components/ui/BreadCrumb";
import {
  FiPlus,
  FiFilter,
  FiClock,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertTriangle,
  FiDroplet,
  FiZap,
  FiLock,
  FiWind,
  FiTool,
  FiEye,
  FiEdit,
  FiMoreVertical,
  //   FiBuilding,
  FiUser,
  //   FiArrowUpDown,
} from "react-icons/fi";
import "../../css/maintenance.css";

const REQUESTS = [
  {
    id: 1,
    title: "Water leakage in bathroom ceiling",
    property: "Sunset Villas",
    unit: "B-104",
    tenant: "Grace Wambui",
    category: "Plumbing",
    priority: "High",
    status: "Open",
    date: "2 Jun 2025",
    icon: <FiDroplet />,
    iconColor: "iconRed",
  },
  {
    id: 2,
    title: "Power socket not working in kitchen",
    property: "Riverside Apartments",
    unit: "A-203",
    tenant: "John Kamau",
    category: "Electrical",
    priority: "Medium",
    status: "In Progress",
    date: "30 May 2025",
    icon: <FiZap />,
    iconColor: "iconAmber",
  },
  {
    id: 3,
    title: "Broken door lock on main entrance",
    property: "Green Meadows",
    unit: "C-02",
    tenant: "Peter Otieno",
    category: "Security",
    priority: "High",
    status: "Open",
    date: "28 May 2025",
    icon: <FiLock />,
    iconColor: "iconTeal",
  },
  {
    id: 4,
    title: "AC unit not cooling properly",
    property: "Wanja Apartments",
    unit: "D-301",
    tenant: "Mary Njeri",
    category: "HVAC",
    priority: "Medium",
    status: "In Progress",
    date: "25 May 2025",
    icon: <FiWind />,
    iconColor: "iconBlue",
  },
  {
    id: 5,
    title: "Wall paint peeling in living room",
    property: "Sunset Villas",
    unit: "A-101",
    tenant: "Samuel Kipkemei",
    category: "General",
    priority: "Low",
    status: "Resolved",
    date: "20 May 2025",
    icon: <FiTool />,
    iconColor: "iconGreen",
  },
  {
    id: 6,
    title: "Kitchen tap dripping constantly",
    property: "Riverside Apartments",
    unit: "B-205",
    tenant: "Amina Hassan",
    category: "Plumbing",
    priority: "Low",
    status: "Open",
    date: "18 May 2025",
    icon: <FiDroplet />,
    iconColor: "iconRed",
  },
  {
    id: 7,
    title: "Lights flickering in bedroom",
    property: "Green Meadows",
    unit: "A-05",
    tenant: "David Mwangi",
    category: "Electrical",
    priority: "Medium",
    status: "Open",
    date: "15 May 2025",
    icon: <FiZap />,
    iconColor: "iconAmber",
  },
  {
    id: 8,
    title: "Window hinge snapped — won't close",
    property: "Wanja Apartments",
    unit: "C-110",
    tenant: "Faith Achieng",
    category: "General",
    priority: "High",
    status: "Overdue",
    date: "10 May 2025",
    icon: <FiTool />,
    iconColor: "iconRed",
  },
];

const STATUS_TABS = ["All", "Open", "In Progress", "Resolved", "Overdue"];

const statusBadgeClass = (status) => {
  switch (status) {
    case "Open":
      return "badgeRed";
    case "In Progress":
      return "badgeBlue";
    case "Resolved":
      return "badgeGreen";
    case "Overdue":
      return "badgeOrange";
    default:
      return "badgeGray";
  }
};

const priorityBadgeClass = (priority) => {
  switch (priority) {
    case "High":
      return "priHigh";
    case "Medium":
      return "priMed";
    case "Low":
      return "priLow";
    default:
      return "badgeGray";
  }
};

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? REQUESTS
      : REQUESTS.filter((r) => r.status === activeTab);

  const counts = {
    open: REQUESTS.filter((r) => r.status === "Open").length,
    inProgress: REQUESTS.filter((r) => r.status === "In Progress").length,
    resolved: REQUESTS.filter((r) => r.status === "Resolved").length,
    overdue: REQUESTS.filter((r) => r.status === "Overdue").length,
  };

  return (
    <>
      <BreadCrumb greetings="Maintenance" />

      <div className="maintPage">
        {/* STAT STRIP */}
        <div className="maintStats">
          <div className="maintStatBox">
            <div className="statIcon iconAmber">
              <FiClock />
            </div>
            <div>
              <p className="statVal">{counts.open}</p>
              <p className="statLbl">Open requests</p>
            </div>
          </div>
          <div className="maintStatBox">
            <div className="statIcon iconBlue">
              <FiRefreshCw />
            </div>
            <div>
              <p className="statVal">{counts.inProgress}</p>
              <p className="statLbl">In progress</p>
            </div>
          </div>
          <div className="maintStatBox">
            <div className="statIcon iconGreen">
              <FiCheckCircle />
            </div>
            <div>
              <p className="statVal">{counts.resolved}</p>
              <p className="statLbl">Resolved</p>
            </div>
          </div>
          <div className="maintStatBox">
            <div className="statIcon iconRed">
              <FiAlertTriangle />
            </div>
            <div>
              <p className="statVal">{counts.overdue}</p>
              <p className="statLbl">Overdue</p>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="card maintCard">
          {/* HEADER */}
          <div className="maintCardHeader">
            <h3>Maintenance requests</h3>
            <button className="btnPrimary">
              <FiPlus /> New request
            </button>
          </div>

          {/* TOOLBAR */}
          <div className="maintToolbar">
            <div className="maintTabs">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`maintTab ${activeTab === tab ? "maintTabActive" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "All" && (
                    <span className="maintTabCount">{REQUESTS.length}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="maintToolbarRight">
              <button className="btnSecondary">
                <FiFilter /> Filter
              </button>
              <button className="btnSecondary">
                {/* <FiArrowUpDown /> Sort */}
              </button>
            </div>
          </div>

          {/* REQUEST LIST */}
          <div className="maintList">
            {filtered.length === 0 ? (
              <div className="maintEmpty">
                <FiCheckCircle />
                <p>No {activeTab.toLowerCase()} requests.</p>
              </div>
            ) : (
              filtered.map((req) => (
                <div key={req.id} className="maintItem">
                  <div className={`maintItemIcon ${req.iconColor}`}>
                    {req.icon}
                  </div>

                  <div className="maintItemBody">
                    <p className="maintItemTitle">{req.title}</p>
                    <div className="maintItemMeta">
                      <span>
                        {/* <FiBuilding />*/} {req.property} &middot; Unit{" "}
                        {req.unit}
                      </span>
                      <span>
                        <FiUser /> {req.tenant}
                      </span>
                      <span className="maintCategory">{req.category}</span>
                    </div>
                  </div>

                  <div className="maintItemRight">
                    <span className={`badge ${statusBadgeClass(req.status)}`}>
                      {req.status}
                    </span>
                    <span
                      className={`badge ${priorityBadgeClass(req.priority)}`}
                    >
                      {req.priority}
                    </span>
                    <span className="maintDate">{req.date}</span>
                    <div className="maintActions">
                      <button className="actionBtn" title="View">
                        <FiEye />
                      </button>
                      <button className="actionBtn" title="Edit">
                        <FiEdit />
                      </button>
                      <button className="actionBtn" title="More">
                        <FiMoreVertical />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Maintenance;
