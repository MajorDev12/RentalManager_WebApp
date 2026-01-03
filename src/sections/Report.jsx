import React, { useState, useEffect } from 'react';
import CustomTabs from '../components/ui/CustomTab';
import LineChart from "../assets/lineChart.svg";
import ExpenseLineChart from "../assets/ExpenseLineChart.svg";
import ProfitLineChart from "../assets/ProfitLineChart.svg";
import BreadCrumb from '../components/ui/BreadCrumb';
import Select from '../components/ui/Select';
import { getData } from '../helpers/getData';
import { getDate } from '../helpers/getDate';
import { years } from '../includes/years';
import BarChart from '../components/ui/BarChart';
import '../css/report.css';




const Report = () => {
    const [entityOptions, setEntityOptions] = useState([]);
    const [incomeEntityData, setIncomeEntityData] = useState([]);
    const [reportSummaryData, setReportSummaryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeKey, setActiveKey] = useState("properties");
    const [totalSummaryFilter, setTotalSummaryFilter] = useState({totalSummaryYear: ''});
    const [incomeFilter, setIncomeFilter] = useState({
      incomeReportYear: getDate("year"),
      incomeReportMonth: 0,
      selectedEntity: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let endpoint = "";
               switch (activeKey) {
                    case "properties":
                    endpoint = "Properties";
                    break;

                    case "tenant":
                    endpoint = "Tenant";
                    break;

                    case "unit":
                    endpoint = "Unit";
                    break;

                    default:
                    endpoint = "";
                }
                if (endpoint) {
                    await getData({
                    endpoint: endpoint,
                    setData: setEntityOptions,
                    setLoading,
                    setError
                    });
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeKey]);



    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
        {
            label: 'Properties Distribution',
            data: incomeEntityData,
            backgroundColor: ['#77DD77'],
            borderWidth: 1,
        },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            legend: {
            display: false,
            },
            tooltip: {
            enabled: false,
            },
        },
    };


    const handleSelect = (e) => {
        const { name, value } = e.target;

        const totalSummaryFilter = ["totalSummaryYear"];
        const incomeFilter = ["incomeReportYear", "incomeReportMonth", "selectedEntity"];

        if(incomeFilter.includes(name)){
            setIncomeFilter(prev => ({
                ...prev,
                [name]: value
            }));

            if(name === "selectedEntity"){
                let fetchEndpoint = "";
                const yearParam = incomeReportYear.value ? `&year=${incomeReportYear.value}` : '';
                if(activeKey.toLowerCase() === "properties"){
                    fetchEndpoint = `Report/IncomeSummary?reportType=Income&propertyId=${value}${yearParam}`;
                }else if(activeKey.toLowerCase() === "tenant"){
                    fetchEndpoint = `ReportIncomeSummary/ByTenant/${value}`;
                }else if(activeKey.toLowerCase() === "unit"){
                    fetchEndpoint = `ReportIncomeSummary/ByUnit/${value}`;
                }

                if(fetchEndpoint){
                    getData({
                        endpoint: fetchEndpoint,
                        setData: setIncomeEntityData,
                        setLoading,
                        setError
                    });
                }
            }

            if(name === "incomeReportYear"){

            }

        }else if(totalSummaryFilter.includes(name)){
            setTotalSummaryFilter(prev => ({
                ...prev,
                [name]: value
            }));
            if(name === "totalSummaryYear"){
                getData({
                    endpoint: `Property/${value}`,
                    setData: setReportSummaryData,
                    setLoading,
                    setError
                });
            }
        };
    }







  return (
    <>
      <BreadCrumb  greetings="" />
      <section id="Section" className="reportSection" style={{backgroundColor: 'transparent', boxShadow: 'none'}}>
        <div className="header">
          <h3>Report Summary</h3>
          <div className="filter">
            <p>Filter By:</p>
            <Select
                className="yearSelect"
                name="totalSummaryYear"
                value={totalSummaryFilter.totalSummaryYear || 0}
                onChange={handleSelect}
                options={
                    years && years.length > 0
                    ? years.map(y => ({ value: y.value, label: y.name }))
                    : [{ value: '', label: 'No Available Years', disabled: true }]
                }
            />
            
          </div>
        </div>

        <div className="reportCards">
            <div className="reportCard">
                <div className="details">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <span className="cardSpan">Statistics</span>
                            <p className="title">Total Income</p>
                        </div>
                        <div className="icon">
                            <img className='lineChart' src={LineChart} alt="Income Chart" />
                        </div>
                    </div>
                    <div className="cardAmount">
                        <h3 className="amount"><span>Sh.</span> 350, 000</h3>
                        <div className="cardGrowth">
                            <span className="growthValue">+0%</span>
                            <div className="growthIcon"></div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="reportCard">
                <div className="details">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <span className="cardSpan">Statistics</span>
                            <p className="title">Total Expense</p>
                        </div>
                        <div className="icon">
                            <img className='lineChart' src={ExpenseLineChart} alt="Expense Chart" />
                        </div>
                    </div>
                    <div className="cardAmount">
                        <h3 className="amount"><span>Sh.</span> 43, 000</h3>
                        <div className="cardGrowth">
                            <span className="growthValue">+0%</span>
                            <div className="growthIcon"></div>
                        </div>
                    </div>
                </div>
            </div>


  
            <div className="reportCard">
                <div className="details">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <span className="cardSpan">Statistics</span>
                            <p className="title">Net Profit</p>
                        </div>
                        <div className="icon">
                            <img className='lineChart' src={ProfitLineChart} alt="Profit Chart" />
                        </div>
                    </div>
                    <div className="cardAmount">
                        <h3 className="amount"><span>Sh.</span> 307, 000</h3>
                        <div className="cardGrowth">
                            <span className="growthValue">+0%</span>
                            <div className="growthIcon"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="incomeReport">
            <h3 className="title">Income Report</h3>

            <div className="incomeChartContainer">
                <div className="header">
                    <div className="filterSelects">
                        <p>Filter By:</p>
                        <div className="selects">
                            <Select
                                name="selectedEntity"
                                value={incomeFilter.selectedEntity || ""}
                                onChange={handleSelect}
                                disabled={loading}
                                options={
                                    entityOptions && entityOptions.length > 0
                                    ? entityOptions.map(e => ({
                                        value: e.id,
                                        label: e.name || e.fullName
                                        }))
                                    : [{ value: "", label: `No Available ${activeKey}`, disabled: true }]
                                }
                                text={loading ? "Loading..." : `--Select ${activeKey}--`}
                            />

                            <Select
                                name="incomeReportYear"
                                value={incomeFilter.incomeReportYear || 0}
                                onChange={handleSelect}
                                options={
                                    years && years.length > 0
                                    ? years.map(y => ({ value: y.value, label: y.name }))
                                    : [{ value: '', label: 'No Available Years', disabled: true }]
                                }
                                text="--Year--"
                            />
                        </div>
                    </div>
                    <div className="filterButtons">
                        <CustomTabs
                            activeKey={activeKey}
                            onSelect={(k) => setActiveKey(k)}
                        />
                    </div>
                </div>

                <div className="chart">
                    <BarChart data={data} options={options} id="chart" />
                </div>
            </div>
        </div>

      </section>
    </>
  )
}

export default Report;