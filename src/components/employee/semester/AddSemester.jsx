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
import { Textarea } from "@/components/ui/textarea";

import { toast } from "react-toastify";
import {
  handleAddSemester,
  handleUpdateSemester,
} from "../../../controller/SemesterController";
import { useLoading } from "../../../context/LoadingProvider";
const AddSemester = ({ open, onClose, onSuccess, semester }) => {
  const { setLoading } = useLoading();

  const checkEdit = !!semester?.id;

  const [form, setForm] = useState({
    id: semester?.id || "",
    nameSemester: semester?.nameSemester || "",
    academicYear: semester?.academicYear || "",
    startDate: semester?.startDate?.slice(0, 10) || "",
    endDate: semester?.endDate?.slice(0, 10) || "",
  });
  //   const checkEdit = !!group?.id;

  //   const [listTeacher, setListTeacher] = useState([]);
  //   const [form, setForm] = useState({
  //     id: group?.id || "",
  //     name: group?.name || "",
  //     teacherId: "",
  //     code: "",
  //   });
  //   const fetchTeacher = async () => {
  //     const teacher = await handleListTeacher();

  //     if (teacher?.data) {
  //       setListTeacher(teacher.data.teachers);
  //     }
  //   };
  //   const handleSubmit = async () => {
  //     if (checkEdit) {
  //       const reqEdit = await handleUpdateGroup(form);
  //       console.log(reqEdit);

  //       if (reqEdit?.data || reqEdit?.status === 204) {
  //         onSuccess();
  //         toast.success(reqEdit.message || "Tạo nhóm thành công");
  //         onClose();
  //       } else {
  //         toast.error(reqEdit.message);
  //       }
  //     } else {
  //       const res = await handleAddGroup(form);
  //       if (res?.data && res?.status === 201) {
  //         onSuccess();
  //         toast.success(res.message || "Tạo nhóm thành công");
  //         onClose();
  //       } else {
  //         toast.error(res.message);
  //       }
  //     }
  //   };
  //   useEffect(() => {
  //     if (open && group?.id) {
  //       setForm({
  //         id: group?.id || "",
  //         name: group?.name || "",
  //         teacherId: "",
  //         code: "",
  //       });
  //     } else {
  //       setForm({
  //         id: "",
  //         name: "",
  //         teacherId: "",
  //         code: "",
  //       });
  //     }
  //   }, [group, open]);
  //   useEffect(() => {
  //     fetchTeacher();
  //   }, []);
  const handleSubmit = async () => {
    if (
      !form.id ||
      !form.academicYear ||
      !form.nameSemester ||
      !form.startDate ||
      !form.endDate
    ) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (start >= end) {
      toast.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      return;
    }
    if (checkEdit) {
      setLoading(true);
      const reqEdit = await handleUpdateSemester(form);
      if (reqEdit?.data || reqEdit?.status === 204) {
        onSuccess();
        toast.success(reqEdit.message || "Cập nhật học kỳ thành công");
        onClose();
      } else {
        toast.error(reqEdit.message);
      }
      setLoading(false);
    } else {
      setLoading(true);
      const res = await handleAddSemester(form);
      if (res?.data) {
        onSuccess();
        toast.success(res.message || "Thêm học kỳ thành công");
        onClose();
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (semester?.id && open) {
      setForm({
        id: semester?.id || "",
        nameSemester: semester?.nameSemester || "",
        academicYear: semester?.academicYear || "",
        startDate: semester?.startDate?.slice(0, 10) || "",
        endDate: semester?.endDate.slice(0, 10) || "",
      });
    } else {
      setForm({
        id: "",
        nameSemester: "",
        academicYear: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [semester, open]);
  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[550px]">
          {checkEdit ? (
            <>
              <DialogHeader>
                <DialogTitle>Cập nhật nhóm</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật nhóm
                </DialogDescription>
              </DialogHeader>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Thêm nhóm mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết về nhóm mới
                </DialogDescription>
              </DialogHeader>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="semesterId">Mã học kỳ</Label>
            <Input
              id="semesterId"
              placeholder="VD: 211"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nameSemester">Tên học kỳ</Label>
              <Input
                id="nameSemester"
                type="text"
                placeholder="Nhập học kỳ..."
                value={form.nameSemester}
                onChange={(e) =>
                  setForm({ ...form, nameSemester: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="academicYear">Năm học</Label>
              <Input
                id="academicYear"
                type="text"
                placeholder="VD: 2024-2025"
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nameSemester">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onClose()}>
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
            >
              {checkEdit ? "Cập nhật" : "Thêm học kỳ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddSemester;
