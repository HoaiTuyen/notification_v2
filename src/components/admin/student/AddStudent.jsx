import React, { useEffect, useState } from "react";
import ClassSelect from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  handleAddStudent,
  handleUpdateStudent,
} from "../../../controller/StudentController";
import { toast } from "react-toastify";
import { handleListClass } from "../../../controller/ClassController";
import { useValidateStudentForm } from "../../../hooks/useValidateForm";
import { useLoading } from "../../../context/LoadingProvider";
const AddStudent = ({ open, onClose, onSuccess, student }) => {
  const checkEdit = !!student?.id;
  const [dataClass, setDataClass] = useState([]);
  const { validateForm, formatDate, minBirthDate, maxBirthDate } =
    useValidateStudentForm();
  const { setLoading } = useLoading();
  const [errors, setErrors] = useState({});
  const [changePassword, setChangePassword] = useState(false);

  const [form, setForm] = useState({
    id: student?.id || "",
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    status: student?.status || "ĐANG_HỌC",
    className: student?.className || "",
    classId: student?.classId || "",
    gender: student?.gender || "NAM",
    username: student?.username || "",
    password: student?.password || "",
    dateOfBirth: student?.dateOfBirth?.slice(0, 10) || "",
  });

  const fetchAllClasses = async () => {
    const pageSize = 10;
    let allClasses = [];
    let page = 0;
    let totalPages = 1;

    try {
      do {
        const res = await handleListClass(page, pageSize);
        if (res?.data?.classes) {
          allClasses = [...allClasses, ...res.data.classes];
          totalPages = res.data.totalPages;
          page++;
        } else {
          break; // stop if bad data
        }
      } while (page < totalPages);

      setDataClass(allClasses);
    } catch (error) {
      console.error("Lỗi khi fetch all classes:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);
  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (open && student?.id) {
      setForm({
        id: student?.id || "",
        firstName: student?.firstName || "",
        lastName: student?.lastName || "",
        email: student?.email || "",
        status: student?.status || "ĐANG_HỌC",
        className: student?.className || "",
        classId: student?.classId || "",
        gender: student?.gender || "NAM",
        username: student?.username || "",
        password: student?.password || "",
        dateOfBirth: student?.dateOfBirth?.slice(0, 10) || "",
      });
    } else {
      setForm({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        status: "ĐANG_HỌC",
        className: "",
        classId: "",
        gender: "NAM",
        username: "",
        password: "",
        dateOfBirth: "",
      });
    }
  }, [student, open]);

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm(form)) {
      return;
    }

    if (!checkEdit) {
      if (!form.username?.trim()) {
        toast.error("Vui lòng nhập username");
        return;
      }
      if (!form.password?.trim()) {
        toast.error("Vui lòng nhập mật khẩu");
        return;
      }

      if (form.password.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }
    }
    try {
      setLoading(true);
      // Validate required fields

      const payload = {
        ...form,
        classId: form.classId,
        ...(checkEdit
          ? {}
          : { username: form.username, password: form.password }),
      };

      if (checkEdit) {
        const reqEdit = await handleUpdateStudent(payload);
        if (reqEdit?.status === 204) {
          toast.success(reqEdit.message || "Cập nhật sinh viên thành công");
          onSuccess();
          onClose();
          return;
        } else {
          toast.error(reqEdit?.message || "Cập nhật sinh viên thất bại");
          return;
        }
      } else {
        const response = await handleAddStudent(payload);
        if (response?.status === 201) {
          toast.success(response.message || "Thêm sinh viên thành công");
          onSuccess();
          onClose();
        } else {
          toast.error(response?.message || "Thêm sinh viên thất bại");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Thêm sinh viên thất bại");
    } finally {
      setLoading(false);
    }
  };
  const classOptions = dataClass.map((cls) => ({
    value: cls.id,
    label: cls.name,
  }));

  const validateField = (field, value) => {
    let message = "";
    const trimmed = value.trim();

    switch (field) {
      case "id":
        if (!trimmed) message = "Mã sinh viên không được để trống";
        else if (!/^[A-Z0-9_]+$/.test(trimmed))
          message = "Chỉ bao gồm chữ in hoa, số hoặc dấu gạch dưới";
        break;
      case "firstName":
      case "lastName":
        if (!trimmed) message = "Trường này không được để trống";
        break;
      case "email":
        if (!trimmed) message = "Email không được để trống";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(trimmed))
          message = "Email không hợp lệ";
        break;
      case "username":
        if (!trimmed) message = "Username không được để trống";
        break;
      case "password":
        if (!trimmed) message = "Password không được để trống";
        else if (trimmed.length < 6)
          message = "Mật khẩu phải có ít nhất 6 ký tự";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent
          className="sm:max-w-[600px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {checkEdit ? "Cập nhật sinh viên" : "Thêm sinh viên mới"}
            </DialogTitle>
            <DialogDescription>
              {checkEdit
                ? "Cập nhật thông tin sinh viên"
                : "Nhập thông tin sinh viên mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentId">
                    Mã sinh viên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="studentId"
                    placeholder="VD: DH52112031"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    onBlur={(e) => validateField("id", e.target.value)}
                    required
                    pattern="^[A-Z][A-Za-z0-9]*$"
                    title="Mã sinh viên phải bắt đầu bằng chữ, các kí tự còn lại chứa chữ hoặc số"
                  />
                  {errors.id && (
                    <p className="text-red-500 text-sm">{errors.id}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">
                    Ngày sinh <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    min={formatDate(minBirthDate)}
                    max={formatDate(maxBirthDate)}
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lastName">
                    Họ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Nhập họ sinh viên"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    onBlur={(e) => validateField("firstName", e.target.value)}
                    required
                    pattern="^[\p{L} ]+$"
                    title="Họ chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="firstName">
                    Tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Nhập tên sinh viên"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    onBlur={(e) => validateField("lastName", e.target.value)}
                    required
                    pattern="^[a-zA-ZÀ-ỹ]+$"
                    title="Tên chỉ được chứa chữ cái, không được chứa số hoặc ký tự đặc biệt"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.edu.vn"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onBlur={(e) => validateField("email", e.target.value)}
                    required
                    title="Email không hợp lệ. Vui lòng nhập đúng định dạng email."
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2 justify-center">
                  <Label htmlFor="gender">
                    Giới tính <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      setForm({ ...form, gender: value })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NAM">Nam</SelectItem>
                      <SelectItem value="NỮ">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">
                    Trạng thái <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ĐANG_HỌC">Đang học</SelectItem>
                      <SelectItem value="ĐÃ_TỐT_NGHIỆP">
                        Đã tốt nghiệp
                      </SelectItem>
                      <SelectItem value="BẢO_LƯU">Bảo lưu</SelectItem>
                      <SelectItem value="THÔI_HỌC">Thôi học</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {!checkEdit && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      placeholder="Nhập username"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      onBlur={(e) => validateField("username", e.target.value)}
                      required={!checkEdit}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      onBlur={(e) => validateField("password", e.target.value)}
                      required={!checkEdit}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="class">Lớp</Label>
                  <ClassSelect
                    options={classOptions}
                    value={classOptions.find(
                      (opt) => opt.value === form.classId
                    )}
                    onChange={(selected) => {
                      setForm({
                        ...form,
                        classId: selected?.value || "",
                        className: selected?.label || "",
                      });
                    }}
                    placeholder="Chọn lớp..."
                    isClearable
                    isSearchable
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => onClose()}
              >
                Hủy
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                type="submit"
              >
                {checkEdit ? "Cập nhật" : "Thêm sinh viên"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddStudent;
