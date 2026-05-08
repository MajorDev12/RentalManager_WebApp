import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../components/ui/BreadCrumb";
import CustomTabs from "../../components/ui/Tab";
import Table from "../../components/ui/Table";
import { getData } from "../../helpers/getData";
import { formatDate } from "../../helpers/formatDate";
import { getColumns } from "./TenantInvoiceColumns";
import { getBalancesColumns } from "./TenantBalanceColumns";
import { tenantService } from "./tenantService";
import { transactionService } from "../transactions/transactionService";
import { useApiRequest } from '../../hooks/useApiRequest';
import defaultProfilePic from "../../assets/TenantDefaultProfile.png";
import "../../css/viewTenant.css";

const ViewTenant = () => {
  const { id } = useParams();
  const { execute, apiLoading } = useApiRequest(); 

  const [tenant, setTenant] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [tenantError, setTenantError] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(false);

  const [balances, setBalances] = useState([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balancesError, setBalancesError] = useState(false);

  const [error, setError] = useState("");

  const [activeRow, setActiveRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTenant, setActiveTenant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const columns = getColumns({
    activeRow,
    setActiveRow,
    setSelectedId,
    setIsEditMode,
    setActiveTenant,
    setShowModal,
    tenant,
  });

  
  const balancecolumns = getBalancesColumns();


  useEffect(() => {
    fetchTenant();
    fetchTransactions();
    fetchBalances();
  }, [id]);



  const fetchTenant = async () => {
    await getData({
      execute,
      request: () => tenantService.getById(id),
      setData: setTenant,
      setLoading: setTenantLoading,
      setError: setTenantError,
    });
  };

  const fetchTransactions = async () => {
    await getData({
      execute,
      request: () => transactionService.getByTenantId(id),
      setData: setTransactions,
      setLoading: setTransactionsLoading,
      setError: setTransactionsError,
    });
  };

  const fetchBalances = async () => {
    await getData({
      execute,
      request: () => transactionService.getTenantBalances(id),
      setData: setBalances,
      setLoading: setBalancesLoading,
      setError: setBalancesError,
    });
  };


  const invoices = useMemo(() => { 
    if(!transactions) return;


    return transactions
      .filter((t) => t.transactionType === "Charge")
      .map((t) => ({
        ...t,
        transactionDate: formatDate(t.transactionDate),
      }));
  }, [transactions]);

  const payments = useMemo(() => { 
    if(!transactions) return;

    return transactions
      .filter((t) => t.transactionType === "Payment")
      .map((t) => ({
        ...t,
        transactionDate: formatDate(t.transactionDate),
      }));
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
      { 
        label: "Balances",
        content: (
          <Table
            data={balances}
            columns={balancecolumns}
            loading={balancesLoading}
            error={balancesError}
          />
        ),
      },
      { label: "Messages", content: <div>Document uploads here</div> },
    ],
    [invoices, payments, balances, transactionsLoading, transactionsError, columns]
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

            <h3 className="tenant-name">
              {
                tenantLoading
                  ? "Loading.."
                  : tenantError
                    ? "Something went wrong"
                    : tenant?.fullName ?? "No Name"
              }
            </h3>
            <p className="tenant-property">
              {
                tenantLoading
                  ? "Loading.."
                  : tenantError
                    ? "Something went wrong"
                    : tenant?.user?.propertyName
                      ? tenant.user.propertyName
                      : "No Property Name Available"
              }
            </p>
            <p className="tenant-house">
              {
                tenantLoading
                  ? "Loading.."
                  : tenantError
                    ? "Something went wrong"
                    : tenant?.unit
                      ? tenant.unit
                      : "No Unit Name Available"
              }
              </p>
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
