import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiRequest } from "../../hooks/useApiRequest"; // TODO: uncomment for real API
import { useAuthContext } from "../../auth/AuthContext";
import { getData } from "../../helpers/getData"; // TODO: uncomment for real API
import { tenantService } from "./tenantService"; // TODO: uncomment for real API
import { can } from "../../auth/rbac";
import Can from "../../auth/Can";
import BreadCrumb from "../../components/ui/BreadCrumb";
import PrimaryButton from "../../components/ui/PrimaryButton";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  FiPhone,
  FiMail,
  FiCreditCard,
  FiCalendar,
  FiArrowLeft,
  FiEdit2,
} from "react-icons/fi";
import { MdOutlineHome, MdOutlineMeetingRoom } from "react-icons/md";
import { BsGenderAmbiguous } from "react-icons/bs";
import { RiFileList3Line } from "react-icons/ri";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { TbReportMoney } from "react-icons/tb";

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  Active: {
    bg: "var(--greenFade)",
    color: "var(--green)",
    dot: "var(--green)",
  },
  Inactive: {
    bg: "var(--greyFade)",
    color: "var(--lightTextColor)",
    dot: "var(--lightTextColor)",
  },
  Evicted: { bg: "var(--redFade)", color: "var(--red)", dot: "var(--red)" },
  "On Notice": {
    bg: "var(--yellowFade)",
    color: "var(--yellow)",
    dot: "var(--yellow)",
  },
  Pending: { bg: "var(--blueFade)", color: "var(--blue)", dot: "var(--blue)" },
};

// ─── REUSABLE SUB-COMPONENTS ──────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG["Inactive"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: "var(--smallFontSize)",
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {status ?? "Unknown"}
    </span>
  );
};

const Avatar = ({ firstName, lastName, photoUrl, size = 80 }) => {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={initials}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid var(--borderColor)",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--lightHighlightColor)",
        color: "var(--darkHighlightColor)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.35,
        border: "3px solid var(--borderColor)",
        flexShrink: 0,
      }}
    >
      {initials || "?"}
    </div>
  );
};

const InfoChip = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: "var(--smallFontSize)",
        color: "var(--lightTextColor)",
      }}
    >
      <Icon size={14} style={{ color: "var(--iconColor)", flexShrink: 0 }} />
      <span style={{ color: "var(--textColor)", fontWeight: 500 }}>
        {value}
      </span>
      {label && (
        <span style={{ color: "var(--lightTextColor)" }}>· {label}</span>
      )}
    </div>
  );
};

const StatCard = ({ label, value, sub, accent, icon: Icon }) => (
  <div
    style={{
      background: "var(--containerColor)",
      border: "1px solid var(--borderColor)",
      borderRadius: 12,
      padding: "16px 20px",
      borderTop: `3px solid ${accent}`,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      flex: 1,
      minWidth: 140,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: "var(--littleFontSize)",
          color: "var(--lightTextColor)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
      {Icon && <Icon size={16} color={accent} />}
    </div>
    <span
      style={{
        fontSize: "var(--headerFontSize)",
        fontWeight: 700,
        color: "var(--HeaderColor)",
        lineHeight: 1.2,
      }}
    >
      {value ?? "—"}
    </span>
    {sub && (
      <span
        style={{
          fontSize: "var(--littleFontSize)",
          color: "var(--lightTextColor)",
        }}
      >
        {sub}
      </span>
    )}
  </div>
);

const SectionCard = ({ title, icon: Icon, children, action }) => (
  <div
    style={{
      background: "var(--containerColor)",
      border: "1px solid var(--borderColor)",
      borderRadius: 12,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid var(--borderLine)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {Icon && <Icon size={16} color="var(--highlightColor)" />}
        <span
          style={{
            fontWeight: 700,
            fontSize: "var(--smallFontSize)",
            color: "var(--HeaderColor)",
          }}
        >
          {title}
        </span>
      </div>
      {action}
    </div>
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const DetailRow = ({ label, value, valueStyle }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "9px 0",
      borderBottom: "1px solid var(--borderLine)",
    }}
  >
    <span
      style={{
        fontSize: "var(--smallFontSize)",
        color: "var(--lightTextColor)",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "var(--smallFontSize)",
        fontWeight: 600,
        color: "var(--textColor)",
        textAlign: "right",
        ...valueStyle,
      }}
    >
      {value ?? "—"}
    </span>
  </div>
);

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview", icon: RiFileList3Line },
  { key: "transactions", label: "Transactions", icon: TbReportMoney },
  { key: "utilities", label: "Utilities", icon: HiOutlineLightningBolt },
];

const TabBar = ({ active, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: 4,
      borderBottom: "2px solid var(--borderLine)",
      marginBottom: 20,
    }}
  >
    {TABS.map(({ key, label, icon: Icon }) => {
      const isActive = active === key;
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "var(--smallFontSize)",
            fontWeight: isActive ? 700 : 500,
            color: isActive ? "var(--highlightColor)" : "var(--lightTextColor)",
            borderBottom: isActive
              ? "2px solid var(--highlightColor)"
              : "2px solid transparent",
            marginBottom: -2,
            transition: "all 0.2s ease",
          }}
        >
          <Icon size={15} />
          {label}
        </button>
      );
    })}
  </div>
);

// ─── TRANSACTION BADGE ────────────────────────────────────────────────────────
const TxBadge = ({ type }) => {
  const isPayment = type?.toLowerCase().includes("payment");
  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: "var(--littleFontSize)",
        fontWeight: 600,
        background: isPayment ? "var(--greenFade)" : "var(--blueFade)",
        color: isPayment ? "var(--green)" : "var(--blue)",
      }}
    >
      {type ?? "—"}
    </span>
  );
};

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
const Skeleton = ({ width = "100%", height = 16, radius = 8 }) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background: "var(--greyColor)",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  />
);

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
  <div
    style={{
      textAlign: "center",
      padding: "32px 16px",
      color: "var(--lightTextColor)",
      fontSize: "var(--smallFontSize)",
    }}
  >
    {message}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ViewTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { execute } = useApiRequest();
  const { user } = useAuthContext();

  // ── Dummy Data ─────────────────────────────────────────────────────────────
  // TODO: Replace with real API calls when backend is ready.
  // See bottom of file for the service methods you'll need.
  const DUMMY_TENANT = {
    id: 1,
    firstName: "Jane",
    lastName: "Mwangi",
    emailAddress: "jane.mwangi@gmail.com",
    mobileNumber: "+254 712 345 678",
    alternativeNumber: "+254 798 765 432",
    nationalId: "30123456",
    gender: "Female",
    profilePhotoUrl: null,
    tenantStatus: "Active",
    propertyName: "Sunset Villas",
    unitName: "Unit 4B",
    unit: {
      name: "Unit 4B",
      unitType: "1 Bedroom",
      floor: "4th Floor",
      amount: 20000,
      billingCycle: "Monthly",
      area: "Nairobi West",
    },
  };

  const DUMMY_LEASE = {
    leaseStatus: "Active",
    billingCycle: "Monthly",
    rentAmount: 20000,
    startDate: "2023-01-01",
    endDate: null,
    nextBillingDate: "2025-07-01",
    requiresDeposit: true,
    depositAmount: 40000,
  };

  const DUMMY_TRANSACTIONS = [
    {
      id: 1,
      transactionDate: "2025-06-01",
      transactionType: "Payment",
      transactionNumber: "TXN-0029",
      amount: 20000,
      notes: "June rent",
    },
    {
      id: 2,
      transactionDate: "2025-06-01",
      transactionType: "Charge",
      transactionNumber: "CHG-0029",
      amount: 20000,
      notes: "June rent invoice",
    },
    {
      id: 3,
      transactionDate: "2025-05-01",
      transactionType: "Payment",
      transactionNumber: "TXN-0028",
      amount: 20000,
      notes: "May rent",
    },
    {
      id: 4,
      transactionDate: "2025-05-01",
      transactionType: "Charge",
      transactionNumber: "CHG-0028",
      amount: 20000,
      notes: "May rent invoice",
    },
    {
      id: 5,
      transactionDate: "2025-04-01",
      transactionType: "Payment",
      transactionNumber: "TXN-0027",
      amount: 20000,
      notes: "April rent",
    },
    {
      id: 6,
      transactionDate: "2025-04-01",
      transactionType: "Charge",
      transactionNumber: "CHG-0027",
      amount: 20000,
      notes: "April rent invoice",
    },
    {
      id: 7,
      transactionDate: "2025-03-03",
      transactionType: "Payment",
      transactionNumber: "TXN-0026",
      amount: 20000,
      notes: "March rent (late)",
    },
    {
      id: 8,
      transactionDate: "2025-03-01",
      transactionType: "Charge",
      transactionNumber: "CHG-0026",
      amount: 20000,
      notes: "March rent invoice",
    },
    {
      id: 9,
      transactionDate: "2025-02-01",
      transactionType: "Payment",
      transactionNumber: "TXN-0025",
      amount: 20000,
      notes: "February rent",
    },
    {
      id: 10,
      transactionDate: "2025-02-01",
      transactionType: "Charge",
      transactionNumber: "CHG-0025",
      amount: 20000,
      notes: "February rent invoice",
    },
  ];

  const DUMMY_UTILITIES = [
    {
      id: 1,
      utilityName: "Water",
      billingCycle: "Monthly",
      isMetered: false,
      amount: 1500,
      ratePerUnit: null,
      month: 6,
      year: 2025,
    },
    {
      id: 2,
      utilityName: "Electricity",
      billingCycle: "Monthly",
      isMetered: true,
      amount: 3200,
      ratePerUnit: 25,
      month: 6,
      year: 2025,
    },
    {
      id: 3,
      utilityName: "Garbage",
      billingCycle: "Monthly",
      isMetered: false,
      amount: 500,
      ratePerUnit: null,
      month: 6,
      year: 2025,
    },
    {
      id: 4,
      utilityName: "Water",
      billingCycle: "Monthly",
      isMetered: false,
      amount: 1500,
      ratePerUnit: null,
      month: 5,
      year: 2025,
    },
    {
      id: 5,
      utilityName: "Electricity",
      billingCycle: "Monthly",
      isMetered: true,
      amount: 2900,
      ratePerUnit: 25,
      month: 5,
      year: 2025,
    },
  ];

  // ── Data State (seeded with dummy data) ───────────────────────────────────
  const [tenant, setTenant] = useState(DUMMY_TENANT);
  const [lease, setLease] = useState(DUMMY_LEASE);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS);
  const [utilities, setUtilities] = useState(DUMMY_UTILITIES);

  // ── Loading/Error states ───────────────────────────────────────────────────
  // All false by default since dummy data is already loaded
  const [loadingTenant, setLoadingTenant] = useState(false);
  const [loadingLease, setLoadingLease] = useState(false);
  const [loadingTransactions, setLoadingTx] = useState(false);
  const [loadingUtilities, setLoadingUtilities] = useState(false);
  const [error, setError] = useState(null);

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("overview");

  // ── TODO: Uncomment these when switching to real API ──────────────────────
  // const fetchTenant = useCallback(async () => {
  //   await getData({ execute, request: () => tenantService.getById(id), setData: setTenant, setLoading: setLoadingTenant, setError });
  // }, [execute, id]);
  //
  // const fetchLease = useCallback(async () => {
  //   await getData({ execute, request: () => tenantService.getLeaseByTenantId(id), setData: setLease, setLoading: setLoadingLease, setError: () => {} });
  // }, [execute, id]);
  //
  // const fetchTransactions = useCallback(async () => {
  //   if (transactions.length > 0) return;
  //   await getData({ execute, request: () => tenantService.getTransactionsByTenantId(id), setData: setTransactions, setLoading: setLoadingTx, setError: () => {} });
  // }, [execute, id, transactions.length]);
  //
  // const fetchUtilities = useCallback(async () => {
  //   if (utilities.length > 0) return;
  //   await getData({ execute, request: () => tenantService.getUtilitiesByTenantId(id), setData: setUtilities, setLoading: setLoadingUtilities, setError: () => {} });
  // }, [execute, id, utilities.length]);
  //
  // useEffect(() => { fetchTenant(); fetchLease(); }, [fetchTenant, fetchLease]);
  // useEffect(() => {
  //   if (activeTab === "transactions") fetchTransactions();
  //   if (activeTab === "utilities")    fetchUtilities();
  // }, [activeTab, fetchTransactions, fetchUtilities]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const fullName = tenant ? `${tenant.firstName} ${tenant.lastName}` : "—";
  const totalPaid = useMemo(
    () =>
      transactions
        .filter((t) => t.transactionType?.toLowerCase().includes("payment"))
        .reduce((sum, t) => sum + (t.amount ?? 0), 0),
    [transactions],
  );

  const balance = useMemo(() => {
    const charges = transactions
      .filter((t) => t.transactionType?.toLowerCase().includes("charge"))
      .reduce((s, t) => s + (t.amount ?? 0), 0);
    const payments = transactions
      .filter((t) => t.transactionType?.toLowerCase().includes("payment"))
      .reduce((s, t) => s + (t.amount ?? 0), 0);
    return payments - charges;
  }, [transactions]);

  const monthsResident = useMemo(() => {
    if (!lease?.startDate) return null;
    const start = new Date(lease.startDate);
    const now = new Date();
    const diff =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());
    return diff > 0 ? diff : 0;
  }, [lease]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fmt = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-KE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";
  const fmtMoney = (n) =>
    n != null ? `KES ${Number(n).toLocaleString()}` : "—";

  if (error) {
    return (
      <div id="Section">
        <BreadCrumb greetings="" />
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "var(--lightTextColor)",
          }}
        >
          Failed to load tenant.{" "}
          <button
            onClick={fetchTenant}
            style={{
              color: "var(--highlightColor)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Keyframe for skeleton ─────────────────────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <BreadCrumb greetings="" />

      <div id="Section">
        {/* ── Back + Edit Row ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => navigate("/tenants")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "1px solid var(--borderColor)",
              borderRadius: 8,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: "var(--smallFontSize)",
              color: "var(--textColor)",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            <FiArrowLeft size={14} /> Back to Tenants
          </button>

          <Can permission="Tenant.Update">
            <PrimaryButton
              name="Edit Tenant"
              onClick={() => navigate(`/tenants/${id}/edit`)}
            />
          </Can>
        </div>

        {/* ── PROFILE HEADER CARD ─────────────────────────────────────────── */}
        <div
          style={{
            background: "var(--containerColor)",
            border: "1px solid var(--borderColor)",
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            {loadingTenant ? (
              <Skeleton width={80} height={80} radius={40} />
            ) : (
              <Avatar
                firstName={tenant?.firstName}
                lastName={tenant?.lastName}
                photoUrl={tenant?.profilePhotoUrl}
                size={80}
              />
            )}

            {/* Main info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              {loadingTenant ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <Skeleton width="60%" height={22} />
                  <Skeleton width="30%" height={14} />
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                      marginBottom: 6,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "var(--headerFontSize)",
                        fontWeight: 700,
                        color: "var(--HeaderColor)",
                        margin: 0,
                      }}
                    >
                      {fullName}
                    </h2>
                    <StatusBadge status={tenant?.tenantStatus} />
                  </div>

                  {/* Contact chips row */}
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}
                  >
                    <InfoChip icon={FiPhone} value={tenant?.mobileNumber} />
                    <InfoChip icon={FiMail} value={tenant?.emailAddress} />
                    <InfoChip
                      icon={FiCreditCard}
                      value={tenant?.nationalId}
                      label="ID"
                    />
                    <InfoChip icon={BsGenderAmbiguous} value={tenant?.gender} />
                  </div>

                  {/* Property / Unit chips */}
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}
                  >
                    <InfoChip
                      icon={MdOutlineHome}
                      value={tenant?.propertyName}
                      label="Property"
                    />
                    <InfoChip
                      icon={MdOutlineMeetingRoom}
                      value={tenant?.unitName}
                      label="Unit"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Lease status pill (right side) */}
            {!loadingLease && lease && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                <StatusBadge status={lease.leaseStatus} />
                <span
                  style={{
                    fontSize: "var(--littleFontSize)",
                    color: "var(--lightTextColor)",
                  }}
                >
                  Since {fmt(lease.startDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── STAT CARDS ROW ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Rent Amount"
            value={loadingLease ? "…" : fmtMoney(lease?.rentAmount)}
            sub={
              lease?.billingCycle
                ? `per ${lease.billingCycle.toLowerCase()}`
                : null
            }
            accent="var(--highlightColor)"
            icon={TbReportMoney}
          />
          <StatCard
            label="Balance"
            value={loadingTransactions ? "…" : fmtMoney(Math.abs(balance))}
            sub={
              balance < 0 ? "In Arrears" : balance > 0 ? "Credit" : "Settled"
            }
            accent={
              balance < 0
                ? "var(--red)"
                : balance > 0
                  ? "var(--green)"
                  : "var(--lightTextColor)"
            }
            icon={FiCreditCard}
          />
          <StatCard
            label="Next Billing"
            value={loadingLease ? "…" : fmt(lease?.nextBillingDate)}
            sub={lease?.billingCycle ?? null}
            accent="var(--blue)"
            icon={FiCalendar}
          />
          <StatCard
            label="Months Resident"
            value={
              loadingLease
                ? "…"
                : monthsResident != null
                  ? `${monthsResident} mo`
                  : "—"
            }
            sub={lease?.startDate ? `Since ${fmt(lease?.startDate)}` : null}
            accent="var(--purple)"
            icon={MdOutlineHome}
          />
        </div>

        {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* ── TAB: OVERVIEW ───────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {/* Lease Details */}
            <SectionCard title="Lease Details" icon={RiFileList3Line}>
              {loadingLease ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} height={14} />
                  ))}
                </div>
              ) : lease ? (
                <>
                  <DetailRow label="Lease Status" value={lease.leaseStatus} />
                  <DetailRow label="Billing Cycle" value={lease.billingCycle} />
                  <DetailRow
                    label="Rent Amount"
                    value={fmtMoney(lease.rentAmount)}
                  />
                  <DetailRow label="Start Date" value={fmt(lease.startDate)} />
                  <DetailRow label="End Date" value={fmt(lease.endDate)} />
                  <DetailRow
                    label="Next Billing"
                    value={fmt(lease.nextBillingDate)}
                  />
                  {lease.requiresDeposit && (
                    <DetailRow
                      label="Deposit"
                      value={fmtMoney(lease.depositAmount)}
                    />
                  )}
                </>
              ) : (
                <EmptyState message="No active lease found." />
              )}
            </SectionCard>

            {/* Unit Details */}
            <SectionCard title="Unit Details" icon={MdOutlineMeetingRoom}>
              {loadingTenant ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height={14} />
                  ))}
                </div>
              ) : tenant?.unit ? (
                <>
                  <DetailRow label="Unit Name" value={tenant.unit.name} />
                  <DetailRow label="Unit Type" value={tenant.unit.unitType} />
                  <DetailRow label="Floor" value={tenant.unit.floor} />
                  <DetailRow
                    label="Base Rent"
                    value={fmtMoney(tenant.unit.amount)}
                  />
                  <DetailRow
                    label="Billing Cycle"
                    value={tenant.unit.billingCycle}
                  />
                  <DetailRow label="Property" value={tenant.propertyName} />
                  <DetailRow label="Area" value={tenant.unit.area} />
                </>
              ) : (
                <EmptyState message="Unit details unavailable." />
              )}
            </SectionCard>

            {/* Personal Details */}
            <SectionCard title="Personal Information" icon={FiCreditCard}>
              {loadingTenant ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height={14} />
                  ))}
                </div>
              ) : (
                <>
                  <DetailRow label="First Name" value={tenant?.firstName} />
                  <DetailRow label="Last Name" value={tenant?.lastName} />
                  <DetailRow label="Email" value={tenant?.emailAddress} />
                  <DetailRow label="Phone" value={tenant?.mobileNumber} />
                  <DetailRow
                    label="Alt. Phone"
                    value={tenant?.alternativeNumber}
                  />
                  <DetailRow label="National ID" value={tenant?.nationalId} />
                  <DetailRow label="Gender" value={tenant?.gender} />
                </>
              )}
            </SectionCard>

            {/* Quick Payment Summary (from transactions if loaded, otherwise prompt) */}
            <SectionCard
              title="Payment Summary"
              icon={TbReportMoney}
              action={
                <button
                  onClick={() => setActiveTab("transactions")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--highlightColor)",
                    fontSize: "var(--littleFontSize)",
                    fontWeight: 600,
                  }}
                >
                  View All →
                </button>
              }
            >
              <DetailRow label="Total Paid" value={fmtMoney(totalPaid)} />
              <DetailRow
                label="Total Charges"
                value={fmtMoney(totalPaid - balance)}
              />
              <DetailRow
                label="Balance"
                value={fmtMoney(Math.abs(balance))}
                valueStyle={{
                  color:
                    balance < 0
                      ? "var(--red)"
                      : balance > 0
                        ? "var(--green)"
                        : "var(--textColor)",
                }}
              />
              <DetailRow
                label="Transactions"
                value={transactions.length || "—"}
              />
              {transactions.length === 0 && (
                <div style={{ paddingTop: 8 }}>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: 8,
                      border: "1px dashed var(--borderColor)",
                      background: "none",
                      color: "var(--highlightColor)",
                      cursor: "pointer",
                      fontSize: "var(--smallFontSize)",
                      fontWeight: 600,
                    }}
                  >
                    Load Transactions
                  </button>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ── TAB: TRANSACTIONS ───────────────────────────────────────────── */}
        {activeTab === "transactions" && (
          <SectionCard title="Transaction History" icon={TbReportMoney}>
            {loadingTransactions ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} height={40} radius={6} />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <EmptyState message="No transactions found for this tenant." />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--borderLine)" }}>
                      {[
                        "#",
                        "Date",
                        "Type",
                        "Reference",
                        "Amount",
                        "Notes",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "8px 12px",
                            fontSize: "var(--littleFontSize)",
                            color: "var(--tableHeadColor)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, idx) => (
                      <tr
                        key={tx.id}
                        style={{
                          borderBottom: "1px solid var(--borderLine)",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--greyColor)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--littleFontSize)",
                            color: "var(--lightTextColor)",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fmt(tx.transactionDate)}
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <TxBadge type={tx.transactionType} />
                        </td>
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            color: "var(--lightTextColor)",
                            fontFamily: "monospace",
                          }}
                        >
                          {tx.transactionNumber ?? "—"}
                        </td>
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            fontWeight: 700,
                            color: tx.transactionType
                              ?.toLowerCase()
                              .includes("payment")
                              ? "var(--green)"
                              : "var(--textColor)",
                          }}
                        >
                          {fmtMoney(tx.amount)}
                        </td>
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            color: "var(--lightTextColor)",
                          }}
                        >
                          {tx.notes ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Footer total */}
                  <tfoot>
                    <tr style={{ borderTop: "2px solid var(--borderLine)" }}>
                      <td
                        colSpan={4}
                        style={{
                          padding: "10px 12px",
                          fontSize: "var(--smallFontSize)",
                          fontWeight: 700,
                          color: "var(--textColor)",
                        }}
                      >
                        Total Paid
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: "var(--smallFontSize)",
                          fontWeight: 700,
                          color: "var(--green)",
                        }}
                      >
                        {fmtMoney(totalPaid)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </SectionCard>
        )}

        {/* ── TAB: UTILITIES ──────────────────────────────────────────────── */}
        {activeTab === "utilities" && (
          <SectionCard title="Utility Bills" icon={HiOutlineLightningBolt}>
            {loadingUtilities ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} height={40} radius={6} />
                ))}
              </div>
            ) : utilities.length === 0 ? (
              <EmptyState message="No utility bills found for this tenant." />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--borderLine)" }}>
                      {[
                        "Utility",
                        "Billing Cycle",
                        "Metered",
                        "Amount / Rate",
                        "Period",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "8px 12px",
                            fontSize: "var(--littleFontSize)",
                            color: "var(--tableHeadColor)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {utilities.map((u) => (
                      <tr
                        key={u.id}
                        style={{ borderBottom: "1px solid var(--borderLine)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--greyColor)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            fontWeight: 600,
                          }}
                        >
                          {u.utilityName ?? "—"}
                        </td>
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            color: "var(--lightTextColor)",
                          }}
                        >
                          {u.billingCycle ?? "—"}
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <span
                            style={{
                              padding: "2px 10px",
                              borderRadius: 20,
                              fontSize: "var(--littleFontSize)",
                              fontWeight: 600,
                              background: u.isMetered
                                ? "var(--yellowFade)"
                                : "var(--greyFade)",
                              color: u.isMetered
                                ? "var(--yellow)"
                                : "var(--lightTextColor)",
                            }}
                          >
                            {u.isMetered ? "Metered" : "Flat Rate"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            fontWeight: 700,
                            color: "var(--textColor)",
                          }}
                        >
                          {fmtMoney(u.amount)}
                          {u.isMetered && u.ratePerUnit && (
                            <div
                              style={{
                                fontSize: "var(--littleFontSize)",
                                color: "var(--lightTextColor)",
                                fontWeight: 400,
                              }}
                            >
                              @ KES {u.ratePerUnit}/unit
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "11px 12px",
                            fontSize: "var(--smallFontSize)",
                            color: "var(--lightTextColor)",
                          }}
                        >
                          {u.month ? `${u.month}/${u.year}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}
      </div>
    </>
  );
};

export default ViewTenant;
