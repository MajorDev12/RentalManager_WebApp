import React, { useState, useEffect, useMemo } from "react";
import BreadCrumb from "../../components/ui/BreadCrumb";
import { MdArrowCircleDown, MdArrowCircleUp } from "react-icons/md";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Table from "../../components/ui/Table";
import { getColumns } from "./UnitChargeColumn";
import CheckBox from "../../components/ui/CheckBox";
import Modal from "../../components/ui/Modal";
import AddOrEditModal from "./components/AddOrEditModal";
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

  const [showModal, setShowModal] = useState(false);
  const [showMoreInputs, setshowMoreInputs] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formError, setFormError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [select, setSelect] = useState("");

  const EMPTY_FORM = {
    propertyId: "",
    utilityId: "",
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

export default UnitCharge;
