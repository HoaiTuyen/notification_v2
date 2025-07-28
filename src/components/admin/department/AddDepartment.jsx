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
import {
  handleAddDepartment,
  handleUpdateDepartment,
} from "../../../controller/DepartmentController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const AddDepartment = ({ open, onClose, onSuccess, department }) => {
  const checkEdit = !!department?.id;
  const { setLoading } = useLoading();
  const [form, setForm] = useState({
    id: department?.id || "",
    name: department?.name || "",
    description: department?.description || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department?.id) {
      setForm({
        id: department.id,
        name: department.name,
        description: department.description,
      });
    } else {
      setForm({
        id: "",
        name: "",
        description: "",
      });
    }
  }, [department]);
  const validateField = (field, value) => {
    let error = "";

    if (field === "id") {
      if (!value.trim()) error = "Mã khoa không được để trống";
      else if (value.length < 4) error = "Mã khoa ít nhất 4 ký tự";
      else if (value.length > 10) error = "Mã khoa không được quá 10 ký tự";
      else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value))
        error = "Mã khoa phải bắt đầu bằng chữ cái và chỉ gồm chữ cái hoặc số";
    }

    if (field === "name") {
      if (!value.trim()) error = "Tên khoa không được để trống";
      else if (value.length < 5) error = "Tên khoa ít nhất 5 ký tự";
      else if (!/^[\p{L} ]+$/u.test(value))
        error = "Tên khoa chỉ chứa chữ cái và khoảng trắng";
    }

    if (field === "description") {
      if (value.trim() && countWords(value) < 3)
        error = "Mô tả phải chứa ít nhất 3 từ";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Validate mã khoa
      if (!form.id.trim()) {
        toast.error("Mã khoa không được để trống");
        setLoading(false);
        return;
      }
      if (form.id.length < 4) {
        toast.error("Mã khoa ít nhất 4 ký tự");
        setLoading(false);
        return;
      }
      if (!/^[A-Za-z][A-Za-z0-9]*$/.test(form.id)) {
        toast.error(
          "Mã khoa phải bắt đầu bằng chữ cái và chỉ được chứa chữ cái hoặc số"
        );
        setLoading(false);
        return;
      }
      if (form.id.length > 10) {
        toast.error("Mã khoa không được quá 10 ký tự");
        setLoading(false);
        return;
      }

      // Validate tên khoa
      if (!form.name.trim()) {
        toast.error("Tên khoa không được để trống");
        setLoading(false);
        return;
      }
      if (form.name.length < 5) {
        toast.error("Tên khoa ít nhất 5 ký tự");
        setLoading(false);
        return;
      }
      if (!/^[\p{L} ]+$/u.test(form.name)) {
        toast.error(
          "Tên khoa chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt"
        );
        setLoading(false);
        return;
      }

      if (checkEdit) {
        const reqEdit = await handleUpdateDepartment(form);
        console.log(reqEdit);

        if (reqEdit && reqEdit.status === 204) {
          onClose();
          onSuccess();
          toast.success(reqEdit.message || "Cập nhật khoa thành công");
        } else {
          toast.error(reqEdit.message || "Cập nhật khoa thất bại");
        }
      } else {
        const response = await handleAddDepartment(form);
        console.log(response);

        if (response?.data && response.status === 201) {
          onClose();
          onSuccess();
          toast.success(response.message || "Thêm khoa thành công");
        } else {
          toast.error(response.message || "Thêm khoa thất bại 1111");
        }
      }
    } catch (error) {
      if (error) {
        toast.error(error.message || "Thêm khoa thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent
          className="sm:max-w-[550px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            {checkEdit ? (
              <>
                <DialogTitle>Cập nhật khoa</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật khoa
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Thêm khoa mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin về khoa mới
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmitAdd}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="departmentId">
                    Mã khoa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="departmentId"
                    placeholder="VD: CNTT"
                    value={form.id}
                    disabled={checkEdit}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    required
                    minLength={4}
                    maxLength={10}
                    onBlur={(e) => validateField("id", e.target.value)}
                    title="Mã khoa phải bắt đầu bằng chữ, chỉ chứa chữ cái hoặc số, dài từ 4–10 ký tự"
                  />
                  {errors.id && (
                    <p className="text-red-500 text-sm">{errors.id}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nameDepartment">
                    Tên khoa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nameDepartment"
                    type="text"
                    placeholder="Nhập tên khoa"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    minLength={5}
                    onBlur={(e) => validateField("name", e.target.value)}
                    title="Tên khoa chỉ được chứa chữ cái và khoảng trắng, không chứa số hoặc ký tự đặc biệt"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn về khoa"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="max-h-[100px] overflow-y-auto"
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
                type="submit"
              >
                {checkEdit ? "Cập nhật" : "Thêm khoa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddDepartment;
