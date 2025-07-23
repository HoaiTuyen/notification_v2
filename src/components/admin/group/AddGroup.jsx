import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleListTeacher } from "../../../controller/TeacherController";
import {
  handleAddGroup,
  handleUpdateGroup,
} from "../../../controller/GroupController";
import { toast } from "react-toastify";
import { AwardIcon } from "lucide-react";
import { useLoading } from "../../../context/LoadingProvider";
const AddGroup = ({ open, onClose, onSuccess, group }) => {
  const checkEdit = !!group?.id;

  const { setLoading } = useLoading();

  const [listTeacher, setListTeacher] = useState([]);
  const [form, setForm] = useState({
    id: group?.id || "",
    name: group?.name || "",
    teacherId: "",
    code: "",
  });
  const fetchTeacher = async () => {
    const pageSize = 10;
    let allTeachers = [];
    let page = 0;
    let totalPages = 1;
    try {
      do {
        const res = await handleListTeacher(page, pageSize);
        console.log(res);
        if (res?.data?.teachers) {
          allTeachers = [...allTeachers, ...res.data.teachers];
          totalPages = res.data.totalPages;
          page++;
        } else {
          break; // stop if bad data
        }
      } while (page < totalPages);
      if (allTeachers) {
        console.log(allTeachers);
        setListTeacher(allTeachers);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmit = async () => {
    if (checkEdit) {
      setLoading(true);
      const reqEdit = await handleUpdateGroup(form);
      console.log(reqEdit);

      if (reqEdit?.data || reqEdit?.status === 204) {
        onSuccess();
        toast.success(reqEdit.message || "Tạo nhóm thành công");
        onClose();
      } else {
        toast.error(reqEdit.message);
      }
      setLoading(false);
    } else {
      setLoading(true);
      const res = await handleAddGroup(form);
      if (res?.data && res?.status === 201) {
        onSuccess();
        toast.success(res.message || "Tạo nhóm thành công");
        onClose();
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open && group?.id) {
      setForm({
        id: group?.id || "",
        name: group?.name || "",
        teacherId: "",
        code: "",
      });
    } else {
      setForm({
        id: "",
        name: "",
        teacherId: "",
        code: "",
      });
    }
  }, [group, open]);
  useEffect(() => {
    fetchTeacher();
  }, []);
  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[550px]">
          {checkEdit ? (
            <>
              <DialogHeader>
                <DialogTitle>Cập nhật nhóm</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật về nhóm
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

          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="groupId">Mã nhóm</Label>
                <Input id="groupId" placeholder="VD: CNTT01" />
              </div> */}

              <div className="grid gap-2">
                <Label htmlFor="nameGroup">Tên nhóm</Label>
                <Input
                  id="nameGroup"
                  type="text"
                  placeholder="Nhập tên nhóm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {checkEdit ? (
                <div className="grid gap-2"></div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="teacher">Giáo viên</Label>
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
                      {listTeacher.map((teacher, index) => (
                        <SelectItem key={index} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
              {checkEdit ? "Cập nhật" : "Thêm nhóm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddGroup;
