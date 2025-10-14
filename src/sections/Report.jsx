import React, { useState, useEffect } from 'react';
import CustomTabs from '../components/CustomTab';
import LineChart from "../assets/lineChart.svg";
import ExpenseLineChart from "../assets/ExpenseLineChart.svg";
import ProfitLineChart from "../assets/ProfitLineChart.svg";
import BreadCrumb from '../components/BreadCrumb';
import Select from '../components/Select';
import { getData } from '../helpers/getData';
import { years } from '../includes/years';
import BarChart from '../components/BarChart';
import '../css/report.css';




const Report = () => {
    const [entityOptions, setEntityOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeKey, setActiveKey] = useState("property");
    const [filter, setFilter] = useState({
      year: 0,
      month: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
            let endpoint = "";

            switch (activeKey.toLowerCase()) {
                case "property":
                endpoint = "Property";
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
                const data = await getData({
                endpoint,
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
            data: [200, 190, 10, 20, 30, 45, 60, 70, 91, 125, 150, 170],
            backgroundColor: ['#77DD77', '#77DD77', '#77DD77', '#77DD77'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
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




    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };


    const handleSelect = (e) => {
    const { name, value } = e.target;
      setFilter(prev => ({
        ...prev,
        [name]: value
      }));
    };





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
                name="year"
                value={filter.year || 0}
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
                                value={filter.selectedEntity || ""}
                                onChange={handleSelect}
                                disabled={loading}
                                options={
                                    entityOptions && entityOptions.length > 0
                                    ? entityOptions.map(e => ({
                                        value: e.id || e.value,
                                        label: e.name || e.title || e.label
                                        }))
                                    : [{ value: "", label: `No Available ${activeKey}s`, disabled: true }]
                                }
                                text={loading ? "Loading..." : `--Select ${activeKey}--`}
                            />

                            <Select
                                name="year"
                                value={filter.year || 0}
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