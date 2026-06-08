import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useAuthContext } from "../../auth/AuthContext";
import { can } from "../../auth/rbac";

// ─── UI Components (same as Property page) ────────────────────────────────
import BreadCrumb from "../../components/ui/BreadCrumb";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import DeleteModal from "../../components/ui/DeleteModal";
import Can from "../../auth/Can";

// ─── Hooks & Helpers ──────────────────────────────────────────────────────
import { useApiRequest } from "../../hooks/useApiRequest";
import { useDataTable } from "../../hooks/useDataTable";
import { getData } from "../../helpers/getData";
import { handleDelete } from "../../helpers/deleteData";

// ─── Feature-specific ─────────────────────────────────────────────────────
import { getTenantColumns } from "./TenantColumn";
import AddOrEditTenantModal from "../properties/components/AddOrEditModal";
import { tenantService } from "./tenantService";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { propertyService } from "../properties/propertyService";
import { unitService } from "../units/unitService";

// ─── Stats Card ───────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, fade }) => (
  <div
    style={{
      background: "var(--containerColor)",
      border: "1px solid var(--borderColor)",
      borderRadius: 12,
      padding: "14px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 130,
      borderLeft: `4px solid ${color}`,
    }}
  >
    <span
      style={{
        fontSize: "var(--bigFontSize)",
        fontWeight: 700,
        color: color,
        lineHeight: 1,
      }}
    >
      {value ?? "—"}
    </span>
    <span
      style={{
        fontSize: "var(--littleFontSize)",
        color: "var(--lightTextColor)",
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  </div>
);

// ─── Status Filter Pill ───────────────────────────────────────────────────
const FilterPill = ({ label, active, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 14px",
      borderRadius: 20,
      border: `1.5px solid ${active ? color : "var(--borderColor)"}`,
      background: active ? color + "18" : "transparent",
      color: active ? color : "var(--lightTextColor)",
      fontSize: "var(--littleFontSize)",
      fontWeight: active ? 700 : 500,
      cursor: "pointer",
      transition: "all var(--trans-3)",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────
const Tenant = () => {
  const navigate = useNavigate();
  const { execute } = useApiRequest();
  const { search } = useSearch();
  const { user } = useAuthContext();

  // ── Modal / Row State ──────────────────────────────────────────────────
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  // ── Dropdown Data ──────────────────────────────────────────────────────
  const [tenantStatuses, setTenantStatuses] = useState([]);
  const [genders, setGenders] = useState([]);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [billingCycles, setBillingCycles] = useState([]);

  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingCycles, setLoadingCycles] = useState(false);

  // ── Status Filter ──────────────────────────────────────────────────────
  const STATUS_FILTERS = [
    { label: "All", value: "", color: "var(--textColor)" },
    { label: "Active", value: "Active", color: "var(--green)" },
    { label: "On Notice", value: "On Notice", color: "var(--yellow)" },
    { label: "Inactive", value: "Inactive", color: "var(--lightTextColor)" },
    { label: "Evicted", value: "Evicted", color: "var(--red)" },
  ];
  const [activeFilter, setActiveFilter] = useState("");

  // ── Table Data ─────────────────────────────────────────────────────────
  const {
    data: tenants,
    loading,
    error,
    query,
    refetch,
    setQuery,
    setSort,
    setPage,
    totalPages,
    pageNumber,
  } = useDataTable(tenantService.getFiltered, {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "",
    isDescending: false,
    status: "",
  });

  const tableData = useMemo(() => tenants ?? [], [tenants]);

  // ── Summary counts derived from current page (or from API if endpoint available) ──
  const counts = useMemo(() => {
    const all = tenants ?? [];
    return {
      total: all.length,
      active: all.filter((t) => t.tenantStatus === "Active").length,
      onNotice: all.filter((t) => t.tenantStatus === "On Notice").length,
      evicted: all.filter((t) => t.tenantStatus === "Evicted").length,
    };
  }, [tenants]);

  // ── Sync search context ────────────────────────────────────────────────
  useEffect(() => {
    setQuery((prev) => ({ ...prev, searchTerm: search, pageNumber: 1 }));
  }, [search]);

  // ── Sync status filter ─────────────────────────────────────────────────
  useEffect(() => {
    setQuery((prev) => ({ ...prev, status: activeFilter, pageNumber: 1 }));
  }, [activeFilter]);

  // ── Fetch dropdowns when modal opens ─────────────────────────────────
  const fetchDropdowns = useCallback(async () => {
    await Promise.all([
      getData({
        execute,
        request: () => systemCodeItemService.getByCodeName("TENANTSTATUS"),
        setData: setTenantStatuses,
        setLoading: setLoadingStatuses,
      }),
      getData({
        execute,
        request: () => systemCodeItemService.getByCodeName("GENDER"),
        setData: setGenders,
        setLoading: setLoadingGenders,
      }),
      getData({
        execute,
        request: () => systemCodeItemService.getByCodeName("BILLINGCYCLE"),
        setData: setBillingCycles,
        setLoading: setLoadingCycles,
      }),
      getData({
        execute,
        request: () => propertyService.getAll(),
        setData: setProperties,
        setLoading: setLoadingProperties,
      }),
    ]);
  }, [execute]);

  const fetchUnitsForProperty = useCallback(
    async (propertyId) => {
      if (!propertyId) return;
      await getData({
        execute,
        request: () => unitService.getVacantByProperty(propertyId),
        setData: setUnits,
        setLoading: setLoadingUnits,
      });
    },
    [execute],
  );

  useEffect(() => {
    if (showModal) fetchDropdowns();
  }, [showModal, fetchDropdowns]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleAddNew = () => {
    setFormData({});
    setOriginalData(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setFormData({});
    setOriginalData(null);
  };

  const refreshTableData = () => {
    refetch();
    setPage(1);
    handleCloseModal();
  };

  const handleRowClick = (row) => {
    navigate(`/tenants/${row.id}`);
  };

  const handleView = useCallback(
    (rowId) => {
      navigate(`/tenants/${rowId}`);
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (rowId) => {
      if (!can(user, "Tenant.Update")) return;
      const item = tenants?.find((t) => t.id === rowId);
      if (!item) return;
      setFormData(item);
      setOriginalData(item);
      setIsEditMode(true);
      setShowModal(true);
      setActiveRow(null);
    },
    [tenants, user],
  );

  const handleDeleteClick = useCallback(
    (rowId) => {
      if (!can(user, "Tenant.Delete")) return;
      setSelectedId(rowId);
      setDeleteModalOpen(true);
      setActiveRow(null);
    },
    [user],
  );

  // ── Columns ────────────────────────────────────────────────────────────
  const columns = useMemo(
    () =>
      getTenantColumns({
        user,
        activeRow,
        setActiveRow,
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
      }),
    [activeRow, handleView, handleEdit, handleDeleteClick, user],
  );

  // ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <BreadCrumb greetings="" />

      <div id="Section">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="header">
          <h3 className="sectionTitle">List of all Tenants</h3>
          <Can permission="Tenant.Create">
            <PrimaryButton name="Add New" onClick={handleAddNew} />
          </Can>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <StatCard
            label="Total Tenants"
            value={counts.total}
            color="var(--highlightColor)"
          />
          <StatCard label="Active" value={counts.active} color="var(--green)" />
          <StatCard
            label="On Notice"
            value={counts.onNotice}
            color="var(--yellow)"
          />
          <StatCard label="Evicted" value={counts.evicted} color="var(--red)" />
        </div>

        {/* ── Status Filter Pills ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {STATUS_FILTERS.map((f) => (
            <FilterPill
              key={f.value}
              label={f.label}
              active={activeFilter === f.value}
              color={f.color}
              onClick={() => setActiveFilter(f.value)}
            />
          ))}
        </div>

        {/* ── Table ───────────────────────────────────────────────── */}
        <div className="TableContainer">
          <Table
            data={tableData}
            columns={columns}
            loading={loading}
            error={error}
            onSort={setSort}
            sortBy={query.sortBy}
            isDescending={query.isDescending}
            onclickItem={handleRowClick}
          />
          <Pagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {/* ── Delete Modal ─────────────────────────────────────────── */}
        <Can permission="Tenant.Delete">
          <DeleteModal
            isOpen={deleteModalOpen}
            title="Delete Tenant"
            onClose={() => setDeleteModalOpen(false)}
            onSubmit={(e) =>
              handleDelete({
                e,
                id: selectedId,
                endpoint: "Tenant",
                setLoadingBtn,
                setDeleteModalOpen,
                setLoading: () => {},
              })
            }
            loadingBtn={loadingBtn}
          />
        </Can>

        {/* ── Add / Edit Modal ─────────────────────────────────────── */}
        <AddOrEditTenantModal
          show={showModal}
          isEdit={isEditMode}
          originalData={originalData}
          modalData={formData}
          onSuccess={refreshTableData}
          closeModal={handleCloseModal}
          // Dropdown props
          tenantStatuses={tenantStatuses}
          genders={genders}
          properties={properties}
          units={units}
          billingCycles={billingCycles}
          onPropertyChange={fetchUnitsForProperty}
          loadingUnits={loadingUnits}
        />
      </div>
    </>
  );
};

export default Tenant;
