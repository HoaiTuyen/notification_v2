import { updateCronTime } from "../servicers/ScheduleServicer";

export const handleUpdateCronTime = async (time) => {
  try {
    const response = await updateCronTime(time);

    return {
      status: response.status,
      message: response.message,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi xử lý",
    };
  }
};
