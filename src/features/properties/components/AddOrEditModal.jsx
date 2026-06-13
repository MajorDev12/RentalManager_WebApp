import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuthContext } from "../../../auth/AuthContext";
import { can, canAny } from "../../../auth/rbac";
import { handleFormSubmit } from "../../../helpers/handleFormSubmit";
import { getData } from "../../../helpers/getData";
import { handleDelete } from "../../../helpers/deleteData";
import { validateTextInput } from "../../../helpers/validateTextInput";
import { validateEmail } from "../../../helpers/validateEmail";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { useSystemConfig } from "../../../hooks/useSystemConfig";
import { propertyService } from "../propertyService";
import { systemCodeItemService } from "../../systemCodeItems/systemCodeItemService";

import { RiDeleteBin6Line } from "react-icons/ri";
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";

import Input from "../../../components/ui/Input";
import SmartSelect from "../../../components/ui/SmartSelect";
import Can from "../../../auth/Can";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import CheckBox from "../../../components/ui/CheckBox";
import Modal from "../../../components/ui/Modal";

const AddOrEditModal = ({
  show = false,
  isEdit = false,
  modalData,
  originalData,
  onSuccess,
  closeModal,
}) => {
  if (!show) return null;
  const { execute, apiLoading } = useApiRequest();
  const { user } = useAuthContext();
  const { getOptions, ready } = useSystemConfig(execute);

  const EMPTY_UTILITY_FORM = {
    utilityBillId: "",
    utilityAmount: "",
    billingCycleId: "",
    isMetered: "",
  };
  const [utilityItems, setUtilityItems] = useState([EMPTY_UTILITY_FORM]);

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(modalData);

  const [showMoreInputs, setshowMoreInputs] = useState(false);

  // FETCH DATA

  const fetchUtilityTypes = async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("UTILITYBILL"),
      setData: setUtilityBillTypes,
      setLoading: setUtilityBillLoading,
      setError: setUtilityBillTypeError,
    });
  };

  const propertyTypes = getOptions("PROPERTYTYPE");
  const utilityBillTypes = getOptions("UTILITYBILL");
  const billingCycleTypes = getOptions("BILLINGCYCLE");
  const propertyTypeOptions = useMemo(
    () =>
      propertyTypes.map((x) => ({
        value: x.value,
        label: x.label,
        icon: x.iconKey,
        color: x.color,
        groupKey: x.groupKey,
      })),
    [propertyTypes],
  );

  const utilityBillOptions = useMemo(
    () =>
      utilityBillTypes.map((x) => ({
        value: x.value,
        label: x.label,
        icon: x.iconKey,
        color: x.color,
        groupKey: x.groupKey,
      })),
    [utilityBillTypes],
  );

  const billingCycleOptions = useMemo(
    () =>
      billingCycleTypes.map((x) => ({
        value: x.value,
        label: x.label,
        icon: x.iconKey,
        color: x.color,
        groupKey: x.groupKey,
      })),
    [billingCycleTypes],
  );

  const floors = [
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
  ];

  // HELPER FUNCTIONS
  const handleSelect = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = () => {
    setUtilityItems((prev) => [
      ...prev,
      {
        propertyTypeId: "",
        amount: "",
        billingCycleId: "",
        isMetered: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setUtilityItems((prev) => prev.filter((_, i) => i !== index));
  };

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

  //  DATA VALIDATION
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

    if (originalData != null && isEdit) {
      return validateChange(originalData, formData);
    }
    return "";
  };

  const validateChange = (originalData, updatedData) => {
    const isSame = JSON.stringify(updatedData) === JSON.stringify(originalData);
    if (isSame) return "No Changes Made";
    return "";
  };

  // ADD AND EDIT FUNCTIONS
  const addPropertyHandler = async (e) => {
    if (!can(user, "Property.Create")) return;
    const payload = {
      ...formData,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      latitude: formData.latitude ? Number(formData.latitude) : null,
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
      resetForm: () => setFormData(formData),
      onSuccess: () => onSuccess(),
    });
  };

  return (
    <Can permissions={isEdit ? ["Property.Update"] : ["Property.Create"]}>
      <Modal
        isOpen={show}
        onClose={closeModal}
        onSubmit={isEdit ? updatePropertyHandler : addPropertyHandler}
        errorMessage={formError}
        title={isEdit ? "Update Property" : "Add Property"}
        loadingBtn={loadingBtn}
        isEditMode={isEdit}
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

          <SmartSelect
            name="floor"
            labelName="Floor"
            value={formData.floor}
            onChange={handleSelect}
            options={floors}
          />

          <SmartSelect
            name="propertyTypeId"
            labelName="Property Type"
            value={formData.propertyTypeId}
            onChange={handleSelect}
            options={propertyTypeOptions}
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

            {!isEdit && (
              <>
                <div className="row3">
                  <p className="subHeaderTitle">Utility Bills</p>
                </div>

                <div className="items" style={{ marginTop: "10px" }}>
                  {Array.isArray(utilityItems) && utilityItems.length > 0 ? (
                    utilityItems.map((item, index) => (
                      <div key={index} className="row3">
                        {/* ===== UTILITY ===== */}
                        <SmartSelect
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
                          options={utilityBillOptions}
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

                        <SmartSelect
                          name="billingCycleId"
                          labelName="Billing Cycle"
                          value={formData.billingCycleId}
                          onChange={handleSelect}
                          options={billingCycleOptions}
                        />
                        <CheckBox
                          name="isMetered"
                          labelName="Is Metered"
                          checked={item?.isMetered ?? false}
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
  );
};

export default AddOrEditModal;
