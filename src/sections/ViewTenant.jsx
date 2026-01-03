import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../components/ui/BreadCrumb";
import CustomTabs from "../components/ui/Tab";
import Table from "../components/ui/Table";
import { getData } from "../helpers/getData";
import { getColumns } from "../columns/TenantInvoiceColumns";
import defaultProfilePic from "../assets/TenantDefaultProfile.png";
import "../css/viewTenant.css";

const ViewTenant = () => {
  const { id } = useParams();

  const [tenant, setTenant] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(false);
  const [error, setError] = useState("");

  const [activeRow, setActiveRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTenant, setActiveTenant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const columns = getColumns({
    endpoint: "Transaction",
    activeRow,
    setActiveRow,
    setSelectedId,
    setIsEditMode,
    setActiveTenant,
    setShowModal,
    tenant,
  });


  useEffect(() => {
    setLoading(true);
    getData({
      endpoint: `Tenants/${id}`,
      setData: setTenant,
      setLoading,
      setError,
    });
  }, [id]);


  useEffect(() => {
    if (!tenant?.user?.id) return;

    setLoading(true);
    getData({
      endpoint: `Transaction/By-Tenant/${tenant.user.id}`,
      setData: setTransactions,
      setLoading: setTransactionsLoading,
      setError: setTransactionsError,
    });
  }, [tenant]);



  const invoices = useMemo(() => {
    return transactions.filter((t) => t.transactionType === "Charge");
  }, [transactions]);

  const payments = useMemo(() => {
    return transactions.filter((t) => t.transactionType === "Payment");
  }, [transactions]);



  const tabData = useMemo(
    () => [
      {
        label: "Invoices",
        content: (
          <Table
            data={invoices}
            columns={columns}
            loading={transactionsLoading}
            error={transactionsError}
          />
        ),
      },
      {
        label: "Payments",
        content: (
          <Table
            data={payments}
            columns={columns}
            loading={transactionsLoading}
            error={transactionsError}
          />
        ),
      },
      { label: "Balances", content: <div>Document uploads here</div> },
      { label: "Messages", content: <div>Document uploads here</div> },
    ],
    [invoices, payments, transactionsLoading, transactionsError, columns]
  );





  return (
    <>
      <BreadCrumb greetings="" />
      <div id="tenantContainer">
        <div className="tenant-container">
          {/* LEFT SIDE */}
          <div className="tenant-left">
            <div className="tenant-avatar">
              <img src={defaultProfilePic} alt="Tenant" />
            </div>

            <h3 className="tenant-name">{tenant?.fullName ?? "Loading..."}</h3>
            <p className="tenant-property">
              {tenant?.user?.propertyName ?? "--"}
            </p>
            <p className="tenant-house">{tenant?.unit ?? "--"}</p>
          </div>

          {/* RIGHT SIDE */}
          <div className="tenant-right">
            <div className="tenant-stats">
              <div className="stat-block">
                <h4>Total Unpaid</h4>
                <div className="amountDiv">
                  <span>Ksh.</span>
                  <p className="amount unpaid">8,500</p>
                </div>
              </div>

              <div className="stat-block">
                <h4>Total Paid</h4>
                <div className="amountDiv">
                  <span>Ksh.</span>
                  <p className="amount paid">8,500</p>
                </div>
              </div>
            </div>

            <div className="tenant-stats">
              <div className="stat-block">
                <h4>Total Deposit</h4>
                <div className="amountDiv">
                  <span>Ksh.</span>
                  <p className="amount deposit">8,500</p>
                </div>
              </div>

              <div className="stat-block">
                <h4>Total Balance</h4>
                <div className="amountDiv">
                  <span>Ksh.</span>
                  <p className="amount balance">0.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustomTabs tabs={tabData} />

      </div>
    </>
  );
};

export default ViewTenant;
