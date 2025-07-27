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
  const { setLoading } = useLoading();
  const { validateForm, formatDate, minBirthDate, maxBirthDate } =
    useValidateLecturerForm();
  const [listDepartment, setListDepartment] = useState([]);
  const checkEdit = !!teacher?.id;
  const [form, setForm] = useState({
    id: teacher?.id || "",
    firstName: teacher?.firstName || "",
    lastName: teacher?.lastName || "",
    email: teacher?.email || "",
    dateOfBirth: teacher?.dateOfBirth?.slice(0, 10) || "",
    departmentId: teacher?.departmentId || "",
    departmentName: teacher?.departmentName || "",
    gender: teacher?.gender || "NAM",
    status: teacher?.status || "ĐANG_CÔNG_TÁC",
    username: teacher?.username || "",
    password: teacher?.password || "",
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
        status: teacher?.status || "ĐANG_CÔNG_TÁC",
        username: teacher?.username || "",
        password: teacher?.password || "",
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
        status: "ĐANG_CÔNG_TÁC",
        username: "",
        password: "",
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
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
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
                Nhập thông tin về giảng viên mới
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
                  placeholder="VD: GV001"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
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
              <div className="grid gap-2">
                <Label htmlFor="faculty">Khoa </Label>
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
                    <SelectItem value="ĐANG_CÔNG_TÁC">Đang công tác</SelectItem>
                    <SelectItem value="CHUYỂN_CÔNG_TÁC">
                      Chuyển công tác
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={checkEdit ? "hidden" : "grid gap-2"}>
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
              <div className={checkEdit ? "hidden" : "grid gap-2"}>
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
