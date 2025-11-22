import React, { useState, useEffect } from 'react';
import BreadCrumb from "../components/BreadCrumb";
import CustomTabs from "../components/Tab";
import Table from '../components/Table';
import "../css/viewTenant.css"; // Make sure this path matches your project structure


const ViewTenant = () => {
    const [tenants, setTenants] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState([]);
    const [error, setError] = useState([]);
    const tabData = [
        { 
            label: "Invoices", 
            content: <Table data={tenants} columns={columns} loading={loading}  error={error}/> },
        { label: "Payments", content: <div>Payment content here</div> },
        { label: "Balances", content: <div>Document uploads here</div> },
        { label: "Messages", content: <div>Document uploads here</div> },
    ];


  return (
    <>
      <BreadCrumb greetings="" />
      <div className="tenant-container">
        <div className="tenant-left">
          <div className="tenant-avatar"></div>
          <h3 className="tenant-name">Major Nganga</h3>
          <p className="tenant-property">Sunset Property</p>
          <p className="tenant-house">House 002</p>
        </div>

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
    </>
  );
};

export default ViewTenant;
