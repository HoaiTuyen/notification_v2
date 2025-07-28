import { useState, useEffect } from "react";

import { Pagination } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Upload } from "lucide-react";
import {
  handleListStudentByClass,
  handleSearchStudentByClass,
} from "../../../../controller/ClassController";
import { handleSearchStudent } from "../../../../controller/StudentController";
import ImportStudentOfClassModal from "./ImportStudentOfClassModal";
import useDebounce from "../../../../hooks/useDebounce";
import DetailStudentOfClass from "./DetailStudentByClass";
const ListStudentOfClass = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [studentByClass, setStudentByClass] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dataClass, setDataClass] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const backUrl =
    location.state?.from || `/admin/class?search=${searchFromUrl}&page=${page}`;

  const renderGender = (gender) => {
    switch (gender) {
      case "NAM":
        return "Nam";
      case "NỮ":
        return "Nữ";
      case "KHÁC":
        return "Khác";
      default:
        return "Không rõ";
    }
  };
  function filterStudents(status) {
    switch (status) {
      case "ĐANG_HỌC":
        return { label: "Đang học", className: "bg-green-100 text-green-800" };
      case "BẢO_LƯU":
        return { label: "Bảo lưu", className: "bg-yellow-100 text-yellow-800" };
      case "ĐÃ_TỐT_NGHIỆP":
        return {
          label: "Đã tốt nghiệp",
          className: "bg-blue-100 text-blue-800",
        };
      case "THÔI_HỌC":
        return { label: "Thôi học", className: "bg-red-100 text-red-800" };

      default:
        break;
    }
  }
  const fetchListStudentByClass = async (page = 1) => {
    let res;
    const keyword = debouncedSearchTerm.trim();
    if (keyword) {
      res = await handleSearchStudentByClass(
        classId,
        keyword,
        page - 1,
        pagination.pageSize
      );
    } else {
      res = await handleListStudentByClass(
        classId,
        page - 1,
        pagination.pageSize
      );
    }

    if (res?.data && res?.status === 200) {
      setStudentByClass(res.data.students);
      setDataClass(res.data);
      setPagination({
        current: page,
        pageSize: res.data.pageSize,
        total: res.data.totalElements,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
      });
    }
  };
  useEffect(() => {
    fetchListStudentByClass(pagination.current);
  }, [pagination.current, debouncedSearchTerm]);
  return (
    <div className="h-full w-full bg-white p-10 overflow-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => navigate(backUrl)}
            >
              <div className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
              </div>
            </Button>
            <h2 className="text-2xl font-bold">
              Danh sách sinh viên thuộc lớp
            </h2>
          </div>
          <div>
            {[...new Set(studentByClass.map((item) => item.className))].map(
              (className) => (
                <span key={className} className="font-medium mr-2">
                  Lớp: {className}
                </span>
              )
            )}
            <Badge>{dataClass.totalElements}</Badge>
          </div>
        </div>

        <Card className="overflow-y-auto max-h-[550px]">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Danh sách sinh viên thuộc lớp</CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex items-center cursor-pointer"
                  onClick={() => setOpenUpload(true)}
                >
                  <Upload className="mr-2 h-4 w-4" /> Nhập danh sách
                </Button>
                {openUpload && (
                  <ImportStudentOfClassModal
                    open={openUpload}
                    onClose={() => setOpenUpload(false)}
                    onSuccess={fetchListStudentByClass}
                  />
                )}
                {/* <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Thêm sinh viên
                </Button> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative flex-1 mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sinh viên..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/6">Mã SV</TableHead>
                    <TableHead className="w-1/6">Họ và tên</TableHead>
                    <TableHead className="w-1/6">Email</TableHead>
                    <TableHead className="w-1/6 text-center">
                      Giới tính
                    </TableHead>
                    <TableHead className="w-1/6 text-center">Lớp</TableHead>
                    <TableHead className="w-1/6  text-center">
                      Trạng thái
                    </TableHead>
                    {/* <TableHead className="w-1/6 text-center">
                      Thao tác
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentByClass.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center h-24 text-muted-foreground"
                      >
                        Không có sinh viên nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentByClass.map((student) => (
                      <TableRow
                        key={student.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedStudent(student);
                          setOpenDetail(true);
                        }}
                      >
                        <TableCell className="font-medium">
                          {student.id}
                        </TableCell>
                        <TableCell>
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-center">
                          {renderGender(student.gender)}
                        </TableCell>
                        <TableCell className="text-center">
                          {student.className}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={filterStudents(student.status).className}
                          >
                            {filterStudents(student.status).label}
                          </Badge>
                        </TableCell>
                        {/* <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <span className="sr-only">Xóa</span>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {openDetail && (
          <DetailStudentOfClass
            open={openDetail}
            onClose={() => setOpenDetail(false)}
            student={selectedStudent}
          />
        )}
        {pagination.totalElements >= 10 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={false}
              onChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ListStudentOfClass;
