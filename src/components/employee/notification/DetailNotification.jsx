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

export default function EmployeeNotificationDetail() {
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
        console.log(detailNotify);
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
              `/nhan-vien/sent-notification-all?search=${search}&type=${type}&department=${department}&page=${page}`
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
            `/nhan-vien/sent-notification-all?search=${search}&type=${type}&department=${department}&page=${page}`
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

                    {[
                      notification.notificationTypeName && {
                        label: notification.notificationTypeName,
                        className: "bg-yellow-100 text-yellow-800",
                      },
                      notification.academicYearName && {
                        label: `Niên khóa: ${notification.academicYearName}`,
                        className: "bg-green-100 text-green-800",
                      },
                      notification.departmentName && {
                        label: `Khoa: ${notification.departmentName}`,
                        className: "bg-purple-100 text-purple-800",
                      },
                    ]
                      .filter(Boolean)
                      .map((item, idx) => (
                        <Badge key={idx} className={item.className}>
                          {item.label}
                        </Badge>
                      ))}

                    {!notification.academicYearName &&
                      !notification.departmentName &&
                      !notification.notificationType && (
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
            notification.fileNotifications &&
            notification.fileNotifications.length > 0 && (
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

// return (
//   <motion.div
//     initial={{ opacity: 0, scale: 0.95 }}
//     animate={{ opacity: 1, scale: 1 }}
//     exit={{ opacity: 0, scale: 0.95 }}
//     transition={{ duration: 0.2, ease: "easeInOut" }}
//   >
//     <div className="h-full max-h-[750px] overflow-y-auto p-10 bg-white">
//       <Spin spinning={loading}>
//         {notification ? (
// <div className="space-y-6 ">
//   <div className="flex items-center justify-between">
//     <Button
//       variant="ghost"
//       onClick={() =>
//         navigate(
//           `/nhan-vien/sent-notification?search=${search}&type=${type}&page=${page}`
//         )
//       }
//     >
//       <ArrowLeft className="h-4 w-4 mr-2" />
//       Quay lại danh sách
//     </Button>
//   </div>

//   <Card className="">
//     <CardHeader>
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <CardTitle className="text-xl mb-2">
//             {notification.title}
//           </CardTitle>
//           <CardDescription className="flex items-center space-x-4 text-sm">
//             <div className="flex items-center">
//               <User className="h-4 w-4 mr-1" />
//               {notification.sender || "Ai gửi"}
//             </div>
//             <div className="flex items-center">
//               <Calendar className="h-4 w-4 mr-1" />
//               {dayjs(notification.createdAt).format(
//                 "DD/MM/YYYY HH:mm"
//               )}
//             </div>
//           </CardDescription>
//         </div>
//         <div className="flex items-center space-x-2">
//           {notification.notificationType && (
//             <Badge className="bg-blue-100 text-blue-800">
//               {notification.notificationType}
//             </Badge>
//           )}
//         </div>
//       </div>
//     </CardHeader>
//   </Card>

//   <Card>
//     <CardHeader>
//       <CardTitle className="flex items-center">
//         <FileText className="h-5 w-5 mr-2" />
//         Nội dung thông báo
//       </CardTitle>
//     </CardHeader>
//     <CardContent>
//       <div className="prose prose-sm max-w-none overflow-y-auto max-h-[350px]">
//         <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
//           {notification.content || "Không có nội dung chi tiết."}
//         </div>
//       </div>
//     </CardContent>
//   </Card>

//   {notification.fileNotifications &&
//     notification.fileNotifications.length > 0 && (
//       <Card className="overflow-x-auto max-h-[300px]">
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Download className="h-5 w-5 mr-2" />
//             Tài liệu đính kèm (
//             {notification.fileNotifications.length})
//           </CardTitle>
//           <CardDescription>
//             Nhấn vào tên file để tải xuống
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="max-h-[300px] overflow-y-auto">
//           <div className="space-y-3">
//             {notification.fileNotifications.map((file, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <FileText className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <a
//                       href={file.fileName}
//                       download={file.displayName}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="font-medium text-blue-600 hover:underline"
//                     >
//                       {file.displayName}
//                     </a>
//                     <p className="text-sm text-gray-500 break-all">
//                       PDF Document
//                     </p>
//                   </div>
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleDownloadFile(file)}
//                   disabled={downloading === file.publicId}
//                 >
//                   {downloading === file.publicId ? (
//                     <>
//                       <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full" />
//                       Đang tải...
//                     </>
//                   ) : (
//                     <>
//                       <Download className="h-4 w-4 mr-2" />
//                       Tải xuống
//                     </>
//                   )}
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     )}

//   <Outlet />
// </div>
//         ) : !loading ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
//             <h3 className="text-lg font-medium mb-2">
//               Không tìm thấy thông báo
//             </h3>
//             <p className="text-muted-foreground text-center mb-4">
//               Thông báo này có thể đã bị xóa hoặc bạn không có quyền truy cập.
//             </p>
//             <Button
//               variant="ghost"
//               onClick={() =>
//                 navigate(
//                   `/nhan-vien/sent-notification?search=${search}&type=${type}&page=${page}`
//                 )
//               }
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Quay lại danh sách
//             </Button>
//           </div>
//         ) : null}
//       </Spin>
//     </div>
//   </motion.div>
// );
