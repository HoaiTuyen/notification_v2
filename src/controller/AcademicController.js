import {
  addAcademic,
  listAcademic,
  updateAcademic,
  deleteAcademic,
} from "../servicers/AcademicServicer";

export const handleListAcademic = async (page, pageSize) => {
  try {
    const response = await listAcademic(page, pageSize);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy danh sách niên khoá",
      data: error.response?.data || {},
    };
  }
};

export const handleAddAcademic = async (data) => {
  try {
    const response = await addAcademic(data);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi thêm niên khoá",
      data: [],
    };
  }
};

export const handleUpdateAcademic = async (data) => {
  try {
    const response = await updateAcademic(data);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật niên khoá",
      data: [],
    };
  }
};

export const handleDeleteAcademic = async (id) => {
  try {
    const response = await deleteAcademic(id);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Xóa niên khoá thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
