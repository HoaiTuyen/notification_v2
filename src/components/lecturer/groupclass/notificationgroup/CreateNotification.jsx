import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Plus, X } from "lucide-react";
import { handleCreateNotificationGroup } from "../../../../controller/NotificationGroupController";
import { useLoading } from "../../../../context/LoadingProvider";
import StudentSelect from "react-select";
import { handleDetailGroup } from "../../../../controller/GroupController";
const LecturerCreateGroupNotification = ({ open, onClose, onSuccess }) => {
  const { groupId } = useParams();
  const { setLoading } = useLoading();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [formData, setFormData] = useState({
    groupId: groupId,
    title: "",
    content: "",
    studentIds: [],
    files: [],
    displayNames: [""],
  });
  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const fetchListStudent = async () => {
    try {
      const detailGroup = await handleDetailGroup(groupId);
      console.log(detailGroup);
      if (detailGroup?.data && detailGroup.status === 200) {
        const formatted = detailGroup.data.members.map((s) => ({
          value: s.fullName,
          label: `${s.studentId} - ${s.fullName}`,
          ...s,
        }));
        setStudents(formatted);
      }
    } catch (e) {
      setStudents([]);
      console.error("Lỗi khi fetch chi tiết nhóm học tập:", e);
    }
  };
  const handleFileChange = (file, index) => {
    const newFiles = [...formData.files];
    newFiles[index] = file;
    setFormData({ ...formData, files: newFiles });
  };

  const handleDisplayNameChange = (value, index) => {
    const newNames = [...formData.displayNames];
    newNames[index] = value;
    setFormData({ ...formData, displayNames: newNames });
  };

  const handleAddFile = () => {
    setFormData({
      ...formData,
      files: [...formData.files, null],
      displayNames: [...formData.displayNames, ""],
    });
  };

  const handleRemoveFile = (index) => {
    const files = [...formData.files];
    const displayNames = [...formData.displayNames];
    files.splice(index, 1);
    displayNames.splice(index, 1);
    setFormData({ ...formData, files, displayNames });
  };
  const validateForm = () => {
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

    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setLoading(true);
      const form = new FormData();
      form.append("groupId", formData.groupId);

      form.append("title", formData.title);
      form.append("content", formData.content);

      formData.files.forEach((file, index) => {
        if (file) {
          form.append(`files.${index}`, file);
          form.append(`desc.${index}`, formData.displayNames[index]);
        }
      });

      const res = await handleCreateNotificationGroup(form);
      if (res?.data && res?.status === 201) {
        onSuccess();
        window.dispatchEvent(new Event("notification-sent"));
        toast.success(res.message || "Tạo thông báo thành công!");
        onClose();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi hệ thống");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListStudent();
  }, []);
  if (!open) return null;
  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Tạo thông báo nhóm học tập
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label className="mb-2">
                Tiêu đề <span className="text-red-500">(*)</span>
              </Label>
              <Input
                placeholder="Nhập tiêu đề"
                value={formData.title}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, title: value }));

                  if (countWords(value) >= 3) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.title;
                      return newErrors;
                    });
                  }
                }}
                required
                className={errors.title ? "border-red-500" : ""}
                onBlur={(e) => handleBlur("title", e.target.value)}
                title="Tiêu đề phải chứa ít nhất 3 từ"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <Label className="mb-2">
                Nội dung <span className="text-red-500">(*)</span>
              </Label>
              <Textarea
                rows={5}
                placeholder="Nội dung chi tiết thông báo"
                value={formData.content}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, content: value }));

                  if (countWords(value) >= 3) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.content;
                      return newErrors;
                    });
                  }
                }}
                required
                className={`whitespace-pre-wrap break-words ${
                  errors.content ? "border-red-500" : ""
                }`}
                onBlur={(e) => handleBlur("content", e.target.value)}
                title="Nội dung phải chứa ít nhất 3 từ"
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {formData.displayNames.map((name, index) => (
              <div
                key={index}
                className="space-y-1 border p-4 rounded-md relative"
              >
                <Label>file {index + 1}</Label>
                <Input
                  type="file"
                  accept=".pdf, image/*, .xls, .xlsx"
                  className="mt-2"
                  onChange={(e) => handleFileChange(e.target.files[0], index)}
                />
                {formData.displayNames.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500 cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}

            <Button
              variant="secondary"
              type="button"
              onClick={handleAddFile}
              className="flex items-center gap-2"
            >
              <Plus size={16} /> Thêm file khác
            </Button>

            <div className="text-right">
              <Button
                type="submit"
                disabled={submitting}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Đang gửi..." : "Tạo thông báo"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LecturerCreateGroupNotification;
