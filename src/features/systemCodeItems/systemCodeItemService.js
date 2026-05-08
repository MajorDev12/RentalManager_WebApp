import apiClient from "../../api/apiClient";

export const systemCodeItemService = {
  getAll() {
    return apiClient.get("SystemCodeItem");
  },

  getById(id) {
    return apiClient.get(`SystemCodeItem/${id}`);
  },

  getByCodeName(code) {
    return apiClient.get(`SystemCodeItem/By-Name/${code}`);
  },

  getTenantStatus() {
    return apiClient.get(`SystemCodeItem/By-Name/TENANTSTATUS`);
  },

  getPaymentMethods() {
    return apiClient.get(`SystemCodeItem/By-Name/PAYMENTMETHOD`);
  },

  getGenders() {
    return apiClient.get(`SystemCodeItem/By-Name/GENDER`);
  },

  getTransacionTypes() {
    return apiClient.get(`SystemCodeItem/By-Name/TRANSACTIONTYPE`);
  },

  getTransacionCategories() {
    return apiClient.get(`SystemCodeItem/By-Name/TRANSACTIONCATEGORY`);
  },

  getExpenseCategories() {
    return apiClient.get(`SystemCodeItem/By-Name/EXPENSECATEGORY`);
  },

  add(data) {
    return apiClient.post(`SystemCodeItem`, data);
  },

  update(id, data) {
    return apiClient.put(`SystemCodeItem/${id}`, data);
  },

  archive(id) {
    return apiClient.delete(`SystemCodeItem/${id}`);
  },

};
