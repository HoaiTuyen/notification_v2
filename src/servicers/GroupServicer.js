import api from "../axios/CustomAxios";

export const listGroup = (page, pageSize = 10) => {
  return api.get("/studygroup/list_study_group", {
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
};
export const addGroup = (data) => {
  return api.post("/studygroup/add", data);
};
export const updateGroup = (data) => {
  return api.put("/studygroup/update", data);
};
export const deleteGroup = (id) => {
  return api.delete(`/studygroup/delete/${id}`);
};

export const searchGroup = (keyword, page, pageSize = 10) => {
  return api.get("/studygroup/list_study_group", {
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};

export const listGroupByIdUser = async (userId, page, pageSize = 10) => {
  return await api.get(
    `/studygroup/list_study_group_by_user?userId=${userId}`,
    {
      params: {
        page: page,
        pageSize: pageSize,
      },
    }
  );
};
export const joinStudentInClass = async (data) => {
  return await api.post("/studygroup/add_student_studygroup", data);
};
export const detailGroup = async (id) => {
  return await api.get(`/studygroup/study_group_detail?id=${id}`);
};

export const leaveGroup = async (userId, groupId) => {
  return await api.post(`/studygroup/leave`, null, {
    params: {
      userId: userId,
      groupId: groupId,
    },
  });
};
export const kickMember = async (groupId, currentUserId, userId) => {
  return await api.post("/studygroup/kick_member", null, {
    params: {
      groupId: groupId,
      currentUserId: currentUserId,
      userId: userId,
    },
  });
};
export const createReplyNotificationGroup = async (
  userId,
  notificationId,
  content
) => {
  return await api.post("/study_group_notification/create_reply_notification", {
    userId: userId,
    notificationId: notificationId,
    content: content,
  });
};

export const listReplyNotificationGroup = async (id) => {
  return await api.get(`/study_group_notification/reply_notification/${id}`);
};

export const detailNotificationGroup = async (id) => {
  return await api.get(`/study_group_notification/detail_notification/${id}`);
};

export const listNotificationGroupStudent = async (id) => {
  return await api.get(
    `/study_group_notification/list_notifications_student?groupId=${id}`
  );
};
