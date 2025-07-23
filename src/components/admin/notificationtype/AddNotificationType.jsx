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

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }
    if (checkEdit) {
      setLoading(true);
      const reqEdit = await handleUpdateNotificationType(form);
      if (reqEdit?.data || reqEdit?.status === 204) {
        onSuccess();
        toast.success(reqEdit.message || "Cập nhật loại thông báo thành công");
        onClose();
      } else {
        toast.error(reqEdit.message || "Lỗi");
      }
      setLoading(false);
    } else {
      setLoading(true);
      const reqAdd = await handleAddNotificationType(form);
      if (reqAdd?.data) {
        onSuccess();
        toast.success(reqAdd.message || "Thêm loại thông báo thành công");
        onClose();
      } else {
        toast.error(reqAdd.message || "Lỗi");
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[550px]">
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
                  Nhập thông tin chi tiết về loại thông báo mới
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
                <Label htmlFor="nameGroup">Tên loại thông báo</Label>
                <Input
                  id="nameGroup"
                  type="text"
                  placeholder="Nhập tên loại thông báo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
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
              onClick={() => handleSubmit()}
            >
              {checkEdit ? "Cập nhật" : "Thêm loại thông báo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddNotificationType;
