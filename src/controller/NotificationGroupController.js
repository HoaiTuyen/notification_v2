import {
  createNotificationGroup,
  listNotificationGroup,
  detailNotificationGroup,
  deleteNotificationGroup,
  updateNotificationGroup,
  createNotificationGroupPersonal,
} from "../servicers/NotificationGroup";
export const handleCreateNotificationGroup = async (formData) => {
  try {
    const response = await createNotificationGroup(formData);

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
export const handleCreateNotificationGroupPersonal = async (formData) => {
  try {
    const response = await createNotificationGroupPersonal(formData);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
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
export const handleListNotificationGroup = async (id) => {
  try {
    const response = await listNotificationGroup(id);

    if (response?.data) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy danh sách thông báo",
      data: [],
    };
  }
};

export const handleDetailNotificationGroup = async (id) => {
  try {
    const response = await detailNotificationGroup(id);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Lỗi hệ thống";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
export const handleDeleteNotificationGroup = async (id) => {
  try {
    const response = await deleteNotificationGroup(id);
    console.log(response);
    return response;
  } catch (error) {
    if (error) {
      const errMsg =
        error.response?.data?.message || "Xoá thông báo nhóm thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
export const handleUpdateNotificationGroup = async (formData) => {
  try {
    const response = await updateNotificationGroup(formData);

    if (response?.data || response?.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông báo",
      data: [],
    };
  }
};
