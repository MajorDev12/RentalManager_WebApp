// src/config/sidebarConfig.js

import { MdDashboard } from "react-icons/md";

import { BsBuildingFill } from "react-icons/bs";

import { FaHouse, FaUsers, FaMoneyCheckDollar } from "react-icons/fa6";

import { BiSolidReport } from "react-icons/bi";

import { IoIosNotifications, IoMdSettings } from "react-icons/io";

import { PERMISSIONS } from "../auth/permissions";

export const sidebarConfig = [
  // =========================
  // DASHBOARD
  // =========================
  {
    label: "Dashboard",
    route: "/",
    icon: MdDashboard,
  },

  // =========================
  // PROPERTIES
  // =========================
  {
    label: "Properties",
    icon: BsBuildingFill,
    permission: PERMISSIONS.PROPERTY_READ,

    children: [
      {
        label: "All Properties",
        route: "/Properties",
        permission: PERMISSIONS.PROPERTY_READ,
      },

      {
        label: "Utility Bills",
        route: "/UtilityBill",
        permission: "UtilityBill.Read",
      },

      {
        label: "Record Utility",
        route: "/UtilityReading",
        permission: "UnitType.Read",
      },
    ],
  },

  // =========================
  // HOUSES / UNITS
  // =========================
  {
    label: "Houses",
    icon: FaHouse,
    permission: "Unit.Read",

    children: [
      {
        label: "All Houses",
        route: "/Units",
        permission: "Unit.Read",
      },

      {
        label: "Maintenance",
        route: "/Maintenance",
        permission: "Unit.Read",
      },
    ],
  },

  // =========================
  // TENANTS
  // =========================
  {
    label: "Tenants",
    icon: FaUsers,

    permissions: ["Tenant.Read.All", "Tenant.Read.Self"],

    requireAny: true,

    children: [
      {
        label: "All Tenants",
        route: "/Tenants",
        permission: "Tenant.Read.All",
      },

      {
        label: "Bookings",
        route: "/Bookings",
        permission: "Tenant.Assign",
      },

      {
        label: "Leases",
        route: "/Leases",
        permission: "Tenant.Assign",
      },
    ],
  },

  // =========================
  // TRANSACTIONS
  // =========================
  {
    label: "Transactions",
    icon: FaMoneyCheckDollar,

    permissions: ["Transaction.Read.All", "Transaction.Read.Self"],

    requireAny: true,

    children: [
      {
        label: "All Transactions",
        route: "/Transactions",

        permissions: ["Transaction.Read.All", "Transaction.Read.Self"],

        requireAny: true,
      },

      {
        label: "Unpaid Tenants",
        route: "/UnpaidTenants",
        permission: "Transaction.Read.All",
      },

      {
        label: "Expenses",
        route: "/Expenses",
        permission: "Expense.Read",
      },
    ],
  },

  // =========================
  // REPORTS
  // =========================
  {
    label: "Reports",
    route: "/Reports",
    icon: BiSolidReport,
    permission: "Report.Read",
  },

  // =========================
  // NOTIFICATIONS
  // =========================
  {
    label: "Notifications",
    icon: IoIosNotifications,
    permission: "Notification.Read",

    children: [
      {
        label: "System",
        route: "/Notifications",
        permission: "Notification.Read",
      },
    ],
  },

  // =========================
  // SETTINGS
  // =========================
  {
    label: "Management",
    icon: IoMdSettings,

    permissions: ["Property.Update", "Tenant.Read.Self"],

    requireAny: true,

    children: [
      {
        label: "Profile",
        route: "/Profile",

        permissions: ["Property.Update", "Tenant.Read.Self"],

        requireAny: true,
      },

      {
        label: "Settings",
        route: "/Settings",
        permission: "Property.Update",
      },
    ],
  },
];
