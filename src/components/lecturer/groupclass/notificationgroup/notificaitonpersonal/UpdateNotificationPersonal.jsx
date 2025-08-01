// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { X } from "lucide-react";
// import { toast } from "react-toastify";
// import { handleUpdateNotificationGroup } from "../../../../../controller/NotificationGroupController";
// import { useLoading } from "../../../../../context/LoadingProvider";
// const UpdateNotificationPersonal = ({ open, onClose, onSuccess, notify }) => {
//   const { setLoading } = useLoading();

//   const [formData, setFormData] = useState({
//     id: notify?.id || "",
//     title: notify?.title || "",
//     content: notify?.content || "",
//     groupId: notify?.studyGroupId || "",
//   });
//   const [errors, setErrors] = useState({});
//   const [fileDisplayNames, setFileDisplayNames] = useState([""]);
//   const [files, setFiles] = useState([null]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     const countWords = (text) =>
//       text.trim().split(/\s+/).filter(Boolean).length;

//     setErrors((prev) => {
//       const updatedErrors = { ...prev };

//       if (field === "title" || field === "content") {
//         if (countWords(value) >= 3) {
//           delete updatedErrors[field];
//         }
//       }

//       return updatedErrors;
//     });
//   };

//   const handleBlur = (field, value) => {
//     const countWords = (text) =>
//       text.trim().split(/\s+/).filter(Boolean).length;

//     setErrors((prev) => {
//       const updatedErrors = { ...prev };

//       if (field === "title") {
//         if (!value.trim()) {
//           updatedErrors.title = "Vui lòng nhập tiêu đề thông báo";
//         } else if (countWords(value) < 3) {
//           updatedErrors.title = "Tiêu đề phải có ít nhất 3 từ";
//         } else {
//           delete updatedErrors.title;
//         }
//       }

//       if (field === "content") {
//         if (!value.trim()) {
//           updatedErrors.content = "Vui lòng nhập nội dung thông báo";
//         } else if (countWords(value) < 3) {
//           updatedErrors.content = "Nội dung phải có ít nhất 3 từ";
//         } else {
//           delete updatedErrors.content;
//         }
//       }

//       return updatedErrors;
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const countWords = (text) =>
//       text.trim().split(/\s+/).filter(Boolean).length;

//     if (!formData.title.trim()) {
//       newErrors.title = "Vui lòng nhập tiêu đề thông báo";
//     } else {
//       if (countWords(formData.title) < 3) {
//         newErrors.title = "Tiêu đề phải có ít nhất 3 từ";
//       }
//     }

//     if (!formData.content.trim()) {
//       newErrors.content = "Vui lòng nhập nội dung thông báo";
//     } else {
//       if (countWords(formData.content) < 3) {
//         newErrors.content = "Nội dung phải có ít nhất 3 từ";
//       }
//     }

//     setErrors(newErrors);

//     // Trả về true nếu không có lỗi
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       setIsLoading(true);
//       setLoading(true);
//       const form = new FormData();
//       form.append("id", formData.id);
//       form.append("title", formData.title);
//       form.append("content", formData.content);
//       form.append("groupId", formData.groupId);

//       // Xử lý files và descriptions
//       const filePromises = [];

//       fileDisplayNames.forEach((name, index) => {
//         const file = files[index];

//         if (file instanceof File) {
//           // File mới - gửi trực tiếp
//           form.append(`files.${index}`, file);
//           //   form.append(`desc.${index}`, name);
//         } else if (typeof file === "string" && file) {
//           // File cũ - cần fetch về và gửi lại
//           const fetchPromise = fetch(file)
//             .then((res) => res.blob())
//             .then((blob) => {
//               const fileFromUrl = new File([blob], `file-${index}.pdf`, {
//                 type: "application/pdf",
//               });
//               form.append(`files.${index}`, fileFromUrl);
//               //   form.append(`desc.${index}`, name);
//             })
//             .catch((error) => {
//               console.error(`Error fetching file ${index}:`, error);
//               // Nếu không fetch được file cũ, bỏ qua file này
//             });

//           filePromises.push(fetchPromise);
//         }
//       });

//       // Đợi tất cả file cũ được fetch xong
//       await Promise.all(filePromises);

//       const result = await handleUpdateNotificationGroup(form);

//       if (result?.status === 204) {
//         toast.success(result.message || "Cập nhật thông báo thành công!");
//         onSuccess();
//         onClose();
//       } else {
//         toast.error(result?.message || "Cập nhật thất bại.");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(error?.message || "Có lỗi xảy ra.");
//     } finally {
//       setIsLoading(false);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchAll = async () => {
//       if (notify) {
//         setFormData({
//           id: notify.id || "",
//           title: notify.title || "",
//           content: notify.content || "",
//           groupId: notify?.studyGroupId || "",
//         });
//         if (notify.fileNotifications?.length > 0) {
//           setFileDisplayNames(
//             notify.fileNotifications.map((file) => file.displayName)
//           );
//           // Gán file URL để hiển thị, giữ null để biết chưa chọn file mới
//           setFiles(notify.fileNotifications.map((file) => file.fileName));
//         } else {
//           setFileDisplayNames([""]);
//           setFiles([null]);
//         }
//       }
//     };

//     fetchAll();
//   }, [notify, open]);

//   return (
//     <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
//       <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Cập nhật thông báo</DialogTitle>
//           <DialogDescription>
//             Thay đổi nội dung và thông tin của thông báo.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <Label className="mb-2" htmlFor="title">
//                 Tiêu đề thông báo <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange("title", e.target.value)}
//                 onBlur={(e) => handleBlur("title", e.target.value)}
//                 className={errors.title ? "border-red-500" : ""}
//                 required
//               />
//               {errors.title && (
//                 <p className="text-sm text-red-600">{errors.title}</p>
//               )}
//             </div>

//             <div>
//               <Label className="mb-2" htmlFor="content">
//                 Nội dung thông báo <span className="text-red-500">*</span>
//               </Label>
//               <Textarea
//                 rows={6}
//                 value={formData.content}
//                 onChange={(e) => handleInputChange("content", e.target.value)}
//                 className={
//                   errors.content
//                     ? "border-red-500"
//                     : "whitespace-pre-wrap break-words"
//                 }
//                 onBlur={(e) => handleBlur("content", e.target.value)}
//                 required
//               />
//               {errors.content && (
//                 <p className="text-sm text-red-600">{errors.content}</p>
//               )}
//             </div>

//             {fileDisplayNames.map((name, index) => (
//               <div key={index} className="space-y-1">
//                 <Label className="mb-2" htmlFor="file">
//                   File {index + 1}
//                 </Label>

//                 {/* Hiển thị tên file hiện tại (nếu có) */}
//                 {typeof files[index] === "string" && (
//                   <div className="flex items-center justify-between text-sm text-gray-600">
//                     <span className="truncate w-[200px]">
//                       {files[index].split("/").pop()}
//                     </span>
//                     <a
//                       href={files[index]}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       Xem file
//                     </a>
//                   </div>
//                 )}

//                 {/* Input để chọn lại file */}
//                 <Input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => {
//                     const newFiles = [...files];
//                     newFiles[index] = e.target.files[0];
//                     setFiles(newFiles);
//                   }}
//                 />

//                 {/* Nút xóa */}
//                 {fileDisplayNames.length > 1 && (
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => {
//                       const newNames = [...fileDisplayNames];
//                       const newFiles = [...files];
//                       newNames.splice(index, 1);
//                       newFiles.splice(index, 1);
//                       setFileDisplayNames(newNames);
//                       setFiles(newFiles);
//                     }}
//                   >
//                     <X className="w-4 h-4 text-red-500" />
//                   </Button>
//                 )}
//               </div>
//             ))}

//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => {
//                 setFileDisplayNames([...fileDisplayNames, ""]);
//                 setFiles([...files, null]);
//               }}
//             >
//               + Thêm file
//             </Button>
//           </div>

//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={onClose}>
//               Hủy
//             </Button>
//             <Button onClick={handleSubmit} disabled={isLoading}>
//               {isLoading ? "Đang cập nhật..." : "Cập nhật thông báo"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UpdateNotificationPersonal;

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
import { handleUpdateNotificationGroup } from "../../../../../controller/NotificationGroupController";
import { useLoading } from "../../../../../context/LoadingProvider";
import { v4 as uuidv4 } from "uuid";

// ...

const UpdateNotificationPersonal = ({ open, onClose, onSuccess, notify }) => {
  console.log("UpdateNotificationPersonal notify:", notify);

  const [formData, setFormData] = useState({ id: "", title: "", content: "" });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [publicIdsToDelete, setPublicIdsToDelete] = useState([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (notify && open) {
      setFormData({
        id: notify.id || "",
        title: notify.title || "",
        content: notify.content || "",
        groupId: notify?.studyGroupId || "",
      });

      if (notify.fileNotifications?.length > 0) {
        setFiles(
          notify.fileNotifications.map((f) => ({
            uuid: uuidv4(),
            file: f.fileName,
            publicId: f.publicId,
            isOld: true,
          }))
        );
      } else {
        setFiles([{ uuid: uuidv4(), file: null, isOld: false }]);
      }
    } else if (!open) {
      setFormData({ id: "", title: "", content: "" });
      setFiles([{ uuid: uuidv4(), file: null, isOld: false }]);
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
    form.append("groupId", formData.groupId);

    let fileIndex = 0;
    files.forEach((f) => {
      if (f.file instanceof File) {
        form.append(`files[${fileIndex}]`, f.file);
        fileIndex++;
      }
    });

    publicIdsToDelete.forEach((id) => {
      form.append("publicIds[]", id);
    });

    try {
      const result = await handleUpdateNotificationGroup(form);
      if (result?.status === 204 || result?.status === 200) {
        toast.success("Cập nhật thông báo thành công!");
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

  const handleRemoveFile = (uuid) => {
    const removed = files.find((f) => f.uuid === uuid);
    if (removed?.isOld && removed.publicId) {
      setPublicIdsToDelete((prev) => [...prev, removed.publicId]);
    }
    const updatedFiles = files.filter((f) => f.uuid !== uuid);
    setFiles(
      updatedFiles.length > 0
        ? updatedFiles
        : [{ uuid: uuidv4(), file: null, isOld: false }]
    );
  };

  const handleFileChange = (uuid, file) => {
    setFiles((prev) =>
      prev.map((item) =>
        item.uuid === uuid
          ? {
              ...item,
              file,
              isOld: false,
              publicId: undefined,
            }
          : item
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật thông báo cá nhân</DialogTitle>
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
            {notify?.studentIds?.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-900 border border-blue-200">
                <strong>Danh sách sinh viên đã gửi thông báo:</strong>
                <ul className="list-disc list-inside mt-1">
                  {notify.studentIds.map((id) => (
                    <li key={id}>{id}</li>
                  ))}
                </ul>
              </div>
            )}
            {files.map((f) => (
              <div key={f.uuid} className="space-y-2 p-4 border rounded-lg">
                <Label>File</Label>

                {f.isOld && typeof f.file === "string" && (
                  <div className="text-sm text-gray-600 flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>File hiện tại: {f.file.split("/").pop()}</span>
                    <a
                      href={f.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Xem file
                    </a>
                  </div>
                )}

                {f.file instanceof File && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    File mới được chọn: {f.file.name}
                  </div>
                )}

                <div>
                  <Label className="text-sm">
                    {f.isOld ? "Thay thế file (tùy chọn)" : "Chọn file"}
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf, image/*, .xls, .xlsx"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileChange(f.uuid, file);
                      }
                    }}
                  />
                </div>

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
                  { uuid: uuidv4(), file: null, isOld: false },
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

export default UpdateNotificationPersonal;
