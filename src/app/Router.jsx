// src/app/Router.jsx

import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import ProtectedRoute from "../auth/ProtectedRoute";
import PermissionRoute from "../auth/PermissionRoute";

import { PERMISSIONS } from "../auth/permissions";

// pages
import Register from "../features/auth/Register";
import Login from "../features/auth/Login";

import MainPage from "../features/home/MainPage";

import Property from "../features/properties/property";
import ViewProperty from "../features/properties/ViewProperty";

import Unit from "../features/units/Unit";
import ViewUnit from "../features/units/ViewUnit";
import Vacants from "../features/units/Vacants";

import UtilityReading from "../features/utilities/UtilityReading";

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
import UnAuthorized from "../sections/403";

export default function Router() {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* =========================
          PROTECTED APP
      ========================== */}

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* DASHBOARD */}
        <Route path="/" element={<MainPage />} />

        {/* =========================
            PROPERTIES
        ========================== */}

        <Route
          path="/properties"
          element={
            <PermissionRoute permissions={[PERMISSIONS.PROPERTY_READ]}>
              <Property />
            </PermissionRoute>
          }
        />

        <Route
          path="/properties/:id"
          element={
            <PermissionRoute permissions={[PERMISSIONS.PROPERTY_READ]}>
              <ViewProperty />
            </PermissionRoute>
          }
        />

        {/* =========================
            UTILITY BILLS
        ========================== */}

        <Route
          path="/UtilityBill"
          element={
            <PermissionRoute permissions={["UtilityBill.Read"]}>
              <UnitCharge />
            </PermissionRoute>
          }
        />

        {/* =========================
            UNIT TYPES
        ========================== */}

        <Route
          path="/UtilityReading"
          element={
            <PermissionRoute permissions={["UnitType.Read"]}>
              <UtilityReading />
            </PermissionRoute>
          }
        />

        {/* =========================
            UNITS
        ========================== */}

        <Route
          path="/Units"
          element={
            <PermissionRoute permissions={["Unit.Read"]}>
              <Unit />
            </PermissionRoute>
          }
        />
        <Route
          path="/Units/:id"
          element={
            <PermissionRoute permissions={[PERMISSIONS.UNIT_READ]}>
              <ViewUnit />
            </PermissionRoute>
          }
        />

        <Route
          path="/Vacants"
          element={
            <PermissionRoute permissions={["Unit.Read"]}>
              <Vacants />
            </PermissionRoute>
          }
        />

        {/* =========================
            TENANTS
        ========================== */}

        <Route
          path="/tenants"
          element={
            <PermissionRoute
              permissions={["Tenant.Read.All", "Tenant.Read.Self"]}
            >
              <Tenant />
            </PermissionRoute>
          }
        />

        <Route
          path="/tenants/:id"
          element={
            <PermissionRoute
              permissions={["Tenant.Read.All", "Tenant.Read.Self"]}
            >
              <ViewTenant />
            </PermissionRoute>
          }
        />

        <Route
          path="/AssignUnit"
          element={
            <PermissionRoute permissions={["Tenant.Assign"]}>
              <AssignUnit />
            </PermissionRoute>
          }
        />

        {/* =========================
            TRANSACTIONS
        ========================== */}

        <Route
          path="/transactions"
          element={
            <PermissionRoute
              permissions={["Transaction.Read.All", "Transaction.Read.Self"]}
            >
              <Transaction />
            </PermissionRoute>
          }
        />

        <Route
          path="/unpaidTenants"
          element={
            <PermissionRoute permissions={["Transaction.Read.All"]}>
              <UnpaidTenant />
            </PermissionRoute>
          }
        />

        {/* =========================
            EXPENSES
        ========================== */}

        <Route
          path="/expenses"
          element={
            <PermissionRoute permissions={["Expense.Read"]}>
              <Expense />
            </PermissionRoute>
          }
        />

        {/* =========================
            REPORTS
        ========================== */}

        <Route
          path="/reports"
          element={
            <PermissionRoute permissions={["Report.Read"]}>
              <Report />
            </PermissionRoute>
          }
        />

        {/* =========================
            NOTIFICATIONS
        ========================== */}

        <Route
          path="/Notifications"
          element={
            <PermissionRoute permissions={["Notification.Read"]}>
              <System />
            </PermissionRoute>
          }
        />

        {/* =========================
            PROFILE
        ========================== */}

        <Route
          path="/Profile"
          element={
            <PermissionRoute
              permissions={["Tenant.Read.Self", "Property.Update"]}
            >
              <Profile />
            </PermissionRoute>
          }
        />

        {/* =========================
            SETTINGS
        ========================== */}

        <Route
          path="/Settings"
          element={
            <PermissionRoute permissions={["Property.Update"]}>
              <Settings />
            </PermissionRoute>
          }
        />
      </Route>

      {/* =========================
          ERROR ROUTES
      ========================== */}

      <Route path="/402" element={<NotSubscribed />} />
      <Route path="/403" element={<UnAuthorized />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
