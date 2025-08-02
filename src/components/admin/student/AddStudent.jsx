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
import { Eye, EyeOff } from "lucide-react";
const AddStudent = ({ open, onClose, onSuccess, student }) => {
  const checkEdit = !!student?.id;
  const [dataClass, setDataClass] = useState([]);
  const { validateForm, formatDate, minBirthDate, maxBirthDate } =
    useValidateStudentForm();
  const { setLoading } = useLoading();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
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
                  <Label htmlFor="studentId">Mã sinh viên(*)</Label>
                  <Input
                    id="studentId"
                    placeholder="VD: DH52112031"
                    value={form.id}
                    onChange={(e) => {
                      setForm({ ...form, id: e.target.value });
                      if (errors.id) {
                        setErrors((prev) => ({ ...prev, id: "" }));
                      }
                    }}
                    onBlur={(e) => validateField("id", e.target.value)}
                    required
                    pattern="^[A-Z][A-Za-z0-9]*$"
                    title="Mã sinh viên phải bắt đầu bằng chữ, các kí tự còn lại chứa chữ hoặc số"
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.id || "\u00A0"}
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
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                    required
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.dateOfBirth || "\u00A0"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Họ(*)</Label>
                  <Input
                    id="lastName"
                    placeholder="Nhập họ sinh viên"
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
                    title="Họ chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt"
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.firstName || "\u00A0"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Tên(*)</Label>
                  <Input
                    id="firstName"
                    placeholder="Nhập tên sinh viên"
                    value={form.lastName}
                    onChange={(e) => {
                      setForm({ ...form, lastName: e.target.value });
                      if (errors.lastName) {
                        setErrors((prev) => ({ ...prev, lastName: "" }));
                      }
                    }}
                    onBlur={(e) => validateField("lastName", e.target.value)}
                    required
                    pattern="^[a-zA-ZÀ-ỹ]+$"
                    title="Tên chỉ được chứa chữ cái, không được chứa số hoặc ký tự đặc biệt"
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.lastName || "\u00A0"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email(*)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.edu.vn"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    onBlur={(e) => validateField("email", e.target.value)}
                    required
                    title="Email không hợp lệ. Vui lòng nhập đúng định dạng email."
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.email || "\u00A0"}
                  </p>
                </div>
                <div className="grid gap-2 justify-center">
                  <Label htmlFor="gender">Giới tính(*)</Label>
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
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.gender || "\u00A0"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Trạng thái(*)</Label>
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
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm min-h-[20px] text-red-500">
                      {errors.password || "\u00A0"}
                    </p>
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
                onClick={() => {
                  onClose();
                  setErrors({});
                  setForm({
                    id: "",
                    username: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    gender: "NAM",
                    status: "ĐANG_HỌC",
                    classId: "",
                    className: "",
                  });
                }}
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
