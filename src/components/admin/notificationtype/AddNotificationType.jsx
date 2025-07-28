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

import { toast } from "react-toastify";
import {
  handleAddNotificationType,
  handleUpdateNotificationType,
} from "../../../controller/NotificationTypeController";
import { useLoading } from "../../../context/LoadingProvider";
const AddNotificationType = ({ open, onClose, onSuccess, notification }) => {
  const { setLoading } = useLoading();

  const checkEdit = !!notification?.id;
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: notification?.id || "",
    name: notification?.name || "",
    description: notification?.description || "",
  });

  useEffect(() => {
    if (open && notification?.id) {
      setForm({
        id: notification?.id || "",
        name: notification?.name || "",
        description: notification?.description || "",
      });
    } else {
      setForm({
        id: "",
        name: "",
        description: "",
      });
    }
  }, [notification, open]);
  const validateField = (field, value) => {
    const trimmed = value.trim();
    let error = "";

    if (field === "name") {
      if (!trimmed) error = "Tên loại thông báo không được để trống";
      else if (trimmed.length < 3) error = "Phải có ít nhất 3 ký tự";
      else if (!/^[\p{L}0-9 ]+$/u.test(trimmed))
        error = "Chỉ được chứa chữ, số và khoảng trắng";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleSubmit = async () => {
    const nameRegex = /^[\p{L}0-9 ]+$/u;

    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();

    // Validate name
    if (!trimmedName) {
      toast.error("Tên loại thông báo không được để trống");
      return;
    }

    if (trimmedName.length < 3) {
      toast.error("Tên loại thông báo phải có ít nhất 3 ký tự");
      return;
    }

    if (!nameRegex.test(trimmedName)) {
      toast.error(
        "Tên loại thông báo chỉ được chứa chữ, số và khoảng trắng (không chứa ký tự đặc biệt)"
      );
      return;
    }

    const requestData = {
      ...form,
      name: trimmedName,
      description: trimmedDescription,
    };

    setLoading(true);

    try {
      let response;

      if (checkEdit) {
        response = await handleUpdateNotificationType(requestData);
        if (response?.data || response?.status === 204) {
          toast.success(
            response.message || "Cập nhật loại thông báo thành công"
          );
        } else {
          toast.error(response.message || "Cập nhật thất bại");
        }
      } else {
        response = await handleAddNotificationType(requestData);
        if (response?.data) {
          toast.success(response.message || "Thêm loại thông báo thành công");
        } else {
          toast.error(response.message || "Thêm thất bại");
        }
      }

      if (response?.data || response?.status === 204) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }

    setLoading(false);
  };

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
                <DialogTitle>Cập nhật loại thông báo</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cập nhật về loại thông báo
                </DialogDescription>
              </DialogHeader>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Thêm loại thông báo mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin về loại thông báo mới
                </DialogDescription>
              </DialogHeader>
            </>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4">
                {/* <div className="grid gap-2">
                  <Label htmlFor="groupId">Mã nhóm</Label>
                  <Input id="groupId" placeholder="VD: CNTT01" />
                </div> */}

                <div className="grid gap-2">
                  <Label htmlFor="nameGroup">
                    Tên loại thông báo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nameGroup"
                    type="text"
                    placeholder="Nhập tên loại thông báo"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }
                    }}
                    onBlur={(e) => validateField("name", e.target.value)}
                    required
                    pattern="^[\p{L}0-9 ]+$"
                    title="Tên loại thông báo phải có ít nhất 3 ký tự, chỉ chứa chữ, số và khoảng trắng"
                  />
                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.name || "\u00A0"}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    type="text"
                    placeholder="Nhập mô tả..."
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
                onClick={() => onClose()}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                type="submit"
              >
                {checkEdit ? "Cập nhật" : "Thêm loại thông báo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddNotificationType;
