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

import useDebounce from "../../../hooks/useDebounce";
import { Pagination, Spin } from "antd";
import {
  handleListGroup,
  handleSearchGroup,
} from "../../../controller/GroupController";
import AddGroup from "./AddGroup";
import DeleteGroup from "./DeleteGroup";
const Group = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectGroup, setSelectGroup] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const openEditGroup = (group) => {
    setSelectGroup(group);
    setOpenModal(true);
  };

  const fetchListGroup = async (page = 1) => {
    try {
      setLoading(true);
      let res;
      const keyword = debouncedSearchTerm.trim();
      if (keyword) {
        res = await handleSearchGroup(keyword, page - 1, pagination.pageSize);
      } else {
        res = await handleListGroup(page - 1, pagination.pageSize);
        console.log(res);
      }
      if (res?.data && res?.status === 200) {
        setGroups(res.data.studyGroups);
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
    fetchListGroup(pageFromUrl);
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
            <Plus className=" h-4 w-4" /> Tạo nhóm học tập
          </Button>
          {openModal && (
            <AddGroup
              open={openModal}
              onClose={() => {
                setOpenModal(false), setSelectGroup(null);
              }}
              onSuccess={() => fetchListGroup(pageFromUrl)}
              group={selectGroup}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle>Danh sách nhóm</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm nhóm học tập theo tên nhóm..."
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
                    <TableHead className="text-center">Tên nhóm</TableHead>
                    <TableHead className="text-center">
                      Giáo viên phụ trách
                    </TableHead>
                    <TableHead className="text-center">Mã code</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        <Spin size="large" />
                      </TableCell>
                    </TableRow>
                  ) : groups.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        {debouncedSearchTerm
                          ? "Không tìm thấy nhóm học tập phù hợp"
                          : "Chưa có nhóm học tập nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    groups.map((group, index) => (
                      <TableRow className="border border-gray-200">
                        <TableCell className="font-medium text-center">
                          {Number.isFinite(pagination.current) &&
                          Number.isFinite(pagination.pageSize)
                            ? (pagination.current - 1) * pagination.pageSize +
                              index +
                              1
                            : index + 1}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate text-center"
                          title={group.name}
                        >
                          {group.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {group.userName}
                        </TableCell>
                        <TableCell className="text-center">
                          {group.code}
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
                              {/* <DropdownMenuItem
                                asChild
                                className="cursor-pointer"
                              >
                                <Link to="">
                                  <FileText className="h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem> */}
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openEditGroup(group)}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  setOpenModalDelete(true),
                                    setSelectGroup(group);
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
          <DeleteGroup
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            group={selectGroup}
            onSuccess={() => fetchListGroup(pageFromUrl)}
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
    </div>
  );
};

export default Group;
