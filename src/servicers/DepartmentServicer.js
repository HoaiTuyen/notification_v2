import api from "../axios/CustomAxios";

export const addDepartment = async (data) => {
  const response = await api.post("/department/add", data);
  return response;
};

export const listDepartment = async (page, pageSize) => {
  const response = await api.get("/department/list_departments", {
    params: {
      page,
      size: pageSize,
    },
  });
  return response;
};
export const updateDepartment = async (data) => {
  const response = await api.put("/department/update", data);
  return response;
};
export const deleteDepartment = async (id) => {
  const response = await api.delete(`/department/delete/${id}`);
  return response;
};
export const searchDepartment = async (keyword, page = 0, pageSize = 10) => {
  const response = await api.get("/department/list_departments", {
    params: {
      keyword: keyword,
      page,
      pageSize,
    },
  });
  return response;
};
export const listClassByDepartment = async (id, page, pageSize = 10) => {
  return await api.get("/department/class_by_department", {
    params: {
      departmentId: id,
      page: page,
      pageSize: pageSize,
    },
  });
};

export const getListClassByDepartmentExcel = (formData) => {
  return api.post("/department/preview_departments_class", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createClassByDepartmentExcel = async (data) => {
  return await api.post("/department/add_classs_department", data);
};

export const searchClassByDepartment = (
  departmentId,
  keyword,
  page,
  pageSize = 10
) => {
  return api.get("/class/list_classes", {
    params: {
      departmentId: departmentId,
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};
