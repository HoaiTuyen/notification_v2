import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageSquare,
  MoreVertical,
  Ellipsis,
  Trash2,
  Users,
  Pencil,
  FileText,
  User,
  Folder,
  Info,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { handleListGroupByUserId } from "../../../controller/GroupController";
import LecturerAddGroup from "./CreateGroup";
import LecturerDeleteGroup from "./DeleteGroup";
import { Pagination, Spin } from "antd";
import { jwtDecode } from "jwt-decode";
import {
  gradientBackgroundFromString,
  hashColorFromString,
} from "../../../config/Color";
const GroupClassTeacher = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectGroup, setSelectGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const token = localStorage.getItem("access_token");
  const data = jwtDecode(token);
  const userId = data.userId;

  const fetchListGroup = async (page = 1) => {
    try {
      const listGroup = await handleListGroupByUserId(
        userId,
        page - 1,
        pagination.pageSize
      );

      if (listGroup?.data?.studyGroups || listGroup?.status === 200) {
        setGroups(listGroup.data.studyGroups);
        setPagination({
          current: page,
          pageSize: listGroup.data.pageSize,
          total: listGroup.data.totalElements,
          totalPages: listGroup.data.totalPages,
          totalElements: listGroup.data.totalElements,
        });
      } else {
        setGroups([]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        });
      }
    } catch (e) {
      console.error("Lỗi khi fetch nhóm học tập:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListGroup();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="framer-motion-page"
    >
      <div className="min-h-screen w-full bg-white p-0 ">
        <div className=" p-6 overflow-y-auto max-h-[600px]">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Nhóm học tập</h1>
              <Dialog>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  onClick={() => setOpenModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Tạo nhóm học tập
                </Button>
                {openModal && (
                  <LecturerAddGroup
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onSuccess={fetchListGroup}
                  />
                )}
              </Dialog>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {groups.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-16">
                  <Users className="w-16 h-16 mb-4" />
                  <p className="text-lg font-semibold">
                    Không có nhóm học tập nào
                  </p>
                </div>
              ) : (
                groups.map((group) => (
                  <Card
                    className="relative p-0 rounded-xl overflow-hidden shadow border w-full h-[300px] flex flex-col justify-between cursor-pointer"
                    onClick={() => {
                      navigate(`/giang-vien/group-class/${group.id}`);
                    }}
                  >
                    {/* Header - ảnh nền + tên + giảng viên */}
                    <div
                      className="relative h-28 px-4 py-3 text-white"
                      style={{
                        // backgroundColor: hashColorFromString(group.id), // fallback dark color
                        backgroundImage: gradientBackgroundFromString(group.id),
                        color: "white",
                      }}
                    >
                      <div className="relative z-10 flex justify-between">
                        <h2 className="text-lg font-semibold truncate cursor-pointer">
                          {group.name}
                        </h2>
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
                            <DropdownMenuItem
                              asChild
                              className="cursor-pointer"
                            >
                              <Link to={`/giang-vien/group-class/${group.id}`}>
                                <FileText className="h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer "
                              onClick={() => {
                                setSelectGroup(group);
                                setOpenModalDelete(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Avatar chữ viết tắt */}
                      {/* <div className="absolute -bottom-9 right-4 z-20">
                      <div className="w-18 h-18 rounded-full  bg-gray-500  text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow">
                        {getInitials(group.teacherName || "GV")}
                      </div>
                    </div> */}
                    </div>

                    {/* Body trống hoặc nội dung khác nếu có */}
                    <div className="flex-grow px-4 pt-6 bottom-0"></div>

                    {/* Footer: Icon điều hướng */}
                    {/* Footer: Code + Icon điều hướng */}
                    <div className="border-t flex justify-between items-center py-2 px-4 text-gray-700">
                      <div>
                        <span className="font-medium text-gray-700">Code:</span>
                        <code className="bg-gray-100 px-3 py-1 rounded ml-2 text-sm">
                          {group.code}
                        </code>
                      </div>
                      {/* <div className="flex gap-4">
                        <button className="hover:text-blue-600">
                          <User className="w-5 h-5" />
                        </button>
                        <button className="hover:text-blue-600">
                          <Folder className="w-5 h-5" />
                        </button>
                      </div> */}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
          {openModalDelete && (
            <LecturerDeleteGroup
              onOpen={openModalDelete}
              onClose={() => setOpenModalDelete(false)}
              onSuccess={fetchListGroup}
              group={selectGroup}
            />
          )}
          {pagination.total > pagination.pageSize && (
            <div className="flex justify-center mt-4">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page) => {
                  fetchListGroup(page);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupClassTeacher;
