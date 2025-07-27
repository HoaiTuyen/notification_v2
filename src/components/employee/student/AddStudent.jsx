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

  const [form, setForm] = useState({
    id: student?.id || "",
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    status: student?.status || "ĐANG_HỌC",
    className: student?.className || "",
    classId: student?.classId || "",
    username: student?.username || "",
    password: student?.password || "",
    gender: student?.gender || "NAM",
    dateOfBirth: student?.dateOfBirth?.slice(0, 10) || "",
  });

  const fetchAllClasses = async () => {
    const pageSize = 10;
    let allClasses = [];
    let page = 0;
    let totalPages = 1;
    setLoading(true);
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
      setDataClass([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

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
        username: student?.username || "",
        password: student?.password || "",
        gender: student?.gender || "NAM",
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
        username: "",
        password: "",
        gender: "NAM",
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

      const payload = {
        ...form,
        classId: form.classId,
        username: form.username,
        password: form.password,
      };

      if (checkEdit) {
        const reqEdit = await handleUpdateStudent(payload);
        if (reqEdit?.status === 204) {
          toast.success(reqEdit.message || "Cập nhật sinh viên thành công");
          onSuccess();
          onClose();
        } else {
          toast.error(reqEdit?.message || "Cập nhật sinh viên thất bại");
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
  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[600px]">
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
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentId">
                  Mã sinh viên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentId"
                  placeholder="VD: SV001"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
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
                />
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
                />
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
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2 justify-center">
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
                    <SelectItem value="KHÁC">Khác</SelectItem>
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
                    <SelectItem value="ĐANG_HỌC">Đang học</SelectItem>
                    <SelectItem value="ĐÃ_TỐT_NGHIỆP">Đã tốt nghiệp</SelectItem>
                    <SelectItem value="BẢO_LƯU">Bảo lưu</SelectItem>
                    <SelectItem value="THÔI_HỌC">Thôi học</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className={checkEdit ? "hidden" : "grid grid-cols-2 gap-4"}>
              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Nhập username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
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
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Lớp</Label>
                <ClassSelect
                  options={classOptions}
                  value={classOptions.find((opt) => opt.value === form.classId)}
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
              onClick={handleSubmitAdd}
            >
              {checkEdit ? "Cập nhật" : "Thêm sinh viên"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddStudent;
