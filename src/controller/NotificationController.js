import {
  createNotification,
  listNotification,
  detailNotification,
  deleteNotification,
  searchNotification,
  updateNotification,
  createUserNotification,
  listNotificationReport,
  downloadReportExcel,
  listNotificationPersonal,
} from "../servicers/Notification";

export const handleCreateNotification = async (formData) => {
  try {
    const response = await createNotification(formData);

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
export const handleCreateUserNotification = async (formData) => {
  try {
    const response = await createUserNotification(formData);

    if (response?.data) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
  } catch (error) {
    console.error("Error creating user notification:", error);
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi tạo thông báo",
    };
  }
};
export const handleListNotification = async (sort, page, pageSize, type) => {
  try {
    const response = await listNotification(sort, page, pageSize, type);

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

export const handleDetailNotification = async (id) => {
  try {
    const response = await detailNotification(id);

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
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy thông tin thông báo",
      data: [],
    };
  }
};
export const handleDeleteNotification = async (id) => {
  try {
    const response = await deleteNotification(id);
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
export const handleSearchNotification = async (
  keyword,
  type,
  department,
  page,
  pageSize
) => {
  try {
    const response = await searchNotification(
      keyword,
      type,
      department,
      page,
      pageSize
    );

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi tìm kiếm khoa",
      data: [],
    };
  }
};

export const handleUpdateNotification = async (formData) => {
  console.log(formData);
  try {
    const response = await updateNotification(formData);

    return {
      status: response.status,
      data: response.data,
      message:
        response.data?.message ||
        response.statusText ||
        "Cập nhật thông báo thành công!",
    };
  } catch (error) {
    console.error("Error updating notification:", error);
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông báo",
      data: [],
    };
  }
};

export const handleListNotificationReport = async (from, to) => {
  try {
    const response = await listNotificationReport(from, to);

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

export const handleDownloadReportExcel = async (from, to) => {
  try {
    const response = await downloadReportExcel(from, to);

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

export const handleListNotificationPersonal = async (
  userId,
  page,
  pageSize
) => {
  try {
    const response = await listNotificationPersonal(userId, page, pageSize);

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
