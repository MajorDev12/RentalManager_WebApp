import apiClient from "../../api/apiClient";

export const expenseService = {
  getAll() {
    return apiClient.get("Expenses");
  },

  getById(id) {
    return apiClient.get(`Expenses/${id}`);
  },

  add(data) {
    return apiClient.post(`Expenses`, data);
  },

  update(id, data) {
    return apiClient.put(`Expenses/${id}`, data);
  },

  delete(id) {
    return apiClient.post(`Expenses/${id}`);
  },

};
