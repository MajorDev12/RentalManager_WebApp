import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useAuthContext } from "../../auth/AuthContext";
import { useUrlSync } from "../../hooks/useUrlSync";
import { can, canAny } from "../../auth/rbac";

import BreadCrumb from "../../components/ui/BreadCrumb";
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Table from "../../components/ui/Table";
import Can from "../../auth/Can";
import { getColumns } from "./UnitColumns";
import Modal from "../../components/ui/Modal";
import DeleteModal from "../../components/ui/DeleteModal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { validateTextInput } from "../../helpers/validateTextInput";
import { getData } from "../../helpers/getData";
import AddOrEditModal from "./components/AddOrEditModal";
import { handleDelete } from "../../helpers/deleteData";
import { handleFormSubmit } from "../../helpers/handleFormSubmit";
import { propertyService } from "../properties/propertyService";
import { unitTypeService } from "../unitTypes/unitTypeService";
import { systemCodeItemService } from "../systemCodeItems/systemCodeItemService";
import { unitService } from "./unitService";

import { useApiRequest } from "../../hooks/useApiRequest";
import { useApiQuery } from "../../hooks/useApiQuery";
import { useDataTable } from "../../hooks/useDataTable";

const Unit = () => {
  const { execute, apiLoading } = useApiRequest();
  const { search } = useSearch();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [activeRow, setActiveRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedPropertyId, setPropertySelectedId] = useState(null);
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [propertyLookups, setPropertyLookups] = useState([]);
  const [propertyLookupsLoading, setPropertyLookupsLoading] = useState(false);
  const [propertyLookupsError, setPropertyLookupsError] = useState(false);

  const [unitTypes, setUnitTypes] = useState([]);
  const [unitTypesLoading, setUnitTypesLoading] = useState(false);
  const [unitTypesError, setUnitTypesError] = useState(false);

  const [showMoreInputs, setshowMoreInputs] = useState(false);

  const EMPTY_FORM = {
    propertyId: "",
    unitTypeId: "",
    rentalTypeId: "",
    billingCycleId: "",
    floor: 0,
    name: "",
    amount: 0,
    notes: "",
  };
  const [formData, setFormData] = useState(EMPTY_FORM);

  const {
    data: units,
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
  } = useDataTable(unitService.getFiltered, {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "",
    isDescending: false,
  });

  const tableData = useMemo(() => units ?? [], [units]);
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      searchTerm: search,
      pageNumber: 1,
    }));
  }, [search]);

  useEffect(() => {
    if (showModal) {
      fetchProperties();
      fetchUnitTypes();
    }
  }, [showModal]);

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

  const refreshTableData = () => {
    setPage(1);
    refetch();
    handleCloseModal();
  };

  const handleEdit = (rowId) => {
    const item = units.find((p) => p.id === rowId);
    if (!item) return;
    setFormData(item);
    setSelectedId(item.id);
    setPropertySelectedId(item.propertyId);
    setOriginalData(item);
    setIsEditMode(true);
    setShowModal(true);
    setActiveRow(null);
  };

  const handleDeleteClick = (rowId) => {
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

  const handleCloseModal = () => {
    setFormError("");
    setIsEditMode(false);
    setFormData(EMPTY_FORM);
    setShowModal(false);
  };

  const handleRowClick = (row) => {
    navigate(`/Units/${row.id}`);
  };

  return (
    <>
      <BreadCrumb greetings="" />
      <div id="Section">
        <div className="header">
          <h3>List of all Units</h3>
          <Can permission="Unit.Create">
            <PrimaryButton name="Add New" onClick={() => setShowModal(true)} />
          </Can>
        </div>

        <div className="TableContainer">
          <Can permission="Unit.Read">
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
          </Can>
        </div>

        <Can permission="permission.Delete">
          <DeleteModal
            isOpen={deleteModalOpen}
            title="Delete Unit"
            onClose={() => setDeleteModalOpen(false)}
            onSubmit={(e) =>
              handleDelete({
                e,
                id: selectedId,
                endpoint: "Unit",
                setLoadingBtn,
                setDeleteModalOpen,
                setData: setCharges,
                setLoading,
              })
            }
            loadingBtn={loadingBtn}
          />
        </Can>

        <AddOrEditModal
          show={showModal}
          isEdit={isEditMode}
          originalData={originalData}
          modalData={formData}
          onSuccess={refreshTableData}
          closeModal={handleCloseModal}
        />
      </div>
    </>
  );
};

export default Unit;
