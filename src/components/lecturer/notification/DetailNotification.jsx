import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import dayjs from "dayjs";
import { handleDetailNotification } from "../../../controller/NotificationController";
import { Spin } from "antd";
// Type definitions based on API response

export default function LecturerNotificationDetail() {
  const { notificationId } = useParams();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const fetchDetailNotification = async () => {
    try {
      setLoading(true);
      const detailNotify = await handleDetailNotification(notificationId);
      if (detailNotify?.data) {
        setNotification(detailNotify.data);
      } else {
        toast.error("Không tìm thấy thông báo");
      }
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi lấy thông báo");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetailNotification();
  }, [notificationId]);

  const handleDownloadFile = async (file) => {
    try {
      setDownloading(file.publicId);

      const link = document.createElement("a");
      link.href = file.fileName;
      link.download = file.displayName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Không thể tải xuống file");
    } finally {
      setDownloading(null);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="h-full max-h-[750px] overflow-y-auto p-10 bg-white">
        <div className="space-y-6 ">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() =>
                navigate(
                  `/giang-vien/sentNotification?search=${search}&type=${type}&page=${page}`
                )
              }
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </div>

          {/* Notification Header Card */}
          <Card className="">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    {notification.title}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {notification.sender || "Ai gửi"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {dayjs(notification.createdAt).format("DD/MM/YYYY HH:mm")}
                    </div>
                    {/* {notification.course && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {notification.course}
                    </div>
                  )} */}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {notification.notificationType && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {notification.notificationType}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Notification Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Nội dung thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none overflow-y-auto max-h-[350px]">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {notification.content || "Không có nội dung chi tiết."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Attachments */}
          {notification.fileNotifications &&
            notification.fileNotifications.length > 0 && (
              <Card className="overflow-x-auto max-h-[300px]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Tài liệu đính kèm ({notification.fileNotifications.length})
                  </CardTitle>
                  <CardDescription>
                    Nhấn vào tên file để tải xuống
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  <div className="space-y-3">
                    {/* {notification.fileNotifications.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors "
                    >
                      <div className="flex items-center space-x-3 ">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {file.displayName}
                          </h4>
                          <p className="text-sm text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                        disabled={downloading === file.publicId}
                      >
                        {downloading === file.publicId ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                            Đang tải...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </>
                        )}
                      </Button>
                    </div>
                  ))} */}
                    {notification.fileNotifications.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <a
                              href={file.fileName}
                              download={file.displayName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {file.displayName}
                            </a>
                            <p className="text-sm text-gray-500 break-all">
                              PDF Document
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                          disabled={downloading === file.publicId}
                        >
                          {downloading === file.publicId ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                              Đang tải...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Tải xuống
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          <Outlet />
        </div>
      </div>
    </motion.div>
  );
}
