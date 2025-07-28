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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { handleListNotificationType } from "../../../controller/NotificationTypeController";
import { handleListDepartment } from "../../../controller/DepartmentController";
import { handleUpdateNotification } from "../../../controller/NotificationController";
import { useLoading } from "../../../context/LoadingProvider";
const UpdateNotification = ({ open, onClose, onSuccess, notify }) => {
  const [formData, setFormData] = useState({
    id: notify?.id || "",
    title: notify?.title || "",
    content: notify?.content || "",
    notificationType: notify?.notificationType || "",
    departmentId: notify?.departmentId || "",
  });
  const [errors, setErrors] = useState({});
  const [fileDisplayNames, setFileDisplayNames] = useState([""]);
  const [files, setFiles] = useState([null]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { setLoading } = useLoading();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    const countWords = (text) =>
      text.trim().split(/\s+/).filter(Boolean).length;

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (field === "title") {
        if (countWords(value) < 3) {
          updatedErrors.title = "Tiêu đề phải có ít nhất 3 từ";
        } else {
          delete updatedErrors.title;
        }
      }

      if (field === "content") {
        if (countWords(value) < 3) {
          updatedErrors.content = "Nội dung phải có ít nhất 3 từ";
        } else {
          delete updatedErrors.content;
        }
      }

      return updatedErrors;
    });
  };

  const validateFormUpdate = () => {
    const newErrors = {};
    const countWords = (text) =>
      text.trim().split(/\s+/).filter(Boolean).length;

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề thông báo";
    } else {
      if (countWords(formData.title) < 3) {
        newErrors.title = "Tiêu đề phải có ít nhất 3 từ";
      }
    }

    if (!formData.content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung thông báo";
    } else {
      if (countWords(formData.content) < 3) {
        newErrors.content = "Nội dung phải có ít nhất 3 từ";
      }
    }

    fileDisplayNames.forEach((name, index) => {
      if (files[index] && !name.trim()) {
        newErrors[`fileDisplayName-${index}`] =
          "Vui lòng nhập tên hiển thị cho file";
      }
    });

    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormUpdate()) return;

    try {
      setLoading(true);

      const form = new FormData();
      form.append("id", formData.id);
      form.append("title", formData.title);
      form.append("content", formData.content);
      form.append("notificationType", formData.notificationType);
      form.append("departmentId", formData.departmentId);

      // Xử lý files và descriptions
      const filePromises = [];

      fileDisplayNames.forEach((name, index) => {
        const file = files[index];

        if (file instanceof File) {
          // File mới - gửi trực tiếp
          form.append(`files.${index}`, file);
          form.append(`desc.${index}`, name);
        } else if (typeof file === "string" && file) {
          // File cũ - cần fetch về và gửi lại
          const fetchPromise = fetch(file)
            .then((res) => res.blob())
            .then((blob) => {
              const fileFromUrl = new File([blob], `file-${index}.pdf`, {
                type: "application/pdf",
              });
              form.append(`files.${index}`, fileFromUrl);
              form.append(`desc.${index}`, name);
            })
            .catch((error) => {
              console.error(`Error fetching file ${index}:`, error);
              // Nếu không fetch được file cũ, bỏ qua file này
            });

          filePromises.push(fetchPromise);
        }
      });

      // Đợi tất cả file cũ được fetch xong
      await Promise.all(filePromises);

      const result = await handleUpdateNotification(form);

      if (result?.status === 204) {
        toast.success(result.message || "Cập nhật thông báo thành công!");
        onSuccess();
        onClose();
      } else {
        toast.error(result?.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };
  const handleBlur = (field, value) => {
    const countWords = (text) =>
      text.trim().split(/\s+/).filter(Boolean).length;

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (field === "title") {
        if (!value.trim()) {
          updatedErrors.title = "Vui lòng nhập tiêu đề thông báo";
        } else if (countWords(value) < 3) {
          updatedErrors.title = "Tiêu đề phải có ít nhất 3 từ";
        } else {
          delete updatedErrors.title;
        }
      }

      if (field === "content") {
        if (!value.trim()) {
          updatedErrors.content = "Vui lòng nhập nội dung thông báo";
        } else if (countWords(value) < 3) {
          updatedErrors.content = "Nội dung phải có ít nhất 3 từ";
        } else {
          delete updatedErrors.content;
        }
      }

      return updatedErrors;
    });
  };
  useEffect(() => {
    const fetchAll = async () => {
      const listDepartment = await handleListDepartment();
      const reqType = await handleListNotificationType();

      if (listDepartment?.data) {
        setDepartments(listDepartment.data.departments);
      }

      if (reqType?.data) {
        setNotificationTypes(reqType.data.notificationTypes);
      }

      if (notify) {
        // Mapping tên notificationType → ID
        const foundType = reqType?.data?.notificationTypes?.find(
          (item) => item.name === notify.notificationType
        );

        // Mapping tên khoa nếu cần (giống logic trên)
        const foundDepartment = listDepartment?.data?.departments?.find(
          (item) => item.name === notify.departmentId // Nếu notify.departmentId là tên
        );

        setFormData({
          id: notify.id || "",
          title: notify.title || "",
          content: notify.content || "",
          notificationType: foundType?.id || "", // Gán đúng ID để Select nhận diện
          departmentId: foundDepartment?.id || "", // Nếu có
        });
        if (notify.fileNotifications?.length > 0) {
          setFileDisplayNames(
            notify.fileNotifications.map((file) => file.displayName)
          );
          // Gán file URL để hiển thị, giữ null để biết chưa chọn file mới
          setFiles(notify.fileNotifications.map((file) => file.fileName));
        } else {
          setFileDisplayNames([""]);
          setFiles([null]);
        }
      }
    };

    fetchAll();
  }, [notify, open]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật thông báo</DialogTitle>
          <DialogDescription>
            Thay đổi nội dung và thông tin của thông báo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">
                Tiêu đề thông báo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
                required
                onBlur={(e) => handleBlur("title", e.target.value)}
                title="Tiêu đề phải chứa ít nhất 3 từ"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Loại thông báo</Label>
                <Select
                  value={formData.notificationType}
                  onValueChange={(value) =>
                    handleInputChange("notificationType", value)
                  }
                >
                  <SelectTrigger
                    className={errors.notificationType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.notificationType && (
                  <p className="text-sm text-red-600">
                    {errors.notificationType}
                  </p>
                )}
              </div>

              <div>
                <Label>Khoa</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    handleInputChange("departmentId", value)
                  }
                >
                  <SelectTrigger
                    className={errors.departmentId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep.id} value={String(dep.id)}>
                        {dep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && (
                  <p className="text-sm text-red-600">{errors.departmentId}</p>
                )}
              </div>
            </div>

            <div>
              <Label>
                Nội dung thông báo <span className="text-red-500">*</span>
              </Label>
              <Textarea
                rows={6}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className={errors.content ? "border-red-500" : ""}
                required
                onBlur={(e) => handleBlur("content", e.target.value)}
                title="Nội dung phải chứa ít nhất 3 từ"
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {fileDisplayNames.map((name, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <Label>File {index + 1}</Label>
                  {fileDisplayNames.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newNames = [...fileDisplayNames];
                        const newFiles = [...files];
                        newNames.splice(index, 1);
                        newFiles.splice(index, 1);
                        setFileDisplayNames(newNames);
                        setFiles(newFiles);
                      }}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>

                {/* Hiển thị tên hiển thị */}
                <Input
                  type="text"
                  placeholder="Tên hiển thị file"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...fileDisplayNames];
                    newNames[index] = e.target.value;
                    setFileDisplayNames(newNames);

                    // Nếu có file được chọn và người dùng nhập tên → xoá lỗi
                    if (files[index] && e.target.value.trim()) {
                      const newErrors = { ...errors };
                      delete newErrors[`fileDisplayName-${index}`];
                      setErrors(newErrors);
                    }
                  }}
                  className={
                    errors[`fileDisplayName-${index}`] ? "border-red-500" : ""
                  }
                />
                {errors[`fileDisplayName-${index}`] && (
                  <p className="text-sm text-red-600">
                    {errors[`fileDisplayName-${index}`]}
                  </p>
                )}

                {/* Hiển thị tên file hiện tại (nếu có) */}
                {typeof files[index] === "string" && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="truncate w-[200px]">
                      {files[index].split("/").pop()}
                    </span>
                    <a
                      href={files[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Xem file
                    </a>
                  </div>
                )}

                {/* Input để chọn lại file */}
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const newFiles = [...files];
                    newFiles[index] = e.target.files[0];
                    setFiles(newFiles);
                  }}
                />

                {/* Nút xóa */}
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFileDisplayNames([...fileDisplayNames, ""]);
                setFiles([...files, null]);
              }}
            >
              + Thêm file
            </Button>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật thông báo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNotification;
