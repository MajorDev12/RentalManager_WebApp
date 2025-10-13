import React, { useState, useEffect } from 'react';
import LineChart from "../assets/lineChart.svg";
import ExpenseLineChart from "../assets/ExpenseLineChart.svg";
import ProfitLineChart from "../assets/ProfitLineChart.svg";
import BreadCrumb from '../components/BreadCrumb';
import PrimaryButton from '../components/PrimaryButton';
import Select from '../components/Select';
import { getData } from '../helpers/getData';
import { months } from '../includes/months';
import { years } from '../includes/years';
import BarChart from '../components/BarChart';
import '../css/report.css';




const Report = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
      year: 0,
      month: 0
    });

    useEffect(() => {
      getData({
          endpoint: 'Expense',
          setData: setExpenses,
          setLoading,
          setError
      });

    }, []);


    const data = {
        labels: ['Tenants', 'Vacants', 'Landlords'],
        datasets: [
        {
            label: 'Properties Distribution',
            data: [200, 190, 10, 20],
            backgroundColor: ['#77DD77', '#77BBDD', '#FFDD88', '#FF8899'],
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
                name="year"
                value={filter.year || 0}
                onChange={handleSelect}
                options={
                    years && years.length > 0
                    ? years.map(y => ({ value: y.value, label: y.name }))
                    : [{ value: '', label: 'No Available Years', disabled: true }]
                }
                placeholder="Select Year"
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
                        <Select
                            name="year"
                            value={filter.year || 0}
                            onChange={handleSelect}
                            options={
                                years && years.length > 0
                                ? years.map(y => ({ value: y.value, label: y.name }))
                                : [{ value: '', label: 'No Available Years', disabled: true }]
                            }
                            placeholder="Select Year"
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
                            placeholder="Select Year"
                        />
                    </div>
                    <div className="filterButtons">
                        <PrimaryButton
                            name="Tenant"
                            onClick={() => setActive(true) }
                        />
                        <PrimaryButton
                            name="Unit"
                            onClick={() => setActive(true) }
                        />
                        <PrimaryButton
                            name="Property"
                            onClick={() => setActive(true) }
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