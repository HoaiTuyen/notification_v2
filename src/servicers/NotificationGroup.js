import api from "../axios/CustomAxios";

export const createNotificationGroup = (formData) => {
  return api.post("/study_group_notification/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const listNotificationGroup = (id) => {
  return api.get(`/study_group_notification/list_notifications?groupId=${id}`);
};
export const detailNotificationGroup = (id) => {
  return api.get(`/study_group_notification/detail_notification/${id}`);
};

export const deleteNotificationGroup = (id) => {
  return api.delete(`/study_group_notification/delete/${id}`);
};
export const updateNotificationGroup = (formData) => {
  return api.put("/study_group_notification/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
