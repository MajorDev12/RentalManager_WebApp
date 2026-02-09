// src/app/Router.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../auth/ProtectedRoute";
import PageWrapper from "../components/layout/PageWrapper";

// pages
import Register from "../features/auth/Register";
import Login from "../features/auth/Login";
import MainPage from "../features/home/MainPage";
import Property from "../features/properties/property";
import ViewProperty from "../features/properties/ViewProperty";
import Unit from "../features/units/Unit";
import UnitType from "../features/unitTypes/UnitType";
import UnitCharge from "../features/utilities/UnitCharge";
import Tenant from "../features/tenants/Tenant";
import ViewTenant from "../features/tenants/ViewTenant";
import AssignUnit from "../features/units/AssignUnit";
import Transaction from "../features/transactions/Transaction";
import UnpaidTenant from "../features/transactions/UnpaidTenant";
import Expense from "../features/expense/Expense";
import Report from "../features/reports/Report";
import System from "../features/notifications/system";
import Profile from "../features/settings/profile";
import Settings from "../features/settings/Settings";
import NotFound from "../sections/NotFound";
import NotSubscribed from "../sections/402";

export default function Router() {
  return (
    
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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


          <Route path="/properties/:id" element={
            <PageWrapper roles={["Owner", "Manager"]}>
              <ViewProperty />
            </PageWrapper>
          } />


          <Route path="/UtilityBill" element={
            <PageWrapper roles={["Owner", "Manager"]}>
              <UnitCharge />
            </PageWrapper>
          } />

          <Route path="/unitTypes" element={
            <PageWrapper roles={["Owner", "Manager"]}>
              <UnitType />
            </PageWrapper>
          
          } />

          <Route path="/Units" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <Unit />
            </PageWrapper>
          
          } />

          <Route path="/tenants" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <Tenant />
            </PageWrapper>
          
          } />

          <Route path="/tenants/:id" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <ViewTenant />
            </PageWrapper>
          
          } />


          <Route path="/assign-unit" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <AssignUnit />
            </PageWrapper>
          
          } />


          <Route path="/transactions" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <Transaction />
            </PageWrapper>
          
          } />

          <Route path="/unpaidTenants" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <UnpaidTenant />
            </PageWrapper>
          
          } />


          <Route path="/expenses" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <Expense />
            </PageWrapper>
          
          } />


          <Route path="/reports" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <Report />
            </PageWrapper>
          
            } />


            <Route path="/Notifications" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord", "Tenant"]}>
              <System />
            </PageWrapper>
          
            } />

          
          <Route path="/Profile" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <Profile />
            </PageWrapper>
          
          } />


          <Route path="/Settings" element={
            <PageWrapper roles={["Owner", "Manager", "Landlord"]}>
              <Settings />
            </PageWrapper>
          } />
          
      </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        <Route path="/402" element={<NotSubscribed />} />

      </Routes>
  );
}
