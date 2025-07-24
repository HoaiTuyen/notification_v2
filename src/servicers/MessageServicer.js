import api from "../axios/CustomAxios";

export const send_message = async (groupId, message) => {
  return await api.post("/chat_message/send_message", {
    groupId: groupId,
    message: message,
  });
};

export const list_message = async (groupId, page, size) => {
  return await api.get("/chat_message/list_messages", {
    params: {
      groupId: groupId,
      page: page,
      size: size,
    },
  });
};
