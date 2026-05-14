import React, { useState, useEffect, useMemo } from "react";
import BreadCrumb from "../../components/ui/BreadCrumb";
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
import "../../css/App.css";

const UnitCharge = () => {
  const { execute, apiLoading } = useApiRequest();
  const { search } = useSearch();
  const { user } = useAuthContext();
  const [activeRow, setActiveRow] = useState(null);
  const [utilityDropdown, setUtilityDropdown] = useState([]);
  const [utilityLoader, setUtilityLoader] = useState(true);
  const [utilityError, setUtilityError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasLoadedLookups, setHasLoadedLookups] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState("");
  const [select, setSelect] = useState("");
  const [properties, setProperties] = useState([]);
  const [propertiesLoader, isPropertiesLoader] = useState(true);
  const EMPTY_FORM = {
    propertyId: "",
    utilityId: "",
    amount: "",
    isReccurring: false,
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
      await Promise.all([fetchProperties(), fetchUtilities()]);
      setHasLoadedLookups(true);
    };

    load();
  }, [showModal]);

  const fetchUtilities = async () => {
    if (!can(user, "UtilityBill.Read")) return;
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("UTILITYBILL"),
      setData: setUtilityDropdown,
      setLoading: setUtilityLoader,
    });
  };

  const fetchProperties = async () => {
    if (!can(user, "Property.Read")) return;
    await getData({
      execute,
      request: () => propertyService.getLookups(),
      setData: setProperties,
      setLoading: isPropertiesLoader,
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
  };

  const refreshTableData = () => {
    refetch();
    setPage(1);
    handleCloseModal();
  };

  const validateModalForm = () => {
    const { utilityId, amount, propertyId, isReccurring } = formData;
    if (!utilityId || !amount || !propertyId) {
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
    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => utilityService.add(formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };

  const updateUtilityHandler = async (e) => {
    if (!can(user, "UtilityBill.Update")) return;
    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => utilityService.update(selectedId, formData),
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

  return (
    <>
      <BreadCrumb />
      <div id="Section">
        <div className="header">
          <h3 className="sectionTitle">List of all Unit Charges</h3>
          <Can permission="UtilityBill.Create">
            <PrimaryButton name="Add New" onClick={() => setShowModal(true)} />
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
                  propertiesLoader
                    ? [{ value: "", label: "Loading properties..." }]
                    : error
                      ? [{ value: "", label: "Error loading properties" }]
                      : !properties || properties.length === 0
                        ? [{ value: "", label: "No properties found" }]
                        : properties.map((p) => ({
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
                  utilityLoader
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
              <CheckBox
                name="isReccurring"
                labelName="Reccurring"
                onChange={handleInputChange}
                checked={formData.isReccurring}
              />
            </div>
          </Modal>
        </Can>
      </div>
    </>
  );
};

export default UnitCharge;
