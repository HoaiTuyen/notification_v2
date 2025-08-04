import api from "../axios/CustomAxios";
export const listUser = (page = 0, pageSize = 1000) => {
  return api.get("/user/list_users", {
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
};
export const addUser = (data) => {
  return api.post("/user/add", data);
};
export const lockUser = (userId) => {
  return api.post(`/user/lock/${userId}`);
};
export const changePassword = (
  id,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  return api.post("/account/change-password", {
    id: id,
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  });
};

export const updateUser = (data) => {
  return api.put("/user/update", data);
};
export const searchUser = (keyword, role, page, pageSize) => {
  return api.get("/user/list_users", {
    params: {
      keyword: keyword,
      role: role,
      page: page,
      pageSize: pageSize,
    },
  });
};
export const getDetailUser = (userId) => {
  return api.post(`/account/user-detail?id=${userId}`);
};
export const uploadImage = (id, formData) => {
  return api.put(`/account/profile_img?id=${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getListStudentAccountExcel = (formData) => {
  return api.post("/user/preview_account_students", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createStudentAccountExcel = (data) => {
  return api.post("/user/account_student", data);
};

export const getListLecturerAccountExcel = (formData) => {
  return api.post("/user/preview_account_teachers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createLecturerAccountExcel = (data) => {
  return api.post("/user/account_teacher", data);
};

export const filterUser = (keyword, page = 0, pageSize = 10) => {
  return api.get("/user/list_users", {
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};

export const listGroupByStudent = async (id, page = 0, pageSize = 10) => {
  return api.get(`/account/list_study_group_by_user?userId=${id}`, {
    params: {
      page,
      pageSize,
    },
  });
};

export const checkCourseSchedule = (id, check) => {
  return api.post("/account/check_course_schedule", {
    id: id,
    check: check,
  });
};

export const listNotificationByStudent = async (StudentId, page, size) => {
  return api.get("/account/list_notifications", {
    params: {
      userId: StudentId,
      page: page,
      size: size,
    },
  });
};
export const searchNotificationByStudent = async (
  StudentId,
  keyword,
  department,
  type,
  fromDate,
  toDate,
  page,
  size
) => {
  return api.get("/account/list_notifications", {
    params: {
      userId: StudentId,
      ...(keyword && { keyword }),
      ...(department && { departmentId: department }),
      ...(type && { notificationTypeId: type }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      page,
      size,
    },
  });
};
export const unreadCountNotificationUser = async (userId) => {
  return api.post(`/account/count_all_notification/${userId}`);
};
export const makeNotificationRead = async (
  userId,
  notificationId,
  notificationType
) => {
  return api.post("/account/make_a_notification", {
    notificationId: notificationId,
    notificationType: notificationType,
    userId: userId,
  });
};
export const makeAllNotificationRead = async (userId) => {
  return api.post(`/account/make_all_notification/${userId}`);
};
