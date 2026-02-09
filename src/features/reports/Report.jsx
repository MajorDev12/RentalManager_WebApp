import React, { useState, useEffect } from "react";
import CustomTabs from "../../components/ui/CustomTab";
import Spinner from '../../components/ui/Spinner';
import LineChart from "../../assets/lineChart.svg";
import ExpenseLineChart from "../../assets/ExpenseLineChart.svg";
import ProfitLineChart from "../../assets/ProfitLineChart.svg";
import BreadCrumb from "../../components/ui/BreadCrumb";
import Select from "../../components/ui/Select";
import { getDate } from "../../helpers/getDate";
import { getData } from '../../helpers/getData';
import { years } from "../../includes/years";
import { months } from "../../includes/months";
import BarChart from "../../components/ui/BarChart";
import { propertyService } from "../properties/propertyService";
import { tenantService } from "../tenants/tenantService";
import { unitService } from "../units/unitService";
import { reportService } from "./reportService";
import { useApiRequest } from "../../hooks/useApiRequest";
import "../../css/report.css";

const Report = () => {
  const { execute, apiLoading } = useApiRequest();

  const [activeKey, setActiveKey] = useState("properties");
  const [entityOptions, setEntityOptions] = useState([]);
  const [propertyLoader, setPropertyLoader] = useState([]);
  const [incomeEntityData, setIncomeEntityData] = useState([]);
  const [reportSummaryData, setReportSummaryData] = useState();
  const [reportSummaryLoader, setReportSummaryLoader] = useState(true);
  const [incomeLoader, setIncomeLoader] = useState(false);
  const [reportSummaryError, setReportSummaryError] = useState(false);
  const [error, setError] = useState(null);

  const [totalSummaryFilter, setTotalSummaryFilter] = useState({
    year: getDate("year"),
    month: getDate("month"),
  });

  const [incomeFilter, setIncomeFilter] = useState({
    year: getDate("year"),
    month: 0,
    entityId: "",
  });


  /* -------------------- FETCH ENTITY OPTIONS -------------------- */
  useEffect(() => {

    if (activeKey === "properties")
       fetchProperties();
    if (activeKey === "tenant")
       fetchTenants();
    if (activeKey === "unit")
       fetchUnits();

  }, [activeKey]);


  useEffect(() => {
    fetchReportSummary();
  }, [])

  useEffect(() => {
    const filters = {
      Year: totalSummaryFilter.year || 0,
      Month: totalSummaryFilter.month || 0,
    };

    fetchReportSummaryWithFilters(filters);
  }, [totalSummaryFilter.year, totalSummaryFilter.month]);

  
  const fetchReportSummaryWithFilters = async (filters) => {
    await getData({
      execute,
      request: () => reportService.getSummary(filters),
      setData: setReportSummaryData,
      setLoading: setReportSummaryLoader,
      setError: setReportSummaryError,
    });
  };

  const fetchIncomeReportSummaryWithFilters = async (filters) => {
    await getData({
      execute,
      request: () => reportService.getSummary(filters),
      setData: setIncomeEntityData,
      setLoading: setIncomeLoader,
      setError,
    });
  };


  const fetchReportSummary = async () => {
    await getData({
      execute,
      request: () => reportService.getSummary(),
      setData: setReportSummaryData,
      setLoading: setReportSummaryLoader,
      setError: setReportSummaryError
    });
  };






  const fetchProperties = async () => {
    await getData({
    execute,
    request: () => propertyService.getAll(),
    setData: setEntityOptions,
    setLoading: setPropertyLoader,
    setError: setError
    });
  };

  const fetchTenants = async () => {
    await getData({
    execute,
    request: () => tenantService.getAll(),
    setData: setEntityOptions,
    setLoading: setPropertyLoader,
    setError: setError
    });
  };

  const fetchUnits = async () => {
    await getData({
    execute,
    request: () => unitService.getAll(),
    setData: setEntityOptions,
    setLoading: setPropertyLoader,
    setError: setError
    });
  };












  /* -------------------- FETCH INCOME REPORT -------------------- */
  useEffect(() => {
    if (!incomeFilter.entityId) return;

    const filters = {
      PropertyId: 0,
      UnitId: 0,
      UserId: 0,
      Month: 0,
      Year: incomeFilter.year,
    };

    if (activeKey === "properties") {
        filters.PropertyId = incomeFilter.entityId;
        filters.Year = incomeFilter.year;
        fetchIncomeReportSummaryWithFilters(filters);
        return
    }

    if (activeKey === "tenant") {
        filters.UserId = incomeFilter.entityId;
        filters.Year = incomeFilter.year;
        fetchIncomeReportSummaryWithFilters(filters);
        return
    }

    if (activeKey === "unit") {
      filters.UnitId = incomeFilter.entityId;
      filters.Year = incomeFilter.year;
      fetchIncomeReportSummaryWithFilters(filters);
      return
    }

  }, [incomeFilter.entityId, incomeFilter.year]);





  /* -------------------- HANDLERS -------------------- */

    const handleReportSummaryFilterChange = (e) => {
      const { name, value } = e.target;

      setTotalSummaryFilter((prev) => ({
        ...prev,
        [name === "totalSummaryYear" ? "year" : "month"]: value,
      }));
    };



  const handleSelect = (e) => {
    const { name, value } = e.target;

    setIncomeFilter((prev) => ({
      ...prev,
      [name === "selectedEntity" ? "entityId" : name.replace("incomeReport", "").toLowerCase()]: value,
    }));
  };

  const renderAmount = (value) => {
    if (reportSummaryLoader) return "Loading...";
    if (reportSummaryError) return "Error";
    return value?.toLocaleString() ?? 0;
  };


  /* -------------------- CHART DATA -------------------- */

  const incomeChartData = React.useMemo(() => {
    if (!incomeEntityData?.monthly) return Array(12).fill(0);

    const map = {};
    incomeEntityData.monthly.forEach(m => {
      map[m.month] = m.totalIncome;
    });

    return Array.from({ length: 12 }, (_, i) => map[i + 1] ?? 0);
  }, [incomeEntityData]);

  const data = {
    labels: months.map((m) => m.name.slice(0,3)),
    datasets: [
      {
        label: "Income",
        data: incomeChartData,
        backgroundColor: ["#77DD77"],
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
  };

  /* -------------------- RENDER -------------------- */
  return (
    <>
      <BreadCrumb greetings="" />

      <section
        id="Section"
        className="reportSection"
        style={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        {/* SUMMARY */}
        <div className="summaryHeader">
          <h3>Report Summary</h3>

          <div className="filter">
            <p>Filter By:</p>

            <Select
              name="totalSummaryYear"
              value={totalSummaryFilter.year}
              onChange={handleReportSummaryFilterChange}
              options={years.map((y) => ({
                value: y.value,
                label: y.name,
              }))}
              text="--All--"
            />


            <Select
              name="totalSummaryMonth"
              value={totalSummaryFilter.month}
              onChange={handleReportSummaryFilterChange}
              options={months.map((m) => ({
                value: m.value,
                label: m.name,
              }))}
              text="--All--"
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="reportCards">
          {/* Total Income */}
          <div className="reportCard">
            <div className="details">
              <div className="cardHeader">
                <div className="cardTitle">
                  <span className="cardSpan">Statistics</span>
                  <p className="title">Total Income</p>
                </div>
                <img src={LineChart} alt="Income" />
              </div>
              <h3 className="amount">
                <span>Sh.</span> {renderAmount(reportSummaryData?.summary?.totalIncome)}
              </h3>
            </div>
          </div>

          {/* Total Expense */}
          <div className="reportCard">
            <div className="details">
              <div className="cardHeader">
                <div className="cardTitle">
                  <span className="cardSpan">Statistics</span>
                  <p className="title">Total Expense</p>
                </div>
                <img src={ExpenseLineChart} alt="Expense" />
              </div>
              <h3 className="amount">
                <span>Sh.</span> {renderAmount(reportSummaryData?.summary?.totalExpense)}
              </h3>

            </div>
          </div>

          {/* Net Profit */}
          <div className="reportCard">
            <div className="details">
              <div className="cardHeader">
                <div className="cardTitle">
                  <span className="cardSpan">Statistics</span>
                  <p className="title">Net Profit</p>
                </div>
                <img src={ProfitLineChart} alt="Profit" />
              </div>
              <h3 className="amount">
                <span>Sh.</span> {renderAmount(reportSummaryData?.summary?.netProfit)}
              </h3>

            </div>
          </div>
        </div>

        {/* INCOME REPORT */}
        <div className="incomeReport">
          <h3 className="title">Income Report</h3>

          <div className="incomeChartContainer">
            <div className="header">
              <div className="filterSelects">
                <p>Filter By:</p>

                <Select
                  name="selectedEntity"
                  value={incomeFilter.entityId}
                  onChange={handleSelect}
                  options={
                    entityOptions && entityOptions.length > 0
                      ? entityOptions.map((e) => ({
                          value: e.id,
                          label: e.name || e.fullName,
                        }))
                      : [{ value: "", label: "No Data", disabled: true }]
                  }
                  text={`--Select ${activeKey}--`}
                />

                <Select
                  name="incomeReportYear"
                  value={incomeFilter.year}
                  onChange={handleSelect}
                  options={years.map((y) => ({
                    value: y.value,
                    label: y.name,
                  }))}
                  text="--All--"
                />
              </div>

              <div className="filterButtons">
                <CustomTabs
                  activeKey={activeKey}
                  onSelect={(k) => setActiveKey(k)}
                />
              </div>
            </div>

            <div className="chart">
              {incomeLoader ? (
                <Spinner />
              ) : (
                <BarChart data={data} options={options} />
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Report;
