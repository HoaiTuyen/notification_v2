import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
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

import AddDepartment from "./AddDepartment";
import DeleteDepartment from "./DeleteDepartment";
import {
  handleListDepartment,
  handleSearchDepartment,
} from "../../../controller/DepartmentController";
import useDebounce from "../../../hooks/useDebounce";
import { Pagination, Spin } from "antd";

const Department = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectDepartment, setSelectDepartment] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const openEditDepartment = (department) => {
    setSelectDepartment(department);
    setOpenModal(true);
  };
  const fetchListDepartment = async (page = 1) => {
    try {
      setLoading(true);
      let res;
      const keyword = debouncedSearchTerm.trim();
      if (!keyword) {
        res = await handleListDepartment(page - 1, pagination.pageSize);
        console.log(res);
      } else {
        res = await handleSearchDepartment(
          keyword,
          page - 1,
          pagination.pageSize
        );
        console.log(res);
      }

      if (res?.data) {
        setDepartments(res.data.departments || []);
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
  useEffect(() => {
    if (debouncedSearchTerm !== searchFromUrl) {
      setSearchParams({
        search: debouncedSearchTerm,
        page: "1",
      });
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    fetchListDepartment(pageFromUrl);
  }, [searchFromUrl, pageFromUrl]);
  return (
    <div className="min-h-screen w-full bg-white p-0 ">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          {/* <Button variant="outline" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" /> Nhập danh sách
            </Button> */}

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center  cursor-pointer"
            onClick={() => {
              setSelectDepartment(null);
              setOpenModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm khoa
          </Button>

          {openModal && (
            <AddDepartment
              open={openModal}
              onClose={() => {
                setOpenModal(false);
                setSelectDepartment(null);
              }}
              department={selectDepartment}
              onSuccess={() => fetchListDepartment(pageFromUrl)}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100 overflow-y-auto max-h-[600px]">
          <CardHeader>
            <CardTitle>Danh sách khoa</CardTitle>
            <CardDescription>
              Tổng số: {pagination.totalElements} khoa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khoa..."
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
                    <TableHead>Mã khoa</TableHead>
                    <TableHead>Tên Khoa</TableHead>
                    <TableHead> Mô tả</TableHead>
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
                  ) : departments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        Không tìm thấy khoa phù hợp
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department) => (
                      <TableRow
                        className="border border-gray-200"
                        key={department.id}
                      >
                        <TableCell className="font-medium">
                          {department.id}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate"
                          title={department.name}
                        >
                          <div className="flex items-center">
                            {department.name}
                          </div>
                        </TableCell>
                        <TableCell className="">
                          {department.description}
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
                                className="cursor-pointer"
                                onClick={() => openEditDepartment(department)}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/admin/department/${department.id}/class?search=${debouncedSearchTerm}&page=${pagination.current}`
                                  )
                                }
                              >
                                <Users className="mr-2 h-4 w-4" /> Danh sách lớp
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
          <DeleteDepartment
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            department={selectDepartment}
            onSuccess={() => fetchListDepartment(pageFromUrl)}
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

export default Department;
