import {
  addSubject,
  listSubject,
  updateSubject,
  deleteSubject,
  searchSubject,
  createSubjectExcel,
  getListSubjectExcel,
} from "../servicers/SubjectServicer";

export const handleAddSubject = async (data) => {
  try {
    const response = await addSubject(data);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi thêm môn học",
      data: [],
    };
  }
};
export const handleListSubject = async (page, pageSize) => {
  try {
    const response = await listSubject(page, pageSize);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi thêm môn học",
      data: [],
    };
  }
};

export const handleUpdateSubject = async (data) => {
  try {
    const response = await updateSubject(data);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật môn học",
      data: [],
    };
  }
};
export const handleDeleteSubject = async (id) => {
  try {
    const response = await deleteSubject(id);
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
export const handleSearchSubject = async (keyword, page = 0, pageSize = 10) => {
  try {
    const response = await searchSubject(keyword, page, pageSize);

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
export const handleGetListSubjectExcel = async (file) => {
  try {
    const response = await getListSubjectExcel(file);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi xử lý file Excel",
      data: [],
    };
  }
};

export const handleCreateSubjectExcel = async (data) => {
  try {
    const response = await createSubjectExcel(data);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi xử lý file Excel",
      data: [],
    };
  }
};
