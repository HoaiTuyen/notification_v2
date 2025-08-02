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
import { handleListAcademic } from "../../../controller/AcademicController";
import useDebounce from "../../../hooks/useDebounce";
import { Pagination, Spin } from "antd";
import AddAcademic from "./AddAcademic";
import DeleteAcademic from "./DeleteAcademic";
const Academic = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); //true
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [academic, setAcademic] = useState([]);
  const [selectAcademic, setSelectAcademic] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchAcademic = async (page = 1) => {
    try {
      setLoading(true);
      const response = await handleListAcademic(page - 1, pagination.pageSize);
      console.log(response);
      if (response?.data && response?.status === 200) {
        setAcademic(response.data.academicYears);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      } else {
        setAcademic([]);
        setPagination({
          ...pagination,
          current: page,
          total: 0,
          totalPages: 0,
          totalElements: 0,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademic(pageFromUrl);
  }, [pageFromUrl]);

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
            onClick={() => {
              setOpenModal(true);
              setSelectAcademic(null);
            }}
          >
            <Plus className="h-4 w-4" /> Thêm niên khoá
          </Button>
          {openModal && (
            <AddAcademic
              open={openModal}
              onClose={() => setOpenModal(false)}
              onSuccess={() => {
                setOpenModal(false);
                fetchAcademic();
              }}
              academic={selectAcademic}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100 overflow-y-auto max-h-[600px]">
          <CardHeader>
            <CardTitle>Danh sách niên khoá</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            {/* <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm niên khoá theo tên niên khoá..."
                  className="pl-8 border-none shadow-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div> */}

            {/* Table */}
            <div className="rounded border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="border border-gray-200">
                    <TableHead className="text-center">STT</TableHead>
                    <TableHead className="text-center">Mã niên khoá</TableHead>
                    <TableHead className="text-center">Tên niên khoá</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        <Spin size="large" />
                      </TableCell>
                    </TableRow>
                  ) : academic.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        "Chưa có niên khoá nào"
                      </TableCell>
                    </TableRow>
                  ) : (
                    academic.map((academic, index) => (
                      <TableRow
                        className="border border-gray-200"
                        key={academic.id}
                      >
                        <TableCell className="font-medium text-center">
                          {Number.isFinite(pagination.current) &&
                          Number.isFinite(pagination.pageSize)
                            ? (pagination.current - 1) * pagination.pageSize +
                              index +
                              1
                            : index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {academic.id}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate text-center"
                          title={academic.name}
                        >
                          {academic.name}
                        </TableCell>

                        <TableCell className="text-center align-middle ">
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
                                onClick={() => {
                                  setSelectAcademic(academic);
                                  setOpenModal(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  setSelectAcademic(academic);
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
          <DeleteAcademic
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            academic={selectAcademic}
            onSuccess={() => {
              setOpenModalDelete(false);
              fetchAcademic(pageFromUrl);
            }}
          />
        )}
        {pagination.totalElements >= 10 && (
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

export default Academic;
