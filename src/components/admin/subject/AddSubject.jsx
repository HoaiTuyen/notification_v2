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
  handleAddSubject,
  handleUpdateSubject,
} from "../../../controller/SubjectController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const AddSubject = ({ open, onClose, onSuccess, subject }) => {
  const checkEdit = !!subject?.id;
  const { setLoading } = useLoading();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: subject?.id || "",
    name: subject?.name || "",
    credit: subject?.credit || "",
  });
  console.log(form);
  useEffect(() => {
    if (subject?.id) {
      setForm({
        id: subject?.id || "",
        name: subject?.name || "",
        credit: subject?.credit || "",
      });
    } else {
      setForm({
        id: "",
        name: "",
        credit: "",
      });
    }
  }, [subject]);
  const handleAdd = async (e) => {
    e.preventDefault();
    const idRegex = /^[A-Za-z][A-Za-z0-9]*$/;
    const nameRegex = /^[\p{L}][\p{L}0-9 ]*$/u;

    // Validate mã môn học
    if (!form.id.trim()) {
      toast.error("Mã môn học không được để trống");
      return;
    }
    if ((form.id || "").trim().length < 7) {
      toast.error("Mã môn học ít nhất 7 ký tự");
      return;
    }
    if (!idRegex.test(form.id)) {
      toast.error("Mã môn học phải bắt đầu bằng chữ");
      return;
    }

    // Validate tên môn học
    if (!form.name.trim()) {
      toast.error("Tên môn học không được để trống");
      return;
    }
    if (form.name.trim().length < 3) {
      toast.error("Tên môn học ít nhất 3 ký tự");
      return;
    }
    if (!nameRegex.test(form.name.trim())) {
      toast.error("Tên môn học phải bắt đầu bằng chữ");
      return;
    }

    // Validate số tín chỉ
    const creditNumber = parseInt(form.credit, 10);
    if (isNaN(creditNumber)) {
      toast.error("Số tín chỉ không hợp lệ");
      return;
    }
    if (creditNumber < 1) {
      toast.error("Số tín chỉ phải lớn hơn hoặc bằng 1");
      return;
    }
    if (creditNumber > 15) {
      toast.error("Số tín chỉ không được lớn hơn 15");
      return;
    }

    if (checkEdit) {
      setLoading(true);
      const resEdit = await handleUpdateSubject(form);
      console.log(resEdit);

      if (resEdit?.data || resEdit?.status === 204) {
        onSuccess();
        toast.success(resEdit.message || "Cập nhật học thành công");
        onClose();
      } else {
        toast.error(resEdit.message || "Lỗi");
      }
      setLoading(false);
    } else {
      setLoading(true);
      const res = await handleAddSubject(form);
      if (res?.data && res?.status === 201) {
        onClose();
        toast.success(res.message || "Thêm môn học thành công");
        onSuccess();
      } else {
        toast.error(res.message || "Lỗi");
      }
      setLoading(false);
    }
  };
  const validateField = (field, value) => {
    let error = "";

    if (field === "id") {
      if (!value.trim()) error = "Mã môn học không được để trống";
      else if (value.length < 7) error = "Mã môn học ít nhất 7 ký tự";
      else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value))
        error = "Mã môn học phải bắt đầu bằng chữ cái và chỉ gồm chữ hoặc số";
    }

    if (field === "name") {
      if (!value.trim()) error = "Tên môn học không được để trống";
      else if (value.length < 3) error = "Tên môn học ít nhất 3 ký tự";
      else if (!/^[\p{L}][\p{L}0-9 ]*$/u.test(value))
        error = "Tên môn học chỉ được chứa chữ cái, số và khoảng trắng";
    }

    if (field === "credit") {
      const num = parseInt(value, 10);

      if (isNaN(num)) error = "Số tín chỉ không hợp lệ";
      else if (num < 1) error = "Tín chỉ phải >= 1";
      else if (num > 15) error = "Tín chỉ không được vượt quá 15";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => !val && onClose()}
        className="cursor-pointer"
      >
        <DialogContent
          className="sm:max-w-[600px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            {checkEdit ? (
              <>
                <DialogTitle>Cập nhật môn học</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật về môn học
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Thêm môn học mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết về môn học mới
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <form onSubmit={handleAdd}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subjectId">Mã môn học</Label>
                  <Input
                    id="subjectId"
                    placeholder="VD: CS03030"
                    disabled={checkEdit}
                    value={form.id}
                    onChange={(e) => {
                      setForm({ ...form, id: e.target.value });
                      if (errors.id) {
                        setErrors((prev) => ({ ...prev, id: "" }));
                      }
                    }}
                    required
                    minLength={7}
                    pattern="^[A-Za-z][A-Za-z0-9]*$"
                    title="Mã môn học phải bắt đầu bằng chữ cái, chỉ chứa chữ cái hoặc số, và ít nhất 7 ký tự"
                    onBlur={(e) => validateField("id", e.target.value)}
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.id || "\u00A0"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nameSubject">Tên môn học</Label>
                  <Input
                    id="nameSubject"
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }
                    }}
                    required
                    minLength={3}
                    pattern="^[\p{L}][\p{L}0-9 ]*$"
                    title="Tên môn học phải bắt đầu bằng chữ cái, chỉ chứa chữ, số và khoảng trắng, và ít nhất 3 ký tự"
                    onBlur={(e) => validateField("name", e.target.value)}
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.name || "\u00A0"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credit">Số tín chỉ</Label>
                  <Input
                    id="credit"
                    type="text"
                    value={form.credit}
                    onChange={(e) => {
                      setForm({ ...form, credit: e.target.value });
                      if (errors.credit) {
                        setErrors((prev) => ({ ...prev, credit: "" }));
                      }
                    }}
                    required
                    min={1}
                    max={15}
                    title="Số tín chỉ phải từ 1 đến 15"
                    onBlur={(e) => validateField("credit", e.target.value)}
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.credit || "\u00A0"}
                  </p>
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
                type="submit"
              >
                {checkEdit ? "Cập nhật" : "Thêm môn học"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddSubject;
