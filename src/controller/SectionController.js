import {
  getListClassSectionExcel,
  createClassSectionExcel,
  getListRegisterStudentExcel,
  createRegisterStudentExcel,
  getListStudentRegister,
  deleteClassSection,
  searchStudentRegister,
  createClassSection,
} from "../servicers/SectionServicer";

export const handleGetListClassSectionExcel = async (file) => {
  try {
    const response = await getListClassSectionExcel(file);

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

export const handleCreateClassSectionExcel = async (data) => {
  try {
    const response = await createClassSectionExcel(data);

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

export const handleGetListRegisterStudentExcel = async (file) => {
  try {
    const response = await getListRegisterStudentExcel(file);

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
    };
  }
};

export const handleCreateRegisterStudentExcel = async (data) => {
  try {
    const response = await createRegisterStudentExcel(data);

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
    };
  }
};
export const handleGetListStudentRegister = async (
  semesterId,
  page,
  pageSize
) => {
  try {
    const response = await getListStudentRegister(semesterId, page, pageSize);

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
    };
  }
};
export const handleDeleteClassSection = async (id) => {
  try {
    const response = await deleteClassSection(id);
    return response;
  } catch (error) {
    if (error) {
      const errMsg =
        error.response?.data?.message || "Xoá lớp học phần thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};

export const handleSearchStudentRegister = async (
  keyword,
  semesterId,
  page,
  pageSize
) => {
  try {
    const response = await searchStudentRegister(
      keyword,
      semesterId,
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
        error.response?.data?.message || "Đã xảy ra lỗi khi xử lý file Excel",
    };
  }
};

export const handleCreateClassSection = async (data) => {
  try {
    const response = await createClassSection(data);

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
    };
  }
};
