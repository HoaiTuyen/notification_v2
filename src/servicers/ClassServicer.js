import api from "../axios/CustomAxios";

export const listClass = (page, pageSize) => {
  return api.get("/class/list_classes", {
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
};
export const addClass = (data) => {
  return api.post("/class/add", data);
};
export const deleteClass = (id) => {
  return api.delete(`/class/delete/${id}`);
};
export const updateClass = (data) => {
  return api.put("/class/update", data);
};
export const searchClass = (keyword, page, pageSize = 10) => {
  return api.get("/class/list_classes", {
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};
export const getListClassExcel = (formData) => {
  return api.post("/class/preview_classes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createClassExcel = (data) => {
  return api.post("/class/class_excel", data);
};
export const listStudentByClass = (classId, page, pageSize = 10) => {
  return api.get("/class/student_by_class", {
    params: {
      classId: classId,
      page: page,
      pageSize: pageSize,
    },
  });
};

export const getListStudentByClassExcel = (formData) => {
  return api.post("/class/preview_classes_student", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createStudentByClassExcel = (data) => {
  return api.post("/class/add_student_class", data);
};

export const searchStudentByClass = (classId, keyword, page = 0, pageSize) => {
  return api.get("/student/list_students", {
    params: {
      classId: classId,
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};
