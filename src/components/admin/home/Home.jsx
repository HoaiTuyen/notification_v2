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
import { Users, GraduationCap, BookOpen, Bell, DollarSign } from "lucide-react";
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
} from "recharts";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  handleStatisticalShare,
  handleStatisticalDepartmentStudent,
  handleStatisticalNotificationDay,
} from "../../../controller/StatisticalController";
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

const HomeAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [countStudent, setCountStudent] = useState(0);
  const [countLecturer, setCountLecturer] = useState(0);
  const [countCourse, setCountCourse] = useState(0);
  const [notificationData, setNotificationData] = useState([]);
  const [countAccount, setCountAccount] = useState(0);
  const [departmentData, setDepartmentData] = useState([]);
  const fetchStaticShare = async () => {
    try {
      setLoading(true);
      const response = await handleStatisticalShare();
      if (response?.data && response?.status === 200) {
        setCountStudent(response?.data?.totalStudent);
        setCountLecturer(response?.data?.totalTeacher);
        setCountCourse(response?.data?.totalSubject);
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
      setLoading(true);
      const response = await handleStatisticalDepartmentStudent();
      if (response?.data && response?.status === 200) {
        setDepartmentData(response?.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Đã xảy ra lỗi khi thống kê");
    } finally {
      setLoading(false);
    }
  };
  const fetchNotificationDay = async () => {
    try {
      setLoading(true);
      const response = await handleStatisticalNotificationDay();
      if (response?.data && response?.status === 200) {
        setNotificationData(response?.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Đã xảy ra lỗi khi thống kê");
    } finally {
      setLoading(false);
    }
  };
  const dailyNotifications = notificationData.map((item) => ({
    date: dayjs(item.date).format("DD/MM/YYYY"),
    totalNotificationDay: item.totalNotificationDay,
  }));
  const transformedData = departmentData.map((item, index) => ({
    id: item.departmentId,
    name: item.departmentName,
    value: item.totalStudent,
    color: COLORS[index % COLORS.length],
  }));

  useEffect(() => {
    fetchStaticShare();
    fetchDepartmentStudent();
    fetchNotificationDay();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-white p-0 ">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 p-10">
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Tổng sinh viên
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countStudent}</div>
            {/* <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% so với tháng trước
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giảng viên
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countLecturer}</div>
            {/* <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +3 giảng viên mới
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng môn học</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countCourse}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Tổng số tài khoản
            </CardTitle>
            <Bell className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countAccount}</div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="trends" className="space-y-6 px-10">
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng thông báo theo ngày</CardTitle>
                <CardDescription>
                  Thống kê số lượng thông báo mỗi ngày gần đây
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dailyNotifications}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="totalNotificationDay"
                      name="Tổng TB/ngày"
                      fill="#0088FE"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Phân bố sinh viên theo khoa</CardTitle>
                <CardDescription>
                  Tỷ lệ sinh viên trong các khoa
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transformedData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ id, percent }) => {
                        return `${id} ${(percent * 100).toFixed(0)}%`;
                      }}
                    >
                      {transformedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default HomeAdmin;
