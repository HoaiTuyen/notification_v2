import { toast } from "react-toastify";

const getFormattedDate = (date) => date.toISOString().split("T")[0];

const validateBirthDate = (dateStr, minAge, minDate) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();

  const age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  const d = now.getDate() - date.getDate();

  const isFuture = date > now;
  const isTooYoung =
    age < minAge || (age === minAge && (m < 0 || (m === 0 && d < 0)));
  const isTooOld = date < minDate;

  return !isFuture && !isTooYoung && !isTooOld;
};

const useValidateFormBase = (type = "student") => {
  const today = new Date();
  const minAge = type === "lecturer" ? 22 : 18;
  const maxBirthDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );
  const minBirthDate = new Date(today.getFullYear() - 100, 0, 1);

  const validateForm = (form) => {
    const requiredMsg =
      type === "lecturer"
        ? "Vui lòng điền đầy đủ thông tin giảng viên"
        : "Vui lòng điền đầy đủ thông tin bắt buộc";
    const birthMsg = "Ngày sinh không hợp lệ. Vui lòng nhập lại.";

    if (!form.id || !form.firstName || !form.lastName || !form.email) {
      toast.error(requiredMsg);
      return false;
    }

    if (!validateBirthDate(form.dateOfBirth, minAge, minBirthDate)) {
      toast.error(birthMsg);
      return false;
    }

    return true;
  };

  return {
    validateForm,
    formatDate: getFormattedDate,
    minBirthDate,
    maxBirthDate,
  };
};

export const useValidateStudentForm = () => useValidateFormBase("student");
export const useValidateLecturerForm = () => useValidateFormBase("lecturer");
