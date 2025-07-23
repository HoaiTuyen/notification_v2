import api from "../axios/CustomAxios";

export const statisticalShare = async () => {
  return await api.get("/report/overview");
};
export const statisticalDepartmentStudent = async () => {
  return await api.get("/report/department_student");
};
export const statisticalNotificationDay = async () => {
  return await api.get("/report/notification");
};
