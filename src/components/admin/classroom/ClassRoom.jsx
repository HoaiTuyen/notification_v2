import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
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
import AddClass from "./AddClass";
import { Pagination, Spin } from "antd";
import {
  handleListClass,
  handleSearchClass,
} from "../../../controller/ClassController";
import useDebounce from "../../../hooks/useDebounce";
import DeleteClass from "./DeleteClass";
import ImportClassModal from "./ImportClassModal";
import ListStudentOfClass from "./liststudentbyclass/ListStudentOfClass";

const ClassName = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [openModal, setOpenModal] = useState(false);
  const [classRoom, setClasses] = useState([]);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectClass, setSelectClass] = useState(null);
  const openEditClass = (item) => {
    setSelectClass(item);
    setOpenModal(true);
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const fetchListClass = async (page = 1) => {
    try {
      setLoading(true);
      let res;
      const keyword = debouncedSearchTerm.trim();
      if (keyword) {
        res = await handleSearchClass(keyword, page - 1, pagination.pageSize);
      } else {
        res = await handleListClass(page - 1, pagination.pageSize);
      }
      if (res?.data && res?.status === 200) {
        setClasses(res.data.classes);
        setPagination({
          current: page,
          pageSize: res.data.pageSize,
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
        });
      }
    } catch (error) {
      console.log(error);
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
    fetchListClass(pageFromUrl);
  }, [searchFromUrl, pageFromUrl]);
  return (
    <div className="h-full w-full bg-white p-0 overflow-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4 ">
          <Button
            variant="outline"
            className="flex items-center cursor-pointer"
            onClick={() => setOpenUpload(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Nhập danh sách lớp
          </Button>
          {openUpload && (
            <ImportClassModal
              open={openUpload}
              onClose={() => setOpenUpload(false)}
              onSuccess={fetchListClass}
            />
          )}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center  cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            <Plus className="h-4 w-4" /> Thêm lớp
          </Button>
          {openModal && (
            <AddClass
              open={openModal}
              onClose={() => {
                setOpenModal(false), setSelectClass(null);
              }}
              onSuccess={() => fetchListClass(pageFromUrl)}
              classRoom={selectClass}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100 overflow-x-auto max-h-[600px]">
          <CardHeader>
            <CardTitle>Danh sách lớp</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm lớp theo tên lớp..."
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
                    <TableHead className="text-center">STT</TableHead>
                    <TableHead className="text-center">Tên lớp</TableHead>
                    <TableHead className="text-center">Mô tả</TableHead>
                    <TableHead className="text-center">
                      Giảng viên phụ trách
                    </TableHead>
                    <TableHead className="text-center">Khoa</TableHead>
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
                  ) : classRoom.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        {debouncedSearchTerm
                          ? "Không tìm thấy lớp học phù hợp"
                          : "Chưa có lớp học nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    classRoom.map((item, index) => (
                      <TableRow className="border border-gray-200" key={index}>
                        <TableCell className="font-medium text-center">
                          {(pagination.current - 1) * pagination.pageSize +
                            index +
                            1}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate text-center"
                          title={item.name}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.description}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.teacherName === null
                            ? "Trống"
                            : item.teacherName}
                          {/* {getTeacherName(item.teacherName)} */}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.departmentName === null
                            ? "Trống"
                            : item.departmentName}
                          {/* {item.departmentName} */}
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
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer"
                              >
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    navigate(
                                      `/admin/class/${item.id}/students?search=${debouncedSearchTerm}&page=${pagination.current}`
                                    )
                                  }
                                >
                                  <Users className="h-4 w-4" />
                                  Danh sách sinh viên
                                </DropdownMenuItem>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openEditClass(item)}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  setOpenModalDelete(true);
                                  setSelectClass(item);
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
          <DeleteClass
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            classRoom={selectClass}
            onSuccess={() => fetchListClass(pageFromUrl)}
          />
        )}
        {pagination.total >= 10 && (
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
      <Outlet />
    </div>
  );
};

export default ClassName;
