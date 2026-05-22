import React, { useState, useEffect, useMemo, useCallback } from "react";
import BreadCrumb from "../../components/ui/BreadCrumb";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Table from "../../components/ui/Table";
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/DeleteModal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import { validateTextInput } from "../../helpers/validateTextInput";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { validateBulkReadings } from "../utilities/validateBulkReadings";
import { unitService } from "../units/unitService";
import { getColumns } from "../utilities/UtilityReadingColumn";
import { utilityService } from "../utilities/utilityService";
import { getData } from "../../helpers/getData";
import { getDate } from "../../helpers/getDate";
import { addData } from "../../helpers/addData";
import { updateData } from "../../helpers/updateData";
import { handleDelete } from "../../helpers/deleteData";
import { handleFormSubmit } from "../../helpers/handleFormSubmit";
import { unitTypeService } from "../unitTypes/unitTypeService";
import { propertyService } from "../properties/propertyService";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useAuthContext } from "../../auth/AuthContext";
import { can, canAny } from "../../auth/rbac";
import "../../css/UtilityReading.css";

const UtilityReading = () => {
  const { execute, apiLoading } = useApiRequest();
  const { user } = useAuthContext();

  const [properties, setProperties] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(false);

  const [units, setUnits] = useState([]);
  const [unitLoading, setUnitLoading] = useState(true);
  const [unitError, setUnitError] = useState(false);

  const [utilities, setUtilities] = useState([]);
  const [utilityLoading, setUtilityLoading] = useState(true);
  const [utilityError, setUtilityError] = useState(false);

  const [bulkUtilities, setBulkUtilities] = useState([]);
  const [bulkUtilityLoading, setBulkUtilityLoading] = useState(true);
  const [bulkUtilityError, setBulkUtilityError] = useState(false);

  const [sheetData, setSheetData] = useState([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetError, setSheetError] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [tableDataError, setTableDataError] = useState(false);

  const [activeSection, setActiveSection] = useState("single");
  const [showMoreInputs, setshowMoreInputs] = useState(false);

  const [singleFormLoading, setSingleFormLoading] = useState(true);
  const [singleFormError, setSingleFormError] = useState(false);

  const [bulkFormLoading, setBulkFormLoading] = useState(true);
  const [bulkFormError, setBulkFormError] = useState(false);

  const EMPTY_SINGLE_FORM = {
    propertyId: "",
    unitId: "",
    utilityId: "",
    previousReading: "",
    currentReading: "",
    readingDate: "",
    notes: "",
  };

  const EMPTY_BULK_FORM = {
    propertyId: "",
    utilityId: "",
  };

  const [singleForm, setSingleForm] = useState(EMPTY_SINGLE_FORM);
  const [bulkForm, setBulkForm] = useState(EMPTY_BULK_FORM);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!singleForm.propertyId) {
      setUnits([]);
      return;
    }

    fetchUnitsByProperty(singleForm.propertyId);
  }, [singleForm.propertyId]);

  useEffect(() => {
    if (!singleForm.unitId) {
      setUtilities([]);
      return;
    }

    fetchUtilitiesByUnitId(singleForm.unitId, true);
  }, [singleForm.unitId]);

  useEffect(() => {
    if (!bulkForm.propertyId) {
      setBulkUtilities([]);
      return;
    }

    fetchUtilitiesByPropertyId(bulkForm.propertyId);
  }, [bulkForm.propertyId]);

  useEffect(() => {
    if (!bulkForm.propertyId || !bulkForm.utilityId) return;

    fetchUtilitySheet(bulkForm.propertyId, bulkForm.utilityId);
  }, [bulkForm.propertyId, bulkForm.utilityId]);

  const fetchProperties = async () => {
    await getData({
      execute,
      request: () => propertyService.getAll(),
      setData: setProperties,
      setLoading: setPropertyLoading,
    });
  };

  const fetchUtilitiesByPropertyId = async (propertyId) => {
    await getData({
      execute,
      request: () => utilityService.getLookupsByPropertyId(propertyId),
      setData: setBulkUtilities,
      setLoading: setBulkUtilityLoading,
      setError: setBulkUtilityError,
    });
  };

  const fetchUnitsByProperty = async (propertyId) => {
    await getData({
      execute,
      request: () => unitService.getByPropertyId(propertyId),
      setData: setUnits,
      setLoading: setUnitLoading,
      setError: setUnitError,
    });
  };

  const fetchUtilitiesByUnitId = async (unitId, isMetered) => {
    await getData({
      execute,
      request: () => utilityService.getByUnitId(unitId, isMetered),
      setData: setUtilities,
      setLoading: setUtilityLoading,
    });
  };

  const fetchUtilitySheet = async (propertyId, utilityId) => {
    if (!propertyId || !utilityId) {
      setSheetData([]);
      return;
    }

    await getData({
      execute,
      request: () => utilityService.getUtilitySheet(propertyId, utilityId),
      setData: (data) => setSheetData(data.units ?? []),
      setLoading: setSheetLoading,
      setError: setSheetError,
    });
  };

  const handleSingleSelect = (e) => {
    const { name, value } = e.target;

    setSingleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSingleInput = (field, value) => {
    setSingleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBulkSelect = (e) => {
    const { name, value } = e.target;

    setBulkForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateSingleForm = () => {
    const { unitId, utilityId, currentReading } = singleForm;

    if (!unitId || !utilityId) {
      return "Please select unit and utility.";
    }

    if (currentReading === "" || currentReading === null) {
      return "Current reading is required.";
    }

    if (Number(currentReading) < 0) {
      return "Current reading cannot be negative.";
    }

    return "";
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!can(user, "UtilityBill.Create")) return;

    const payload = {
      unitId: Number(singleForm.unitId),
      utilityBillId: Number(singleForm.utilityId),
      previousReading: Number(singleForm.previousReading) || 0,
      currentReading: Number(singleForm.currentReading) || 0,
      readingDate: singleForm.readingDate || getDate().formatted,
      notes: singleForm.notes || "",
    };

    await handleFormSubmit({
      e,
      validateForm: validateSingleForm,
      execute,
      request: () => utilityService.addReading(payload),
      setFormError: setSingleFormError,
      setLoadingBtn: setSingleFormLoading,
      resetForm: () => setSingleForm(EMPTY_SINGLE_FORM),
      onSuccess: () => setSingleForm(EMPTY_SINGLE_FORM),
    });
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!can(user, "UtilityBill.Create")) return;

    // 1. FILTER valid rows only
    const validReadings = sheetData
      .map((r) => ({
        utilityBillId: r.utilityBillId,
        unitId: r.unitId,
        currentReading: Number(r.currentReading),
      }))
      .filter((r) => r.currentReading > 0);

    // 2. VALIDATION: must have at least one row
    if (validReadings.length === 0) {
      setBulkFormError("No readings to submit.");
      return;
    }
    console.log("Valid Readings", validReadings);

    // 3. VALIDATION: check invalid readings
    const hasInvalid = sheetData.some((r) => {
      const prev = Number(r.previousReading || 0);
      const curr = Number(r.currentReading || 0);

      return curr !== 0 && curr < prev;
    });

    if (hasInvalid) {
      setBulkFormError("Some readings are less than previous values.");
      return;
    }

    // 4. BUILD PAYLOAD (bulk DTO)
    const payload = {
      readings: validReadings,
    };

    // 5. SUBMIT
    await handleFormSubmit({
      e,
      validateForm: () => validateBulkReadings(sheetData), // already validated above
      execute,
      request: () => utilityService.bulkAddReadings(payload),
      setFormError: setBulkFormError,
      setLoadingBtn: setBulkFormLoading,
      resetForm: () => {
        setSheetData([]);
        setBulkForm(EMPTY_BULK_FORM);
      },
      onSuccess: () => {
        setSheetData([]);
        setBulkForm(EMPTY_BULK_FORM);
      },
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

  const handleSheetChange = useCallback((unitId, field, value) => {
    setSheetData((prev) =>
      prev.map((row) =>
        row.unitId === unitId ? { ...row, [field]: value } : row,
      ),
    );
  }, []);

  const columns = useMemo(
    () => getColumns(handleSheetChange),
    [handleSheetChange],
  );
  return (
    <>
      <BreadCrumb greetings="" />
      <div id="Section">
        <div className="header">
          <h3 className="sectionTitle">Record Utility Readings</h3>
          <div className="sectionActions">
            <PrimaryButton
              name="Record Utility"
              onClick={() => setActiveSection("single")}
              isActive={activeSection === "single"}
            />

            <PrimaryButton
              name="Bulk Record"
              onClick={() => setActiveSection("bulk")}
              isActive={activeSection === "bulk"}
            />
          </div>
        </div>

        <div className="ContentContainer">
          {activeSection == "single" && (
            <form
              className="SingleReadingSection"
              onSubmit={handleSingleSubmit}
            >
              <div className="row2">
                <Select
                  name="propertyId"
                  labelName="Property Name"
                  value={singleForm.propertyId || ""}
                  onChange={handleSingleSelect}
                  options={
                    propertyLoading
                      ? [{ value: "", label: "Loading properties..." }]
                      : propertyError
                        ? [{ value: "", label: "Error loading properties" }]
                        : !properties || properties.length === 0
                          ? [{ value: "", label: "No properties found" }]
                          : properties.map((p) => ({
                              value: p.id,
                              label: p.name,
                            }))
                  }
                />
              </div>

              <div className="row2">
                <Select
                  name="unitId"
                  labelName="Unit Name"
                  value={singleForm.unitId || ""}
                  onChange={handleSingleSelect}
                  disabled={!singleForm.propertyId}
                  options={
                    !singleForm.propertyId
                      ? [
                          {
                            value: "",
                            label: "Choose Property First",
                            disabled: true,
                          },
                        ]
                      : unitLoading
                        ? [
                            {
                              value: "",
                              label: "Loading Units...",
                              disabled: true,
                            },
                          ]
                        : unitError
                          ? [
                              {
                                value: "",
                                label: "Error loading Units",
                                disabled: true,
                              },
                            ]
                          : units && units.length > 0
                            ? units.map((p) => ({
                                value: p.id,
                                label: p.name,
                              }))
                            : [
                                {
                                  value: "",
                                  label: "No Units Found",
                                  disabled: true,
                                },
                              ]
                  }
                  text={
                    singleForm.propertyId
                      ? "Select Unit"
                      : "Choose Property First"
                  }
                  placeholder=""
                />

                <Select
                  name="utilityId"
                  labelName="Utility Name"
                  value={singleForm.utilityId || ""}
                  onChange={handleSingleSelect}
                  disabled={!singleForm.unitId}
                  options={
                    !singleForm.unitId
                      ? [
                          {
                            value: "",
                            label: "Choose Unit First",
                            disabled: true,
                          },
                        ]
                      : utilityLoading
                        ? [
                            {
                              value: "",
                              label: "Loading Utilities...",
                              disabled: true,
                            },
                          ]
                        : utilityError
                          ? [
                              {
                                value: "",
                                label: "Error loading Utilities...",
                                disabled: true,
                              },
                            ]
                          : utilities && utilities.length > 0
                            ? utilities.map((p) => ({
                                value: p.id,
                                label: `${p.name} - ${p.amount}`,
                              }))
                            : [
                                {
                                  value: "",
                                  label: "No Utilities Found",
                                  disabled: true,
                                },
                              ]
                  }
                  text={
                    singleForm.unitId ? "Select Utility" : "Choose Unit First"
                  }
                />
              </div>

              <div className="row2">
                <Input
                  type="number"
                  name="currentReading"
                  placeholder="Current Reading eg 2.5"
                  value={singleForm.currentReading || ""}
                  labelName="Current Reading"
                  onChange={handleSingleInput}
                />

                <Input
                  type="date"
                  name="readingDate"
                  placeholder="Reading Date"
                  value={singleForm.readingDate || getDate().formatted}
                  labelName="Reading Date"
                  onChange={handleSingleInput}
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
                <div className="row2">
                  <Input
                    type="number"
                    name="previousReading"
                    placeholder="Previous Reading"
                    value={singleForm.previousReading || ""}
                    labelName="Previous Reading"
                    onChange={handleSingleInput}
                  />
                  <Textarea
                    type="text"
                    name="notes"
                    placeholder="Enter description"
                    value={singleForm.notes || ""}
                    labelName="Notes"
                    onChange={handleSingleInput}
                  />
                </div>
              )}
              <div className="row2">
                <p className="errorMessage">{singleFormError}</p>
              </div>
              <div className="row2 btnCont">
                <PrimaryButton
                  name="Record Reading"
                  type="submit"
                  onClick={handleSingleSubmit}
                  loading={apiLoading}
                />
              </div>
            </form>
          )}

          {activeSection == "bulk" && (
            <form className="BulkReadingSection" onSubmit={handleBulkSubmit}>
              <div className="row2">
                <Select
                  name="propertyId"
                  labelName="Property Name"
                  value={bulkForm.propertyId || ""}
                  onChange={handleBulkSelect}
                  options={
                    propertyLoading
                      ? [{ value: "", label: "Loading properties..." }]
                      : propertyError
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
                  value={bulkForm.utilityId || ""}
                  onChange={handleBulkSelect}
                  disabled={!bulkForm.propertyId}
                  options={
                    !bulkForm.propertyId
                      ? [
                          {
                            value: "",
                            label: "Choose Property First",
                            disabled: true,
                          },
                        ]
                      : bulkUtilityLoading
                        ? [
                            {
                              value: "",
                              label: "Loading Utilities...",
                              disabled: true,
                            },
                          ]
                        : bulkUtilityError
                          ? [
                              {
                                value: "",
                                label: "Error loading Utilities...",
                                disabled: true,
                              },
                            ]
                          : bulkUtilities && bulkUtilities.length > 0
                            ? bulkUtilities.map((p) => ({
                                value: p.utilityId,
                                label: `${p.utilityName}`,
                              }))
                            : [
                                {
                                  value: "",
                                  label: "No Utilities Found",
                                  disabled: true,
                                },
                              ]
                  }
                  text={
                    bulkForm.propertyId
                      ? "Select Utility"
                      : "Choose Property First"
                  }
                />
              </div>

              <Table
                data={sheetData}
                columns={columns}
                loading={sheetLoading}
                error={sheetError}
                getRowId={(row) => row.unitId}
              />
              <div className="row2">
                <p className="errorMessage">{bulkFormError}</p>
              </div>
              <div className="row2" style={{ margin: "20px auto" }}>
                <PrimaryButton
                  name="Record Readings"
                  onClick={handleBulkSubmit}
                  isActive={activeSection === "bulk"}
                  className="recordBulkBtn"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UtilityReading;
