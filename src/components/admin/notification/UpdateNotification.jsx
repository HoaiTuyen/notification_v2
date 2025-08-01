// ✅ Full version using uuid for file mapping: updateNotification desc/files/publicIds logic
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { handleUpdateNotification } from "../../../controller/NotificationController";
import { useLoading } from "../../../context/LoadingProvider";
import { v4 as uuidv4 } from "uuid";

const UpdateNotification = ({ open, onClose, onSuccess, notify }) => {
  const [formData, setFormData] = useState({ id: "", title: "", content: "" });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]); // { uuid, displayName, file (File | string), publicId (if old), isOld }
  const [publicIdsToDelete, setPublicIdsToDelete] = useState([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (notify && open) {
      setFormData({
        id: notify.id || "",
        title: notify.title || "",
        content: notify.content || "",
      });

      if (notify.fileNotifications?.length > 0) {
        setFiles(
          notify.fileNotifications.map((f) => ({
            uuid: uuidv4(),
            displayName: f.displayName,
            file: f.fileName,
            publicId: f.publicId,
            isOld: true,
          }))
        );
      } else {
        setFiles([
          { uuid: uuidv4(), displayName: "", file: null, isOld: false },
        ]);
      }
    } else if (!open) {
      setFormData({ id: "", title: "", content: "" });
      setFiles([{ uuid: uuidv4(), displayName: "", file: null, isOld: false }]);
      setErrors({});
      setPublicIdsToDelete([]);
    }
  }, [notify, open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (field === "title") {
        if (wordCount < 3) newErrors.title = "Tiêu đề phải có ít nhất 3 từ";
        else delete newErrors.title;
      }
      if (field === "content") {
        if (wordCount < 3) newErrors.content = "Nội dung phải có ít nhất 3 từ";
        else delete newErrors.content;
      }
      return newErrors;
    });
  };

  const validateFormUpdate = () => {
    const newErrors = {};
    const countWords = (text) =>
      text.trim().split(/\s+/).filter(Boolean).length;
    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    else if (countWords(formData.title) < 3)
      newErrors.title = "Tiêu đề phải có ít nhất 3 từ";

    if (!formData.content.trim()) newErrors.content = "Vui lòng nhập nội dung";
    else if (countWords(formData.content) < 3)
      newErrors.content = "Nội dung phải có ít nhất 3 từ";

    files.forEach((f) => {
      if (!f.isOld && f.file instanceof File && !f.displayName.trim()) {
        newErrors[`fileDisplayName-${f.uuid}`] =
          "Vui lòng nhập tên hiển thị cho file";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormUpdate()) return;

    setLoading(true);
    const form = new FormData();
    form.append("id", formData.id);
    form.append("title", formData.title);
    form.append("content", formData.content);

    files.forEach((f) => {
      if (!f.isOld && f.file instanceof File) {
        form.append(`desc[${f.uuid}]`, f.displayName);
        form.append(`files[${f.uuid}]`, f.file);
      }
    });

    publicIdsToDelete.forEach((id) => {
      form.append(`publicIds[${id}]`, "1");
    });

    try {
      const result = await handleUpdateNotification(form);
      if (result?.status === 204 || result?.status === 200) {
        toast.success("Cập nhật thông báo thành công!");
        onSuccess();
        onClose();
      } else {
        toast.error(result?.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (uuid) => {
    const removed = files.find((f) => f.uuid === uuid);
    if (removed?.isOld && removed.publicId) {
      setPublicIdsToDelete((prev) => [...prev, removed.publicId]);
    }
    const updatedFiles = files.filter((f) => f.uuid !== uuid);
    setFiles(
      updatedFiles.length > 0
        ? updatedFiles
        : [{ uuid: uuidv4(), displayName: "", file: null, isOld: false }]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật thông báo</DialogTitle>
          <DialogDescription>
            Thay đổi nội dung và file thông báo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Tiêu đề</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <Label>Nội dung</Label>
              <Textarea
                rows={5}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className={errors.content ? "border-red-500" : ""}
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {files.map((f) => (
              <div key={f.uuid} className="space-y-1">
                <Label>File</Label>
                <Input
                  value={f.displayName}
                  onChange={(e) => {
                    setFiles((prev) =>
                      prev.map((item) =>
                        item.uuid === f.uuid
                          ? { ...item, displayName: e.target.value }
                          : item
                      )
                    );
                  }}
                  placeholder="Tên hiển thị"
                  className={
                    errors[`fileDisplayName-${f.uuid}`] ? "border-red-500" : ""
                  }
                />
                {errors[`fileDisplayName-${f.uuid}`] && (
                  <p className="text-sm text-red-600">
                    {errors[`fileDisplayName-${f.uuid}`]}
                  </p>
                )}

                {typeof f.file === "string" && (
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>{f.file.split("/").pop()}</span>
                    <a
                      href={f.file}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Xem file
                    </a>
                  </div>
                )}

                <Input
                  type="file"
                  accept=".pdf, image/*, .xls, .xlsx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFiles((prev) =>
                        prev.map((item) =>
                          item.uuid === f.uuid
                            ? {
                                ...item,
                                file,
                                isOld: false,
                                publicId: undefined,
                              }
                            : item
                        )
                      );
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(f.uuid)}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setFiles([
                  ...files,
                  { uuid: uuidv4(), displayName: "", file: null, isOld: false },
                ])
              }
            >
              + Thêm file
            </Button>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Cập nhật thông báo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNotification;
