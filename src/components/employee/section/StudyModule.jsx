import { useEffect, useState } from "react";
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
  Upload,
  MapPin,
} from "lucide-react";
import ImportSection from "./ImportSection";
import { handleListSemester } from "../../../controller/SemesterController";
import ImportRegisterStudentSection from "./ImportRegisterStudentSection";
import {
  handleGetListStudentRegister,
  handleSearchStudentRegister,
} from "../../../controller/SectionController";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { Pagination, Spin, TimePicker } from "antd";
import useDebounce from "@/hooks/useDebounce";
import DeleteSection from "./DeleteSection";
import AddSection from "./AddSection";
import { handleUpdateCronTime } from "../../../controller/SchedulerController";
import { toast } from "react-toastify";

const StudyModule = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [semesterList, setSemesterList] = useState([]);
  const [classSectionList, setClassSectionList] = useState([]);
  const [openModalRegisterStudent, setOpenModalRegisterStudent] =
    useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchListRegisterStudent = async (semesterId, page = 1) => {
    try {
      setLoading(true);
      let res;
      const keyword = debouncedSearchTerm;
      if (keyword) {
        res = await handleSearchStudentRegister(
          keyword,
          semesterId,
          page - 1,
          pagination.pageSize
        );
      } else {
        res = await handleGetListStudentRegister(
          semesterId,
          page - 1,
          pagination.pageSize
        );
      }
      if (res?.data?.classSections) {
        setPagination({
          current: page,
          pageSize: res.data.pageSize,
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        });
        const list = res?.data?.classSections || [];

        const courseMap = {};

        list.forEach((section) => {
          const {
            id: sectionId,
            subjectName,
            subjectId,
            subjectCode,
            teacherName,
            startDate,
            endDate,
            courseSchedules,
            id: { groupId },
          } = section;

          // Tạo khóa gộp theo tên môn học
          if (!courseMap[subjectName]) {
            courseMap[subjectName] = {
              id: subjectId,
              name: subjectName,
              code: subjectId, // hoặc dùng subjectCode nếu có
              sectionId: sectionId,
              startDate,
              endDate,
              totalClasses: 0,
              assignedClasses: 0,
              classes: [],
            };
          }

          const classItem = {
            id: `${subjectId}-${groupId}-${teacherName || "no-teacher"}`,
            sectionId: sectionId,
            name: `Nhóm môn học ${groupId.toString().padStart(2, "0")}`,
            instructor: teacherName || null,
            scheduleRooms: [],
            startDate,
            endDate,
          };

          courseSchedules?.forEach((s) => {
            const scheduleStr = `Thứ ${s.id.day}, tiết ${s.id.startPeriod}–${s.id.endPeriod}`;
            const roomStr = s.id.room || "Chưa có phòng";

            classItem.scheduleRooms.push({
              schedule: scheduleStr,
              room: roomStr,
            });
          });

          courseMap[subjectName].classes.push(classItem);
          courseMap[subjectName].totalClasses += 1;
          courseMap[subjectName].assignedClasses += teacherName ? 1 : 0;
        });

        const transformedData = Object.values(courseMap);
        setClassSectionList(transformedData);
      }
    } catch (err) {
      console.error("Lỗi khi fetch danh sách đăng ký:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemester = async () => {
    try {
      const res = await handleListSemester("desc", 0, 10);
      if (res?.data?.semesters) {
        const list = res?.data?.semesters || [];
        setSemesterList(list);
        if (list.length > 0) {
          const firstSemesterId = list[0].id;
          setSelectedSemester(list[0].id);
          await fetchListRegisterStudent(firstSemesterId);
        }
      }
    } catch (err) {
      console.error("Lỗi khi fetch học kỳ:", err);
    }
  };
  const updateCronTime = async () => {
    if (!selectedTime) {
      toast.warning("Vui lòng chọn thời gian gửi thông báo!");
      return;
    }
    const cron = dayjs(selectedTime).format("HH:mm");

    try {
      await handleUpdateCronTime(cron);
      toast.success("Đã cập nhật thời gian gửi thông báo!");
      setSelectedTime(null);
    } catch (error) {
      console.error("Lỗi cập nhật cron:", error);
      toast.error("Lỗi khi cập nhật thời gian.");
    }
  };

  useEffect(() => {
    setSearchParams({
      search: debouncedSearchTerm,
      page: "1",
    });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (selectedSemester) {
      fetchListRegisterStudent(selectedSemester, pageFromUrl);
    }
  }, [selectedSemester, pageFromUrl, debouncedSearchTerm]);

  useEffect(() => {
    fetchSemester();
  }, []);

  const handleSemesterChange = async (value) => {
    setSelectedSemester(value); // Cập nhật select
    await fetchListRegisterStudent(value); // Gọi lại API với học kỳ mới
  };

  return (
    <div className="w-full bg-white p-10 overflow-y-auto max-h-[750px] ">
      <div className="space-y-6">
        <Card className="p-4  w-full md:w-fit">
          <CardTitle className="text-base mb-2">Nhập dữ liệu từ file</CardTitle>
          <div className="flex flex-col md:flex-row gap-3">
            <Button
              onClick={() => setOpenModalImport(true)}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Nhập danh sách lớp học phần
            </Button>
            <Button
              onClick={() => setOpenModalRegisterStudent(true)}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Nhập danh sách sinh viên đăng ký
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center cursor-pointer"
              onClick={() => setOpenModalAdd(true)}
            >
              <Plus className="h-4 w-4" /> Thêm lớp học phần
            </Button>
          </div>
          {openModalImport && (
            <ImportSection
              open={openModalImport}
              onClose={() => setOpenModalImport(false)}
              onSuccess={() => setOpenModalImport(false)}
            />
          )}
          {openModalRegisterStudent && (
            <ImportRegisterStudentSection
              open={openModalRegisterStudent}
              onClose={() => setOpenModalRegisterStudent(false)}
              onSuccess={() => setOpenModalRegisterStudent(false)}
            />
          )}
          {openModalAdd && (
            <AddSection
              open={openModalAdd}
              onClose={() => setOpenModalAdd(false)}
              onSuccess={() =>
                fetchListRegisterStudent(selectedSemester, pageFromUrl)
              }
            />
          )}
        </Card>

        <Tabs defaultValue="courses" className="space-y-4">
          <div className="flex gap-2 justify-end">
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
              onValueChange={handleSemesterChange}
            >
              <SelectTrigger className="w-[200px]">
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
          <TabsContent value="courses" className="space-y-4">
            <Card className="overflow-y-auto max-h-[600px]">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <CardTitle>Danh sách môn học</CardTitle>
                    <CardDescription>
                      Quản lý môn học theo học kỳ
                    </CardDescription>
                  </div>
                  <div className=" space-y-2">
                    <Label>
                      Chọn thời gian gửi thông báo theo lich học phần
                    </Label>
                    <div className="flex items-center gap-3">
                      <TimePicker
                        format="HH:mm"
                        value={selectedTime}
                        onChange={(time) => setSelectedTime(time)}
                        allowClear={false}
                        placeholder="Chọn giờ"
                      />
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        onClick={updateCronTime}
                      >
                        Lưu thời gian
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                      <Spin size="large" />
                    </div>
                  ) : classSectionList.length === 0 ? (
                    <p className="text-center">Không có dữ liệu phù hợp</p>
                  ) : (
                    classSectionList.map((course) => (
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
                                <div>
                                  Thời gian bắt đầu:{" "}
                                  {dayjs(course.startDate).format("DD/MM/YYYY")}
                                  {" - "}
                                  Thời gian kết thúc:{"  "}
                                  {dayjs(course.endDate).format("DD/MM/YYYY")}
                                </div>
                              </div>
                              <CardDescription>{course.code}</CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => {
                                    setSelectedSection(course.sectionId);
                                    setOpenModalDelete(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                              Danh sách lớp học:
                            </h4>
                            {course.classes.length === 0 ? (
                              <div className="text-sm italic text-muted-foreground">
                                <AlertCircle className="inline h-4 w-4 mr-1 text-red-500" />
                                Chưa có lớp học nào
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                      </div>
                                    </div>
                                    <div className="grid gap-2 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        GV:{" "}
                                        {classItem.instructor ||
                                          "Chưa phân công"}
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-1">
                                        {classItem.scheduleRooms?.map(
                                          (item, idx) => (
                                            <div
                                              key={idx}
                                              className="flex flex-col text-sm text-muted-foreground border rounded px-2 py-1"
                                            >
                                              <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {item.schedule}
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {item.room}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page) => {
            const params = new URLSearchParams({
              search: debouncedSearchTerm,
              page: page.toString(),
            });
            setSearchParams(params);
          }}
        />
      </div>
      {openModalDelete && (
        <DeleteSection
          onOpen={openModalDelete}
          onClose={() => setOpenModalDelete(false)}
          section={selectedSection}
          onSuccess={() => fetchListRegisterStudent(selectedSemester)}
        />
      )}
    </div>
  );
};
export default StudyModule;
