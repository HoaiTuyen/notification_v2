import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Eye,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  School,
  Info,
  Clock,
  MapPin,
  FileText,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";
import { handleListClassOfTeacher } from "../../../controller/TeacherController";
import { handleGetDetailUser } from "../../../controller/AccountController";
import { jwtDecode } from "jwt-decode";

import { Spin } from "antd";
const ClassCharge = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchClass = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const data = jwtDecode(token);
      const req = await handleGetDetailUser(data.userId);
      if (req?.data && req?.status === 200) {
        const teacherDetail = await handleListClassOfTeacher(
          req.data.teacherId
        );
        setClasses(teacherDetail.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Lỗi khi fetch lớp học:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClass();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="w-full bg-white overflow-y-auto max-h-[700px] p-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lớp học phụ trách</h1>
          <p className="text-muted-foreground">Quản lý lớp chủ nhiệm</p>
        </div>

        {/* Stats Cards */}

        <Tabs defaultValue="homeroom" className="space-y-4">
          <TabsList>
            <TabsTrigger value="homeroom">Lớp chủ nhiệm</TabsTrigger>
          </TabsList>

          {/* Lớp chủ nhiệm */}
          <TabsContent value="homeroom" className="space-y-4">
            {classes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa được phân công</p>
              </div>
            ) : (
              classes.map((cls) => (
                <Card className="pb-0">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-3">
                          <School className="h-5 w-5" />
                          Lớp {cls.name}
                        </CardTitle>
                        <CardDescription>
                          {cls.departmentName} • {cls.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            navigate(`/giang-vien/class-charge/${cls.id}`)
                          }
                          className="w-[250px] cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default ClassCharge;

{
  /* <CardContent> */
}
{
  /* <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Tổng sinh viên</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {homeRoomClass.totalStudents}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Nam: {homeRoomClass.maleStudents} • Nữ:{" "}
                      {homeRoomClass.femaleStudents}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">GPA trung bình</span>
                    </div>
                    <div className="text-2xl font-bold">8.1</div>
                    <div className="text-sm text-muted-foreground">
                      Học kỳ này
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Tín chỉ TB</span>
                    </div>
                    <div className="text-2xl font-bold">115</div>
                    <div className="text-sm text-muted-foreground">
                      Đã tích lũy
                    </div>
                  </div>
                </div> */
}

{
  /* Students List */
}
{
  /* <div className="space-y-4">
                  <h4 className="font-medium">Danh sách sinh viên</h4>
                  <div className="grid gap-4">
                    {homeRoomClass.students
                      .filter(
                        (student) =>
                          student.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          student.studentId.includes(searchTerm)
                      )
                      .map((student) => (
                        <Card key={student.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={student.avatar || "/placeholder.svg"}
                                  alt={student.name}
                                />
                                <AvatarFallback>
                                  {student.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {student.name}
                                  </h4>
                                  {getStatusBadge(student.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  MSSV: {student.studentId}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {student.email}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {student.phone}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <div
                                    className={`text-lg font-bold ${getGradeColor(
                                      student.gpa
                                    )}`}
                                  >
                                    {student.gpa}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    GPA
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold">
                                    {student.credits}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Tín chỉ
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setSelectedStudent(student)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      Chi tiết
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Thông tin sinh viên
                                      </DialogTitle>
                                      <DialogDescription>
                                        Chi tiết thông tin học tập và cá nhân
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedStudent && (
                                      <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                          <Avatar className="h-16 w-16">
                                            <AvatarImage
                                              src={
                                                selectedStudent.avatar ||
                                                "/placeholder.svg"
                                              }
                                              alt={selectedStudent.name}
                                            />
                                            <AvatarFallback>
                                              {selectedStudent.name.charAt(0)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <h3 className="text-lg font-semibold">
                                              {selectedStudent.name}
                                            </h3>
                                            <p className="text-muted-foreground">
                                              MSSV: {selectedStudent.studentId}
                                            </p>
                                            {getStatusBadge(
                                              selectedStudent.status
                                            )}
                                          </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                          <div className="space-y-2">
                                            <h4 className="font-medium">
                                              Thông tin cá nhân
                                            </h4>
                                            <div className="space-y-1 text-sm">
                                              <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {selectedStudent.email}
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {selectedStudent.phone}
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {selectedStudent.address}
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Sinh:{" "}
                                                {selectedStudent.birthDate}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <h4 className="font-medium">
                                              Thông tin học tập
                                            </h4>
                                            <div className="space-y-1 text-sm">
                                              <div>
                                                GPA:{" "}
                                                <span
                                                  className={`font-bold ${getGradeColor(
                                                    selectedStudent.gpa
                                                  )}`}
                                                >
                                                  {selectedStudent.gpa}
                                                </span>
                                              </div>
                                              <div>
                                                Tín chỉ tích lũy:{" "}
                                                <span className="font-bold">
                                                  {selectedStudent.credits}
                                                </span>
                                              </div>
                                              <div>
                                                Ngày nhập học:{" "}
                                                {selectedStudent.enrollmentDate}
                                              </div>
                                              <div>
                                                Trạng thái:{" "}
                                                {getStatusBadge(
                                                  selectedStudent.status
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Thao tác
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                      Gửi tin nhắn
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileText className="mr-2 h-4 w-4" />
                                      Xem bảng điểm
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div> */
}
{
  /* </CardContent>; */
}
