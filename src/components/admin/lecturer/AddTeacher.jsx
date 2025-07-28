import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  handleAddTeacher,
  handleUpdateTeacher,
} from "@/controller/TeacherController";
import { toast } from "react-toastify";
import { handleListDepartment } from "../../../controller/DepartmentController";
import { useValidateLecturerForm } from "../../../hooks/useValidateForm";
import { useLoading } from "../../../context/LoadingProvider";
const AddTeacher = ({ open, onClose, teacher, onSuccess }) => {
  const { validateForm, formatDate, minBirthDate, maxBirthDate } =
    useValidateLecturerForm();
  const [listDepartment, setListDepartment] = useState([]);
  const [errors, setErrors] = useState({});

  const checkEdit = !!teacher?.id;
  const { setLoading } = useLoading();
  const [form, setForm] = useState({
    id: teacher?.id || "",
    firstName: teacher?.firstName || "",
    lastName: teacher?.lastName || "",
    email: teacher?.email || "",
    dateOfBirth: teacher?.dateOfBirth?.slice(0, 10) || "",
    departmentId: teacher?.departmentId || "",
    departmentName: teacher?.departmentName || "",
    gender: teacher?.gender || "NAM",
    username: teacher?.username || "",
    password: teacher?.password || "",
    status: teacher?.status || "ĐANG_CÔNG_TÁC",
  });
  useEffect(() => {
    if (open && teacher?.id) {
      setForm({
        id: teacher?.id || "",
        firstName: teacher?.firstName || "",
        lastName: teacher?.lastName || "",
        email: teacher?.email || "",
        dateOfBirth: teacher?.dateOfBirth?.slice(0, 10) || "",
        departmentId: teacher?.departmentId || "",
        departmentName: teacher?.departmentName || "",
        gender: teacher?.gender || "NAM",
        username: teacher?.username || "",
        password: teacher?.password || "",
        status: teacher?.status || "ĐANG_CÔNG_TÁC",
      });
    } else {
      setForm({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        departmentId: "",
        departmentName: "",
        gender: "NAM",
        username: "",
        password: "",
        status: "ĐANG_CÔNG_TÁC",
      });
    }
  }, [teacher, open]);
  const handleSubmit = async (e) => {
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
      if (checkEdit) {
        const reqEdit = await handleUpdateTeacher(form);

        if (reqEdit.status === 204) {
          onSuccess();
          onClose();
          toast.success(reqEdit.message);
        } else {
          toast.error(reqEdit.message || "Cập nhật giảng viên thất bại");
        }
      } else {
        const result = await handleAddTeacher(form);
        if (result.status === 201) {
          onClose();
          toast.success(result.message);
          onSuccess();
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error(error || "Đã xảy ra lỗi khi thêm giảng viên");
    } finally {
      setLoading(false);
    }
  };
  const fetchListDepartment = async () => {
    const list = await handleListDepartment();

    if (list?.data?.departments) {
      const data = list.data.departments;
      setListDepartment(data);
    }
  };
  useEffect(() => {
    fetchListDepartment();
  }, []);
  const validateField = (field, value) => {
    let message = "";
    const trimmed = value.trim();

    switch (field) {
      case "id":
        if (!trimmed) message = "Mã giảng viên không được để trống";
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
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className="sm:max-w-[600px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          {checkEdit ? (
            <>
              <DialogTitle>Cập nhật giảng viên</DialogTitle>
              <DialogDescription>
                Nhập thông tin cập nhật về giảng viên
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Thêm giảng viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin giảng viên mới
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="teacherId">
                  Mã giảng viên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="teacherId"
                  placeholder="Nhập mã giảng viên..."
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  onBlur={(e) => validateField("id", e.target.value)}
                  required
                  pattern="^[A-Z0-9_]+$"
                  title="Chỉ bao gồm chữ in hoa, số hoặc dấu gạch dưới"
                />
                {errors.id && (
                  <p className="text-red-500 text-sm">{errors.id}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  onBlur={(e) => validateField("firstName", e.target.value)}
                  required
                  pattern="^[\p{L} ]+$"
                  title="Họ chỉ được chứa chữ cái và khoảng trắng"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  onBlur={(e) => validateField("lastName", e.target.value)}
                  required
                  pattern="^[\p{L}]+$"
                  title="Tên chỉ được chứa chữ cái, không có số hoặc ký tự đặc biệt"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  onBlur={(e) => validateField("email", e.target.value)}
                  pattern="^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$"
                  title="Email phải đúng định dạng: example@domain.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
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
                  onBlur={(e) => validateField("dateOfBirth", e.target.value)}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">Khoa</Label>
                <Select
                  value={form.departmentId}
                  onValueChange={(value) =>
                    setForm({ ...form, departmentId: value })
                  }
                >
                  <SelectTrigger id="faculty">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {listDepartment.map((department, index) => (
                      <SelectItem key={index} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">
                  Giới tính <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.gender}
                  onValueChange={(value) => setForm({ ...form, gender: value })}
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
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ĐANG_CÔNG_TÁC">Đang công tác</SelectItem>
                    <SelectItem value="CHUYỂN_CÔNG_TÁC">
                      Chuyển công tác
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!checkEdit && (
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
                    required
                    onBlur={(e) => validateField("username", e.target.value)}
                    pattern="^[a-zA-Z0-9._-]{4,}$"
                    title="Username phải có ít nhất 4 ký tự, không có dấu hoặc ký tự đặc biệt lạ"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>
              )}
              <div className={checkEdit ? "hidden" : "grid gap-2"}>
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  onBlur={(e) => validateField("password", e.target.value)}
                  pattern=".{6,}"
                  title="Mật khẩu phải có ít nhất 6 ký tự"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {checkEdit ? "Cập nhật" : "Thêm giảng viên"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacher;
