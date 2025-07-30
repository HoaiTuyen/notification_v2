import api from "../axios/CustomAxios";

export const listAcademic = (page, pageSize) => {
  return api.get("/academic_year/list_academic_year", {
    params: {
      page: page,
      pageSize: pageSize,
    },
  });
};

export const addAcademic = (data) => {
  return api.post("/academic_year/add", {
    id: data.id,
    name: data.name,
  });
};
export const updateAcademic = (data) => {
  return api.put("/academic_year/update", {
    id: data.id,
    name: data.name,
  });
};

export const deleteAcademic = (id) => {
  return api.delete(`/academic_year/delete/${id}`);
};
