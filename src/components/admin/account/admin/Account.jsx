import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pagination, Spin } from "antd";
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
  Lock,
  LogIn,
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
import {
  handleListUser,
  handleLockUser,
  handleSearchUser,
  handleFilterUser,
} from "../../../../controller/AccountController";
import useDebounce from "../../../../hooks/useDebounce";
import AddAccount from "./AddAccount";
import DetailAccount from "../DetailAccount";
import { toast } from "react-toastify";
import ImportAccountModal from "./ImportAccountModal";
const Account = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedRole, setSelectedRole] = useState("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const openEditModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const openDetail = (userId) => {
    setSelectedUser(userId);
    setOpenDetailModal(true);
  };

  const fetchListUser = async (page = 1) => {
    try {
      setLoading(true);
      let response;
      // const keyword = [
      //   debouncedSearchTerm,
      //   selectedRole !== "all" ? selectedRole : "",
      // ]
      //   .filter(Boolean)
      //   .join(" ");
      const keyword = debouncedSearchTerm;

      if (keyword.trim() === "") {
        response = await handleFilterUser(
          "ADMIN",
          page - 1,
          pagination.pageSize
        );
      } else {
        const searchTerm = debouncedSearchTerm.trim();
        // const roleFilter = selectedRole !== "all" ? selectedRole : "";
        // searchTerm ? `${searchTerm} ${roleFilter}`.trim() : roleFilter,
        response = await handleSearchUser(
          searchTerm,
          "ADMIN",
          page - 1,
          pagination.pageSize
        );
      }

      if (response?.status === 200 && response?.data) {
        setTotal(pagination.totalElements);
        setUsers(response?.data?.users || []);
        setPagination({
          current: page,
          pageSize: response?.data?.pageSize,
          total: response?.data?.totalElements,
          totalPages: response?.data?.totalPages,
          totalElements: response?.data?.totalElements,
        });
      } else {
        setUsers([]);
        setPagination({
          ...pagination,
          current: page,
          total: 0,
          totalPages: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const SubmitLockUser = async (userUd) => {
    try {
      const req = await handleLockUser(userUd.id);

      if (req.status === 204) {
        fetchListUser(pagination.current);
        toast.success(req.message || "Khoá tài khoản thành công");
      } else {
        toast.error(req.message);
      }
    } catch (error) {
      console.error("Error locking user:", error);
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
    fetchListUser(pageFromUrl);
  }, [debouncedSearchTerm, pageFromUrl, selectedRole]);
  return (
    <div className="h-full w-full bg-white overflow-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-6 ">
        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4 ">
          {/* <Button
            variant="outline"
            className="flex items-center cursor-pointer"
            onClick={() => setOpenUpload(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Nhập danh sách tài khoản
          </Button>
          {openUpload && (
            <ImportAccountModal
              open={openUpload}
              onClose={() => setOpenUpload(false)}
              onSuccess={fetchListUser}
            />
          )} */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center  cursor-pointer"
            onClick={() => {
              setOpenModal(true);
              setSelectedUser(null);
            }}
          >
            <Plus className="h-4 w-4" /> Tạo tài khoản
          </Button>
          {openModal && (
            <AddAccount
              open={openModal}
              onClose={() => {
                setOpenModal(false);
                setSelectedUser(null);
              }}
              onSuccess={() => fetchListUser(pageFromUrl)}
              users={selectedUser}
            />
          )}
        </div>

        {/* Card */}
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle>Danh sách tài khoản quản trị viên</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 ">
              <div className="relative flex-1 border border-gray-100 rounded-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tài khoản theo username..."
                  className="pl-8 border-none shadow-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="border border-gray-200">
                    <TableHead>STT</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="justify-start">Trạng thái</TableHead>
                    <TableHead className="">Role</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={5}>
                      <div className="flex justify-center items-center h-[200px] text-gray-500">
                        <Spin size="large" />
                      </div>
                    </TableCell>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        {debouncedSearchTerm
                          ? "Không tìm thấy tài khoản phù hợp"
                          : "Chưa có tài khoản nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user, index) => (
                      <TableRow className="border border-gray-200" key={index}>
                        <TableCell className="font-medium pl-3.5">
                          {(pagination.current - 1) * pagination.pageSize +
                            index +
                            1}
                        </TableCell>
                        <TableCell
                          className="max-w-[180px] truncate"
                          title={user.username}
                        >
                          <div className="flex items-center">
                            {user.username}
                          </div>
                        </TableCell>
                        <TableCell>{user.status}</TableCell>
                        <TableCell className="">{user.role}</TableCell>

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
                                onClick={() => openDetail(user.id)}
                              >
                                <Link to="">
                                  <FileText className="h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openEditModal(user)}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => SubmitLockUser(user)}
                              >
                                <Lock className="mr-2 h-4 w-4" /> Khoá tài khoản
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                {openDetailModal && (
                  <DetailAccount
                    open={openDetailModal}
                    onClose={() => setOpenDetailModal(false)}
                    accountId={selectedUser}
                  />
                )}
              </Table>
            </div>
          </CardContent>
        </Card>

        {pagination.totalElements >= 10 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={false}
              onChange={(page) => {
                const params = new URLSearchParams({
                  search: debouncedSearchTerm,
                  page: page.toString(),
                });
                setSearchParams(params);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
