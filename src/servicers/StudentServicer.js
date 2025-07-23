import api from "../axios/CustomAxios";

export const addStudent = (data) => {
  return api.post("/student/add", data);
};
export const listStudent = (page = 0, pageSize) => {
  return api.get("/student/list_students", {
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
};
export const updateStudent = (data) => {
  return api.put("/student/update", data);
};
export const deleteStudent = (id) => {
  return api.delete(`/student/delete/${id}`);
};
export const searchStudent = (status, keyword, page = 0, pageSize = 10) => {
  return api.get("/student/list_students", {
    params: {
      status: status,
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};

export const getListStudentExcel = (formData) => {
  return api.post("/student/preview_students", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createStudentExcel = (data) => {
  return api.post("/student/student_excel", data);
};

export const studentDetail = (id) => {
  return api.post(`/student/student-detail?id=${id}`);
};

export const listClassSectionStudent = (studentId, semesterId) => {
  return api.get("/student/list_class_section", {
    params: {
      studentId: studentId,
      semesterId: semesterId,
    },
  });
};
export const totalGroup = (studentId) => {
  return api.post(`/student/total_study_group?studentId=${studentId}`);
};

export const totalCourseSchedule = (studentId, semesterId) => {
  return api.post("/student/count_course_schedule", {
    studentId: studentId,
    semesterId: semesterId,
  });
};
