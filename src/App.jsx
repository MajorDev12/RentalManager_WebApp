import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/toast.css'; 
import './App.css'
import './index.css'
import SideNav from '../src/sections/Sidebar'
import TopNav from '../src/sections/TopNav'
import MainPage from '../src/sections/MainPage'
import Property from '../src/sections/property'
import ViewProperty from '../src/sections/ViewProperty'
import Unit from '../src/sections/Unit'
import UnitCharge from "./sections/UnitCharge";
import NotFound from './sections/NotFound';

function App() {
  const [width, setWidth] = useState(260);

  return (
   <Router>
      <div id="app">
        <SideNav width={width} setWidth={setWidth}/>
        <div id="rightSide">
          <TopNav width={width} setWidth={setWidth} />

          
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/Properties" element={<Property />} />
            <Route path="/Properties/:id" element={<ViewProperty />} />
            <Route path="/Units" element={<Unit />} />
            <Route path="/UtilityBill" element={<UnitCharge />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      
      </div>
   </Router>
  )
}

export default App
