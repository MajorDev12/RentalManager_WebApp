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
import { propertyService } from "../../properties/propertyService";
import { systemCodeItemService } from "../../systemCodeItems/systemCodeItemService";
import { unitService } from "../unitService";

import { RiDeleteBin6Line } from "react-icons/ri";
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";

import Input from "../../../components/ui/Input";
import Can from "../../../auth/Can";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import SmartSelect from "../../../components/ui/SmartSelect";
import CheckBox from "../../../components/ui/CheckBox";
import Modal from "../../../components/ui/Modal";

const AddOrEditModal = ({
  show = false,
  isEdit = false,
  modalData,
  originalData = null,
  onSuccess,
  closeModal,
}) => {
  if (!show) return null;
  const { execute, apiLoading } = useApiRequest();
  const { user } = useAuthContext();
  const { getOptions, ready } = useSystemConfig(execute);

  const [propertyLookups, setPropertyLookups] = useState([]);
  const [propertyLookupsLoading, setPropertyLookupsLoading] = useState(false);
  const [propertyLookupsError, setPropertyLookupsError] = useState(false);

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(modalData);
  const [showModal, setShowModal] = useState(show);

  const [showMoreInputs, setshowMoreInputs] = useState(false);

  // FETCH DATA
  useEffect(() => {
    if (showModal) {
      fetchProperties();
    }
  }, [showModal]);

  const unitTypes = getOptions("UNITTYPE");
  const rentalTypes = getOptions("RENTALTYPE");
  const billingCycleTypes = getOptions("BILLINGCYCLE");
  const propertyOptions = useMemo(
    () =>
      propertyLookups.map((x) => ({
        value: x.id,
        label: x.name,
      })),
    [propertyLookups],
  );
  const unitTypeOptions = useMemo(
    () =>
      unitTypes.map((x) => ({
        value: x.value,
        label: x.label,
        icon: x.icon,
        color: x.color,
        groupBy: x.groupBy,
      })),
    [unitTypes],
  );

  const rentalTypeOptions = useMemo(
    () =>
      rentalTypes.map((x) => ({
        value: x.value,
        label: x.label,
        icon: x.iconKey,
        color: x.color,
        groupKey: x.groupKey,
      })),
    [rentalTypes],
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

  const fetchProperties = async () => {
    await getData({
      execute,
      request: () => propertyService.getAll(),
      setData: setPropertyLookups,
      setLoading: setPropertyLookupsLoading,
      setError: setPropertyLookupsError,
    });
  };

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

  const handleCloseModal = () => {
    setFormData([]);
    setShowModal(false);
  };

  //  DATA VALIDATION
  const validateModalForm = () => {
    const {
      name,
      unitTypeId,
      rentalTypeId,
      billingCycleId,
      propertyId,
      amount,
      floor,
    } = formData;

    if (
      !name ||
      !unitTypeId ||
      !rentalTypeId ||
      !billingCycleId ||
      !amount ||
      !propertyId
    ) {
      return "Please fill in all required fields.";
    }
    if (!validateTextInput(name, true)) {
      return "Unit Name cannot be empty";
    }
    if (amount == isNaN) {
      return "Please enter a valid Rent Amount";
    }

    if (floor < 0) {
      return "Enter a valid Floor Number";
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
  const addUnitHandler = async (e) => {
    if (!can(user, "Unit.Create")) return;
    const payload = {
      PropertyId: formData.propertyId ? Number(formData.propertyId) : null,
      UnitTypeId: formData.unitTypeId ? Number(formData.unitTypeId) : null,
      RentalTypeId: formData.rentalTypeId
        ? Number(formData.rentalTypeId)
        : null,
      BillingCycleId: formData.billingCycleId
        ? Number(formData.billingCycleId)
        : null,
      Floor: formData.floor ? Number(formData.floor) : null,
      Name: formData.name ? String(formData.name) : null,
      Amount: formData.amount ? Number(formData.amount) : null,
      Notes: formData.notes ? String(formData.notes) : null,
    };

    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => unitService.add(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(modalData),
      onSuccess: () => onSuccess(),
    });
  };

  const updateUnitHandler = async (e) => {
    if (!can(user, "Unit.Update")) return;
    const payload = {
      PropertyId: formData.propertyId ? Number(formData.propertyId) : null,
      UnitTypeId: formData.unitTypeId ? Number(formData.unitTypeId) : null,
      RentalTypeId: formData.rentalTypeId
        ? Number(formData.rentalTypeId)
        : null,
      BillingCycleId: formData.billingCycleId
        ? Number(formData.billingCycleId)
        : null,
      Floor: formData.floor ? Number(formData.floor) : null,
      Name: formData.name ? String(formData.name) : null,
      Amount: formData.amount ? Number(formData.amount) : null,
      Notes: formData.notes ? String(formData.notes) : null,
    };
    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => unitService.patch(formData.id, payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData([]),
      onSuccess: () => onSuccess(),
    });
  };

  return (
    <Can permissions={isEdit ? ["Unit.Update"] : ["Unit.Create"]}>
      <Modal
        isOpen={show}
        onClose={closeModal}
        onSubmit={isEdit ? updateUnitHandler : addUnitHandler}
        errorMessage={formError}
        title={isEdit ? "Update Unit" : "Add Unit"}
        loadingBtn={loadingBtn}
        isEditMode={isEdit}
      >
        <div className="row3">
          <SmartSelect
            name="propertyId"
            labelName="Property Name"
            value={formData.propertyId || ""}
            onChange={handleSelect}
            options={propertyOptions}
          />
          <Input
            type="text"
            name="name"
            placeholder="Enter House Name"
            value={formData.name || ""}
            labelName="House Name"
            onChange={handleInputChange}
          />

          <SmartSelect
            name="unitTypeId"
            labelName="Unit Type"
            value={formData.unitTypeId || ""}
            onChange={handleSelect}
            options={unitTypeOptions}
            groupBy="groupKey"
          />

          <SmartSelect
            name="rentalTypeId"
            labelName="Rental Type"
            value={formData.rentalTypeId || ""}
            onChange={handleSelect}
            options={rentalTypeOptions}
          />

          <SmartSelect
            name="billingCycleId"
            labelName="Billing Cycles"
            value={formData.billingCycleId || ""}
            onChange={handleSelect}
            options={billingCycleOptions}
          />

          <SmartSelect
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

          <Input
            type="number"
            name="amount"
            placeholder="Enter Rent Amount"
            value={formData.amount || ""}
            labelName="Rent Amount"
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

        <button className="showMoreBtn" onClick={toggleShowMoreButton}>
          Show more{" "}
          {showMoreInputs ? (
            <MdArrowCircleUp className="downIcon" />
          ) : (
            <MdArrowCircleDown className="topIcon" />
          )}
        </button>

        {showMoreInputs && (
          <div className="row3">
            <p className="subHeaderTitle">Unit Features</p>
          </div>
        )}
      </Modal>
    </Can>
  );
};

export default AddOrEditModal;
