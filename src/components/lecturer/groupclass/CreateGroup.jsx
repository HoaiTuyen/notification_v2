import React, { useEffect, useState } from "react";
import { BlockPicker } from "react-color";
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

import {
  handleAddGroup,
  handleUpdateGroup,
} from "../../../controller/GroupController";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { AwardIcon } from "lucide-react";
const DEFAULT_COLOR = "#4CAF50";
import { useLoading } from "../../../context/LoadingProvider";
const LecturerAddGroup = ({ open, onClose, onSuccess, group }) => {
  const { setLoading } = useLoading();
  const checkEdit = !!group?.id;
  const token = localStorage.getItem("access_token");
  const data = jwtDecode(token);
  const userId = data.userId;
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    id: group?.id || "",
    name: group?.name || "",
    userId: userId,
    code: "",
    color: DEFAULT_COLOR,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setLoading(true);
    const submitData = {
      ...form,
      color: form.color || DEFAULT_COLOR,
    };
    if (checkEdit) {
      const reqEdit = await handleUpdateGroup(submitData);
      console.log(reqEdit);

      if (reqEdit?.data || reqEdit?.status === 204) {
        onSuccess();
        toast.success(reqEdit.message || "Tạo nhóm thành công");

        onClose();
      } else {
        toast.error(reqEdit.message);
      }
    } else {
      const res = await handleAddGroup(submitData);
      if (res?.data && res?.status === 201) {
        toast.success(res.message || "Tạo nhóm thành công");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    if (open && group?.id) {
      setForm({
        id: group?.id || "",
        name: group?.name || "",
        userId: userId,
        code: "",
        color: group?.color || DEFAULT_COLOR,
      });
    } else {
      setForm({
        id: "",
        name: "",
        userId: userId,
        code: "",
        color: DEFAULT_COLOR,
      });
    }
  }, [group, open]);

  useEffect(() => {}, []);
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
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4">
                {/* <div className="grid gap-2">
                <Input
                  id="userId"
                  placeholder="VD: CNTT01"
                  value={form.userId}
                />
              </div> */}

                <div className="grid gap-2">
                  <Label htmlFor="nameGroup">Tên nhóm học tập</Label>
                  <Input
                    id="nameGroup"
                    type="text"
                    placeholder="Nhập tên nhóm học tập..."
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }
                    }}
                    required
                    onBlur={(e) => validateField("name", e.target.value)}
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.name || "\u00A0"}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onClose()}>
                Hủy
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
                Thêm nhóm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default LecturerAddGroup;
