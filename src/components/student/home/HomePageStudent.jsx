import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Bell, Calendar, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { Spin } from "antd";
import dayjs from "dayjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import {
  handleUnreadCountNotificationUser,
  handleGetDetailUser,
  handleListGroupByStudent,
} from "../../../controller/AccountController";
import { handleListNotification } from "../../../controller/NotificationController";
import { handleTotalCourseSchedule } from "../../../controller/StudentController";
import { handleListSemester } from "../../../controller/SemesterController";

const HomePageStudent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token") || "";
  const { userId } = jwtDecode(token);

  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalCourses: 0,
    totalGroups: 0,
    notifications: 0,
    unreadNotifications: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [userRes, semesterRes] = await Promise.all([
          handleGetDetailUser(userId),
          handleListSemester(),
        ]);

        const studentId = userRes?.data?.studentId;
        const today = dayjs();

        const currentSemester = semesterRes?.data?.semesters?.find(
          (semester) => {
            const start = dayjs(semester.startDate);
            const end = dayjs(semester.endDate);
            return today.isAfter(start) && today.isBefore(end);
          }
        );

        const semesterId = currentSemester?.id;
        console.log("semesterId", semesterId);
        if (studentId) setStudentId(studentId);
        if (semesterId) setSemesterId(semesterId);

        if (studentId && semesterId) {
          const res = await handleTotalCourseSchedule(studentId, semesterId);
          setStats((prev) => ({ ...prev, totalCourses: res?.data || 0 }));
        }
      } catch (err) {
        console.error("Lỗi khi fetch thông tin sinh viên:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [userId]);

  useEffect(() => {
    const fetchPaginatedData = async (fetchFn, key) => {
      const pageSize = 10;
      let allData = [];
      let page = 0;
      let totalPages = 1;
      do {
        const res = await fetchFn(page, pageSize);
        if (res?.data) {
          allData = [...allData, ...(res.data.notifications || res.data)];
          totalPages = res.data.totalPages;
          page++;
        } else break;
      } while (page < totalPages);
      return allData;
    };

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [notificationsData, unreadRes, groupsData] = await Promise.all([
          fetchPaginatedData(handleListNotification, "notifications"),
          handleUnreadCountNotificationUser(userId),
          fetchPaginatedData(
            handleListGroupByStudent.bind(null, userId),
            "groups"
          ),
        ]);

        setNotifications(notificationsData);
        setGroups(groupsData);

        setStats((prev) => ({
          ...prev,
          notifications: notificationsData.length,
          unreadNotifications: unreadRes?.data || 0,
          totalGroups: groupsData.length,
        }));
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [userId]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-gray-50 overflow-auto">
      <div className="space-y-8 p-8 overflow-y-auto max-h-[700px]">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Nhóm học tập"
            value={stats.totalGroups}
            icon={Users}
            color="text-primary"
          />
          <StatCard
            title="Lớp học phần"
            value={stats.totalCourses}
            icon={BookOpen}
            color="text-primary"
          />
          <StatCard
            title="Tổng số thông báo"
            value={stats.notifications}
            icon={Bell}
            color="text-green-500"
          />
          <StatCard
            title="Thông báo chưa đọc"
            value={stats.unreadNotifications}
            icon={Bell}
            color="text-red-500"
          />
        </motion.div>

        {/* Notifications & Groups */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        >
          {/* Notifications */}
          <Card className="col-span-3 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thông báo mới</CardTitle>
                <Badge variant="outline">{stats.notifications} mới</Badge>
              </div>
              <CardDescription>Các thông báo mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <EmptyState message="Không có thông báo nào" />
                ) : (
                  notifications
                    .slice(0, 5)
                    .map((n) => (
                      <NotificationItem key={n.id} notification={n} />
                    ))
                )}
              </div>
              {notifications.length > 0 && (
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/sinh-vien/notification">Xem tất cả thông báo</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Group Study */}
          <Card className="col-span-4 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Nhóm học tập</CardTitle>
              <CardDescription>
                Các nhóm học tập bạn đang tham gia
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 space-y-4">
                {groups.length === 0 ? (
                  <EmptyState message="Không có nhóm học tập" />
                ) : (
                  groups
                    .slice(0, 5)
                    .map((g) => <GroupItem key={g.id} group={g} />)
                )}
              </div>
              {groups.length > 0 && (
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/sinh-vien/group-study">Xem tất cả nhóm</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageStudent;

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-6 w-6 ${color}`} />
    </CardHeader>
    <CardContent className="flex flex-col items-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <p className="text-sm text-gray-500">{title}</p>
    </CardContent>
  </Card>
);

const EmptyState = ({ message }) => (
  <p className="text-center text-gray-500">{message}</p>
);

const NotificationItem = ({ notification }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0">
      <div
        className={`h-3 w-3 rounded-full ${
          notification.type === "important"
            ? "bg-red-500"
            : notification.type === "assignment"
            ? "bg-yellow-500"
            : "bg-blue-500"
        }`}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{notification.title}</p>
      <p className="text-xs text-gray-500">
        {dayjs(notification.createdAt).format("DD/MM/YYYY HH:mm")}
      </p>
    </div>
  </div>
);

const GroupItem = ({ group }) => (
  <div className="flex items-center space-x-3">
    <Avatar className="h-10 w-10">
      <AvatarFallback className="bg-blue-600 text-white">
        {group.teacherName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div>
      <p className="text-sm font-medium">{group.groupName}</p>
      <p className="text-xs text-gray-500">Giảng viên: {group.teacherName}</p>
    </div>
  </div>
);
