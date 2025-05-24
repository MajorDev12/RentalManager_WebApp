import React from 'react'
import DoughnutChart from '../components/DoughnutChart';
import "../css/center.css";


const CenterPage = () => {
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


  return (
    <div className='homeCont'>
      <div className="firstRow">
        <div className="cont totalDetail">
          <div className="left">
            <div className="chartContainer" style={{width: "100px", height: "100px"}}>
              <DoughnutChart data={data} options={options} id="chart" />
            </div>
            <div className="text">
              <h3>Total Properties</h3>
              <p>20</p>
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
          <div className="img"></div>
          <div className="content">
            <h3>27 / 30</h3>
            <p>Payment Last Month</p>
          </div>
        </div>
        <div className="cont">
          <div className="img"></div>
          <div className="content">
            <h3>Sh. 120, 000</h3>
            <p>Income Last Month</p>
          </div>
        </div>
        <div className="cont">
          <div className="img"></div>
          <div className="content">
            <h3>Sh. 6, 200</h3>
            <p>Total UnPaid</p>
          </div>
        </div>
        <div className="cont">
          <div className="img"></div>
          <div className="content">
            <h3>Sh. 4,500,000</h3>
            <p>Total Income</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CenterPage