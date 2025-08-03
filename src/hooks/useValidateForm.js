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
    const idRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
    const nameRegex = /^[\p{L} ]+$/u;

    const requiredMsg =
      type === "lecturer"
        ? "Vui lòng điền đầy đủ thông tin giảng viên"
        : "Vui lòng điền đầy đủ thông tin sinh viên";
    const birthMsg = "Ngày sinh không hợp lệ. Vui lòng nhập lại.";

    const fieldLabels = {
      id: type === "lecturer" ? "Mã số giảng viên" : "Mã số sinh viên",
      firstName: "Họ",
      lastName: "Tên",
    };

    // ID
    if (!form.id?.trim()) {
      toast.error(`${fieldLabels.id} không được để trống`);
      return false;
    }
    if (form.id.trim().length < 10) {
      toast.error(`${fieldLabels.id} ít nhất 10 ký tự`);
      return false;
    }
    if (!idRegex.test(form.id.trim())) {
      toast.error(
        `${fieldLabels.id} phải bắt đầu bằng chữ, các kí tự còn lại chứa chữ, số và dấu gạch dưới`
      );
      return false;
    }

    // First name
    if (!form.firstName?.trim()) {
      toast.error(`${fieldLabels.firstName} không được để trống`);
      return false;
    }
    if (form.firstName.trim().length < 3) {
      toast.error(`${fieldLabels.firstName} ít nhất 3 ký tự`);
      return false;
    }
    if (!nameRegex.test(form.firstName.trim())) {
      toast.error(
        `${fieldLabels.firstName} chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt`
      );
      return false;
    }

    // Last name
    if (!form.lastName?.trim()) {
      toast.error(`${fieldLabels.lastName} không được để trống`);
      return false;
    }
    if (form.lastName.trim().length < 1) {
      toast.error(`${fieldLabels.lastName} ít nhất 1 ký tự`);
      return false;
    }
    if (!nameRegex.test(form.lastName.trim())) {
      toast.error(
        `${fieldLabels.lastName} chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt`
      );
      return false;
    }

    // Email
    if (!form.email?.trim()) {
      toast.error("Email không được để trống");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      toast.error("Email không hợp lệ. Vui lòng nhập đúng định dạng email.");
      return false;
    }

    // Date of birth
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
