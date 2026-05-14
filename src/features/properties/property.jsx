import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import BreadCrumb from "../../components/ui/BreadCrumb";
import CheckBox from "../../components/ui/CheckBox";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Table from "../../components/ui/Table";
import { getPropertyColumns } from "./propertyColumns";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/DeleteModal";
import Input from "../../components/ui/Input";
import Can from "../../auth/Can";
import { getData } from "../../helpers/getData";
import { handleDelete } from "../../helpers/deleteData";
import { validateTextInput } from "../../helpers/validateTextInput";
import { validateEmail } from "../../helpers/validateEmail";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { propertyService } from "./propertyService";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useApiQuery } from "../../hooks/useApiQuery";
import { useDataTable } from "../../hooks/useDataTable";
import { useUrlSync } from "../../hooks/useUrlSync";
import { handleFormSubmit } from "../../helpers/handleFormSubmit";
import { useAuthContext } from "../../auth/AuthContext";
import { can, canAny } from "../../auth/rbac";
import "../../css/property.css";

const Property = () => {
  const navigate = useNavigate();
  const { execute } = useApiRequest();
  const { search } = useSearch();
  const { user } = useAuthContext();
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [utilityBillTypes, setUtilityBillTypes] = useState([]);
  const [utilityBillTypeLoading, setUtilityBillLoading] = useState(true);
  const [utilityBillError, setUtilityBillTypeError] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState("");
  const [propertyTypeError, setPropertyTyperror] = useState("");
  const [showMoreInputs, setshowMoreInputs] = useState(false);
  const EMPTY_FORM = {
    name: "",
    emailAddress: "",
    mobileNumber: "",
    physicalAddress: "",
    country: "",
    county: "",
    area: "",
    floor: "",
    propertyTypeId: "",
    longitude: "",
    latitude: "",
    notes: "",
  };
  const EMPTY_UTILITY_FORM = {
    utilityBillId: "",
    utilityAmount: "",
    isReccurring: false,
  };
  const [utilityItems, setUtilityItems] = useState([EMPTY_UTILITY_FORM]);

  const {
    data: properties,
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
  } = useDataTable(propertyService.getFiltered, {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "",
    isDescending: false,
  });

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      searchTerm: search,
      pageNumber: 1,
    }));
  }, [search]);
  useUrlSync(query, setQuery);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const tableData = useMemo(() => properties ?? [], [properties]);
  const fetchPropertyTypes = useCallback(async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("PROPERTYTYPE"),
      setData: setPropertyTypes,
      setLoading: setLoadingTypes,
      setError: setPropertyTyperror,
    });
  }, [execute]);

  const fetchUtilityTypes = useCallback(async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("UTILITYBILL"),
      setData: setUtilityBillTypes,
      setLoading: setUtilityBillLoading,
      setError: setUtilityBillTypeError,
    });
  }, [execute]);

  useEffect(() => {
    if (showModal) {
      fetchPropertyTypes();
      fetchUtilityTypes();
    }
  }, [showModal, fetchPropertyTypes, fetchUtilityTypes]);

  const refreshTableData = () => {
    refetch();
    setPage(1);
    handleCloseModal();
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setFormData(EMPTY_FORM);
    setOriginalData(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormError("");
    setIsEditMode(false);
    setFormData(EMPTY_FORM);
    setFormData(EMPTY_UTILITY_FORM);
    setShowModal(false);
    setshowMoreInputs(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUtilityChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      utilities: prev.utilities.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const validateModalForm = () => {
    const {
      name,
      emailAddress,
      mobileNumber,
      country,
      county,
      floor,
      area,
      longitude,
      latitude,
      notes,
      propertyTypeId,
    } = formData;

    if (
      !name ||
      !emailAddress ||
      !mobileNumber ||
      !country ||
      !county ||
      !floor ||
      !area
    ) {
      return "Please fill in all required fields.";
    }
    if (!validateTextInput(name, true)) {
      return "Property Name cannot be empty";
    }
    if (!validateEmail(emailAddress)) {
      return "Please enter a valid email";
    }
    if (propertyTypeId <= 0) {
      return "Invalid PropertyTypeId";
    }

    if (!isEditMode) {
      if (Array.isArray(utilityItems) || utilityItems.length > 0) {
        for (let index = 0; index < utilityItems.length; index++) {
          const item = utilityItems[index];

          if (!item.utilityBillId) {
            return `Please select a utility for item ${index + 1}`;
          }

          if (!item.utilityAmount || Number(item.utilityAmount) <= 0) {
            return `Please enter a valid amount for item ${index + 1}`;
          }
        }
      }
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

  const addPropertyHandler = async (e) => {
    if (!can(user, "Property.Create")) return;
    const payload = {
      ...formData,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      latitude: formData.latitude ? Number(formData.latitude) : null,

      utilities: utilityItems
        .filter((u) => u.utilityBillId)
        .map((u) => ({
          utilityId: Number(u.utilityBillId),
          amount: Number(u.utilityAmount),
          isReccurring: u.isReccurring,
        })),
    };

    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => propertyService.add(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => {
        setFormData(EMPTY_FORM);

        setUtilityItems([
          {
            utilityBillId: "",
            utilityAmount: "",
            isReccurring: true,
          },
        ]);
      },
      onSuccess: () => refreshTableData(),
    });
  };

  const updatePropertyHandler = async (e) => {
    if (!can(user, "Property.Update")) return;
    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => propertyService.update(formData.id, formData),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(EMPTY_FORM),
      onSuccess: () => refreshTableData(),
    });
  };

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

  const handleRowClick = (row) => {
    navigate(`/properties/${row.id}`);
  };

  const handleEdit = useCallback(
    (rowId) => {
      if (!can(user, "Property.Update")) return;
      const item = properties.find((p) => p.id === rowId);

      if (!item) return;

      setFormData(item);
      setOriginalData(item);
      setIsEditMode(true);
      setShowModal(true);
      setActiveRow(null);
    },
    [properties],
  );

  const handleDeleteClick = useCallback((rowId) => {
    if (!can(user, "Property.Delete")) return;
    setSelectedId(rowId);
    setDeleteModalOpen(true);
    setActiveRow(null);
  }, []);

  const columns = useMemo(
    () =>
      getPropertyColumns({
        user,
        activeRow,
        setActiveRow,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
      }),
    [activeRow, handleEdit, handleDeleteClick],
  );

  const handleAddItem = () => {
    setUtilityItems((prev) => [
      ...prev,
      {
        propertyTypeId: "",
        amount: "",
        isReccurring: false,
      },
    ]);
  };

  // ================= REMOVE =================

  const handleRemoveItem = (index) => {
    setUtilityItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= CHANGE =================

  const handleItemChange = (index, field, value) => {
    setUtilityItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  return (
    <>
      <BreadCrumb greetings="" />
      <div id="Section">
        <div className="header">
          <h3 className="sectionTitle">List of all Properties</h3>

          <Can permission="Property.Create">
            <PrimaryButton name="Add New" onClick={handleAddNew} />
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
            onclickItem={handleRowClick}
          />
          <Pagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
        <Can permission="Property.Delete">
          <DeleteModal
            isOpen={deleteModalOpen}
            title="Delete Property"
            onClose={() => setDeleteModalOpen(false)}
            onSubmit={(e) =>
              handleDelete({
                e,
                id: selectedId,
                endpoint: "Property",
                setLoadingBtn,
                setDeleteModalOpen,
                setData: setProperties,
                setLoading,
              })
            }
            loadingBtn={loadingBtn}
          />
        </Can>
        <Can
          permissions={isEditMode ? ["Property.Update"] : ["Property.Create"]}
        >
          <Modal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSubmit={isEditMode ? updatePropertyHandler : addPropertyHandler}
            errorMessage={formError}
            title={isEditMode ? "Update Property" : "Add Property"}
            loadingBtn={loadingBtn}
            isEditMode={isEditMode}
          >
            <div className="row3">
              <Input
                type="text"
                name="name"
                placeholder="Enter Property Name"
                value={formData.name || ""}
                labelName="Property Name"
                onChange={handleInputChange}
              />

              <Input
                type="email"
                name="emailAddress"
                placeholder="Enter Email Address"
                value={formData.emailAddress || ""}
                labelName="Email"
                onChange={handleInputChange}
              />

              <Input
                type="tel"
                name="mobileNumber"
                placeholder="Enter Mobile Number"
                value={formData.mobileNumber || ""}
                labelName="Mobile"
                onChange={handleInputChange}
              />

              <Input
                type="text"
                name="physicalAddress"
                placeholder="Enter physical Address"
                value={formData.physicalAddress || ""}
                labelName="physical Address"
                onChange={handleInputChange}
              />

              <Input
                type="text"
                name="country"
                placeholder="Enter Country"
                value={formData.country || ""}
                labelName="Country"
                onChange={handleInputChange}
              />

              <Input
                type="text"
                name="county"
                placeholder="Enter County"
                value={formData.county || ""}
                labelName="County"
                onChange={handleInputChange}
              />

              <Input
                type="text"
                name="area"
                placeholder="Enter Area"
                value={formData.area || ""}
                labelName="Area"
                onChange={handleInputChange}
              />

              <Select
                name="floor"
                labelName="Floor (s)"
                value={formData.floor}
                onChange={handleSelect}
                options={[
                  { value: "0", label: "Ground Floor" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                  { value: "7", label: "7" },
                  { value: "8", label: "8" },
                  { value: "9", label: "9" },
                  { value: "10", label: "10" },
                  { value: "11", label: "11" },
                  { value: "12", label: "12" },
                  { value: "13", label: "13" },
                  { value: "14", label: "14" },
                  { value: "15", label: "15" },
                  { value: "16", label: "16" },
                  { value: "17", label: "17" },
                  { value: "18", label: "18" },
                  { value: "19", label: "19" },
                  { value: "20", label: "20" },
                ]}
              />

              <Select
                name="propertyTypeId"
                labelName="property Type"
                value={formData.propertyTypeId}
                onChange={handleSelect}
                options={
                  error
                    ? [
                        {
                          value: 0,
                          label: "Error Fetching property Types",
                          disabled: true,
                        },
                      ]
                    : loading
                      ? [
                          {
                            value: 0,
                            label: "Loading property Types...",
                            disabled: true,
                          },
                        ]
                      : propertyTypes.map((p) => ({
                          value: p.id,
                          label: p.item,
                        }))
                }
              />
            </div>
            <button className="showMoreBtn" onClick={toggleShowMoreButton}>
              Show more{" "}
              {showMoreInputs ? (
                <MdArrowCircleUp className="downIcon" />
              ) : (
                <MdArrowCircleDown className="topIcon" />
              )}
            </button>

            {showMoreInputs && (
              <>
                <div className="row3">
                  <Input
                    type="text"
                    name="longitude"
                    placeholder="Enter Longitude"
                    value={formData.longitude || ""}
                    labelName="Longitude"
                    onChange={handleInputChange}
                  />

                  <Input
                    type="text"
                    name="latitude"
                    placeholder="Enter latitude"
                    value={formData.latitude || ""}
                    labelName="Latitude"
                    onChange={handleInputChange}
                  />
                  <Textarea
                    type="text"
                    name="notes"
                    placeholder="Enter description"
                    value={formData.notes || ""}
                    labelName="Notes"
                    onChange={handleInputChange}
                  />
                </div>

                {!isEditMode && (
                  <>
                    <div className="row3">
                      <p className="subHeaderTitle">Utility Bills</p>
                    </div>

                    <div className="items" style={{ marginTop: "10px" }}>
                      {Array.isArray(utilityItems) &&
                      utilityItems.length > 0 ? (
                        utilityItems.map((item, index) => (
                          <div key={index} className="row3">
                            {/* ===== UTILITY ===== */}
                            <Select
                              name="utilityBillId"
                              labelName="Utility"
                              value={item?.utilityBillId ?? ""}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "utilityBillId",
                                  e.target.value,
                                )
                              }
                              options={utilityBillTypes.map((p) => ({
                                value: p.id,
                                label: p.item,
                              }))}
                            />

                            {/* ===== AMOUNT ===== */}
                            <Input
                              type="number"
                              labelName="Amount"
                              name="utilityAmount"
                              placeholder="Enter Amount"
                              value={item?.utilityAmount ?? ""}
                              onChange={(name, value) =>
                                handleItemChange(index, name, value)
                              }
                            />

                            <CheckBox
                              name="isReccurring"
                              labelName="Is Reccurring"
                              checked={item?.isReccurring ?? false}
                              onChange={(name, value) =>
                                handleItemChange(index, name, value)
                              }
                            />

                            {/* ===== DELETE ===== */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="delete-btn"
                              disabled={utilityItems.length === 1}
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div
                          className="row3"
                          style={{
                            justifyContent: "center",
                            opacity: 0.6,
                          }}
                        >
                          No utility items added
                        </div>
                      )}
                    </div>

                    {/* ===== ADD ITEM ===== */}
                    <div className="row3">
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="add-btn"
                      >
                        <FaPlusCircle className="plusIcon" />
                        Add Item
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </Modal>
        </Can>
      </div>
    </>
  );
};

export default Property;
