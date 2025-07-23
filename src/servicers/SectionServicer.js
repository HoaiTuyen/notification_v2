import api from "../axios/CustomAxios";

export const getListClassSectionExcel = (formData) => {
  return api.post("/classsection/preview_class_section", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createClassSectionExcel = (data) => {
  return api.post("/classsection/add_class_section", data);
};

export const getListRegisterStudentExcel = (formData) => {
  return api.post("/classsection/preview_student_class_section", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createRegisterStudentExcel = (data) => {
  return api.post("/classsection/add_student_class_section", data);
};
export const getListStudentRegister = (semesterId, page, pageSize) => {
  return api.get("/classsection/list_class_section", {
    params: {
      semesterId: semesterId,
      page: page,
      pageSize: pageSize,
    },
  });
};

export const deleteClassSection = (id) => {
  console.log(id);
  return api.delete("/classsection/delete", {
    data: {
      subjectId: id.subjectId,
      teacherId: id.teacherId,
      semesterId: id.semesterId,
      groupId: id.groupId,
    },
  });
};

export const searchStudentRegister = (keyword, semesterId, page, pageSize) => {
  return api.get("/classsection/list_class_section", {
    params: {
      keyword: keyword,
      semesterId: semesterId,
      page: page,
      pageSize: pageSize,
    },
  });
};

export const createClassSection = (data) => {
  return api.post("/classsection/add", data);
};
