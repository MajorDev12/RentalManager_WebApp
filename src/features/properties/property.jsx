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
import AddOrEditModal from "./components/AddOrEditModal";
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

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState("");
  const [formError, setFormError] = useState("");

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
  const tableData = useMemo(() => properties ?? [], [properties]);

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      searchTerm: search,
      pageNumber: 1,
    }));
  }, [search]);

  const fetchUtilityTypes = useCallback(async () => {
    await getData({
      execute,
      request: () => systemCodeItemService.getByCodeName("UTILITYBILL"),
      setData: setUtilityBillTypes,
      setLoading: setUtilityBillLoading,
      setError: setUtilityBillTypeError,
    });
  }, [execute]);

  const refreshTableData = () => {
    refetch();
    setPage(1);
    handleCloseModal();
  };

  const handleAddNew = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

export default Property;
