import {
  addTeacher,
  listTeacher,
  updateTeacher,
  deleteTeacher,
  searchTeacher,
  createTeacherExcel,
  getListTeacherExcel,
  filterTeacher,
  teacherDetail,
  listClassOfTeacher,
  listClassSectionTeacher,
  countCourseSchedule,
  countGroupCreate,
  countSubjectCharge,
} from "../servicers/TeacherServicer";

export const handleAddTeacher = async (dataTeacher) => {
  try {
    const response = await addTeacher(dataTeacher);
    if (response?.data && response.status === 200) {
      return {
        status: response.status,
        message: response.message || "Thêm giáo viên thành công",
        data: response.data,
      };
    } else {
      return {
        status: response.status,
        message: response.message || "Thêm giáo viên thất bại",
      };
    }
  } catch (error) {
    console.error("Error adding teacher:", error);
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi thêm giáo viên",
    };
  }
};
export const handleListTeacher = async (page, pageSize) => {
  try {
    const response = await listTeacher(page, pageSize);
    if (response?.data?.teachers) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
    return {
      status: response?.status || 500,
      message:
        response?.message || "Đã xảy ra lỗi khi lấy danh sách giảng viên",
      data: [],
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy danh sách giảng viên",
    };
  }
};

export const handleUpdateTeacher = async (dataTeacher) => {
  try {
    const response = await updateTeacher(dataTeacher);
    if (response?.data && response.status === 200) {
      return {
        status: response.status,
        message: response.message || "Cập nhật giảng viên thành công",
        data: response.data,
      };
    } else {
      return {
        status: response.status,
        message: response.message || "Cập nhật giảng viên thất bại",
      };
    }
  } catch (error) {
    console.error("Error adding teacher:", error);
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi cập nhật giảng viên",
    };
  }
};
export const handleDeleteTeacher = async (id) => {
  try {
    const response = await deleteTeacher(id);
    console.log(response);
    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
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
export const handleSearchTeacher = async (
  status,
  keyword,
  page = 0,
  pageSize = 10
) => {
  try {
    const response = await searchTeacher(status, keyword, page, pageSize);
    console.log(response);

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

export const handleGetListTeacherExcel = async (file) => {
  try {
    const response = await getListTeacherExcel(file);

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

export const handleCreateTeacherExcel = async (data) => {
  try {
    const response = await createTeacherExcel(data);

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

export const handleFilterTeacher = async (page = 0, pageSize = 10) => {
  try {
    const response = await filterTeacher(page, pageSize);
    if (response?.data?.teachers) {
      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    }
    return {
      status: response?.status || 500,
      message:
        response?.message || "Đã xảy ra lỗi khi lấy danh sách giảng viên",
      data: [],
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi lấy danh sách giảng viên",
    };
  }
};

export const handleTeacherDetail = async (id) => {
  try {
    const response = await teacherDetail(id);

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
        "Đã xảy ra lỗi khi lấy danh sách sinh viên",
    };
  }
};

export const handleListClassOfTeacher = async (id) => {
  try {
    const response = await listClassOfTeacher(id);

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
        "Đã xảy ra lỗi khi lấy danh sách sinh viên",
    };
  }
};

export const handleListClassSectionTeacher = async (teacherId, semesterId) => {
  try {
    const response = await listClassSectionTeacher(teacherId, semesterId);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi xử lý",
    };
  }
};

export const handleCountCourseSchedule = async (teacherId) => {
  try {
    const response = await countCourseSchedule(teacherId);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi xử lý",
    };
  }
};

export const handleCountGroupCreate = async (teacherId) => {
  try {
    const response = await countGroupCreate(teacherId);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi xử lý",
    };
  }
};

export const handleCountSubjectCharge = async (teacherId, semesterId) => {
  try {
    const response = await countSubjectCharge(teacherId, semesterId);

    return {
      status: response.status,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi xử lý",
    };
  }
};
