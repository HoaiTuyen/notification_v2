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
  handleAddAcademic,
  handleUpdateAcademic,
} from "../../../controller/AcademicController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";

const AddAcademic = ({ open, onClose, onSuccess, academic }) => {
  const checkEdit = !!academic?.id;
  const { setLoading } = useLoading();

  const [form, setForm] = useState({
    id: academic?.id || "",
    name: academic?.name || "",
  });

  const [errorId, setErrorId] = useState("");
  const [errorName, setErrorName] = useState("");

  const idPattern = /^[A-Z0-9][A-Z0-9-]*$/;
  const namePattern = /^[\p{L}0-9\s-]+$/u;

  useEffect(() => {
    if (academic?.id) {
      setForm({
        id: academic.id,
        name: academic.name,
      });
    } else {
      setForm({
        id: "",
        name: "",
      });
    }
    setErrorId("");
    setErrorName("");
  }, [academic]);

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();

    // Validate ID
    if (!form.id) {
      setErrorId("Mã niên khoá không được để trống.");
      return;
    } else if (!idPattern.test(form.id)) {
      setErrorId(
        "Mã niên khoá phải bắt đầu bằng chữ in hoa hoặc số, chỉ chứa chữ in hoa, số và dấu gạch ngang."
      );
      return;
    }

    // Validate Name
    if (!trimmedName) {
      setErrorName("Tên niên khoá không được để trống.");
      return;
    } else if (!namePattern.test(trimmedName)) {
      setErrorName(
        "Tên niên khoá chỉ được chứa chữ, số, dấu cách và dấu gạch ngang."
      );
      return;
    }

    try {
      setLoading(true);
      const payload = { id: form.id, name: trimmedName };

      if (checkEdit) {
        const reqEdit = await handleUpdateAcademic(payload);
        if (reqEdit && reqEdit.status === 204) {
          toast.success(reqEdit.message || "Cập nhật niên khoá thành công");
          onClose();
          onSuccess();
        } else {
          toast.error(reqEdit.message || "Cập nhật niên khoá thất bại");
        }
      } else {
        const response = await handleAddAcademic(payload);
        if (response?.data && response.status === 201) {
          toast.success(response.message || "Thêm niên khoá thành công");
          onClose();
          onSuccess();
        } else {
          toast.error(response.message || "Thêm niên khoá thất bại");
        }
      }
    } catch (error) {
      toast.error(error.message || "Thêm niên khoá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className="sm:max-w-[550px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          {checkEdit ? (
            <>
              <DialogTitle>Cập nhật niên khoá</DialogTitle>
              <DialogDescription>
                Nhập thông tin cập nhật niên khoá
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Thêm niên khoá mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin về niên khoá mới
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmitAdd}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="academicId">
                  Mã niên khoá <span className="text-red-500">(*)</span>
                </Label>
                <Input
                  id="academicId"
                  placeholder="VD: 2021-2025"
                  value={form.id}
                  disabled={checkEdit}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setForm({ ...form, id: value });
                    setErrorId("");
                  }}
                  onBlur={() => {
                    if (!form.id) {
                      setErrorId("Mã niên khoá không được để trống.");
                    } else if (!idPattern.test(form.id)) {
                      setErrorId(
                        "Mã niên khoá phải bắt đầu bằng chữ in hoa hoặc số, chỉ chứa chữ in hoa, số và dấu gạch ngang."
                      );
                    }
                  }}
                  required
                />
                <p className="text-sm min-h-[20px] text-red-500">
                  {errorId || "\u00A0"}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nameAcademic">
                  Tên niên khoá <span className="text-red-500">(*)</span>
                </Label>
                <Input
                  id="nameAcademic"
                  type="text"
                  placeholder="Nhập tên niên khoá"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setErrorName("");
                  }}
                  onBlur={() => {
                    const trimmed = form.name.trim();
                    if (!trimmed) {
                      setErrorName("Tên niên khoá không được để trống.");
                    } else if (!namePattern.test(trimmed)) {
                      setErrorName(
                        "Tên niên khoá chỉ được chứa chữ, số, dấu cách và dấu gạch ngang."
                      );
                    }
                  }}
                  required
                />
                <p className="text-sm min-h-[20px] text-red-500">
                  {errorName || "\u00A0"}
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
              {checkEdit ? "Cập nhật" : "Thêm niên khoá"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAcademic;
