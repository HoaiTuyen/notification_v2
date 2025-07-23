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
  Upload,
} from "lucide-react";
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
import AddSubject from "./AddSubject";
import DeleteSubject from "./DeleteSubject";
import {
  handleListSubject,
  handleSearchSubject,
} from "../../../controller/SubjectController";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import useDebounce from "../../../hooks/useDebounce";
import ImportSubjectModal from "./ImportSubjectModal";
import { Spin } from "antd";
const EmployeeSubject = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [openModal, setOpenModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectSubject, setSelectSubject] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const openModalEdit = (subject) => {
    setSelectSubject(subject);
    setOpenModal(true);
  };
  const fetchListSubject = async (page = 1) => {
    try {
      setLoading(true);
      let res;
      const keyword = debouncedSearchTerm.trim();
      console.log(keyword);

      if (keyword.trim() === "") {
        res = await handleListSubject(page - 1, pagination.pageSize);
      } else {
        res = await handleSearchSubject(keyword, page - 1, pagination.pageSize);
        console.log(res);
      }

      if (res?.data) {
        setSubjects(res.data.subjects);
        setPagination({
          current: page,
          pageSize: res.data.pageSize,
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        });
      } else {
        toast.error(res.data.message || "Lỗi");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
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
    fetchListSubject(pageFromUrl);
  }, [searchFromUrl, pageFromUrl]);
  return (
    <div className="min-h-screen w-full bg-white p-0 ">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4 ">
          <Button
            variant="outline"
            className="flex items-center cursor-pointer"
            onClick={() => setOpenUpload(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Nhập danh sách môn học
          </Button>
          {openUpload && (
            <ImportSubjectModal
              open={openUpload}
              onClose={() => setOpenUpload(false)}
              onSuccess={fetchListSubject}
            />
          )}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center  cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm môn học
          </Button>
          {openModal && (
            <AddSubject
              open={openModal}
              onClose={() => {
                setOpenModal(false), setSelectSubject(null);
              }}
              onSuccess={() => fetchListSubject(pageFromUrl)}
              subject={selectSubject}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100 overflow-x-auto max-h-[600px]">
          <CardHeader>
            <CardTitle>Danh sách lớp</CardTitle>
            <CardDescription>
              Tổng số: {pagination.totalElements} môn học
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 overflow-y-auto max-h-[500px]">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm môn học..."
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
                    <TableHead>Mã môn học</TableHead>
                    <TableHead>Tên môn học</TableHead>
                    <TableHead>Số tín chỉ</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={4}>
                      <div className="flex justify-center items-center h-[200px] text-gray-500">
                        <Spin size="large" />
                      </div>
                    </TableCell>
                  ) : subjects.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        Không tìm thấy môn học phù hợp
                      </TableCell>
                    </TableRow>
                  ) : (
                    subjects.map((subject) => (
                      <TableRow
                        className="border border-gray-200"
                        key={subject.id}
                      >
                        <TableCell className="font-medium">
                          {subject.id}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate"
                          title={subject.name}
                        >
                          <div className="flex items-center">
                            {subject.name}
                          </div>
                        </TableCell>
                        <TableCell className="pl-7">{subject.credit}</TableCell>

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
                                asChild
                                className="cursor-pointer"
                              >
                                <Link to="">
                                  <FileText className="h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openModalEdit(subject)}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectSubject(subject),
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
          <DeleteSubject
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            onSuccess={() => fetchListSubject(pageFromUrl)}
            subject={selectSubject}
          />
        )}
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
      </div>
    </div>
  );
};

export default EmployeeSubject;
