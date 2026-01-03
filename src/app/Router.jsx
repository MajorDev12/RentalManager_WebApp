// src/app/Router.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../auth/ProtectedRoute";
import PageWrapper from "../components/layout/PageWrapper";

// pages
import Login from "../sections/Login";
import MainPage from "../sections/MainPage";
import Property from "../features/properties/property";
import ViewProperty from "../sections/ViewProperty";
import Unit from "../sections/Unit";
import UnitType from "../sections/UnitType";
import UnitCharge from "../sections/UnitCharge";
import Tenant from "../sections/Tenant";
import ViewTenant from "../sections/ViewTenant";
import AssignUnit from "../sections/AssignUnit";
import Transaction from "../sections/Transaction";
import UnpaidTenant from "../sections/UnpaidTenant";
import Expense from "../sections/Expense";
import Report from "../sections/Report";
import NotFound from "../sections/NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<MainPage />} />

          <Route path="/properties" element={
            <PageWrapper roles={["Owner", "Manager"]}>
              <Property />
            </PageWrapper>
          } />


          <Route path="/properties/:id" element={<ViewProperty />} />
          <Route path="/units" element={<Unit />} />
          <Route path="/unit-type" element={<UnitType />} />
          <Route path="/utility-bill" element={<UnitCharge />} />
          <Route path="/tenants" element={<Tenant />} />
          <Route path="/tenants/:id" element={<ViewTenant />} />
          <Route path="/assign-unit" element={<AssignUnit />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/unpaid-tenants" element={<UnpaidTenant />} />
          <Route path="/expenses" element={<Expense />} />
          <Route path="/reports" element={<Report />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

        {/* <ToastContainer position="top-right" autoClose={4000} /> */}
      </Routes>
    </BrowserRouter>
  );
}
