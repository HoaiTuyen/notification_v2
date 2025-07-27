import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Ellipsis, FileText, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AddStudent from "./AddStudent";
import DeleteStudent from "./DeleteStudent";
import {
  handleListStudent,
  handleSearchStudent,
} from "../../../controller/StudentController";
import { Pagination } from "antd";
import useDebounce from "../../../hooks/useDebounce";
import ImportStudentModal from "./ImportStudentModal";
import { Spin } from "antd";
const StudentEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const statusFromUrl = searchParams.get("status") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectStatus, setSelectStatus] = useState(statusFromUrl || "all");
  const [openUpload, setOpenUpload] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      let response;
      let keyword = [
        debouncedSearchTerm,
        selectStatus !== "all" ? selectStatus : "",
      ]
        .filter(Boolean)
        .join(" ");
      if (keyword.trim() === "") {
        response = await handleListStudent(page - 1, pagination.pageSize);
      } else {
        const searchTerm = debouncedSearchTerm.trim();
        const status = selectStatus !== "all" ? selectStatus : "";
        response = await handleSearchStudent(
          status,
          searchTerm,
          page - 1,
          pagination.pageSize
        );
      }

      if (response?.data) {
        setStudents(response.data.students);
        setPagination({
          current: page,
          pageSize: response.data.pageSize,
          total: response.data.totalElements,
          totalPages: response.data.totalPages,
        });
      } else {
        setStudents([]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (debouncedSearchTerm !== searchFromUrl) {
      setSearchParams({
        search: debouncedSearchTerm,
        page: "1",
      });
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    fetchStudents(pageFromUrl);
  }, [searchFromUrl, pageFromUrl, selectStatus]);

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
  const openModalEdit = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <div className="h-full w-full bg-white p-0 overflow-auto ">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          <Button
            variant="outline"
            className="flex items-center cursor-pointer"
            onClick={() => setOpenUpload(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Nhập danh sách sinh viên
          </Button>
          {openUpload && (
            <ImportStudentModal
              open={openUpload}
              onClose={() => setOpenUpload(false)}
              onSuccess={fetchStudents}
            />
          )}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" /> Thêm sinh viên
          </Button>
          {showModal && (
            <AddStudent
              open={showModal}
              onClose={() => {
                setShowModal(false), setSelectedStudent(null);
              }}
              onSuccess={() => fetchStudents(pageFromUrl)}
              student={selectedStudent}
            />
          )}
        </div>

        {/* Card */}
        <Card
          className="border border-gray-100 overflow-y-auto max-h-[600px]"
          // style={{ overflowY: "auto", maxHeight: "600px" }}
        >
          <CardHeader>
            <CardTitle>Danh sách sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sinh viên theo tên..."
                  className="pl-8 border-none shadow-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* <Select>
                <SelectTrigger className="w-[200px] border border-gray-100 rounded-md shadow-none focus:ring-0">
                  <SelectValue placeholder="Tất cả các khoa" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded border border-gray-200">
                  <SelectItem value="all">Tất cả các khoa</SelectItem>
                  <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
                  <SelectItem value="Toán-Tin">Toán - Tin học</SelectItem>
                </SelectContent>
              </Select> */}
              <Select
                value={selectStatus}
                onValueChange={(value) => setSelectStatus(value)}
              >
                <SelectTrigger className="w-[200px] border border-gray-100 rounded-md shadow-none focus:ring-0">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded border border-gray-200">
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ĐANG_HỌC">Đang học</SelectItem>
                  <SelectItem value="ĐÃ_TỐT_NGHIỆP">Đã tốt nghiệp</SelectItem>
                  <SelectItem value="BẢO_LƯU">Bảo lưu</SelectItem>
                  <SelectItem value="THÔI_HỌC">Thôi học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded border border-gray-200 ">
              <Table>
                <TableHeader>
                  <TableRow className="border border-gray-200">
                    <TableHead>MSSV</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Khoa</TableHead>
                    <TableHead className="justify-start">Giới tính</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        <Spin size="large" />
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        {debouncedSearchTerm
                          ? "Không có dữ liệu sinh viên phù hợp"
                          : "Chưa có sinh viên nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow
                        className="border border-gray-200"
                        key={student?.id}
                      >
                        <TableCell className="font-medium" title={student?.id}>
                          {student?.id}
                        </TableCell>
                        <TableCell
                          title={student?.firstName + " " + student?.lastName}
                        >
                          <div className="max-w-[160px] truncate">
                            {student?.firstName} {student?.lastName}
                          </div>
                        </TableCell>
                        <TableCell title={student?.email}>
                          <div className="max-w-[100px] truncate">
                            {student?.email}
                          </div>
                        </TableCell>
                        <TableCell title={student?.className}>
                          <div className="max-w-[100px] truncate">
                            {student?.className || "Trống"}
                          </div>
                        </TableCell>
                        <TableCell title={student?.departmentName}>
                          <div className="max-w-[100px] truncate">
                            {student?.departmentName || "Trống"}
                          </div>
                        </TableCell>
                        <TableCell title={student?.gender}>
                          {renderGender(student?.gender)}
                        </TableCell>
                        <TableCell title={student?.status}>
                          <Badge
                            className={
                              filterStudents(student?.status).className
                            }
                          >
                            {filterStudents(student?.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="pl-4">
                          <DropdownMenu asChild>
                            <DropdownMenuTrigger>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer"
                              >
                                <Ellipsis className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openModalEdit(student)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setOpenModalDelete(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {openModalDelete && (
          <DeleteStudent
            open={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            student={selectedStudent}
            onSuccess={() => {
              setSelectedStudent(null);
              fetchStudents(pageFromUrl);
            }}
          />
        )}
        {pagination.total >= 10 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={false}
              onChange={(page) => {
                setSearchParams({
                  search: debouncedSearchTerm,
                  page: page.toString(),
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEmployee;
