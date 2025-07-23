import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton, Spin } from "antd";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, User, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { handleDetailNotification } from "../../../controller/NotificationController";
const StudentNotificationDetail = () => {
  const { notificationId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";
  console.log(type, search, page);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await handleDetailNotification(notificationId);
        setLoading(false);
        if (res?.data) {
          setNotification(res.data);
        }
      } catch (error) {
        console.log(error.message || "Lỗi khi tải thông tin.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [notificationId]);
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-white">
  //       <Skeleton active paragraph={{ rows: 5 }} />
  //     </div>
  //   );
  // }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full max-h-[750px] overflow-y-auto p-10 bg-white space-y-6">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() =>
            navigate(
              `/sinh-vien/notification?search=${search}&type=${type}&page=${page}`
            )
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-start items-start">
              <div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Tiêu đề */}
                  <CardTitle className="text-xl whitespace-pre-line">
                    {loading ? (
                      <Skeleton.Input
                        active
                        size="small"
                        className="w-[200px]"
                      />
                    ) : (
                      notification?.title || "Trống"
                    )}
                  </CardTitle>

                  {/* Badge container */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {loading ? (
                      <Skeleton.Input
                        active
                        size="small"
                        className="w-[100px]"
                      />
                    ) : (
                      notification?.notificationType && (
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {notification.notificationType}
                        </span>
                      )
                    )}
                    {loading ? (
                      <Skeleton.Input
                        active
                        size="small"
                        className="w-[100px]"
                      />
                    ) : (
                      notification?.departmentName && (
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                          {notification.departmentName}
                        </span>
                      )
                    )}
                    {loading ? (
                      <Skeleton.Input
                        active
                        size="small"
                        className="w-[100px]"
                      />
                    ) : (
                      !notification?.notificationType &&
                      !notification?.departmentName && (
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          Phòng Đào tạo
                        </span>
                      )
                    )}
                  </div>
                </div>

                <CardDescription className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {loading ? (
                      <Skeleton.Input
                        active
                        size="small"
                        className="w-[100px]"
                      />
                    ) : (
                      dayjs(notification.createdAt).format("DD/MM/YYYY")
                    )}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                notification?.content || "Không có nội dung chi tiết."
              )}
            </div>

            {notification?.fileNotifications?.length > 0 && (
              <div className="space-y-2">
                {notification?.fileNotifications?.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.fileName}
                    download={file.displayName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block text-sm"
                  >
                    {file.displayName}
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default StudentNotificationDetail;
