import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  BookOpen,
  Bell,
  DollarSign,
  BellRing,
} from "lucide-react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  handleStatisticalShare,
  handleStatisticalDepartmentStudent,
  handleStatisticalNotificationDay,
} from "../../../controller/StatisticalController";
import { handleListNotification } from "../../../controller/NotificationController";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Spin } from "antd";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#A28EFF",
];

const HomePageEmployee = () => {
  const [totalNotification, setTotalNotification] = useState(0);
  const [countStudent, setCountStudent] = useState(0);
  const [countLecturer, setCountLecturer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notificationData, setNotificationData] = useState([]);
  const [countAccount, setCountAccount] = useState(0);
  const [departmentData, setDepartmentData] = useState([]);

  const [notificationTypeStats, setNotificationTypeStats] = useState([]);

  const fetchStaticShare = async () => {
    try {
      setLoading(true);
      const response = await handleStatisticalShare();
      console.log(response);
      if (response?.data && response?.status === 200) {
        setCountStudent(response?.data?.totalStudent);
        setCountLecturer(response?.data?.totalTeacher);

        setCountAccount(response?.data?.totalAccount);
      }
    } catch (e) {
      console.log(e);
      toast.error("Đã xảy ra lỗi khi thống kê");
    } finally {
      setLoading(false);
    }
  };
  const fetchDepartmentStudent = async () => {
    try {
      const response = await handleStatisticalDepartmentStudent();
      if (response?.data && response?.status === 200) {
        setDepartmentData(response?.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Đã xảy ra lỗi khi thống kê");
    }
  };
  const fetchNotificationDay = async () => {
    try {
      const response = await handleStatisticalNotificationDay();
      if (response?.data && response?.status === 200) {
        setNotificationData(response?.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Đã xảy ra lỗi khi thống kê");
    }
  };
  const fetchTotalNotification = async () => {
    try {
      const pageSize = 100;
      let allNotifications = [];
      let page = 0;
      let totalPages = 1;

      do {
        const response = await handleListNotification("desc", page, pageSize);
        if (response?.data) {
          const data =
            response.data.notifications || response.data.content || [];
          allNotifications = [...allNotifications, ...data];
          totalPages = response.data.totalPages || 1;
          page++;
        } else {
          break;
        }
      } while (page < totalPages);

      // Gán default department nếu không có
      const enhanced = allNotifications.map((item) => ({
        ...item,
        department: item.department || "Phòng Đào Tạo",
      }));

      setTotalNotification(enhanced.length);

      // Đếm số lượng theo notificationType
      const counts = {};
      enhanced.forEach((item) => {
        const type = item.notificationType || "Thông báo";
        if (!counts[type]) {
          counts[type] = 1;
        } else {
          counts[type]++;
        }
      });

      // Chuyển thành mảng để render, kèm màu
      const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
      const mapped = Object.entries(counts).map(([name, count], index) => ({
        name,
        value: Math.round((count / enhanced.length) * 100), // phần trăm
        raw: count, // số lượng thực tế
        color: COLORS[index % COLORS.length],
      }));

      setNotificationTypeStats(mapped);
    } catch (e) {
      console.log(e);
      toast.error("Đã xảy ra lỗi khi thống kê");
    }
  };

  const dailyNotifications = notificationData.map((item) => ({
    date: dayjs(item.date).format("DD/MM/YYYY"),
    totalNotificationDay: item.totalNotificationDay,
  }));

  useEffect(() => {
    fetchStaticShare();
    fetchDepartmentStudent();
    fetchNotificationDay();
    fetchTotalNotification();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }
  // return (
  //   <div className="h-full w-full bg-white p-0 overflow-auto">
  //     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 p-10">
  //       <Card className="">
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0">
  //           <CardTitle className="text-sm font-medium">
  //             Tổng sinh viên
  //           </CardTitle>
  //           <Users className="h-4 w-4 text-blue-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold">{countStudent}</div>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //           <CardTitle className="text-sm font-medium">
  //             Tổng giảng viên
  //           </CardTitle>
  //           <GraduationCap className="h-4 w-4 text-green-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold">{countLecturer}</div>
  //           {/* <div className="flex items-center text-xs text-green-600">
  //             <TrendingUp className="mr-1 h-3 w-3" />
  //             +3 giảng viên mới
  //           </div> */}
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //           <CardTitle className="text-sm font-medium">Thông báo</CardTitle>
  //           <BellRing className="h-4 w-4 text-purple-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold">{totalNotification}</div>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0">
  //           <CardTitle className="text-sm font-medium">
  //             Tổng số tài khoản
  //           </CardTitle>
  //           <Bell className="h-4 w-4 text-yellow-600" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-2xl font-bold">{countAccount}</div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //     <Tabs defaultValue="trends" className="space-y-6 px-10">
  //       <TabsContent value="trends" className="space-y-6">
  //         <div className="grid grid-cols-2 gap-6">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Xu hướng thông báo theo ngày</CardTitle>
  //               <CardDescription>
  //                 Thống kê số lượng thông báo mỗi ngày gần đây
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent className="h-[400px]">
  //               <ResponsiveContainer width="100%" height="100%">
  //                 <AreaChart data={dailyNotifications}>
  //                   <defs>
  //                     <linearGradient
  //                       id="colorNotify"
  //                       x1="0"
  //                       y1="0"
  //                       x2="0"
  //                       y2="1"
  //                     >
  //                       <stop
  //                         offset="5%"
  //                         stopColor="#0088FE"
  //                         stopOpacity={0.8}
  //                       />
  //                       <stop
  //                         offset="95%"
  //                         stopColor="#0088FE"
  //                         stopOpacity={0}
  //                       />
  //                     </linearGradient>
  //                   </defs>
  //                   <XAxis dataKey="date" />
  //                   <YAxis />
  //                   <CartesianGrid strokeDasharray="3 3" />
  //                   <Tooltip />
  //                   <Area
  //                     type="monotone"
  //                     dataKey="totalNotificationDay"
  //                     stroke="#0088FE"
  //                     fillOpacity={1}
  //                     fill="url(#colorNotify)"
  //                     name="Tổng TB/ngày"
  //                   />
  //                 </AreaChart>
  //               </ResponsiveContainer>
  //             </CardContent>
  //           </Card>

  //           <Card className="col-span-1">
  //             <CardHeader>
  //               <CardTitle>Chi tiết loại thông báo</CardTitle>
  //               <CardDescription>Thống kê cụ thể cho từng loại</CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <div className="space-y-4">
  //                 {notificationTypeStats.map((type, index) => (
  //                   <div
  //                     key={index}
  //                     className="flex items-center justify-between p-4 border rounded-lg"
  //                   >
  //                     <div className="flex items-center space-x-3">
  //                       <div
  //                         className="w-4 h-4 rounded-full"
  //                         style={{ backgroundColor: type.color }}
  //                       />
  //                       <div>
  //                         <p className="font-medium">{type.name}</p>
  //                         <p className="text-sm text-gray-500">
  //                           {type.value}% tổng số
  //                         </p>
  //                       </div>
  //                     </div>
  //                     <div className="text-right">
  //                       <p className="text-lg font-bold">{type.raw}</p>
  //                       <p className="text-sm text-gray-500">thông báo</p>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </TabsContent>
  //     </Tabs>
  //   </div>
  // );
  return (
    <div className="h-full w-full bg-white p-0 overflow-auto flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Chào mừng bạn đến với hệ thống thông báo
      </h1>
    </div>
  );
};
export default HomePageEmployee;
