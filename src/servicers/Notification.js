import api from "../axios/CustomAxios";

export const createNotification = (formData) => {
  return api.post("/notification/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createUserNotification = (formData) => {
  return api.post("/notification/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const listNotification = (sort, page, pageSize, type) => {
  return api.get("/notification/list_notifications", {
    params: {
      sort: sort,
      page: page,
      pageSize: pageSize,
      notificationType: type,
    },
  });
};
export const deleteNotification = (id) => {
  return api.delete(`/notification/delete/${id}`);
};
export const detailNotification = (id) => {
  return api.get(`/notification/detail_notification/${id}`);
};
export const searchNotification = async (
  keyword,
  type,
  department,
  page,
  pageSize
) => {
  const req = await api.get("/notification/list_notifications", {
    params: {
      keyword: keyword,
      notificationType: type,
      departmentName: department,
      page: page,
      pageSize: pageSize,
    },
  });
  return req;
};
export const updateNotification = (formData) => {
  return api.put("/notification/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const listNotificationReport = (form, to) => {
  return api.post(`/notification/filter_notification?from=${form}&to=${to}`);
};

export const downloadReportExcel = (from, to) => {
  return api.post("/notification/export_notification", null, {
    params: { from, to },
    responseType: "blob", // quan trọng: để axios trả về blob
  });
};

export const listNotificationPersonal = (userId, page, pageSize) => {
  return api.get("notification/notification_create", {
    params: {
      userId: userId,
      page: page,
      size: pageSize,
    },
  });
};
