import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import dayjs from "dayjs";
import { Skeleton } from "antd";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import { handleDetailNotification } from "../../../controller/NotificationController";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EmployeeNotificationDetailPersonal() {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";
  const department = searchParams.get("department") || "all";

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      try {
        setLoading(true);
        const detailNotify = await handleDetailNotification(notificationId);
        console.log("Detail notify:", detailNotify);
        if (detailNotify?.data) {
          setNotification(detailNotify.data);
        } else {
          setNotification(null);
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
        toast.error("Không thể tải thông báo");
        setNotification(null);
      } finally {
        setLoading(false);
      }
    };

    if (notificationId) {
      fetchNotificationDetail();
    }
  }, [notificationId]);

  // const handleDownloadFile = async (file) => {
  //   try {
  //     setDownloading(file.publicId);

  //     const link = document.createElement("a");
  //     link.href = file.fileName;
  //     link.download = file.displayName;
  //     link.target = "_blank";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Download error:", error);
  //     toast.error("Không thể tải xuống file");
  //   } finally {
  //     setDownloading(null);
  //   }
  // };
  const handleDownloadFile = async (file) => {
    try {
      setDownloading(file.publicId);

      const response = await fetch(file.fileName);

      if (!response.ok) {
        throw new Error("Không thể tải file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.displayName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Giải phóng bộ nhớ
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Không thể tải xuống file");
    } finally {
      setDownloading(null);
    }
  };

  if (!loading && !notification) {
    return (
      <div className="flex flex-col items-center justify-center py-12 cursor-pointer">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Không tìm thấy thông báo</h3>
        <p className="text-muted-foreground text-center mb-4">
          Thông báo này có thể đã bị xóa hoặc bạn không có quyền truy cập.
        </p>
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() =>
            navigate(
              `/nhan-vien/sent-notification-personal?search=${search}&type=${type}&page=${page}`
            )
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[750px] overflow-y-auto p-10 bg-white space-y-6">
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() =>
          navigate(
            `/nhan-vien/sent-notification-personal?search=${search}&type=${type}&department=${department}&page=${page}`
          )
        }
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại danh sách
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">
                {loading ? (
                  <Skeleton active paragraph={false} />
                ) : (
                  notification.title
                )}
              </CardTitle>
              <CardDescription className="flex items-center space-x-4 text-sm">
                {loading ? (
                  <Skeleton.Input active size="small" style={{ width: 200 }} />
                ) : (
                  <CardDescription className="flex items-center flex-wrap gap-2 text-sm mt-1">
                    {/* Ngày tạo */}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {dayjs(notification.createdAt).format("DD/MM/YYYY HH:mm")}
                    </div>
                    {/* Loại thông báo */}
                    {notification.notificationTypeName && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Loại thông báo: {notification.notificationTypeName}
                      </Badge>
                    )}
                    {/* Niên khóa */}
                    {notification.academicYearName && (
                      <Badge className="bg-green-100 text-green-800">
                        Niên khóa: {notification.academicYearName}
                      </Badge>
                    )}

                    {/* Khoa */}
                    {notification.departmentName && (
                      <Badge className="bg-purple-100 text-purple-800">
                        Khoa: {notification.departmentName}
                      </Badge>
                    )}

                    {notification.scope === "CA_NHAN" && (
                      <Badge className="bg-pink-100 text-pink-800">
                        Cá nhân
                      </Badge>
                    )}
                    {!notification?.academicYearName &&
                      !notification?.departmentName &&
                      !notification?.notificationTypeName &&
                      notification?.scope === "TOAN_TRUONG" && (
                        <Badge className="bg-gray-100 text-gray-800">
                          Toàn trường
                        </Badge>
                      )}
                  </CardDescription>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {notification?.scope === "CA_NHAN" &&
            Array.isArray(notification?.students) &&
            notification?.students?.length > 0 && (
              <div>
                <p className="text-sm text-gray-700">
                  Gửi đến các sinh viên:{" "}
                  <span className="font-medium">
                    {notification?.students?.join(", ")}
                  </span>
                </p>
              </div>
            )}
          <div>
            <h4 className="text-base font-semibold flex items-center mb-2">
              Nội dung thông báo
            </h4>
            <div className="prose prose-sm max-w-none overflow-y-auto max-h-[350px]">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 5 }} />
                ) : notification.content ? (
                  notification.content
                ) : (
                  "Không có nội dung chi tiết."
                )}
              </div>
            </div>
          </div>

          {!loading &&
            notification?.fileNotifications &&
            notification?.fileNotifications?.length > 0 && (
              <div>
                <ul className="space-y-2">
                  {notification.fileNotifications.map((file, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="text-blue-600 hover:underline inline cursor-pointer bg-transparent border-none p-0"
                      >
                        {file.displayName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </CardContent>
      </Card>

      <Outlet />
    </div>
  );
}
