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
import { Eye, EyeOff } from "lucide-react";
const AddTeacher = ({ open, onClose, teacher, onSuccess }) => {
  const { validateForm, formatDate, minBirthDate, maxBirthDate } =
    useValidateLecturerForm();
  const [listDepartment, setListDepartment] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    const trimmed = value?.trim?.() || "";

    const idRegex = /^[A-Z][A-Z0-9]*$/;
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isCapitalized = (str) => {
      return str
        .split(" ")
        .every(
          (word) =>
            word.length > 0 &&
            word[0] === word[0].toUpperCase() &&
            word.slice(1) === word.slice(1).toLowerCase()
        );
    };

    switch (field) {
      case "id":
        if (!trimmed) {
          message = "Mã sinh viên không được để trống";
        } else if (trimmed.length < 10) {
          message = "Mã sinh viên phải ít nhất 10 ký tự";
        } else if (!idRegex.test(trimmed)) {
          message =
            "Mã sinh viên phải bắt đầu bằng chữ in hoa và chỉ gồm chữ in hoa và số";
        }
        break;

      case "firstName":
        if (!trimmed) {
          message = "Họ không được để trống";
        } else if (trimmed.length < 3) {
          message = "Họ phải ít nhất 3 ký tự";
        } else if (!nameRegex.test(trimmed)) {
          message =
            "Họ chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt";
        } else if (!isCapitalized(trimmed)) {
          message =
            "Họ phải viết hoa chữ cái đầu của mỗi từ (ví dụ: 'Nguyen Van')";
        }
        break;

      case "lastName":
        if (!trimmed) {
          message = "Tên không được để trống";
        } else if (trimmed.length < 1) {
          message = "Tên phải ít nhất 1 ký tự";
        } else if (!nameRegex.test(trimmed)) {
          message =
            "Tên chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt";
        } else if (!isCapitalized(trimmed)) {
          message = "Tên phải viết hoa chữ cái đầu của mỗi từ (ví dụ: 'An')";
        }
        break;

      case "email":
        if (!trimmed) {
          message = "Email không được để trống";
        } else if (!emailRegex.test(trimmed)) {
          message = "Email không hợp lệ. Vui lòng nhập đúng định dạng email.";
        }
        break;

      case "username":
        if (!trimmed) {
          message = "Username không được để trống";
        }
        break;

      case "password":
        if (!trimmed) {
          message = "Mật khẩu không được để trống";
        } else if (trimmed.length < 6) {
          message = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        break;

      case "dateOfBirth":
        if (!validateBirthDate(trimmed, minAge, minBirthDate)) {
          message = birthMsg;
        }
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
                <Label htmlFor="teacherId">Mã giảng viên(*)</Label>
                <Input
                  id="teacherId"
                  placeholder="Nhập mã giảng viên..."
                  value={form.id}
                  onChange={(e) => {
                    setForm({ ...form, id: e.target.value });
                    if (errors.id) {
                      setErrors((prev) => ({ ...prev, id: "" }));
                    }
                  }}
                  onBlur={(e) => validateField("id", e.target.value)}
                  required
                  pattern="^[A-Z0-9_]+$"
                  title="Chỉ bao gồm chữ in hoa, số hoặc dấu gạch dưới"
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.id || "\u00A0"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">Họ(*)</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Nhập họ..."
                  value={form.firstName}
                  onChange={(e) => {
                    setForm({ ...form, firstName: e.target.value });
                    if (errors.firstName) {
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }
                  }}
                  onBlur={(e) => validateField("firstName", e.target.value)}
                  required
                  pattern="^[\p{L} ]+$"
                  title="Họ chỉ được chứa chữ cái và khoảng trắng"
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.firstName || "\u00A0"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Tên(*)</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Nhập tên..."
                  value={form.lastName}
                  onChange={(e) => {
                    setForm({ ...form, lastName: e.target.value });
                    if (errors.lastName) {
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }
                  }}
                  onBlur={(e) => validateField("lastName", e.target.value)}
                  required
                  pattern="^[\p{L}]+$"
                  title="Tên chỉ được chứa chữ cái, không có số hoặc ký tự đặc biệt"
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.lastName || "\u00A0"}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email(*)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="VD: example@domain.com..."
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  required
                  onBlur={(e) => validateField("email", e.target.value)}
                  pattern="^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$"
                  title="Email phải đúng định dạng: example@domain.com"
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.email || "\u00A0"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Ngày sinh(*)</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  min={formatDate(minBirthDate)}
                  max={formatDate(maxBirthDate)}
                  onChange={(e) => {
                    setForm({ ...form, dateOfBirth: e.target.value });
                    if (errors.dateOfBirth) {
                      setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                    }
                  }}
                  required
                  onBlur={(e) => validateField("dateOfBirth", e.target.value)}
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.dateOfBirth || "\u00A0"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">Khoa</Label>
                <Select
                  value={form.departmentId}
                  onValueChange={(value) => {
                    setForm({ ...form, departmentId: value });
                    if (errors.departmentId) {
                      setErrors((prev) => ({ ...prev, departmentId: "" }));
                    }
                  }}
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
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.departmentId || "\u00A0"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Giới tính(*)</Label>
                <Select
                  value={form.gender}
                  onValueChange={(value) => {
                    setForm({ ...form, gender: value });
                    if (errors.gender) {
                      setErrors((prev) => ({ ...prev, gender: "" }));
                    }
                  }}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NAM">Nam</SelectItem>
                    <SelectItem value="NỮ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.gender || "\u00A0"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Trạng thái(*)</Label>
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
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.status || "\u00A0"}
                </p>
              </div>
            </div>
            {!checkEdit && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username(*)</Label>
                  <Input
                    id="username"
                    placeholder="Nhập username"
                    value={form.username}
                    onChange={(e) => {
                      setForm({ ...form, username: e.target.value });
                      if (errors.username) {
                        setErrors((prev) => ({ ...prev, username: "" }));
                      }
                    }}
                    onBlur={(e) => validateField("username", e.target.value)}
                    required={!checkEdit}
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.username || "\u00A0"}
                  </p>
                </div>
                <div className="grid gap-2 relative">
                  <Label htmlFor="password">Password(*)</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }));
                        }
                      }}
                      onBlur={() => validateField("password", form.password)}
                      required
                      minLength={6}
                      title="Mật khẩu phải có ít nhất 6 ký tự"
                      className="pr-10"
                    />
                    <div
                      className="absolute right-2 top-2.5 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                  </div>
                  <p className="text-sm min-h-[20px] text-red-500">
                    {errors.password || "\u00A0"}
                  </p>
                </div>
              </div>
            )}
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
