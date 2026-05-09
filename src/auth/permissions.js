// src/auth/permissions.js

export const PERMISSIONS = {
  // =========================
  // PROPERTY
  // =========================
  PROPERTY_READ: "Property.Read",
  PROPERTY_CREATE: "Property.Create",
  PROPERTY_UPDATE: "Property.Update",
  PROPERTY_DELETE: "Property.Delete",
  PROPERTY_ASSIGN: "Property.Assign",

  // =========================
  // UTILITY BILL
  // =========================
  UTILITY_BILL_READ: "UtilityBill.Read",
  UTILITY_BILL_CREATE: "UtilityBill.Create",
  UTILITY_BILL_UPDATE: "UtilityBill.Update",
  UTILITY_BILL_DELETE: "UtilityBill.Delete",

  // =========================
  // UNIT TYPES
  // =========================
  UNIT_TYPE_READ: "UnitType.Read",
  UNIT_TYPE_CREATE: "UnitType.Create",
  UNIT_TYPE_UPDATE: "UnitType.Update",
  UNIT_TYPE_DELETE: "UnitType.Delete",

  // =========================
  // UNITS
  // =========================
  UNIT_READ: "Unit.Read",
  UNIT_CREATE: "Unit.Create",
  UNIT_UPDATE: "Unit.Update",
  UNIT_DELETE: "Unit.Delete",

  // =========================
  // TENANTS
  // =========================
  TENANT_READ_ALL: "Tenant.Read.All",
  TENANT_READ_SELF: "Tenant.Read.Self",
  TENANT_CREATE: "Tenant.Create",
  TENANT_UPDATE: "Tenant.Update",
  TENANT_ASSIGN: "Tenant.Assign",
  TENANT_DELETE: "Tenant.Delete",

  // =========================
  // TRANSACTIONS
  // =========================
  TRANSACTION_READ_ALL: "Transaction.Read.All",
  TRANSACTION_READ_SELF: "Transaction.Read.Self",
  TRANSACTION_CREATE: "Transaction.Create",
  TRANSACTION_UPDATE: "Transaction.Update",
  TRANSACTION_DELETE: "Transaction.Delete",

  // =========================
  // EXPENSES
  // =========================
  EXPENSE_READ: "Expense.Read",
  EXPENSE_CREATE: "Expense.Create",
  EXPENSE_UPDATE: "Expense.Update",
  EXPENSE_DELETE: "Expense.Delete",

  // =========================
  // REPORTS
  // =========================
  REPORT_READ: "Report.Read",
  REPORT_CREATE: "Report.Create",
  REPORT_UPDATE: "Report.Update",
  REPORT_DELETE: "Report.Delete",

  // =========================
  // NOTIFICATIONS
  // =========================
  NOTIFICATION_READ: "Notification.Read",

  // =========================
  // PROFILE / SETTINGS
  // =========================
  PROFILE_READ: "Profile.Read",
  PROFILE_UPDATE: "Profile.Update",

  SETTINGS_READ: "Settings.Read",
  SETTINGS_UPDATE: "Settings.Update",

  // =========================
  // SYSTEM
  // =========================
  SYSTEM_LOGS_READ: "SystemLogs.Read",

  // =========================
  // SUPER ADMIN (future)
  // =========================
  USER_MANAGEMENT: "UserManagement",
  ROLE_MANAGEMENT: "RoleManagement",
  PERMISSION_MANAGEMENT: "PermissionManagement",
};
