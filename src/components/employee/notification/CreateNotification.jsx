import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageSquare,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import useWebSocket from "@/config/Websorket";
import { handleCreateNotification } from "../../../controller/NotificationController";
import { handleListNotificationType } from "../../../controller/NotificationTypeController";
import { handleListDepartment } from "../../../controller/DepartmentController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
import { handleListClass } from "../../../controller/ClassController";
const EmployeeCreateNotification = () => {
  const { connected } = useWebSocket();

  useEffect(() => {
    if (connected) {
      console.log("Kết nối WebSocket thành công!");
    }
  }, [connected]);

  const { setLoading } = useLoading();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    notificationType: "",
    departmentId: "",
    academicYear: "",
    studentId: "",
  });

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [fileDisplayNames, setFileDisplayNames] = useState([""]);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const hanndleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề và nội dung");
      return;
    }
    // if (!formData.title) {
    //   toast.error("Vui lòng nhập tiêu đề và nội dung");
    //   return;
    // }
    if (!validateForm) return;

    // Kiểm tra file + tên hiển thị
    // const hasEmptyName = fileDisplayNames.some((n) => !n.trim());
    // const hasEmptyFile = files.some((f) => !f);
    // if (hasEmptyName || hasEmptyFile) {
    //   toast.error("Vui lòng nhập tên hiển thị và chọn đầy đủ file PDF");
    //   return;
    // }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("content", formData.content);
    form.append("notificationType", formData.notificationType);
    form.append("departmentId", formData.departmentId);
    form.append("academicYear", formData.academicYear);
    form.append("studentId", formData.studentId);
    fileDisplayNames.forEach((name, index) => {
      form.append(`fileNotifications[${index}].displayName`, name);
      form.append(`files[${index}]`, files[index]);
    });
    console.log(form);

    try {
      setIsLoading(true);
      setLoading(true);
      const res = await handleCreateNotification(form);

      if (res.status === 201) {
        setFormData({
          title: "",
          content: "",
          notificationType: "",
          departmentId: "",
          academicYear: "",
          studentId: "",
        });
        setFileDisplayNames([""]);
        setFiles([]);
        setFileInputKey(Date.now());

        toast.success("Gửi thông báo thành công!");
        // await fetch("http://localhost:4000/api/send-notification", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     message: formData.title || "Bạn có thông báo mới",
        //   }),
        // });
      } else {
        toast.error(res.message || "Lỗi khi gửi thông báo");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra");
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };
  const fetchNotifyType = async () => {
    const req = await handleListNotificationType();
    if (req?.data) {
      setNotificationTypes(req.data.notificationTypes);
    }
  };
  const fetchAcademicYear = async () => {
    const req = await handleListClass(0, 10);
    console.log(req);
    if (req?.data) {
      setAcademicYears(req.data.classes);
    }
  };

  // const handleInputChange = (field, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));

  //   if (errors[field]) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       [field]: "",
  //     }));
  //   }
  // };
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Nếu người dùng đang thay đổi mã sinh viên và nó không hợp lệ → reset gửi email
      if (field === "studentCode" && !isValidStudentCode(value)) {
        updated.sendEmail = false;
      }

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề thông báo";
    }

    if (!formData.notificationType) {
      newErrors.notificationType = "Vui lòng chọn loại thông báo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const fetchListDepartment = async () => {
    const listDepartment = await handleListDepartment();
    console.log(listDepartment);

    if (listDepartment?.data) {
      setDepartments(listDepartment.data.departments);
    }
  };

  const isValidStudentCode = (code) => {
    const regex = /^DH\d{8,}$/i;
    return regex.test(code.trim());
  };

  useEffect(() => {
    fetchNotifyType();
    fetchListDepartment();
    fetchAcademicYear();
  }, []);
  return (
    <div className="min-h-screen w-full bg-white p-0">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="max-h-[calc(100vh-100px)] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Nội dung thông báo
                  </CardTitle>
                  <CardDescription className="text-red-400">
                    (*) Lưu ý: Gửi thông báo chung, gửi thông báo cho từng khoa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={hanndleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề thông báo *</Label>
                      <Input
                        id="title"
                        placeholder="Nhập tiêu đề thông báo..."
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600">{errors.title}</p>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="type">Loại thông báo *</Label>
                        <Select
                          value={formData.notificationType}
                          onValueChange={(value) =>
                            handleInputChange("notificationType", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.type ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Chọn loại thông báo" />
                          </SelectTrigger>
                          <SelectContent>
                            {notificationTypes.map((type) => (
                              <SelectItem key={type.id} value={String(type.id)}>
                                <div className="flex items-center gap-2">
                                  <span>{type.name}</span>
                                </div>
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
                      <div className="space-y-2">
                        <Label htmlFor="type">Khoa *</Label>
                        <Select
                          value={formData.departmentId}
                          onValueChange={(value) =>
                            handleInputChange("departmentId", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.type ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Chọn khoa" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={String(department.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{department.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.departmentId && (
                          <p className="text-sm text-red-600">
                            {errors.departmentId}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Niên khoá *</Label>
                        <Select
                          value={formData.academicYear}
                          onValueChange={(value) =>
                            handleInputChange("academicYear", value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.academicYear ? "border-red-500" : ""
                            }
                          >
                            <SelectValue placeholder="Chọn niên khoá" />
                          </SelectTrigger>
                          <SelectContent>
                            {academicYears?.map((academicYear) => (
                              <SelectItem
                                key={academicYear.id}
                                value={String(academicYear.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{academicYear.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.academicYear && (
                          <p className="text-sm text-red-600">
                            {errors.academicYear}
                          </p>
                        )}
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="studentId">
                          Mã sinh viên (nếu gửi cho 1 sinh viên)
                        </Label>
                        <Input
                          id="studentId"
                          placeholder="Nhập mã sinh viên (VD: DH52110090)"
                          value={formData.studentId}
                          onChange={(e) =>
                            handleInputChange("studentId", e.target.value)
                          }
                        />

                        <div className="flex items-center space-x-2 pl-1">
                          <Checkbox
                            id="sendEmail"
                            checked={formData.sendEmail}
                            disabled={!isValidStudentCode(formData.studentId)}
                            onCheckedChange={(checked) =>
                              handleInputChange("sendEmail", checked === true)
                            }
                          />
                          <label
                            htmlFor="sendEmail"
                            className={`text-sm ${
                              !isValidStudentCode(formData.studentId)
                                ? "text-gray-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            Gửi email đến sinh viên có mã trên
                          </label>
                        </div>
                        {formData.studentId &&
                          !isValidStudentCode(formData.studentId) && (
                            <p className="text-sm text-red-600">
                              Mã sinh viên không hợp lệ. Vui lòng kiểm tra lại.
                            </p>
                          )}
                      </div> */}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Nội dung thông báo *</Label>
                      <Textarea
                        id="content"
                        placeholder="Nhập nội dung chi tiết thông báo..."
                        value={formData.content}
                        onChange={(e) =>
                          handleInputChange("content", e.target.value)
                        }
                        rows={6}
                        className={errors.content ? "border-red-500" : ""}
                      />
                      {errors.content && (
                        <p className="text-sm text-red-600">{errors.content}</p>
                      )}
                    </div>

                    {/* {fileDisplayNames.map((name, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input
                          type="text"
                          placeholder="Tên hiển thị file (VD: Đề cương gì đó...)"
                          value={name}
                          onChange={(e) => {
                            const newNames = [...fileDisplayNames];
                            newNames[index] = e.target.value;
                            setFileDisplayNames(newNames);
                          }}
                        />
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const newFiles = [...files];
                            newFiles[index] = e.target.files[0];
                            setFiles(newFiles);
                          }}
                        />
                        {fileDisplayNames.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
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
                    ))} */}
                    {fileDisplayNames.map((name, index) => (
                      <div
                        key={`${fileInputKey}-${index}`}
                        className="flex items-center gap-2 mb-2"
                      >
                        <Input
                          type="text"
                          placeholder="Tên hiển thị file..."
                          value={name}
                          onChange={(e) => {
                            const newNames = [...fileDisplayNames];
                            newNames[index] = e.target.value;
                            setFileDisplayNames(newNames);
                          }}
                        />
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const newFiles = [...files];
                            newFiles[index] = e.target.files[0];
                            setFiles(newFiles);
                          }}
                        />
                        {fileDisplayNames.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
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

                    <div className="flex gap-4 justify-between">
                      <div></div>
                      <Button
                        type="submit"
                        className="cursor-pointer"
                        disabled={isLoading}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {isLoading ? "Đang gửi..." : "Gửi thông báo"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6 overflow-x-auto max-h-[700px]">
              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5" />
                    Một vài gợi ý
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Sử dụng tiêu đề ngắn gọn và rõ ràng</p>
                  <p>• Chọn loại thông báo phù hợp để sinh viên dễ phân loại</p>
                  <p>• Kiểm tra kỹ đối tượng nhận trước khi gửi</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeCreateNotification;

// import React, { useEffect } from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   MessageSquare,
//   Users,
//   Send,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import useWebSocket from "@/config/Websorket";
// import { handleCreateNotification } from "../../controller/NotificationController";
// import { toast } from "react-toastify";
// const LecturerCreateNotification = () => {
//   const { connected } = useWebSocket();

//   useEffect(() => {
//     if (connected) {
//       console.log("🎉 Kết nối WebSocket thành công!");
//     }
//   }, [connected]);

//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     // type: "",
//     // priority: "medium",
//     // targetAudience: [],
//     // scheduleDate: "",
//     // scheduleTime: "",
//     // attachments: [],
//   });

//   const [errors, setErrors] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const hanndleSubmit = async () => {
//     const req = await handleCreateNotification(
//       formData.title,
//       formData.content
//     );
//     console.log(req);

//     toast.success(req.message);
//     setFormData({
//       title: "",
//       content: "",
//     });
//   };
//   const notificationTypes = [
//     { value: "announcement", label: "Thông báo chung", icon: "" },
//     { value: "assignment", label: "Bài tập", icon: "" },
//     { value: "exam", label: "Kiểm tra/Thi", icon: "" },
//     { value: "event", label: "Sự kiện", icon: "" },
//     { value: "reminder", label: "Nhắc nhở", icon: "" },
//     { value: "urgent", label: "Khẩn cấp", icon: "" },
//   ];

//   // const priorityLevels = [
//   //   { value: "low", label: "Thấp", color: "bg-gray-100 text-gray-800" },
//   //   {
//   //     value: "medium",
//   //     label: "Trung bình",
//   //     color: "bg-blue-100 text-blue-800",
//   //   },
//   //   { value: "high", label: "Cao", color: "bg-orange-100 text-orange-800" },
//   //   { value: "urgent", label: "Khẩn cấp", color: "bg-red-100 text-red-800" },
//   // ];

//   // const audienceOptions = [
//   //   { id: "all-students", label: "Tất cả sinh viên" },
//   //   { id: "it301", label: "Lớp IT301 - Lập trình Web" },
//   //   { id: "it205", label: "Lớp IT205 - Cơ sở dữ liệu" },
//   //   { id: "it401", label: "Lớp IT401 - Phân tích thiết kế hệ thống" },
//   //   { id: "it501", label: "Lớp IT501 - Trí tuệ nhân tạo" },
//   //   { id: "study-groups", label: "Nhóm học tập" },
//   // ];

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: "",
//       }));
//     }

//     setSuccess(false);
//   };

//   // const handleAudienceChange = (audienceId, checked) => {
//   //   if (checked) {
//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       targetAudience: [...prev.targetAudience, audienceId],
//   //     }));
//   //   } else {
//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       targetAudience: prev.targetAudience.filter((id) => id !== audienceId),
//   //     }));
//   //   }
//   // };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) {
//       newErrors.title = "Vui lòng nhập tiêu đề thông báo";
//     }

//     if (!formData.content.trim()) {
//       newErrors.content = "Vui lòng nhập nội dung thông báo";
//     }

//     if (!formData.type) {
//       newErrors.type = "Vui lòng chọn loại thông báo";
//     }

//     if (formData.targetAudience.length === 0) {
//       newErrors.targetAudience = "Vui lòng chọn đối tượng nhận thông báo";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       setSuccess(true);
//       // Reset form
//       setFormData({
//         title: "",
//         content: "",
//         type: "",
//         priority: "medium",
//         targetAudience: [],
//         scheduleDate: "",
//         scheduleTime: "",
//         attachments: [],
//       });
//     }, 2000);
//   };

//   const selectedType = notificationTypes.find(
//     (type) => type.value === formData.type
//   );
//   // const selectedPriority = priorityLevels.find(
//   //   (priority) => priority.value === formData.priority
//   // );

//   return (
//     <div className="min-h-screen w-full bg-white p-0">
//       <div className="max-w-[1400px] mx-auto px-6 py-6">
//         <div className="space-y-6">
//           {success && (
//             <Alert className="border-green-200 bg-green-50">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-800">
//                 Thông báo đã được gửi thành công!
//               </AlertDescription>
//             </Alert>
//           )}

//           <div className="grid gap-6 lg:grid-cols-3">
//             <div className="lg:col-span-2">
//               <Card className="max-h-[calc(100vh-100px)] overflow-y-auto">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <MessageSquare className="h-5 w-5" />
//                     Nội dung thông báo
//                   </CardTitle>
//                   <CardDescription>
//                     Nhập thông tin chi tiết về thông báo
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="title">Tiêu đề thông báo *</Label>
//                       <Input
//                         id="title"
//                         placeholder="Nhập tiêu đề thông báo..."
//                         value={formData.title}
//                         onChange={(e) =>
//                           handleInputChange("title", e.target.value)
//                         }
//                         className={errors.title ? "border-red-500" : ""}
//                       />
//                       {errors.title && (
//                         <p className="text-sm text-red-600">{errors.title}</p>
//                       )}
//                     </div>

//                     {/* <div className="grid gap-4 md:grid-cols-2">
//                       <div className="space-y-2">
//                         <Label htmlFor="type">Loại thông báo *</Label>
//                         <Select
//                           value={formData.type}
//                           onValueChange={(value) =>
//                             handleInputChange("type", value)
//                           }
//                         >
//                           <SelectTrigger
//                             className={errors.type ? "border-red-500" : ""}
//                           >
//                             <SelectValue placeholder="Chọn loại thông báo" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {notificationTypes.map((type) => (
//                               <SelectItem key={type.value} value={type.value}>
//                                 <div className="flex items-center gap-2">
//                                   <span>{type.icon}</span>
//                                   <span>{type.label}</span>
//                                 </div>
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         {errors.type && (
//                           <p className="text-sm text-red-600">{errors.type}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="priority">Mức độ ưu tiên</Label>
//                         <Select
//                           value={formData.priority}
//                           onValueChange={(value) =>
//                             handleInputChange("priority", value)
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {priorityLevels.map((priority) => (
//                               <SelectItem
//                                 key={priority.value}
//                                 value={priority.value}
//                               >
//                                 {priority.label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div> */}

//                     <div className="space-y-2">
//                       <Label htmlFor="content">Nội dung thông báo *</Label>
//                       <Textarea
//                         id="content"
//                         placeholder="Nhập nội dung chi tiết thông báo..."
//                         value={formData.content}
//                         onChange={(e) =>
//                           handleInputChange("content", e.target.value)
//                         }
//                         rows={6}
//                         className={errors.content ? "border-red-500" : ""}
//                       />
//                       {errors.content && (
//                         <p className="text-sm text-red-600">{errors.content}</p>
//                       )}
//                     </div>

//                     {/* <div className="space-y-3">
//                       <Label>Đối tượng nhận thông báo *</Label>
//                       <div className="space-y-2">
//                         {audienceOptions.map((option) => (
//                           <div
//                             key={option.id}
//                             className="flex items-center space-x-2"
//                           >
//                             <Checkbox
//                               id={option.id}
//                               checked={formData.targetAudience.includes(
//                                 option.id
//                               )}
//                               onCheckedChange={(checked) =>
//                                 handleAudienceChange(option.id, checked)
//                               }
//                             />
//                             <Label
//                               htmlFor={option.id}
//                               className="text-sm font-normal"
//                             >
//                               {option.label}
//                             </Label>
//                           </div>
//                         ))}
//                       </div>
//                       {errors.targetAudience && (
//                         <p className="text-sm text-red-600">
//                           {errors.targetAudience}
//                         </p>
//                       )}
//                     </div> */}

//                     {/* <div className="grid gap-4 md:grid-cols-2">
//                       <div className="space-y-2">
//                         <Label htmlFor="scheduleDate">
//                           Lên lịch gửi (tùy chọn)
//                         </Label>
//                         <Input
//                           id="scheduleDate"
//                           type="date"
//                           value={formData.scheduleDate}
//                           onChange={(e) =>
//                             handleInputChange("scheduleDate", e.target.value)
//                           }
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="scheduleTime">Thời gian</Label>
//                         <Input
//                           id="scheduleTime"
//                           type="time"
//                           value={formData.scheduleTime}
//                           onChange={(e) =>
//                             handleInputChange("scheduleTime", e.target.value)
//                           }
//                           disabled={!formData.scheduleDate}
//                         />
//                       </div>
//                     </div> */}

//                     <div className="flex gap-4">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="flex-1"
//                       >
//                         Lưu nháp
//                       </Button>
//                       <Button
//                         type="submit"
//                         className="flex-1"
//                         disabled={isLoading}
//                         onClick={() => hanndleSubmit()}
//                       >
//                         <Send className="mr-2 h-4 w-4" />
//                         {isLoading ? "Đang gửi..." : "Gửi thông báo"}
//                       </Button>
//                     </div>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="space-y-6">
//               {/* Preview */}
//               <Card className="h-[500px] overflow-y-auto">
//                 <CardHeader className="sticky top-0 bg-white z-10">
//                   <CardTitle className="text-lg">Xem trước</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {formData.title && (
//                     <div>
//                       <h3 className="font-semibold">{formData.title}</h3>
//                       {selectedType && (
//                         <div className="flex items-center gap-2 mt-1">
//                           <span>{selectedType.icon}</span>
//                           <span className="text-sm text-muted-foreground">
//                             {selectedType.label}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* {selectedPriority && (
//                     <Badge className={selectedPriority.color}>
//                       {selectedPriority.label}
//                     </Badge>
//                   )} */}

//                   {formData.content && (
//                     <div className="max-h-40 overflow-y-auto rounded-md border p-3 text-sm text-muted-foreground bg-gray-50">
//                       {formData.content.substring(0, 100)}
//                       {formData.content.length > 100 && "..."}
//                     </div>
//                   )}

//                   {/* {formData.targetAudience.length > 0 && (
//                     <div>
//                       <p className="text-sm font-medium mb-2">Gửi đến:</p>
//                       <div className="space-y-1">
//                         {formData.targetAudience.map((audienceId) => {
//                           const audience = audienceOptions.find(
//                             (opt) => opt.id === audienceId
//                           );
//                           return audience ? (
//                             <Badge
//                               key={audienceId}
//                               variant="outline"
//                               className="text-xs"
//                             >
//                               {audience.label}
//                             </Badge>
//                           ) : null;
//                         })}
//                       </div>
//                     </div>
//                   )} */}
//                 </CardContent>
//               </Card>

//               {/* Statistics */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <Users className="h-5 w-5" />
//                     Thống kê
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Tổng người nhận:</span>
//                     <Badge variant="secondary">
//                       {/* {formData.targetAudience.includes("all-students")
//                         ? "245"
//                         : formData.targetAudience.length * 35}{" "}
//                       sinh viên */}
//                     </Badge>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Thời gian gửi:</span>
//                     <span className="text-sm text-muted-foreground">
//                       {formData.scheduleDate
//                         ? `${formData.scheduleDate} ${
//                             formData.scheduleTime || ""
//                           }`
//                         : "Ngay lập tức"}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Tips */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <AlertCircle className="h-5 w-5" />
//                     Gợi ý
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2 text-sm text-muted-foreground">
//                   <p>• Sử dụng tiêu đề ngắn gọn và rõ ràng</p>
//                   <p>• Chọn loại thông báo phù hợp để sinh viên dễ phân loại</p>
//                   <p>• Đặt mức độ ưu tiên cao cho thông báo quan trọng</p>
//                   <p>• Kiểm tra kỹ đối tượng nhận trước khi gửi</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default LecturerCreateNotification;
