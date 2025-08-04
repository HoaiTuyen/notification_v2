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
import { jwtDecode } from "jwt-decode";
const AddGroup = ({ open, onClose, onSuccess, group }) => {
  const token = localStorage.getItem("access_token");
  console.log(token);
  const { userId } = jwtDecode(token);
  console.log(userId);
  const checkEdit = !!group?.id;
  const { setLoading } = useLoading();
  const [errors, setErrors] = useState({});

  const [listTeacher, setListTeacher] = useState([]);
  const [form, setForm] = useState({
    id: group?.id || "",
    name: group?.name || "",
    userId: userId,
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
    const nameRegex = /^[\p{L}][\p{L}0-9 ]*$/u;

    // Validate Tên nhóm
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      toast.error("Tên nhóm học tập không được để trống");
      return;
    }

    if (trimmedName.length < 5) {
      toast.error("Tên nhóm học tập ít nhất 5 ký tự");
      return;
    }

    if (!nameRegex.test(trimmedName)) {
      toast.error(
        "Tên nhóm học tập phải bắt đầu bằng chữ, các kí tự còn lại chứa chữ, số hoặc khoảng trắng (không ký tự đặc biệt)"
      );
      return;
    }
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
      console.log(res);
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
  const validateField = (field, value) => {
    let error = "";

    if (field === "name") {
      const trimmed = value.trim();
      if (!trimmed) error = "Tên nhóm học tập không được để trống";
      else if (trimmed.length < 5) error = "Tên nhóm học tập ít nhất 5 ký tự";
      else if (!/^[\p{L}][\p{L}0-9 ]*$/u.test(trimmed))
        error =
          "Tên nhóm học tập phải bắt đầu bằng chữ và chỉ chứa chữ, số, hoặc khoảng trắng";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  useEffect(() => {
    if (open && group?.id) {
      setForm({
        id: group?.id || "",
        name: group?.name || "",
        userId: userId || "",
      });
    } else {
      setForm({
        id: group?.id,
        name: "",
        userId: userId || "",
      });
    }
  }, [group, open]);
  useEffect(() => {
    fetchTeacher();
  }, []);
  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent
          className="sm:max-w-[550px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {checkEdit ? (
            <>
              <DialogHeader>
                <DialogTitle>Cập nhật nhóm học tập</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật về nhóm học tập
                </DialogDescription>
              </DialogHeader>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Thêm nhóm học tập</DialogTitle>
                <DialogDescription>
                  Nhập thông tin về nhóm học tập mới
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
                <Label htmlFor="nameGroup">Tên nhóm học tập(*)</Label>
                <Input
                  id="nameGroup"
                  type="text"
                  placeholder="Nhập tên nhóm học tập"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                  onBlur={(e) => validateField("name", e.target.value)}
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.name || "\u00A0"}
                </p>
              </div>
              {/* {checkEdit ? (
                <div className="grid gap-2"></div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="teacher">
                    Giáo viên phụ trách(*)
                  </Label>
                  <Select
                    value={form.userId}
                    onValueChange={(value) =>
                      setForm({ ...form, userId: value })
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
              )} */}
            </div>
          </div>

          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => onClose()}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
