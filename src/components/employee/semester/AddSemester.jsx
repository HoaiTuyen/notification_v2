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
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: semester?.id || "",
    nameSemester: semester?.nameSemester || "",
    academicYear: semester?.academicYear || "",
    startDate: semester?.startDate?.slice(0, 10) || "",
    endDate: semester?.endDate?.slice(0, 10) || "",
  });
  const validateField = (field, value) => {
    let message = "";

    switch (field) {
      case "id":
        if (!value.trim()) message = "Mã học kỳ không được để trống";
        else if (value.length < 3) message = "Ít nhất 3 chữ số";
        else if (!/^[0-9]+$/.test(value)) message = "Chỉ được chứa số";
        break;
      case "nameSemester":
        if (!value.trim()) message = "Tên học kỳ không được để trống";
        else if (value.length < 3) message = "Ít nhất 3 ký tự";
        else if (!/^[\p{L}][\p{L}0-9 ]*$/u.test(value))
          message = "Phải bắt đầu bằng chữ, chỉ chứa chữ/số/khoảng trắng";
        break;
      case "academicYear":
        if (!value.trim()) message = "Niên khóa không được để trống";
        else if (!/^\d{4}-\d{4}$/.test(value))
          message = "Định dạng phải là yyyy-yyyy (VD: 2024-2025)";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idRegex = /^[0-9]+$/;
    const nameRegex = /^[\p{L}][\p{L}0-9 ]*$/u;
    const yearRegex = /^[0-9]{4}-[0-9]{4}$/;

    if (!form.id.trim()) {
      toast.error("Mã học kỳ không được để trống");
      return;
    }
    if (form.id.length < 3) {
      toast.error("Mã học kỳ ít nhất 3 ký tự");
      return;
    }
    if (!idRegex.test(form.id)) {
      toast.error("Mã học kỳ chỉ được chứa số");
      return;
    }

    if (!form.nameSemester.trim()) {
      toast.error("Tên học kỳ không được để trống");
      return;
    }
    if (form.nameSemester.trim().length < 3) {
      toast.error("Tên học kỳ ít nhất 3 ký tự");
      return;
    }
    if (!nameRegex.test(form.nameSemester.trim())) {
      toast.error(
        "Tên học kỳ phải bắt đầu bằng chữ và chỉ được chứa chữ cái, số hoặc khoảng trắng"
      );
      return;
    }

    if (!form.academicYear.trim()) {
      toast.error("Niên khóa không được để trống");
      return;
    }
    if (form.academicYear.trim().length < 8) {
      toast.error("Niên khóa ít nhất 8 ký tự");
      return;
    }
    if (!yearRegex.test(form.academicYear.trim())) {
      toast.error("Niên khóa phải có định dạng yyyy-yyyy, ví dụ: 2024-2025");
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast.error("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc");
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (start >= end) {
      toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
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
                <DialogTitle>Cập nhật học kỳ</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật học kỳ
                </DialogDescription>
              </DialogHeader>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Thêm học kỳ mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin về học kỳ mới
                </DialogDescription>
              </DialogHeader>
            </>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <p className="text-xs text-red-500 font-medium mb-1">
                Hướng dẫn đặt mã học kỳ: gồm 3 chữ số. Ví dụ:
                <br />• <strong>151</strong>: năm học 2015–2016 học kỳ 1<br />•{" "}
                <strong>152</strong>: năm học 2015–2016 học kỳ 2<br />•{" "}
                <strong>153</strong>: năm học 2015–2016 học kỳ hè
              </p>
              <Label htmlFor="semesterId">
                Mã học kỳ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="semesterId"
                value={form.id}
                onChange={(e) => {
                  setForm({ ...form, id: e.target.value });
                  if (errors.id) {
                    setErrors((prev) => ({ ...prev, id: "" }));
                  }
                }}
                onBlur={() => validateField("id", form.id)}
                required
                minLength={3}
                pattern="^[0-9]+$"
              />
              <p className="text-red-500 min-h-[20px] text-sm">
                {errors.id || "\u00A0"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nameSemester">
                  Tên học kỳ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameSemester"
                  value={form.nameSemester}
                  onChange={(e) => {
                    setForm({ ...form, nameSemester: e.target.value });
                    if (errors.nameSemester) {
                      setErrors((prev) => ({ ...prev, nameSemester: "" }));
                    }
                  }}
                  onBlur={() =>
                    validateField("nameSemester", form.nameSemester)
                  }
                  required
                  minLength={3}
                  pattern="^[\p{L}][\p{L}0-9 ]*$"
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.nameSemester || "\u00A0"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="academicYear">
                  Năm học <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="academicYear"
                  value={form.academicYear}
                  onChange={(e) => {
                    setForm({ ...form, academicYear: e.target.value });
                    if (errors.academicYear) {
                      setErrors((prev) => ({ ...prev, academicYear: "" }));
                    }
                  }}
                  onBlur={() =>
                    validateField("academicYear", form.academicYear)
                  }
                  required
                  pattern="^\d{4}-\d{4}$"
                />
                <p className="text-red-500 min-h-[20px] text-sm">
                  {errors.academicYear || "\u00A0"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nameSemester">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => {
                    setForm({ ...form, startDate: e.target.value });
                    if (errors.startDate) {
                      setErrors((prev) => ({ ...prev, startDate: "" }));
                    }
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => {
                    setForm({ ...form, endDate: e.target.value });
                    if (errors.endDate) {
                      setErrors((prev) => ({ ...prev, endDate: "" }));
                    }
                  }}
                  required
                />
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
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                type="submit"
              >
                {checkEdit ? "Cập nhật" : "Thêm học kỳ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddSemester;
