import React, { useEffect, useRef } from "react";
import StudentSelect from "react-select";
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
import { handleCreateUserNotification } from "../../../controller/NotificationController";
import { handleListNotificationType } from "../../../controller/NotificationTypeController";
import { handleListDepartment } from "../../../controller/DepartmentController";
import { handleListStudent } from "../../../controller/StudentController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const EmployeeCreateNotificationStudent = () => {
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
    studentIds: [],
    isMail: false,
  });

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [fileDisplayNames, setFileDisplayNames] = useState([""]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const hanndleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    const form = new FormData();
    form.append("title", formData.title);
    form.append("content", formData.content);
    form.append("studentIds", formData.studentIds.join(","));
    form.append("isMail", formData.isMail ? "true" : "false");
    console.log("Form data before appending files:", formData.studentIds);
    fileDisplayNames.forEach((name, index) => {
      form.append(`fileNotifications[${index}].displayName`, name);
      form.append(`files[${index}]`, files[index]);
    });

    try {
      setIsLoading(true);
      setLoading(true);
      const res = await handleCreateUserNotification(form);
      console.log(res);
      if (res.status === 201) {
        setFormData({
          title: "",
          content: "",
          studentIds: [],
          isMail: false,
        });
        setFileDisplayNames([""]);
        setFiles([]);
        setSelectedStudents([]);
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Nếu người dùng đang thay đổi mã sinh viên và nó không hợp lệ → reset gửi email
      if (field === "studentIds" && !isValidStudentCode(value)) {
        updated.isMail = false;
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
    const countWords = (text) =>
      text.trim().split(/\s+/).filter(Boolean).length;

    const isAllNumbersOrSymbols = (text) => {
      const onlyNumbers = /^[\d\s-]+$/;
      const onlySymbols = /^[^\w\s]+$/;
      return onlyNumbers.test(text) || onlySymbols.test(text);
    };

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề thông báo";
    } else {
      if (countWords(formData.title) < 3) {
        newErrors.title = "Tiêu đề phải có ít nhất 3 từ";
      } else if (isAllNumbersOrSymbols(formData.title)) {
        newErrors.title = "Tiêu đề không được chỉ chứa số hoặc ký tự đặc biệt";
      }
    }

    if (!formData.content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung thông báo";
    } else {
      if (countWords(formData.content) < 3) {
        newErrors.content = "Nội dung phải có ít nhất 3 từ";
      } else if (isAllNumbersOrSymbols(formData.content)) {
        newErrors.content =
          "Nội dung không được chỉ chứa số hoặc ký tự đặc biệt";
      }
    }
    if (!formData.studentIds || formData.studentIds.length === 0) {
      newErrors.studentIds = "Vui lòng chọn ít nhất một sinh viên";
    }

    fileDisplayNames.forEach((name, index) => {
      if (files[index] && !name.trim()) {
        newErrors[`fileDisplayName-${index}`] =
          "Vui lòng nhập tên hiển thị cho file";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidStudentCode = (code) => {
    if (typeof code !== "string") return false;
    const regex = /^DH\d{8,}$/i;
    return regex.test(code.trim());
  };
  const handleBlur = (field, value) => {
    const countWords = (text) =>
      text.trim().split(/\s+/).filter(Boolean).length;

    const isAllNumbersOrSymbols = (text) => {
      const onlyNumbers = /^[\d\s-]+$/;
      const onlySymbols = /^[^\w\s]+$/;
      return onlyNumbers.test(text) || onlySymbols.test(text);
    };

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (field === "title") {
        if (!value.trim()) {
          updatedErrors.title = "Vui lòng nhập tiêu đề thông báo";
        } else if (countWords(value) < 3) {
          updatedErrors.title = "Tiêu đề phải có ít nhất 3 từ";
        } else if (isAllNumbersOrSymbols(value)) {
          updatedErrors.title =
            "Tiêu đề không được chỉ chứa số hoặc ký tự đặc biệt";
        } else {
          delete updatedErrors.title;
        }
      }

      if (field === "content") {
        if (!value.trim()) {
          updatedErrors.content = "Vui lòng nhập nội dung thông báo";
        } else if (countWords(value) < 3) {
          updatedErrors.content = "Nội dung phải có ít nhất 3 từ";
        } else if (isAllNumbersOrSymbols(value)) {
          updatedErrors.content =
            "Nội dung không được chỉ chứa số hoặc ký tự đặc biệt";
        } else {
          delete updatedErrors.content;
        }
      }

      return updatedErrors;
    });
  };

  const fetchStudents = async () => {
    const pageSize = 10;
    let allStudents = [];
    let page = 0;
    let totalPages = 1;

    try {
      do {
        const res = await handleListStudent(page, pageSize);

        if (res?.data?.students) {
          allStudents = [...allStudents, ...res.data.students];
          totalPages = res.data.totalPages;
          page++;
        } else {
          break; // stop if bad data
        }
      } while (page < totalPages);

      const formatted = allStudents.map((s) => ({
        value: s.id,
        label: `${s.id} - ${s.firstName} ${s.lastName}`,
        ...s,
      }));

      setStudents(formatted);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sinh viên:", error);
      toast.error("Không thể tải danh sách sinh viên");
    }
  };
  useEffect(() => {
    const ids = selectedStudents.map((s) => s.value);
    handleInputChange("studentIds", ids);
  }, [selectedStudents]);

  useEffect(() => {
    fetchStudents();
  }, []);
  const isSingleValidStudent =
    formData.studentIds.length === 1 &&
    isValidStudentCode(formData.studentIds[0]);

  return (
    <div className="h-full w-full bg-white p-0 overflow-auto">
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
                    (*) Lưu ý: Gửi thông báo cho một hoặc nhiều sinh viên
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={hanndleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề thông báo (*)</Label>
                      <Input
                        id="title"
                        placeholder="Nhập tiêu đề thông báo..."
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        required
                        className={errors.title ? "border-red-500" : ""}
                        onBlur={(e) => handleBlur("title", e.target.value)}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600">{errors.title}</p>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="studentIds">Mã sinh viên(*)</Label>
                        {/* <Input
                          id="studentId"
                          placeholder="Nhập mã sinh viên (VD: DH52110090)"
                          value={formData.studentId}
                          onChange={(e) =>
                            handleInputChange("studentId", e.target.value)
                          }
                        /> */}
                        <div className="space-y-2">
                          <StudentSelect
                            isMulti
                            name="students"
                            options={students}
                            value={selectedStudents}
                            onChange={(selected) =>
                              setSelectedStudents(selected)
                            }
                            classNamePrefix="select"
                            placeholder="Chọn sinh viên theo mã, tên hoặc lớp"
                            className={`react-select-container ${
                              errors.studentIds
                                ? "border-2 border-red-500   rounded-md"
                                : ""
                            }`}
                          />
                        </div>

                        <div className="flex items-center space-x-2 pl-1">
                          <Checkbox
                            id="isMail"
                            checked={formData.isMail}
                            disabled={!isSingleValidStudent}
                            onCheckedChange={(checked) =>
                              handleInputChange("isMail", checked === true)
                            }
                          />
                          <label
                            htmlFor="isMail"
                            className={`text-sm ${
                              !isSingleValidStudent
                                ? "text-gray-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            Gửi email đến sinh viên có mã trên
                          </label>
                        </div>
                        {formData.studentIds.length > 0 &&
                          !isSingleValidStudent && (
                            <p className="text-sm text-red-600">
                              Mã sinh viên không hợp lệ. Vui lòng kiểm tra lại.
                            </p>
                          )}
                        {errors.studentIds && (
                          <p className="text-sm text-red-600">
                            {errors.studentIds}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Nội dung(*)</Label>
                      <Textarea
                        id="content"
                        placeholder="Nhập nội dung chi tiết thông báo..."
                        value={formData.content}
                        onChange={(e) =>
                          handleInputChange("content", e.target.value)
                        }
                        rows={6}
                        required
                        className={errors.content ? "border-red-500" : ""}
                        onBlur={(e) => handleBlur("content", e.target.value)}
                      />
                      {errors.content && (
                        <p className="text-sm text-red-600">{errors.content}</p>
                      )}
                    </div>

                    {/* {fileDisplayNames.map((name, index) => (
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
                    ))} */}

                    <p className="text-sm text-red-500 mb-2">
                      (*) Lưu ý: Chỉ chấp nhận file .pdf, ảnh hoặc Excel (xls,
                      xlsx).
                      <br />
                      (*) Dung lượng tối đa: nhỏ hơn 20MB
                    </p>
                    {fileDisplayNames.map((name, index) => (
                      <div
                        key={`${fileInputKey}-${index}`}
                        className="flex items-start gap-2 mb-2"
                      >
                        {/* Cột input tên + lỗi */}
                        <div className="flex flex-col flex-1">
                          <Input
                            type="text"
                            placeholder="Tên hiển thị file."
                            value={name}
                            onChange={(e) => {
                              const newNames = [...fileDisplayNames];
                              newNames[index] = e.target.value;
                              setFileDisplayNames(newNames);
                            }}
                            className={
                              errors[`fileDisplayName-${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors[`fileDisplayName-${index}`] && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors[`fileDisplayName-${index}`]}
                            </p>
                          )}
                        </div>

                        {/* Cột input file */}
                        <div className="flex flex-col">
                          <Input
                            type="file"
                            accept=".pdf, image/*, .xls, .xlsx"
                            onChange={(e) => {
                              const newFiles = [...files];
                              newFiles[index] = e.target.files[0];
                              setFiles(newFiles);
                            }}
                          />
                        </div>

                        {/* Nút xoá */}
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
                    Một vài lưu ý
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
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
export default EmployeeCreateNotificationStudent;
