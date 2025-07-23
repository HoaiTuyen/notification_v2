import React, { useEffect } from "react";

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
import { toast } from "react-toastify";
const LecturerCreateNotification = () => {
  const { connected } = useWebSocket();

  useEffect(() => {
    if (connected) {
      console.log("🎉 Kết nối WebSocket thành công!");
    }
  }, [connected]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    // type: "",
    // priority: "medium",
    // targetAudience: [],
    // scheduleDate: "",
    // scheduleTime: "",
    // attachments: [],
  });

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [fileDisplayNames, setFileDisplayNames] = useState([""]);
  const [files, setFiles] = useState([]);

  // const hanndleSubmit = async () => {
  //   const req = await handleCreateNotification(
  //     formData.title,
  //     formData.content
  //   );
  //   console.log(req);

  //   toast.success(req.message);
  //   setFormData({
  //     title: "",
  //     content: "",
  //   });
  // };
  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

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

    fileDisplayNames.forEach((name, index) => {
      form.append(`fileNotifications[${index}].displayName`, name);
      form.append(`files[${index}]`, files[index]);
    });

    try {
      setIsLoading(true);
      const res = await handleCreateNotification(form);
      console.log(res);

      if (res.status === 201) {
        toast.success("Gửi thông báo thành công!");
        setFormData({ title: "", content: "" });
        setFileDisplayNames([""]);
        setFiles([]);
      } else {
        toast.error(res.message || "Lỗi khi gửi thông báo");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const notificationTypes = [
    { value: "announcement", label: "Thông báo chung", icon: "" },
    { value: "assignment", label: "Bài tập", icon: "" },
    { value: "exam", label: "Kiểm tra/Thi", icon: "" },
    { value: "event", label: "Sự kiện", icon: "" },
    { value: "reminder", label: "Nhắc nhở", icon: "" },
    { value: "urgent", label: "Khẩn cấp", icon: "" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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

    // if (!formData.type) {
    //   newErrors.type = "Vui lòng chọn loại thông báo";
    // }

    // if (formData.targetAudience.length === 0) {
    //   newErrors.targetAudience = "Vui lòng chọn đối tượng nhận thông báo";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setIsLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsLoading(false);

  //     // Reset form
  //     setFormData({
  //       title: "",
  //       content: "",
  //       type: "",
  //       priority: "medium",
  //       targetAudience: [],
  //       scheduleDate: "",
  //       scheduleTime: "",
  //       attachments: [],
  //     });
  //   }, 2000);
  // };

  const selectedType = notificationTypes.find(
    (type) => type.value === formData.type
  );

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
                  <CardDescription>
                    Nhập thông tin chi tiết về thông báo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
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

                    {fileDisplayNames.map((name, index) => (
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
                          className="cursor-pointer"
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
                      className="cursor-pointer"
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
                        onClick={() => handleSubmit()}
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
export default LecturerCreateNotification;
