import apiClient from "../../api/apiClient";

export const profileService = {
  getUserData(id) {
    return apiClient.get(`Users/${id}`);
  },

  updateGeneralData(id, data) {
    return apiClient.put(`Users/${id}`, data);
  },


};
