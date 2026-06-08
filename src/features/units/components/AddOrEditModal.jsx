import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuthContext } from "../../../auth/AuthContext";
import { can, canAny } from "../../../auth/rbac";
import { handleFormSubmit } from "../../../helpers/handleFormSubmit";
import { getData } from "../../../helpers/getData";
import { handleDelete } from "../../../helpers/deleteData";
import { validateTextInput } from "../../../helpers/validateTextInput";
import { validateEmail } from "../../../helpers/validateEmail";
import { useApiRequest } from "../../../hooks/useApiRequest";
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

  const [propertyLookups, setPropertyLookups] = useState([]);
  const [propertyLookupsLoading, setPropertyLookupsLoading] = useState(false);
  const [propertyLookupsError, setPropertyLookupsError] = useState(false);

  const [rentalTypes, setRentalTypes] = useState([]);
  const [rentalTypesLoading, setRentalTypesLoading] = useState(false);
  const [rentalTypesError, setRentalTypesError] = useState(false);

  const [billingCycles, setBillingCycles] = useState([]);
  const [billingCyclesLoading, setBillingCyclesLoading] = useState(false);
  const [billingCyclesError, setBillingCyclesError] = useState(false);

  const [unitTypes, setUnitTypes] = useState([]);
  const [unitTypesLoading, setUnitTypesLoading] = useState(false);
  const [unitTypesError, setUnitTypesError] = useState(false);

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(modalData);
  const [showModal, setShowModal] = useState(show);

  const [showMoreInputs, setshowMoreInputs] = useState(false);

  // FETCH DATA
  useEffect(() => {
    if (showModal) {
      fetchProperties();
      fetchUnitTypes();
      fetchBillingCycles();
      fetchRentalTypes();
    }
  }, [showModal]);

  const fetchBillingCycles = async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("BILLINGCYCLE"),
      setData: setBillingCycles,
      setLoading: setBillingCyclesLoading,
      setError: setBillingCyclesError,
    });
  };

  const fetchRentalTypes = async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("RENTALTYPE"),
      setData: setRentalTypes,
      setLoading: setRentalTypesLoading,
      setError: setRentalTypesError,
    });
  };

  const fetchProperties = async () => {
    await getData({
      execute,
      request: () => propertyService.getAll(),
      setData: setPropertyLookups,
      setLoading: setPropertyLookupsLoading,
      setError: setPropertyLookupsError,
    });
  };

  const fetchUnitTypes = async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("UNITTYPE"),
      setData: setUnitTypes,
      setLoading: setUnitTypesLoading,
      setError: setUnitTypesError,
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
          <Select
            name="propertyId"
            labelName="Property Name"
            value={formData.propertyId || ""}
            onChange={handleSelect}
            options={
              propertyLookups
                ? propertyLookups && propertyLookups.length > 0
                  ? propertyLookups.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  : [
                      {
                        value: "",
                        label: "No Available Properties",
                        disabled: true,
                      },
                    ]
                : []
            }
          />
          <Input
            type="text"
            name="name"
            placeholder="Enter House Name"
            value={formData.name || ""}
            labelName="House Name"
            onChange={handleInputChange}
          />

          <Select
            name="unitTypeId"
            labelName="Unit Type"
            value={formData.unitTypeId || ""}
            onChange={handleSelect}
            options={
              unitTypesLoading
                ? [
                    {
                      value: "",
                      label: "Loading UnitTypes...",
                    },
                  ]
                : unitTypesError
                  ? [
                      {
                        value: "",
                        label: "Error loading UnitTypes",
                      },
                    ]
                  : !unitTypes || unitTypes.length === 0
                    ? [
                        {
                          value: "",
                          label: "No UnitTypes Found",
                        },
                      ]
                    : unitTypes.map((p) => ({
                        value: p.id,
                        label: p.item,
                      }))
            }
          />

          <Select
            name="rentalTypeId"
            labelName="Rental Type"
            value={formData.rentalTypeId || ""}
            onChange={handleSelect}
            options={
              rentalTypesLoading
                ? [
                    {
                      value: "",
                      label: "Loading Rental Types...",
                    },
                  ]
                : rentalTypesError
                  ? [
                      {
                        value: "",
                        label: "Error loading Rental Types",
                      },
                    ]
                  : !rentalTypes || rentalTypes.length === 0
                    ? [
                        {
                          value: "",
                          label: "No Rental Types Found",
                        },
                      ]
                    : rentalTypes.map((p) => ({
                        value: p.id,
                        label: p.item,
                      }))
            }
          />

          <Select
            name="billingCycleId"
            labelName="Billing Cycles"
            value={formData.billingCycleId || ""}
            onChange={handleSelect}
            options={
              billingCyclesLoading
                ? [
                    {
                      value: "",
                      label: "Loading Billing Cycles...",
                    },
                  ]
                : billingCyclesError
                  ? [
                      {
                        value: "",
                        label: "Error loading Billing Cycles",
                      },
                    ]
                  : !billingCycles || billingCycles.length === 0
                    ? [
                        {
                          value: "",
                          label: "No Billing Cycles Found",
                        },
                      ]
                    : billingCycles.map((p) => ({
                        value: p.id,
                        label: p.item,
                      }))
            }
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
