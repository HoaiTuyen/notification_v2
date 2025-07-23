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
  const [form, setForm] = useState({
    id: subject?.id || "",
    name: subject?.name || "",
    credit: subject?.credit || "",
  });
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
  const handleAdd = async () => {
    if (!form.id || !form.name || !form.credit) {
      toast.error("Vui lòng điền đầy đủ thông tin");
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

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => !val && onClose()}
        className="cursor-pointer"
      >
        <DialogContent className="sm:max-w-[600px] ">
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
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subjectId">Mã môn học</Label>
                <Input
                  id="subjectId"
                  placeholder="VD: CS03030"
                  disabled={checkEdit}
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameSubject">Tên môn học</Label>
                <Input
                  id="nameSubject"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credit">Số tín chỉ</Label>
                <Input
                  id="credit"
                  type="text"
                  value={form.credit}
                  onChange={(e) => setForm({ ...form, credit: e.target.value })}
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
              onClick={handleAdd}
            >
              {checkEdit ? "Cập nhật" : "Thêm môn học"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddSubject;
