import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Bell,
  Calendar,
  TrendingUp,
  Clock,
  School,
  Shapes,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  handleCountCourseSchedule,
  handleCountGroupCreate,
  handleCountSubjectCharge,
  handleListClassSectionTeacher,
  handleListClassOfTeacher,
} from "../../../controller/TeacherController";
import { handleGetDetailUser } from "../../../controller/AccountController";
import { handleListSemester } from "../../../controller/SemesterController";
import { Spin } from "antd";

const HomeLecturerPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token") || "";
  const { userId } = jwtDecode(token);
  const [teacherId, setTeacherId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [statsData, setStatsData] = useState({
    totalCourses: 0,
    totalGroups: 0,
    totalSubjects: 0,
  });
  const [classSectionList, setClassSectionList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const userRes = await handleGetDetailUser(userId);
      const teacherId = userRes?.data?.teacherId;
      if (!teacherId) return;

      setTeacherId(teacherId);

      const semesterRes = await handleListSemester("desc", 0, 10);
      const semesters = semesterRes?.data?.semesters || [];
      if (!semesters.length) return;

      const currentSemesterId = semesters[0].id;
      setSemesterId(currentSemesterId);
      const classRes = await handleListClassOfTeacher(teacherId);
      // Gọi song song 3 API
      const [
        classSectionsRes,
        totalCoursesRes,
        totalGroupsRes,
        totalSubjectsRes,
      ] = await Promise.all([
        handleListClassSectionTeacher(teacherId, currentSemesterId),
        handleCountCourseSchedule(teacherId),
        handleCountGroupCreate(teacherId),
        handleCountSubjectCharge(teacherId, currentSemesterId),
      ]);

      if (classSectionsRes?.data?.classSections)
        setClassSectionList(classSectionsRes.data.classSections);

      setStatsData({
        totalCourses: totalCoursesRes?.data || 0,
        totalGroups: totalGroupsRes?.data || 0,
        totalSubjects: totalSubjectsRes?.data || 0,
      });
      setClasses(classRes.data);
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu giảng viên:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Môn học phụ trách",
      value: statsData.totalSubjects,
      description: "Học kỳ này",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Lớp học",
      value: statsData.totalCourses,
      description: "Chủ nhiệm",
      icon: School,
      color: "text-green-600",
    },
    {
      title: "Nhóm học tập",
      value: statsData.totalGroups,
      description: "Tổng số",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Lớp học phần",
      value: statsData.totalSubjects,
      description: "Học kỳ này",
      icon: Shapes,
      color: "text-orange-600",
    },
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredCourses = classSectionList.map((section, index) => {
    return {
      id: `${section.subjectId}-${section.id.groupId}`,
      code: section.subjectId,
      name: section.subjectName,
      semester: section.semesterName,
      classes: section.courseSchedules.map((s, i) => ({
        id: `${section.subjectId}-${section.id.groupId}-${i}`,
        name: `Nhóm môn học ${section.id.groupId.toString().padStart(2, "0")}`,
        schedule: `Thứ ${s.id.day}, tiết ${s.id.startPeriod}-${s.id.endPeriod}`,
        room: s.id.room || "Trống",
      })),
    };
  });
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="h-full w-full bg-white p-0 overflow-auto">
      <div className="space-y-6 p-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ title, value, description, icon: Icon, color }) => (
            <Card key={title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Lịch giảng dạy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Calendar className="h-5 w-5" />
                Lịch giảng dạy
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-4 flex-1 pb-3">
                {filteredCourses.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-primary">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.code} - {item.classes[0].room}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          item.classes[0].schedule ===
                          "Thứ 2, 4, 6 - 07:00-09:00"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {item.semester}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.classes[0].schedule}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {filteredCourses.length != 0 && (
                <Button
                  className="w-full mt-auto cursor-pointer"
                  variant="outline"
                  onClick={() => navigate("/giang-vien/subject-charge")}
                >
                  Xem chi tiết
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Hoạt động gần đây */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <School className="h-5 w-5" />
                Lớp chủ nhiệm
              </CardTitle>
              <CardDescription>Lớp học được chủ nhiệm</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-4 flex-1 pb-3">
                {classes.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Không có lớp học nào
                  </p>
                ) : (
                  classes.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Khoa: {item.departmentName}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {classes.length != 0 && (
                <Button
                  className="w-full mt-auto cursor-pointer"
                  variant="outline"
                  onClick={() => navigate("/giang-vien/class-charge")}
                >
                  Xem chi tiết
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeLecturerPage;
