import React, { useState, useEffect } from 'react';
import DoughnutChart from '../../components/ui/DoughnutChart';
import { getColumns } from '../../columns/BalanceHomeColumn';
import { getData } from '../../helpers/getData';
import Table from '../../components/ui/Table';
import Select from '../../components/ui/Select';
import LineChart from '../../components/ui/LineChart';
import HomeIcon1 from "../../assets/HomeIcon1.svg";
import HomeIcon2 from "../../assets/HomeIcon2.svg";
import HomeIcon3 from "../../assets/HomeIcon3.svg";
import HomeIcon4 from "../../assets/HomeIcon4.svg";
import BarChart from '../../components/ui/BarChart';
import "../../css/center.css";


const CenterPage = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
      
  const totalData = {
    labels: ['Houses', 'Tenants', 'Vacants', 'Landlords'],
    datasets: [
      {
        label: 'Properties Summary',
        data: [200, 190, 10, 20],
        backgroundColor: ['#77DD77', '#77BBDD', '#FFDD88', '#FF8899'],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const totalOptions = {
    cutout: '70%',
    plugins: {
        legend: {
        display: false,
        },
        tooltip: {
        enabled: true,
        },
    },
  };

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
        {
            label: 'Monthly Report',
            data: [200, 192, 650, 430,200, 192, 650, 430,200, 192, 650, 430,],
            backgroundColor: ['#77DD77'],
            borderWidth: 1,
        },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            legend: {
            display: true,
            },
            tooltip: {
            enabled: true,
            },
        },
    };




    // useEffect(() => {
    //   getData({
    //       endpoint: 'Transaction/UnpaidTenants',
    //       setData: setBalances,
    //       setLoading,
    //       setError
    //   });
  
    // }, []);



  const handleSelect = (e) => {
  const { name, value } = e.target;
    setSelect(value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



   const unpaidTenantColumn = getColumns();


  return (
    <div className='homeCont'>
      <div className="firstRow">
        <div className="cont totalDetail">
          <div className="left">
            <div className="chartContainer">
              <DoughnutChart data={totalData} options={totalOptions} id="chart" />
            </div>
            <div className="text">
              <h3>Total Properties</h3>
              <p className='total'>20</p>
            </div>
          </div>
          <div className="right">
            <p>200 <span>Houses</span></p>
            <p>190 <span>Tenants</span></p>
            <p>10 <span>Vacants</span></p>
            <p>20 <span>Landlords</span></p>
          </div>
        </div>
        <div className="cont">
          <div className="img">
            <img src={HomeIcon1} alt="" srcset="" />
          </div>
          <div className="content">
            <h3>27 / 30</h3>
            <p>Payment This Month</p>
          </div>
        </div>
        <div className="cont">
          <div className="img">
            <img src={HomeIcon2} alt="" srcset="" />
          </div>
          <div className="content">
            <h3>Sh. 120, 000</h3>
            <p>Income This Month</p>
          </div>
        </div>
        <div className="cont">
          <div className="img">
            <img src={HomeIcon3} alt="" srcset="" />
          </div>
          <div className="content">
            <h3>Sh. 6, 200</h3>
            <p>Total UnPaid</p>
          </div>
        </div>
        <div className="cont">
          <div className="img">
            <img src={HomeIcon4} alt="" srcset="" />
          </div>
          <div className="content">
            <h3>Sh. 4,500,000</h3>
            <p>Total Income</p>
          </div>
        </div>
      </div>

      <div className="secondRow">
        <div className="left">
          <div className="cont">
            <div className="header">
              <h1 className="headerText">
                UnPaid Tenants
              </h1>
              <div className="filter">
                <Select
                name="unitId"
                value={''}
                onChange={handleSelect}
                text={"Filter By Month"}
                >Month</Select>
              </div>

            </div>
            <div className="TableContainer">
              <Table data={balances} columns={unpaidTenantColumn} loading={loading}  error={error}/>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="cont">
            <div className="header">
              <h1 className="headerText">Monthly Rent Collection</h1>
              <div className="filter">
                <Select
                name="unitId"
                value={''}
                onChange={handleSelect}
                text={"Filter By Year"}
                >Month</Select>
              </div>
            </div>
            <div className="chartContainer">
              <BarChart data={data} options={options} id="chart" />
            </div>
          </div>
        </div>

      </div>

      <div className="thirdRow">
        <div className="cont">Third container</div>
      </div>
    </div>
  )
}

export default CenterPage