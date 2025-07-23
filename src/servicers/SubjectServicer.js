import api from "../axios/CustomAxios";

export const addSubject = (data) => {
  return api.post("/subject/add", data);
};
export const listSubject = (page, pageSize = 10) => {
  return api.get("/subject/list_subjects", {
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
};
export const updateSubject = (data) => {
  return api.put("/subject/update", data);
};
export const deleteSubject = (id) => {
  return api.delete(`/subject/delete/${id}`);
};
export const searchSubject = (keyword, page, pageSize = 10) => {
  return api.get("/subject/list_subjects", {
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};
export const getListSubjectExcel = (formData) => {
  return api.post("/subject/preview_subjects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createSubjectExcel = (data) => {
  return api.post("/subject/subject_excel", data);
};
