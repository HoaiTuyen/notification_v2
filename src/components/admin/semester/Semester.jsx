import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
import {
  Search,
  Ellipsis,
  FileText,
  Pencil,
  Trash2,
  Plus,
  Users,
} from "lucide-react";

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
import dayjs from "dayjs";
import useDebounce from "../../../hooks/useDebounce";
import { Pagination, Spin } from "antd";
import {
  handleListSemester,
  handleSearchSemester,
} from "../../../controller/SemesterController";
import AddSemester from "./AddSemester";
import DeleteSemester from "./DeleteSemester";
const Semester = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectSemester, setSelectSemester] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const openEditSemester = (semester) => {
    setSelectSemester(semester);
    setOpenModal(true);
  };

  const fetchListSemester = async (page = 1) => {
    try {
      setLoading(true);
      let res;
      const keyword = debouncedSearchTerm.trim();
      if (keyword) {
        res = await handleSearchSemester(
          keyword,
          page - 1,
          pagination.pageSize
        );
      } else {
        res = await handleListSemester("desc", page - 1, pagination.pageSize);
        console.log(res);
      }

      if (res?.data) {
        setSemesters(res.data.semesters);
        setPagination({
          current: page,
          pageSize: res.data.pageSize,
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleFormatDate = (date) => {
    const formatted = dayjs(date).format("DD/MM/YYYY");

    return formatted;
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
    fetchListSemester(pageFromUrl);
  }, [searchFromUrl, pageFromUrl]);
  return (
    <div className="h-full w-full bg-white p-0 overflow-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          {/* <Button variant="outline" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" /> Nhập danh sách
            </Button> */}

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center  cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            <Plus className="h-4 w-4" /> Thêm học kỳ
          </Button>
          {openModal && (
            <AddSemester
              open={openModal}
              onClose={() => {
                setOpenModal(false);
                setSelectSemester(null);
              }}
              onSuccess={() => fetchListSemester(pageFromUrl)}
              semester={selectSemester}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle>Danh sách học kỳ</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm học kỳ theo tên học kỳ..."
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
                    <SelectItem value="QTTD">Quản trị kinh doanh</SelectItem>
                  </SelectContent>
                </Select> */}
            </div>

            {/* Table */}
            <div className="rounded border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="border border-gray-200">
                    <TableHead>STT</TableHead>
                    <TableHead>Tên học kỳ</TableHead>
                    <TableHead>Năm học</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        <Spin size="large" />
                      </TableCell>
                    </TableRow>
                  ) : semesters.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        {debouncedSearchTerm
                          ? "Không tìm thấy học kỳ phù hợp"
                          : "Chưa có học kỳ nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    semesters.map((semester, index) => (
                      <TableRow className="border border-gray-200">
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate"
                          title={semester.nameSemester}
                        >
                          <div className="flex items-center">
                            {semester.nameSemester}
                          </div>
                        </TableCell>
                        <TableCell className="">
                          {semester.academicYear}
                        </TableCell>
                        <TableCell className="">
                          {handleFormatDate(semester.startDate)}
                        </TableCell>
                        <TableCell className="">
                          {handleFormatDate(semester.endDate)}
                        </TableCell>

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
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openEditSemester(semester)}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  setOpenModalDelete(true),
                                    setSelectSemester(semester);
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
          <DeleteSemester
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            semester={selectSemester}
            onSuccess={() => {
              fetchListSemester(pageFromUrl);
              setSelectSemester(null);
            }}
          />
        )}
        {pagination.totalPages >= 10 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
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

export default Semester;
