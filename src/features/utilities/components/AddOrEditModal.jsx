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
import { unitService } from "../../units/unitService";
import { utilityService } from "../utilityService";

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

  const [unitLookups, setUnitLookups] = useState([]);
  const [unitLookupsLoading, setUnitLookupsLoading] = useState(false);
  const [unitLookupsError, setUnitLookupsError] = useState(false);

  const [utilityDropdown, setUtilityDropdown] = useState([]);
  const [utilityLoading, setUtilityLoading] = useState(true);
  const [utilityError, setUtilityError] = useState(false);

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(modalData);
  const [showModal, setShowModal] = useState(show);
  const [hasLoadedLookups, setHasLoadedLookups] = useState(false);

  const [showMoreInputs, setshowMoreInputs] = useState(false);

  // FETCH DATA
  useEffect(() => {
    if (!showModal) return;

    fetchProperties();
    fetchUtilities();
  }, [showModal]);

  useEffect(() => {
    if (!formData.propertyId) {
      setUnitLookups([]);
      setUnitLookupsError(false);
      return;
    }

    const loadUnits = async () => {
      setUnitLookupsError(false);
      setUnitLookupsLoading(true);

      await getData({
        execute,
        request: () => unitService.getByPropertyId(formData.propertyId),
        setData: setUnitLookups,
        setLoading: setUnitLookupsLoading,
        setError: setUnitLookupsError,
      });
    };

    loadUnits();
  }, [formData.propertyId]);

  const fetchProperties = async () => {
    await getData({
      execute,
      request: () => propertyService.getAll(),
      setData: setPropertyLookups,
      setLoading: setPropertyLookupsLoading,
      setError: setPropertyLookupsError,
    });
  };

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

  const fetchUnitsByProperty = async (propertyId) => {
    await getData({
      execute,
      request: () => unitService.getByPropertyId(propertyId),
      setData: setUnitLookups,
      setLoading: setUnitLookupsLoading,
      setError: setUnitLookupsError,
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

  //  DATA VALIDATION
  const validateModalForm = () => {
    const { utilityId, amount, propertyId, unitId, isMetered } = formData;

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

  // ADD AND EDIT FUNCTIONS
  const addUtilityHandler = async (e) => {
    if (!can(user, "Unit.Create")) return;
    // e.preventDefault();

    const payload = {
      PropertyId: formData.propertyId ? Number(formData.propertyId) : null,
      UtilityId: formData.utilityId ? Number(formData.utilityId) : null,
      Amount: formData.amount ? Number(formData.amount) : null,
      IsMetered:
        formData.isMetered !== undefined ? Boolean(formData.isMetered) : null,
      Notes: formData.notes ? String(formData.notes) : null,
      UnitId: formData.unitId ? Number(formData.unitId) : null,
    };
    // console.log("Form Data:", formData);
    // console.log("Form Data:", payload);
    // return;

    await handleFormSubmit({
      e,
      validateForm: validateModalForm,
      execute,
      request: () => utilityService.add(payload),
      setFormError,
      setLoadingBtn,
      resetForm: () => setFormData(modalData),
      onSuccess: () => onSuccess(),
    });
  };

  const updateUtilityHandler = async (e) => {
    if (!can(user, "UtilityBill.Update")) return;
    const payload = {
      PropertyId: formData.propertyId ? Number(formData.propertyId) : null,
      UtilityId: formData.utilityId ? Number(formData.utilityId) : null,
      Amount: formData.amount ? Number(formData.amount) : null,
      IsMetered:
        formData.isMetered !== undefined ? Boolean(formData.isMetered) : null,
      Notes: formData.notes ? String(formData.notes) : null,
      UnitId: formData.unitId ? Number(formData.unitId) : null,
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

  return (
    <Can permissions={isEdit ? ["UtilityBill.Update"] : ["UtilityBill.Create"]}>
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={isEdit ? updateUtilityHandler : addUtilityHandler}
        errorMessage={formError}
        title={isEdit ? "Update Charge" : "Add Charge"}
        loadingBtn={loadingBtn}
        isEditMode={isEdit}
      >
        <div className="row2">
          <Select
            name="propertyId"
            labelName="Property Name"
            value={formData.propertyId || ""}
            onChange={handleSelect}
            options={
              propertyLookupsLoading
                ? [{ value: "", label: "Loading properties..." }]
                : propertyLookupsError
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

          <CheckBox
            name="IsMetered"
            labelName="IsMetered"
            onChange={handleInputChange}
            checked={formData.IsMetered}
          />
        </div>
        <div className="row1">
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
            <div className="row1">
              <Select
                name="unitId"
                labelName="Unit Name"
                value={formData.unitId || ""}
                onChange={handleSelect}
                disabled={!formData.propertyId}
                options={
                  !formData.propertyId
                    ? [{ value: "", label: "Select property first" }]
                    : unitLookupsLoading
                      ? [{ value: "", label: "Loading units..." }]
                      : unitLookupsError
                        ? [{ value: "", label: "Error loading units" }]
                        : !unitLookups || unitLookups.length === 0
                          ? [{ value: "", label: "No units found" }]
                          : unitLookups.map((p) => ({
                              value: p.id,
                              label: p.name,
                            }))
                }
                text={
                  formData.propertyId ? "select unit" : "choose property first"
                }
              />
            </div>
          </>
        )}
      </Modal>
    </Can>
  );
};

export default AddOrEditModal;
