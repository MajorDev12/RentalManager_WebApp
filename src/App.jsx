import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/toast.css'; 
import './App.css'
import './index.css'
import Login from '../src/sections/Login'
import SideNav from '../src/sections/Sidebar'
import TopNav from '../src/sections/TopNav'
import MainPage from '../src/sections/MainPage'
import Property from '../src/sections/property'
import ViewProperty from '../src/sections/ViewProperty'
import Unit from '../src/sections/Unit'
import UnitType from '../src/sections/UnitType'
import UnitCharge from "./sections/UnitCharge";
import Tenant from "./sections/Tenant";
import AssignUnit from "./sections/AssignUnit";
import Transaction from "./sections/Transaction";
import NotFound from './sections/NotFound';

function Layout() {
  const [width, setWidth] = useState(260);
  const location = useLocation();

  const hideLayout = location.pathname === "/Login";

  return (
    <div id="app">
      {!hideLayout && <SideNav width={width} setWidth={setWidth} />}
      <div id="rightSide">
        {!hideLayout && <TopNav width={width} setWidth={setWidth} />}

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Properties" element={<Property />} />
          <Route path="/Properties/:id" element={<ViewProperty />} />
          <Route path="/Units" element={<Unit />} />
          <Route path="/UnitType" element={<UnitType />} />
          <Route path="/UtilityBill" element={<UnitCharge />} />
          <Route path="/Tenants" element={<Tenant />} />
          <Route path="/AssignUnit" element={<AssignUnit />} />
          <Route path="/Transactions" element={<Transaction />} />
          <Route path="/Login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
