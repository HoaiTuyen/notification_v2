import api from "../axios/CustomAxios";

export const updateCronTime = async (time) => {
  return await api.post("/scheduler/update-cron", {
    time: time,
  });
};
