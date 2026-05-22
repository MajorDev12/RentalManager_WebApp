import React, { useState, useEffect, useMemo } from "react";
import BreadCrumb from "../../components/ui/BreadCrumb";
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Table from "../../components/ui/Table";
import { getColumns } from "./UnitChargeColumn";
import CheckBox from "../../components/ui/CheckBox";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/DeleteModal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import Can from "../../auth/Can";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { validateTextInput } from "../../helpers/validateTextInput";
import { getData } from "../../helpers/getData";
import { handleDelete } from "../../helpers/deleteData";
import { handleFormSubmit } from "../../helpers/handleFormSubmit";
import { propertyService } from "../properties/propertyService";
import { utilityService } from "./utilityService";
import { useApiRequest } from "../../hooks/useApiRequest";

import { useApiQuery } from "../../hooks/useApiQuery";
import { useDataTable } from "../../hooks/useDataTable";
import { useSearch } from "../../context/SearchContext";
import { useUrlSync } from "../../hooks/useUrlSync";
import { useAuthContext } from "../../auth/AuthContext";
import { can, canAny } from "../../auth/rbac";
import { unitService } from "../units/unitService";
import "../../css/App.css";

const UnitCharge = () => {
  const { execute, apiLoading } = useApiRequest();
  const { search } = useSearch();
  const { user } = useAuthContext();
  const [activeRow, setActiveRow] = useState(null);

  const [utilityDropdown, setUtilityDropdown] = useState([]);
  const [utilityLoading, setUtilityLoading] = useState(true);
  const [utilityError, setUtilityError] = useState(false);

  const [propertyLookups, setPropertyLookups] = useState([]);
  const [propertiesLoading, setPropertyLoading] = useState(true);
  const [propertiesError, setPropertyError] = useState(false);

  const [billingCycleLookups, setBillingCycleLookups] = useState([]);
  const [billingCycleLoading, setBillingCycleLoading] = useState(true);
  const [billingCycleError, setBillingCycleError] = useState(false);

  const [unitLookups, setUnitLookups] = useState([]);
  const [unitLoading, setUnitLoading] = useState(true);
  const [unitError, setUnitError] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [hasLoadedLookups, setHasLoadedLookups] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [select, setSelect] = useState("");

  const [showMoreInputs, setshowMoreInputs] = useState(false);
  const EMPTY_FORM = {
    propertyId: "",
    utilityId: "",
    billingCycleId: "",
    unitId: "",
    amount: "",
    IsMetered: false,
  };
  const [formData, setFormData] = useState(EMPTY_FORM);

  const {
    data: utilities,
    loading,
    error,
    query,
    refetch,
    setQuery,
    setSearch,
    setSort,
    setPage,
    totalPages,
    pageNumber,
  } = useDataTable(utilityService.getFiltered, {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "",
    isDescending: false,
  });
  const tableData = useMemo(() => utilities ?? [], [utilities]);

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      searchTerm: search,
      pageNumber: 1,
    }));
  }, [search]);

  // useUrlSync(query, setQuery);

  useEffect(() => {
    if (!showModal || hasLoadedLookups) return;

    const load = async () => {
      await Promise.all([
        fetchProperties(),
        fetchUtilities(),
        fetchBillingCycle(),
      ]);
      setHasLoadedLookups(true);
    };

    load();
  }, [showModal]);

  useEffect(() => {
    if (!formData.propertyId) {
      setUnitLookups([]);
      setUnitError(false);
      return;
    }

    const loadUnits = async () => {
      setUnitError(false);
      setUnitLoading(true);

      await getData({
        execute,
        request: () => unitService.getByPropertyId(formData.propertyId),
        setData: setUnitLookups,
        setLoading: setUnitLoading,
        setError: setUnitError,
      });
    };

    loadUnits();
  }, [formData.propertyId]);

  const fetchUtilities = async () => {
    if (!can(user, "UtilityBill.Read")) return;
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("UTILITYBILL"),
      setData: setUtilityDropdown,
      setLoading: setUtilityLoading,
      setError: setUtilityError,
    });
  };

  const fetchProperties = async () => {
    if (!can(user, "Property.Read")) return;
    await getData({
      execute,
      request: () => propertyService.getLookups(),
      setData: setPropertyLookups,
      setLoading: setPropertyLoading,
      setError: setPropertyError,
    });
  };

  const fetchBillingCycle = async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("BILLINGCYCLE"),
      setData: setBillingCycleLookups,
      setLoading: setBillingCycleLoading,
      setError: setBillingCycleError,
    });
  };

  const fetchUnitsByProperty = async (propertyId) => {
    await getData({
      execute,
      request: () => unitService.getByPropertyId(propertyId),
      setData: setUnitLookups,
      setLoading: setUnitLoading,
      setError: setUnitError,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setSelect(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setFormError("");
    setIsEditMode(false);
    setFormData(EMPTY_FORM);
    setShowModal(false);
    setshowMoreInputs(false);
  };

  const refreshTableData = () => {
    refetch();
    setPage(1);
    handleCloseModal();
  };

  const validateModalForm = () => {
    const { utilityId, amount, propertyId, unitId, billingCycleId, IsMetered } =
      formData;

    if (!utilityId || !amount || !propertyId || !billingCycleId) {
      return "Please fill in all required fields.";
    }

    if (isNaN(Number(amount))) {
      return "Please enter a valid Amount";
    }

    if (originalData != null && isEditMode) {
      return validateChange(originalData, formData);
    }

    return "";
  };

  const validateChange = (originalData, updatedData) => {
    const isSame = JSON.stringify(updatedData) === JSON.stringify(originalData);
    if (isSame) return "No Changes Made";
    return "";
  };

  const addUtilityHandler = async (e) => {
    if (!can(user, "UtilityBill.Create")) return;
    const payload = {
      ...formData,
      unitId: formData.unitId ? Number(formData.unitId) : null,
    };
    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => utilityService.add(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };

  const updateUtilityHandler = async (e) => {
    if (!can(user, "UtilityBill.Update")) return;

    const payload = {
      ...formData,
      unitId: formData.unitId ? Number(formData.unitId) : null,
    };
    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => utilityService.update(selectedId, payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };

  const deleteUtilityHandler = async (e) => {
    if (!can(user, "UtilityBill.Delete")) return;
    await handleDelete({
      e,
      execute,
      request: () => utilityService.archive(selectedId),
      setLoadingBtn,
      setDeleteModalOpen,
      onSuccess: refetch,
    });
  };

  const handleEdit = (rowId) => {
    if (!can(user, "UtilityBill.Update")) return;
    const item = utilities.find((p) => p.id === rowId);

    if (!item) return;

    setFormData({
      propertyId: item.propertyId?.toString() || "",
      utilityId: item.utilityId?.toString() || "",
      unitId: item.unitId?.toString() || "",
      billingCycleId: item.billingCycleId?.toString() || "",
      amount: item.amount || "",
      isReccurring: item.isReccurring || false,
    });

    setSelectedId(item.id);
    setOriginalData(item);
    setIsEditMode(true);
    setActiveRow(null);
    setShowModal(true);
  };

  const handleDeleteClick = (rowId) => {
    if (!can(user, "UtilityBill.Delete")) return;
    setSelectedId(rowId);
    setDeleteModalOpen(true);
    setActiveRow(null);
  };

  const columns = useMemo(
    () =>
      getColumns({
        activeRow,
        setActiveRow,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
      }),
    [activeRow],
  );

  const toggleShowMoreButton = (e) => {
    e.preventDefault();
    if (showMoreInputs) {
      setshowMoreInputs(false);
      return;
    } else {
      setshowMoreInputs(true);
      return;
    }
  };

  return (
    <>
      <BreadCrumb />
      <div id="Section">
        <div className="header">
          <h3 className="sectionTitle">List of all Unit Charges</h3>
          <Can permission="UtilityBill.Create">
            <PrimaryButton
              name="Add Utility"
              onClick={() => setShowModal(true)}
            />
          </Can>
        </div>

        <div className="TableContainer">
          <Table
            data={tableData}
            columns={columns}
            loading={loading}
            error={error}
            onSort={setSort}
            sortBy={query.sortBy}
            isDescending={query.isDescending}
          />
          <Pagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
        <Can permission="UtilityBill.Delete">
          <DeleteModal
            isOpen={deleteModalOpen}
            title="Delete Property"
            onClose={() => setDeleteModalOpen(false)}
            onSubmit={deleteUtilityHandler}
            loadingBtn={loadingBtn}
          />
        </Can>

        <Can
          permissions={
            isEditMode ? ["UtilityBill.Update"] : ["UtilityBill.Create"]
          }
        >
          <Modal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSubmit={isEditMode ? updateUtilityHandler : addUtilityHandler}
            errorMessage={formError}
            title={isEditMode ? "Update Charge" : "Add Charge"}
            loadingBtn={loadingBtn}
            isEditMode={isEditMode}
          >
            <div className="row2">
              <Select
                name="propertyId"
                labelName="Property Name"
                value={formData.propertyId || ""}
                onChange={handleSelect}
                options={
                  propertiesLoading
                    ? [{ value: "", label: "Loading properties..." }]
                    : propertiesError
                      ? [{ value: "", label: "Error loading properties" }]
                      : !propertyLookups || propertyLookups.length === 0
                        ? [{ value: "", label: "No properties found" }]
                        : propertyLookups.map((p) => ({
                            value: p.id,
                            label: p.name,
                          }))
                }
              />
              <Select
                name="utilityId"
                labelName="Utility Name"
                value={formData.utilityId || ""}
                onChange={handleSelect}
                options={
                  utilityLoading
                    ? [{ value: "", label: "Loading Utilities..." }]
                    : utilityError
                      ? [{ value: "", label: "Error loading Utilities" }]
                      : !utilityDropdown || utilityDropdown.length === 0
                        ? [{ value: "", label: "No Utilities found" }]
                        : utilityDropdown.map((p) => ({
                            value: p.id,
                            label: p.item,
                          }))
                }
              />
              <Input
                type="number"
                name="amount"
                placeholder="Enter Charge Amount"
                value={formData.amount || ""}
                labelName="Amount"
                onChange={handleInputChange}
              />
              <Select
                name="billingCycleId"
                labelName="Billing Cycle"
                value={formData.billingCycleId || ""}
                onChange={handleSelect}
                options={
                  billingCycleLoading
                    ? [{ value: "", label: "Loading billingCycle..." }]
                    : billingCycleError
                      ? [{ value: "", label: "Error loading billingCycle" }]
                      : !billingCycleLookups || billingCycleLookups.length === 0
                        ? [{ value: "", label: "No billingCycle found" }]
                        : billingCycleLookups.map((p) => ({
                            value: p.id,
                            label: p.item,
                          }))
                }
              />
            </div>
            <div className="row3">
              <button className="showMoreBtn" onClick={toggleShowMoreButton}>
                Show more{" "}
                {showMoreInputs ? (
                  <MdArrowCircleUp className="downIcon" />
                ) : (
                  <MdArrowCircleDown className="topIcon" />
                )}
              </button>
            </div>

            {showMoreInputs && (
              <>
                <div className="row2">
                  <Select
                    name="unitId"
                    labelName="Unit Name"
                    value={formData.unitId || ""}
                    onChange={handleSelect}
                    disabled={!formData.propertyId}
                    options={
                      !formData.propertyId
                        ? [{ value: "", label: "Select property first" }]
                        : unitLoading
                          ? [{ value: "", label: "Loading units..." }]
                          : unitError
                            ? [{ value: "", label: "Error loading units" }]
                            : !unitLookups || unitLookups.length === 0
                              ? [{ value: "", label: "No units found" }]
                              : unitLookups.map((p) => ({
                                  value: p.id,
                                  label: p.name,
                                }))
                    }
                    text={
                      formData.propertyId
                        ? "select unit"
                        : "choose property first"
                    }
                  />

                  <CheckBox
                    name="IsMetered"
                    labelName="IsMetered"
                    onChange={handleInputChange}
                    checked={formData.IsMetered}
                  />
                </div>
              </>
            )}
          </Modal>
        </Can>
      </div>
    </>
  );
};

export default UnitCharge;
