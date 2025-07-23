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
import { handleListTeacher } from "../../../controller/TeacherController";
import { handleListDepartment } from "../../../controller/DepartmentController";
import {
  handleAddClass,
  handleUpdateClass,
} from "../../../controller/ClassController";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const AddClass = ({ open, onClose, onSuccess, classRoom }) => {
  const { setLoading } = useLoading();

  const checkEdit = !!classRoom?.id;
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    id: classRoom?.id || "",
    name: classRoom?.name || "",
    description: classRoom?.description || "",
    teacherId: classRoom?.teacherId || "",
    departmentId: classRoom?.departmentId || "",
  });

  const listTeacher = async () => {
    const res = await handleListTeacher();
    console.log(res);

    if (res?.data && res?.status === 200) {
      setTeachers(res.data.teachers);
    }
  };
  const listDepartment = async () => {
    const res = await handleListDepartment();
    if (res?.data && res?.status === 200) {
      setDepartments(res.data.departments);
    }
  };
  useEffect(() => {
    if (open && classRoom?.id) {
      setForm({
        id: classRoom?.id || "",
        name: classRoom?.name || "",
        description: classRoom?.description || "",
        teacherId: classRoom?.teacherId || "",
        departmentId: classRoom?.departmentId || "",
      });
    } else {
      setForm({
        id: "",
        name: "",
        description: "",
        teacherId: "",
        departmentId: "",
      });
    }
  }, [open, classRoom]);
  const handleSubmit = async () => {
    if (checkEdit) {
      setLoading(true);
      const resEdit = await handleUpdateClass(form);
      console.log(resEdit);

      if (resEdit?.data || resEdit?.status === 204) {
        onSuccess();
        toast.success(resEdit?.message || "Cập nhật lớp thành công");
        onClose();
      } else {
        toast.error(resEdit?.message);
      }
      setLoading(false);
    } else {
      setLoading(true);
      const resAdd = await handleAddClass(form);
      console.log(resAdd);

      if (resAdd?.data && resAdd?.status === 201) {
        onSuccess();
        toast.success(resAdd?.message || "Thêm lớp thành công");
        onClose();
      } else {
        toast.error(resAdd?.message);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    listTeacher();
    listDepartment();
  }, []);
  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[600px]">
          {checkEdit ? (
            <DialogHeader>
              <DialogTitle>Cập nhật lớp</DialogTitle>
              <DialogDescription>
                Nhập thông tin cập nhật về lớp
              </DialogDescription>
            </DialogHeader>
          ) : (
            <DialogHeader>
              <DialogTitle>Thêm lớp mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết về lớp mới
              </DialogDescription>
            </DialogHeader>
          )}
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="classId">Mã lớp</Label>
                <Input
                  id="classId"
                  placeholder="VD: CNTT01"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={checkEdit}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameClass">Tên lớp</Label>
                <Input
                  id="nameClass"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameDescription">Mô tả</Label>
                <Textarea
                  id="nameDescription"
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="">Giáo viên phụ trách</Label>
                <Select
                  value={form.teacherId}
                  onValueChange={(value) =>
                    setForm({ ...form, teacherId: value })
                  }
                >
                  <SelectTrigger id="faculty">
                    <SelectValue placeholder="Chọn giáo viên..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.length === 0 ? (
                      <SelectItem>Trống</SelectItem>
                    ) : (
                      teachers.map((teacher, index) => (
                        <SelectItem key={index} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="">Khoa</Label>
                <Select
                  value={form.departmentId}
                  onValueChange={(value) =>
                    setForm({ ...form, departmentId: value })
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.length === 0 ? (
                      <SelectItem>Trống</SelectItem>
                    ) : (
                      departments.map((department, index) => (
                        <SelectItem key={index} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onClose()}>
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleSubmit()}
            >
              {checkEdit ? "Cập nhật" : "Thêm lớp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddClass;
