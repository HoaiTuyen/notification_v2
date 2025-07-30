import {
  send_message,
  list_message,
  revoke_message,
} from "../servicers/MessageServicer";

export const handleSendMessage = async (groupId, message) => {
  try {
    const response = await send_message(groupId, message);

    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Gửi tin nhắn thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};

export const handleListMessage = async (groupId, page, size) => {
  try {
    const response = await list_message(groupId, page, size);
    console.log(response);
    return response;
  } catch (error) {
    if (error) {
      const errMsg = error.response?.data?.message || "Lấy tin nhắn thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};

export const handleRevokeMessage = async (messageId, userId) => {
  try {
    const response = await revoke_message(messageId, userId);
    return response;
  } catch (error) {
    if (error) {
      const errMsg =
        error.response?.data?.message || "Thu hồi tin nhắn thất bại";
      const status = error.response?.status || 500;
      return {
        status,
        message: errMsg,
      };
    }
  }
};
