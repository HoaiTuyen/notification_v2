import api from "../axios/CustomAxios";
export const systemLogin = (username, password) => {
  return api.post("/auth/login", {
    username,
    password,
  });
};
