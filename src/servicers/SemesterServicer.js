import api from "../axios/CustomAxios";

export const listSemester = (sort, page, pageSize = 10) => {
  return api.get("/semester/list_semesters", {
    params: {
      sort: sort,
      page: page,
      pageSize: pageSize,
    },
  });
};
export const addSemester = (data) => {
  return api.post("/semester/add", data);
};
export const deleteSemester = (id) => {
  return api.delete(`/semester/delete/${id}`);
};
export const updateSemester = (data) => {
  return api.put("/semester/update", data);
};
export const searchSemester = (keyword, page, pageSize = 10) => {
  return api.get("/semester/list_semesters", {
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};
