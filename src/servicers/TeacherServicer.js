import api from "../axios/CustomAxios";

export const addTeacher = async (data) => {
  return await api.post("/teacher/add", data);
};
export const listTeacher = async (page, pageSize) => {
  return await api.get("/teacher/list_teachers", {
    params: {
      page: page,
      size: pageSize,
    },
  });
};
export const updateTeacher = async (data) => {
  return await api.put("/teacher/update", data);
};
export const deleteTeacher = async (id) => {
  return await api.delete(`/teacher/delete/${id}`);
};
export const searchTeacher = async (status, keyword, page = 0, pageSize) => {
  return await api.get("/teacher/list_teachers", {
    params: {
      status: status,
      keyword: keyword,
      page: page,
      size: pageSize,
    },
  });
};
export const getListTeacherExcel = async (formData) => {
  return await api.post("/teacher/preview_teachers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createTeacherExcel = async (data) => {
  return await api.post("/teacher/teacher_excel", data);
};

export const filterTeacher = async (
  keyword = "TEACHER",
  page = 0,
  pageSize = 10
) => {
  return await api.get("/teacher/list_teachers", {
    params: {
      keyword: keyword,
      page: page,
      size: pageSize,
    },
  });
};

export const teacherDetail = async (id) => {
  return await api.post(`/teacher/teacher-detail?id=${id}`);
};

export const listClassOfTeacher = async (id) => {
  return await api.post(`/teacher/getall_class?id=${id}`);
};
export const listClassSectionTeacher = async (teacherId, semesterId) => {
  return await api.get("/teacher/list_class_section", {
    params: {
      teacherId: teacherId,
      semesterId: semesterId,
    },
  });
};
export const countCourseSchedule = async (teacherId) => {
  return await api.post(
    `/teacher/count_course_schedule?teacherId=${teacherId}`
  );
};

export const countGroupCreate = async (teacherId) => {
  return await api.post(
    `/teacher/count_create_study_group?teacherId=${teacherId}`
  );
};

export const countSubjectCharge = async (teacherId, semesterId) => {
  return await api.post("/teacher/count_subject_semester", {
    teacherId: teacherId,
    semesterId: semesterId,
  });
};
