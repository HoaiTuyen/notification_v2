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
import AddTeacher from "./AddTeacher";
import DeleteTeacher from "./DeleteTeacher";
// import { handleListDepartment } from "../../../controller/DepartmentController";
import {
  handleListTeacher,
  handleSearchTeacher,
} from "../../../controller/TeacherController";
import { Pagination } from "antd";
import useDebounce from "../../../hooks/useDebounce";
import ImportTeacherModal from "./ImportTeacherModal";
import { Spin } from "antd";
const LecturerEmployee = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const statusFromUrl = searchParams.get("status") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectTeacher, setSelectTeacher] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectStatus, setSelectStatus] = useState(statusFromUrl || "all");
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // Lưu tên khoa được chọn
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
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
  const openModalEdit = (teacher) => {
    setSelectTeacher(teacher);
    setShowModal(true);
  };
  const fetchListTeacher = async (page = 1) => {
    try {
      setLoading(true);
      let result;
      let keyword = [
        debouncedSearchTerm,
        selectStatus !== "all" ? selectStatus : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (keyword.trim() === "") {
        result = await handleListTeacher(page - 1, pagination.pageSize);
      } else {
        const searchTerm = debouncedSearchTerm.trim();
        const status = selectStatus !== "all" ? selectStatus : "";
        result = await handleSearchTeacher(
          status,
          searchTerm,
          page - 1,
          pagination.pageSize
        );
        console.log(result);
      }
      if (result?.data) {
        const response = result.data.teachers;
        setTeachers(response);
        setPagination({
          current: page,
          pageSize: result.data.pageSize,
          total: result.data.totalElements,
          totalPages: result.data.totalPages,
        });
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
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
    fetchListTeacher(pageFromUrl);
  }, [searchFromUrl, pageFromUrl, selectStatus]);
  return (
    <div className="min-h-screen w-full bg-white p-0">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => setOpenModalUpdate(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Nhập danh sách
          </Button>
          {openModalUpdate && (
            <ImportTeacherModal
              open={openModalUpdate}
              onClose={() => setOpenModalUpdate(false)}
              onSuccess={fetchListTeacher}
            />
          )}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" /> Thêm giảng viên
          </Button>
          {showModal && (
            <AddTeacher
              open={showModal}
              onClose={() => {
                setShowModal(false);
                setSelectTeacher(null);
              }}
              teacher={selectTeacher}
              onSuccess={() => fetchListTeacher(pageFromUrl)}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100 overflow-x-auto max-h-[600px]">
          <CardHeader>
            <CardTitle>Danh sách giảng viên</CardTitle>
            <CardDescription>
              Tổng số: {pagination.total} giảng viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sinh viên..."
                  className="pl-8 border-none shadow-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectStatus}
                onValueChange={(value) => {
                  setSelectStatus(value);
                }}
              >
                <SelectTrigger className="w-[200px] border border-gray-100 rounded-md shadow-none focus:ring-0">
                  <SelectValue placeholder="Tất cả các khoa" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded border border-gray-200">
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {/* {listDepartment.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Không có khoa nào
                    </SelectItem>
                  ) : (
                    listDepartment.map((department, index) => (
                      <SelectItem key={index} value={department.name}>
                        {department.name}
                      </SelectItem>
                    ))
                  )} */}

                  <SelectItem value="ĐANG_CÔNG_TÁC">Đang công tác</SelectItem>
                  <SelectItem value="CHUYỂN_CÔNG_TÁC">
                    Chuyển công tác
                  </SelectItem>
                </SelectContent>
              </Select>
              {/* <Select>
                <SelectTrigger className="w-[200px] border border-gray-100 rounded-md shadow-none focus:ring-0">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded border border-gray-200">
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Đang học">Đang học</SelectItem>
                  <SelectItem value="Đã tốt nghiệp">Đã tốt nghiệp</SelectItem>
                  <SelectItem value="Bảo lưu">Bảo lưu</SelectItem>
                  <SelectItem value="Thôi học">Thôi học</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            {/* Table */}
            <div className="rounded border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="border border-gray-200">
                    <TableHead>MSGV</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Khoa</TableHead>
                    <TableHead className="justify-start">Giới tính</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={7}>
                      <div className="flex justify-center items-center h-[200px] text-gray-500">
                        <Spin size="large" />
                      </div>
                    </TableCell>
                  ) : teachers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center justify-center py-6 text-gray-500"
                      >
                        Không tìm thấy giảng viên phù hợp
                      </TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((teacher) => (
                      <TableRow
                        className="border border-gray-200"
                        key={teacher.id}
                      >
                        <TableCell className="font-medium">
                          {teacher.id}
                        </TableCell>
                        <TableCell
                          className="max-w-[150px] truncate"
                          title={teacher.firstName}
                        >
                          <div className="flex items-center gap-2">
                            {/* <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg" />
                                    <AvatarFallback>
                                    {student.name
                                        .split(" ")
                                        .map((w) => w[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar> */}
                            {teacher.firstName} {teacher.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.departmentName}</TableCell>

                        <TableCell>{renderGender(teacher.gender)}</TableCell>
                        {teacher.status == "ĐANG_CÔNG_TÁC" ? (
                          <TableCell>Đang công tác</TableCell>
                        ) : (
                          <TableCell>Chuyển công tác</TableCell>
                        )}

                        <TableCell className="text-center align-middle">
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
                                className="cursor-pointer"
                                onClick={() => openModalEdit(teacher)}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  setSelectTeacher(teacher);
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
          <DeleteTeacher
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            teacher={selectTeacher}
            onSuccess={() => fetchListTeacher(pageFromUrl)}
          />
        )}
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
      </div>
    </div>
  );
};

export default LecturerEmployee;
