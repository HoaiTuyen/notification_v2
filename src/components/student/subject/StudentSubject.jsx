import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  GraduationCap,
  Search,
  Filter,
  Download,
  Eye,
  Users,
  FileText,
  Video,
  CalendarIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { handleListSemester } from "../../../controller/SemesterController";
import { handleListClassSectionStudent } from "../../../controller/StudentController";
import { handleGetDetailUser } from "../../../controller/AccountController";
import { jwtDecode } from "jwt-decode";
import CheckCourseSchedule from "./CheckCourseSchedule";
import dayjs from "dayjs";
import { handleCheckCourseSchedule } from "../../../controller/AccountController";
import { toast } from "react-toastify";

import { Spin } from "antd";
// Mock data for student courses
const studentCourses = [
  {
    id: 1,
    code: "CS101",
    name: "Nhập môn lập trình",
    instructor: "TS. Nguyễn Văn A",
    credits: 3,
    semester: "HK1 2023-2024",
    schedule: [
      { day: "Thứ 2", time: "07:00-09:00", room: "A101", type: "Lý thuyết" },
      { day: "Thứ 4", time: "07:00-09:00", room: "B201", type: "Thực hành" },
    ],
    progress: 75,
    attendance: 18,
    totalSessions: 20,
    assignments: 3,
    completedAssignments: 2,
    nextClass: "2024-01-15T07:00:00",
    status: "Đang học",
    grade: null,
    description: "Môn học cơ bản về lập trình với ngôn ngữ Python",
    materials: 12,
    announcements: 5,
  },
  {
    id: 2,
    code: "CS201",
    name: "Cấu trúc dữ liệu và giải thuật",
    instructor: "ThS. Trần Thị B",
    credits: 4,
    semester: "HK1 2023-2024",
    schedule: [
      { day: "Thứ 3", time: "09:00-11:00", room: "B201", type: "Lý thuyết" },
      { day: "Thứ 5", time: "13:00-15:00", room: "C301", type: "Thực hành" },
    ],
    progress: 60,
    attendance: 15,
    totalSessions: 18,
    assignments: 4,
    completedAssignments: 3,
    nextClass: "2024-01-16T09:00:00",
    status: "Đang học",
    grade: null,
    description: "Học về các cấu trúc dữ liệu cơ bản và nâng cao",
    materials: 18,
    announcements: 3,
  },
  {
    id: 3,
    code: "MATH101",
    name: "Đại số tuyến tính",
    instructor: "PGS. Lê Văn C",
    credits: 3,
    semester: "HK1 2023-2024",
    schedule: [
      { day: "Thứ 2", time: "13:00-15:00", room: "C301", type: "Lý thuyết" },
      { day: "Thứ 6", time: "07:00-09:00", room: "D101", type: "Bài tập" },
    ],
    progress: 85,
    attendance: 16,
    totalSessions: 16,
    assignments: 2,
    completedAssignments: 2,
    nextClass: "2024-01-19T07:00:00",
    status: "Đang học",
    grade: null,
    description: "Môn toán cơ sở cho ngành công nghệ thông tin",
    materials: 8,
    announcements: 2,
  },
  {
    id: 4,
    code: "ENG101",
    name: "Tiếng Anh học thuật",
    instructor: "ThS. Ngô Thị D",
    credits: 2,
    semester: "HK1 2023-2024",
    schedule: [
      { day: "Thứ 7", time: "07:00-09:00", room: "E201", type: "Lý thuyết" },
    ],
    progress: 90,
    attendance: 14,
    totalSessions: 15,
    assignments: 5,
    completedAssignments: 5,
    nextClass: "2024-01-20T07:00:00",
    status: "Hoàn thành",
    grade: "A",
    description: "Phát triển kỹ năng tiếng Anh học thuật",
    materials: 15,
    announcements: 1,
  },
];

const upcomingClasses = [
  {
    id: 1,
    courseCode: "CS101",
    courseName: "Nhập môn lập trình",
    time: "07:00-09:00",
    date: "2024-01-15",
    room: "A101",
    type: "Lý thuyết",
    instructor: "TS. Nguyễn Văn A",
  },
  {
    id: 2,
    courseCode: "CS201",
    courseName: "Cấu trúc dữ liệu và giải thuật",
    time: "09:00-11:00",
    date: "2024-01-16",
    room: "B201",
    type: "Lý thuyết",
    instructor: "ThS. Trần Thị B",
  },
  {
    id: 3,
    courseCode: "MATH101",
    courseName: "Đại số tuyến tính",
    time: "07:00-09:00",
    date: "2024-01-19",
    room: "D101",
    type: "Bài tập",
    instructor: "PGS. Lê Văn C",
  },
];

const weeklySchedule = [
  {
    day: "Thứ 2",
    slots: [
      { time: "07:00-09:00", course: "CS101", room: "A101", type: "Lý thuyết" },
      {
        time: "13:00-15:00",
        course: "MATH101",
        room: "C301",
        type: "Lý thuyết",
      },
    ],
  },
  {
    day: "Thứ 3",
    slots: [
      { time: "09:00-11:00", course: "CS201", room: "B201", type: "Lý thuyết" },
    ],
  },
  {
    day: "Thứ 4",
    slots: [
      { time: "07:00-09:00", course: "CS101", room: "B201", type: "Thực hành" },
    ],
  },
  {
    day: "Thứ 5",
    slots: [
      { time: "13:00-15:00", course: "CS201", room: "C301", type: "Thực hành" },
    ],
  },
  {
    day: "Thứ 6",
    slots: [
      { time: "07:00-09:00", course: "MATH101", room: "D101", type: "Bài tập" },
    ],
  },
  {
    day: "Thứ 7",
    slots: [
      {
        time: "07:00-09:00",
        course: "ENG101",
        room: "E201",
        type: "Lý thuyết",
      },
    ],
  },
  { day: "Chủ nhật", slots: [] },
];

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesterList, setSemesterList] = useState([]);
  const [classSectionList, setClassSectionList] = useState([]);
  const [notifyDisabled, setNotifyDisabled] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [isCheckSend, setIsCheckSend] = useState(false);
  const [loading, setLoading] = useState(true);
  const filteredCourses = classSectionList.map((section, index) => {
    return {
      id: `${section.subjectId}-${section.id.groupId}`,
      code: section.subjectId,
      name: section.subjectName,
      semester: section.semesterName,
      date: `Thời gian bắt đầu: ${dayjs(section.startDate).format(
        "DD/MM/YYYY"
      )} - Thời gian kết thúc: ${dayjs(section.endDate).format("DD/MM/YYYY")}`,
      classes: section.courseSchedules.map((s, i) => ({
        id: `${section.subjectId}-${section.id.groupId}-${i}`,
        name: `Nhóm môn học ${section.id.groupId.toString().padStart(2, "0")}`,
        schedule: `Thứ ${s.id.day}, tiết ${s.id.startPeriod}-${s.id.endPeriod}`,
        room: s.id.room || "Trống",
      })),
    };
  });
  const handleToggleNotification = (checked) => {
    if (checked) {
      setShowDialog(true); // xác nhận tắt
    } else {
      // Bật lại không cần hỏi
      updateNotificationSetting(false);
    }
  };
  const updateNotificationSetting = async (checked) => {
    try {
      setLoading(true);
      const res = await handleCheckCourseSchedule(studentId, checked); // true = tắt, false = bật

      setNotifyDisabled(checked);
      setIsCheckSend(checked);
      toast.success(res.message || "Cập nhật trạng thái thông báo thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật thông báo:", err);
      toast.error(err.response.data.message || "Lỗi khi cập nhật thông báo");
    } finally {
      setLoading(false);
    }
  };
  const confirmDisableNotification = () => {
    setShowDialog(false);
    updateNotificationSetting(true);
    setIsCheckSend(true);
  };
  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await handleListSemester("desc", 0, 10);
        if (res?.data?.semesters) {
          const list = res?.data?.semesters || [];
          setSemesterList(list);
          if (list.length > 0) {
            setSelectedSemester(list[0].id);
            fetchClassOfStudent(list[0].id);
          }
        }
      } catch (err) {
        console.error("Lỗi khi fetch học kỳ:", err);
      }
    };
    fetchSemester();
  }, []);
  const handleSemesterChange = async (value) => {
    setSelectedSemester(value); // Cập nhật select
    await fetchClassOfStudent(value); // Gọi lại API với học kỳ mới
  };
  const fetchClassOfStudent = async (semesterId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const decoded = jwtDecode(token);
      const userId = decoded?.userId;
      setStudentId(userId);
      const userRes = await handleGetDetailUser(userId);
      setIsCheckSend(userRes?.data?.isCheck);
      const studentId = userRes?.data?.studentId;

      if (!studentId) return;
      const res = await handleListClassSectionStudent(studentId, semesterId);
      if (res?.data?.classSections) {
        const list = res?.data?.classSections || [];
        setClassSectionList(list);
      } else {
        setClassSectionList([]);
      }
    } catch (err) {
      console.error("Lỗi khi fetch lớp học phần:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen w-full bg-white p-0 ">
        <div className="space-y-6 p-10 overflow-y-auto max-h-[700px]">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Môn học của tôi
              </h1>
              <p className="text-muted-foreground">
                Quản lý và theo dõi tiến độ học tập của bạn
              </p>
            </div>
          </div>

          {/* Quick Stats */}

          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="courses">Danh sách môn học</TabsTrigger>
              {/* <TabsTrigger value="timetable">Lịch học</TabsTrigger> */}
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <div className="flex gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-2 py-2">
                  <Checkbox
                    id="notify-6am"
                    checked={isCheckSend}
                    onCheckedChange={handleToggleNotification}
                  />
                  <label
                    htmlFor="notify-6am"
                    className="text-sm cursor-pointer"
                  >
                    Không nhận thông báo khi có lịch học
                  </label>
                </div>
                {showDialog && (
                  <CheckCourseSchedule
                    open={showDialog}
                    onClose={() => setShowDialog(false)}
                    onConfirm={confirmDisableNotification}
                  />
                )}
                <Select
                  value={selectedSemester}
                  onValueChange={handleSemesterChange}
                >
                  <SelectTrigger className="w-[200px] ml-auto">
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesterList.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.nameSemester} - {semester.academicYear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {filteredCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-gray-500 text-base py-12">
                    <BookOpen className="w-8 h-8 mb-3" />
                    <p className="font-medium">
                      Hiện chưa có môn học nào được đăng ký
                    </p>
                  </div>
                ) : (
                  filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">
                                {course.name}
                              </CardTitle>
                              <div className="text-sm text-muted-foreground">
                                {course.date}
                              </div>
                            </div>
                            <CardDescription>
                              {course.code} • {course.semester}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mt-4 space-y-2">
                          <div className="grid gap-2 md:grid-cols-2">
                            {course.classes.map((classItem) => (
                              <div
                                key={classItem.id}
                                className="p-3 border rounded-lg bg-muted/50"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">
                                    {classItem.name}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {classItem.schedule}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Phòng {classItem.room}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
