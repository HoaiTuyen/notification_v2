import { useState } from "react";
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
const LecturerCreateGroupNotification = ({ open, onClose, onSuccess }) => {
  const { groupId } = useParams();
  const { setLoading } = useLoading();
  const [formData, setFormData] = useState({
    groupId: groupId,
    title: "",
    content: "",
    files: [],
    displayNames: [""],
  });

  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!formData.title.trim()) return toast.error("Vui lòng nhập tiêu đề");

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
  if (!open) return null;
  return (
    // <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
    //   <DialogContent className="w-[1200px]  max-h-[90vh] overflow-y-auto">
    //     <DialogHeader>
    //       <DialogTitle className="text-xl font-semibold">
    //         Tạo thông báo nhóm học tập
    //       </DialogTitle>
    //     </DialogHeader>

    //     <Card className="max-w-[700px] shadow-lg">
    //       <CardContent className="space-y-4">
    //         <div>
    //           <Label>Tiêu đề *</Label>
    //           <Input
    //             placeholder="Nhập tiêu đề"
    //             value={formData.title}
    //             onChange={(e) =>
    //               setFormData({ ...formData, title: e.target.value })
    //             }
    //           />
    //         </div>
    //         <div>
    //           <Label>Nội dung *</Label>
    //           <Textarea
    //             rows={5}
    //             placeholder="Nội dung chi tiết thông báo"
    //             value={formData.content}
    //             onChange={(e) =>
    //               setFormData({ ...formData, content: e.target.value })
    //             }
    //             className="whitespace-pre-wrap break-words"
    //           />
    //         </div>

    //         {formData.displayNames.map((name, index) => (
    //           <div
    //             key={index}
    //             className="space-y-1 border p-4 rounded-md relative"
    //           >
    //             <Label>Tên hiển thị file {index + 1}</Label>
    //             <Input
    //               type="text"
    //               placeholder="Ví dụ: Tài liệu chương 1"
    //               value={name}
    //               onChange={(e) =>
    //                 handleDisplayNameChange(e.target.value, index)
    //               }
    //             />
    //             <Input
    //               type="file"
    //               accept=".pdf,.docx,.xlsx"
    //               className="mt-2"
    //               onChange={(e) => handleFileChange(e.target.files[0], index)}
    //             />
    //             {formData.displayNames.length > 1 && (
    //               <button
    //                 type="button"
    //                 className="absolute top-2 right-2 text-red-500"
    //                 onClick={() => handleRemoveFile(index)}
    //               >
    //                 <X size={16} />
    //               </button>
    //             )}
    //           </div>
    //         ))}

    //         <Button
    //           variant="secondary"
    //           type="button"
    //           onClick={handleAddFile}
    //           className="flex items-center gap-2"
    //         >
    //           <Plus size={16} /> Thêm file khác
    //         </Button>

    //         <div className="text-right">
    //           <Button onClick={handleSubmit} disabled={submitting}>
    //             {submitting ? "Đang gửi..." : "Gửi thông báo"}
    //           </Button>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </DialogContent>
    // </Dialog>
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

        <div className="space-y-4">
          <div>
            <Label>Tiêu đề *</Label>
            <Input
              placeholder="Nhập tiêu đề"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Nội dung *</Label>
            <Textarea
              rows={5}
              placeholder="Nội dung chi tiết thông báo"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="whitespace-pre-wrap break-words"
            />
          </div>

          {formData.displayNames.map((name, index) => (
            <div
              key={index}
              className="space-y-1 border p-4 rounded-md relative"
            >
              <Label>file {index + 1}</Label>
              {/* <Input
                type="text"
                value={name}
                placeholder="VD: Tài liệu chương 1"
                onChange={(e) => handleDisplayNameChange(e.target.value, index)}
              /> */}
              <Input
                type="file"
                accept=".pdf,.docx,.xlsx"
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
              onClick={handleSubmit}
              disabled={submitting}
              className="cursor-pointer"
            >
              {submitting ? "Đang gửi..." : "Tạo thông báo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LecturerCreateGroupNotification;
