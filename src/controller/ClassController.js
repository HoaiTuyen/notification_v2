import {
  listClass,
  addClass,
  deleteClass,
  updateClass,
  searchClass,
  createClassExcel,
  getListClassExcel,
  listStudentByClass,
  getListStudentByClassExcel,
  createStudentByClassExcel,
  searchStudentByClass,
} from "../servicers/ClassServicer";

export const handleAddClass = async (data) => {
  try {
    const response = await addClass(data);

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
export const handleListClass = async (page, pageSize) => {
  try {
    const response = await listClass(page, pageSize);

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
      data: error.response?.data || {},
    };
  }
};

export const handleUpdateClass = async (data) => {
  try {
    const response = await updateClass(data);
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
export const handleDeleteClass = async (id) => {
  try {
    const response = await deleteClass(id);
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
export const handleSearchClass = async (keyword, page = 0, pageSize = 10) => {
  try {
    const response = await searchClass(keyword, page, pageSize);

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
export const handleGetListClassExcel = async (file) => {
  try {
    const response = await getListClassExcel(file);

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

export const handleCreateClassExcel = async (data) => {
  try {
    const response = await createClassExcel(data);

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

export const handleListStudentByClass = async (id, page, pageSize) => {
  try {
    const response = await listStudentByClass(id, page, pageSize);

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

export const handleGetListStudentByClassExcel = async (file) => {
  try {
    const response = await getListStudentByClassExcel(file);

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
export const handleCreateStudentByClassExcel = async (data) => {
  try {
    const response = await createStudentByClassExcel(data);

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

export const handleSearchStudentByClass = async (
  classId,
  keyword,
  page = 0,
  pageSize = 10
) => {
  try {
    const response = await searchStudentByClass(
      classId,
      keyword,
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
        error.response?.data?.message || "Đã xảy ra lỗi khi thêm môn học",
      data: error.response?.data || {},
    };
  }
};
