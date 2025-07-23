import {
  listGroup,
  addGroup,
  updateGroup,
  deleteGroup,
  searchGroup,
  listGroupByIdUser,
  joinStudentInClass,
  detailGroup,
  leaveGroup,
  kickMember,
  createReplyNotificationGroup,
  listReplyNotificationGroup,
} from "../servicers/GroupServicer";

export const handleListGroup = async (page, pageSize) => {
  try {
    const response = await listGroup(page, pageSize);

    if (response?.data) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi lấy danh sách khoa",
      data: [],
    };
  }
};
export const handleAddGroup = async (data) => {
  try {
    const response = await addGroup(data);
    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Thêm nhóm thất bại";

      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
export const handleUpdateGroup = async (data) => {
  try {
    const response = await updateGroup(data);
    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Thêm nhóm thất bại";

      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
export const handleDeleteGroup = async (id) => {
  try {
    const response = await deleteGroup(id);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Xoá khoa thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
export const handleSearchGroup = async (keyword, page, pageSize) => {
  try {
    const response = await searchGroup(keyword, page, pageSize);

    if (response?.data) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi",
      data: [],
    };
  }
};
export const handleListGroupByUserId = async (userId, page, pageSize) => {
  try {
    const response = await listGroupByIdUser(userId, page, pageSize);

    if (response?.data) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi",
      data: [],
    };
  }
};

export const handleJoinStudentInGroup = async (data) => {
  try {
    const response = await joinStudentInClass(data);

    return response;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi lấy danh sách khoa",
      data: [],
    };
  }
};
export const handleDetailGroup = async (id) => {
  try {
    const response = await detailGroup(id);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Đã xảy ra lỗi";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};

export const handleLeaveGroup = async (userId, groupId) => {
  try {
    const response = await leaveGroup(userId, groupId);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Rời nhóm thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};

export const handleKickMember = async (groupId, currentUserId, userId) => {
  try {
    const response = await kickMember(groupId, currentUserId, userId);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Xoá thành viên thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};

export const handleCreateReplyNotificationGroup = async (
  userId,
  notificationId,
  content
) => {
  try {
    const response = await createReplyNotificationGroup(
      userId,
      notificationId,
      content
    );
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Đã có lỗi xảy ra";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};

export const handleListReplyNotificationGroup = async (id) => {
  try {
    const response = await listReplyNotificationGroup(id);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Đã có lỗi xảy ra";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
