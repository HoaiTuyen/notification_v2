import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Users,
  Calendar,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const StudyModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("2023-2024-1");
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isAssignTeacherOpen, setIsAssignTeacherOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Mock data
  const semesters = [
    { id: "2023-2024-1", name: "Học kỳ 1, 2023-2024", status: "Đang diễn ra" },
    { id: "2023-2024-2", name: "Học kỳ 2, 2023-2024", status: "Sắp diễn ra" },
    { id: "2022-2023-2", name: "Học kỳ 2, 2022-2023", status: "Đã kết thúc" },
  ];

  const courses = [
    {
      id: 1,
      code: "CS101",
      name: "Nhập môn lập trình",
      credits: 3,
      department: "Công nghệ thông tin",
      semester: "2023-2024-1",
      classes: [
        {
          id: 1,
          name: "CNTT-K19A",
          instructor: "Nguyễn Văn A",
          instructorId: "GV001",
          students: 45,
          maxStudents: 50,
          schedule: "Thứ 2, 4, 6 - 07:00-09:00",
          room: "A101",
          status: "Đang diễn ra",
        },
        {
          id: 2,
          name: "CNTT-K19B",
          instructor: null,
          instructorId: null,
          students: 42,
          maxStudents: 50,
          schedule: "Thứ 3, 5, 7 - 09:00-11:00",
          room: "A102",
          status: "Chưa phân công",
        },
      ],
      totalStudents: 87,
      assignedClasses: 1,
      totalClasses: 2,
      status: "Đang mở",
    },
    {
      id: 2,
      code: "CS201",
      name: "Cấu trúc dữ liệu và giải thuật",
      credits: 4,
      department: "Công nghệ thông tin",
      semester: "2023-2024-1",
      classes: [
        {
          id: 3,
          name: "CNTT-K18A",
          instructor: "Trần Thị B",
          instructorId: "GV002",
          students: 38,
          maxStudents: 40,
          schedule: "Thứ 2, 4 - 13:00-16:00",
          room: "B201",
          status: "Đang diễn ra",
        },
      ],
      totalStudents: 38,
      assignedClasses: 1,
      totalClasses: 1,
      status: "Đang mở",
    },
    {
      id: 3,
      code: "MATH101",
      name: "Đại số tuyến tính",
      credits: 3,
      department: "Toán - Tin học",
      semester: "2023-2024-1",
      classes: [
        {
          id: 4,
          name: "TOAN-K19A",
          instructor: null,
          instructorId: null,
          students: 50,
          maxStudents: 50,
          schedule: "Thứ 2, 4 - 07:00-09:00",
          room: "C301",
          status: "Chưa phân công",
        },
      ],
      totalStudents: 50,
      assignedClasses: 0,
      totalClasses: 1,
      status: "Chưa phân công",
    },
  ];

  const availableTeachers = [
    {
      id: "GV001",
      name: "Nguyễn Văn A",
      department: "Công nghệ thông tin",
      specialization: "Lập trình",
    },
    {
      id: "GV002",
      name: "Trần Thị B",
      department: "Công nghệ thông tin",
      specialization: "Thuật toán",
    },
    {
      id: "GV003",
      name: "Lê Văn C",
      department: "Công nghệ thông tin",
      specialization: "Cơ sở dữ liệu",
    },
    {
      id: "GV004",
      name: "Phạm Thị D",
      department: "Toán - Tin học",
      specialization: "Toán học",
    },
    {
      id: "GV005",
      name: "Hoàng Văn E",
      department: "Toán - Tin học",
      specialization: "Thống kê",
    },
  ];

  const stats = [
    {
      title: "Tổng môn học",
      value: courses.length.toString(),
      description: "Học kỳ hiện tại",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Lớp học",
      value: courses
        .reduce((sum, course) => sum + course.classes.length, 0)
        .toString(),
      description: "Tổng số lớp",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Đã phân công",
      value: courses
        .reduce((sum, course) => sum + course.assignedClasses, 0)
        .toString(),
      description: "Lớp có giảng viên",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      title: "Chưa phân công",
      value: courses
        .reduce(
          (sum, course) => sum + (course.totalClasses - course.assignedClasses),
          0
        )
        .toString(),
      description: "Cần phân công GV",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = course.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="min-h-screen w-full bg-white p-10 overflow-y-auto max-h-[700px] ">
      <div className="space-y-6 ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Quản lý đào tạo</h1>
            <p className="text-muted-foreground">
              Quản lý môn học và phân công giảng viên theo học kỳ
            </p>
          </div>
          <Button
            onClick={() => setIsCreateCourseOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Tạo môn học mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Quản lý môn học</TabsTrigger>
            <TabsTrigger value="assignments">Phân công giảng viên</TabsTrigger>
            <TabsTrigger value="schedule">Thời khóa biểu</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <CardTitle>Danh sách môn học</CardTitle>
                    <CardDescription>
                      Quản lý môn học theo học kỳ
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm môn học..."
                        className="pl-8 w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={selectedSemester}
                      onValueChange={setSelectedSemester}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Chọn học kỳ" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester.id} value={semester.id}>
                            {semester.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">
                                {course.name}
                              </CardTitle>
                              <Badge
                                variant={
                                  course.status === "Đang mở"
                                    ? "default"
                                    : course.status === "Chưa phân công"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {course.status}
                              </Badge>
                            </div>
                            <CardDescription>
                              {course.code} • {course.credits} tín chỉ •{" "}
                              {course.department}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setIsAssignTeacherOpen(true);
                                }}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Phân công GV
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">
                              <span className="font-medium">
                                {course.totalStudents}
                              </span>{" "}
                              sinh viên
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              <span className="font-medium">
                                {course.totalClasses}
                              </span>{" "}
                              lớp học
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">
                              <span className="font-medium">
                                {course.assignedClasses}/{course.totalClasses}
                              </span>{" "}
                              đã phân công
                            </span>
                          </div>
                        </div>

                        {/* Classes */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">
                            Danh sách lớp học:
                          </h4>
                          <div className="space-y-2">
                            {course.classes.map((classItem) => (
                              <div
                                key={classItem.id}
                                className="p-3 border rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {classItem.name}
                                    </span>
                                    <Badge
                                      variant={
                                        classItem.instructor
                                          ? "default"
                                          : "destructive"
                                      }
                                    >
                                      {classItem.status}
                                    </Badge>
                                  </div>
                                  <Badge variant="outline">
                                    {classItem.students}/{classItem.maxStudents}{" "}
                                    SV
                                  </Badge>
                                </div>
                                <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    GV:{" "}
                                    {classItem.instructor || "Chưa phân công"}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Phòng {classItem.room}
                                  </div>
                                  <div className="flex items-center gap-1 md:col-span-2">
                                    <Clock className="h-3 w-3" />
                                    {classItem.schedule}
                                  </div>
                                </div>
                                {!classItem.instructor && (
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedCourse({
                                          ...course,
                                          selectedClass: classItem,
                                        });
                                        setIsAssignTeacherOpen(true);
                                      }}
                                    >
                                      <UserPlus className="mr-1 h-3 w-3" />
                                      Phân công GV
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phân công giảng viên</CardTitle>
                <CardDescription>
                  Quản lý phân công giảng viên cho các lớp học
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Lớp học</TableHead>
                      <TableHead>Giảng viên</TableHead>
                      <TableHead>Sinh viên</TableHead>
                      <TableHead>Lịch học</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.flatMap((course) =>
                      course.classes.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{course.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {course.code}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{classItem.name}</TableCell>
                          <TableCell>
                            {classItem.instructor || (
                              <span className="text-muted-foreground">
                                Chưa phân công
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {classItem.students}/{classItem.maxStudents}
                          </TableCell>
                          <TableCell className="text-sm">
                            {classItem.schedule}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                classItem.instructor ? "default" : "destructive"
                              }
                            >
                              {classItem.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCourse({
                                  ...course,
                                  selectedClass: classItem,
                                });
                                setIsAssignTeacherOpen(true);
                              }}
                            >
                              {classItem.instructor ? "Thay đổi" : "Phân công"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thời khóa biểu tổng hợp</CardTitle>
                <CardDescription>
                  Xem thời khóa biểu của tất cả lớp học
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tính năng thời khóa biểu đang được phát triển</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog phân công giảng viên */}
        <Dialog
          open={isAssignTeacherOpen}
          onOpenChange={setIsAssignTeacherOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Phân công giảng viên</DialogTitle>
              <DialogDescription>
                Chọn giảng viên phụ trách lớp học
              </DialogDescription>
            </DialogHeader>
            {selectedCourse && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedCourse.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCourse.selectedClass?.name} •{" "}
                    {selectedCourse.selectedClass?.schedule}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Chọn giảng viên</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giảng viên..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeachers
                        .filter(
                          (teacher) =>
                            teacher.department === selectedCourse.department
                        )
                        .map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.specialization}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAssignTeacherOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={() => setIsAssignTeacherOpen(false)}>
                Phân công
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog tạo môn học mới */}
        <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tạo môn học mới</DialogTitle>
              <DialogDescription>Thêm môn học mới vào học kỳ</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-code">Mã môn học</Label>
                  <Input id="course-code" placeholder="VD: CS101" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Số tín chỉ</Label>
                  <Input id="credits" type="number" placeholder="3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-name">Tên môn học</Label>
                <Input id="course-name" placeholder="Nhập tên môn học" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Khoa</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cntt">Công nghệ thông tin</SelectItem>
                    <SelectItem value="toan">Toán - Tin học</SelectItem>
                    <SelectItem value="kinh-te">Kinh tế</SelectItem>
                    <SelectItem value="ngoai-ngu">Ngoại ngữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Học kỳ</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" placeholder="Mô tả môn học..." />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateCourseOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={() => setIsCreateCourseOpen(false)}>
                Tạo môn học
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default StudyModule;
