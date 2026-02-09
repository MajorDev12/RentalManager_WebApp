import apiClient from "../../api/apiClient";

export const notificationService = {

    getUnRead(userId) {
      return apiClient.get(`Notifications/UnRead?userId=${userId}`);
    },

    getAll() {
      return apiClient.get(`Notifications`);
    },

};
