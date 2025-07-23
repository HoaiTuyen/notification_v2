import api from "../axios/CustomAxios";

export const listNotificationType = (page, pageSize = 10) => {
  return api.get("/notification_type/list_notification_type", {
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
};
export const addNotificationType = (data) => {
  return api.post("/notification_type/add", data);
};
export const deleteNotificationType = (id) => {
  return api.delete(`/notification_type/delete/${id}`);
};
export const updateNotificationType = (data) => {
  return api.put("/notification_type/update", data);
};
export const searchNotificationType = (keyword, page, pageSize = 10) => {
  return api.get("/notification_type/list_notification_type", {
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};
