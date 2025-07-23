import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  MoreVertical,
  NotepadText,
  Send,
  Copy,
  Ellipsis,
  Pencil,
  Trash2,
  LogOut,
  SendHorizontal,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { handleDetailGroup } from "../../../controller/GroupController";
import { gradientBackgroundFromString } from "../../../config/Color";
import LecturerCreateGroupNotification from "./notificationgroup/CreateNotification";
import {
  handleListNotificationGroup,
  handleDetailNotificationGroup,
} from "../../../controller/NotificationGroupController";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteNotificationGroup from "./notificationgroup/DeleteNotificationGroup";
import UpdateNotificationGroup from "./notificationgroup/UpdateNotificationGroup";
import { Spin } from "antd";
import DeleteStudentOut from "./DeleteStudentOut";
import { jwtDecode } from "jwt-decode";
import { handleGetDetailUser } from "../../../controller/AccountController";
import { handleStudentDetail } from "../../../controller/StudentController";
import { handleTeacherDetail } from "../../../controller/TeacherController";
import {
  handleCreateReplyNotificationGroup,
  handleListReplyNotificationGroup,
} from "../../../controller/GroupController";
const DetailGroupLecturer = () => {
  const token = localStorage.getItem("access_token");
  const { userId } = jwtDecode(token);

  const location = useLocation();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [imageUser, setImageUser] = useState("");
  const [groupDetail, setGroupDetail] = useState({});

  const [selectTabs, setSelectTabs] = useState("home");
  const [members, setMembers] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [selectNotificationGroup, setSelectNotificationGroup] = useState(null);
  const [notificationGroups, setNotificationGroups] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [detailNotify, setDetailNotify] = useState([]);
  const [openModalDeleteStudentOut, setOpenModalDeleteStudentOut] =
    useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // { [notificationId]: "Nội dung comment" }
  const [comments, setComments] = useState({}); // { [notificationId]: [{id, content, sender, timestamp}] }
  const [userDetail, setUserDetail] = useState({});
  const [isSending, setIsSending] = useState(false);
  const backUrl = location.state?.from || "/giang-vien/group-class";
  const fetchDetailGroup = async () => {
    try {
      const detailGroup = await handleDetailGroup(groupId);
      console.log(detailGroup);
      if (detailGroup?.data && detailGroup.status === 200) {
        setGroupDetail(detailGroup.data);
        setMembers(detailGroup.data.members);
      }
    } catch (e) {
      console.error("Lỗi khi fetch chi tiết nhóm học tập:", e);
    } finally {
      setLoading(false);
    }
  };
  const fetchListNotificationGroup = async () => {
    try {
      const listNotificationGroup = await handleListNotificationGroup(groupId);
      if (
        listNotificationGroup?.data ||
        listNotificationGroup?.status === 200
      ) {
        const sorted = [...listNotificationGroup.data].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setNotificationGroups(sorted);
        sorted.forEach((notify) => {
          fetchListReplyNotificationGroup(notify.id);
        });
      } else {
        setNotificationGroups([]);
      }
    } catch (e) {
      console.error("Lỗi khi fetch thông báo nhóm học tập:", e);
    } finally {
      setLoading(false);
    }
  };
  const fetchDetailUser = async () => {
    try {
      const detailUser = await handleGetDetailUser(userId);
      setImageUser(detailUser.data.image);
      if (detailUser?.data?.studentId) {
        const detailStudent = await handleStudentDetail(
          detailUser.data.studentId
        );

        setUserDetail(detailStudent.data);
      } else {
        const detailTeacher = await handleTeacherDetail(
          detailUser.data.teacherId
        );
        setUserDetail(detailTeacher.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchListReplyNotificationGroup = async (notificationId) => {
    try {
      const listReplyNotificationGroup = await handleListReplyNotificationGroup(
        notificationId
      );
      console.log(listReplyNotificationGroup);
      if (
        listReplyNotificationGroup?.data ||
        listReplyNotificationGroup?.status === 200
      ) {
        setComments((prev) => ({
          ...prev,
          [notificationId]: listReplyNotificationGroup.data.map((c) => ({
            id: c.id,
            sender: c.fullName,
            content: c.content,
            timestamp: c.createdAt,
            image: c.avatarUrl,
          })),
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleCommentChange = (id, value) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };
  const handleSendComment = async (id) => {
    try {
      const content = commentInputs[id]?.trim();

      if (!content) return;

      const response = await handleCreateReplyNotificationGroup(
        userId,
        id,
        content
      );
      console.log(response);
      await fetchListReplyNotificationGroup(id);

      setCommentInputs((prev) => ({ ...prev, [id]: "" }));
      setIsSending(false);
    } catch (e) {
      console.log(e);
      setIsSending(false);
    }
  };
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);

    return parts
      .map((part) =>
        part[0]
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      )
      .join("");
  };
  const handleToggleExpand = async (notificationGroup, e) => {
    e.stopPropagation();
    const isSame = expandedId === notificationGroup.id;

    if (isSame) {
      setExpandedId(null);
      setDetailNotify([]);
    } else {
      setIsLoadingDetail(true);
      const detail = await handleDetailNotificationGroup(notificationGroup.id);

      if (detail?.data) {
        setDetailNotify(detail.data);
        setExpandedId(notificationGroup.id);
      } else {
        setDetailNotify([]);
      }

      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchDetailGroup();
    fetchListNotificationGroup();
    fetchDetailUser();
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
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-gray-50 border-t border-gray-200 rounded-b-xl"
    >
      <div className="min-h-screen w-full bg-white overflow-y-auto max-h-screen p-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(backUrl)}
              >
                <div className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="min-h-screen pb-10">
          <Tabs
            value={selectTabs}
            onValueChange={setSelectTabs}
            className="px-6 pt-8 pb-3"
          >
            <TabsList>
              <TabsTrigger
                value="home"
                className="data-[state=active]:text-blue-600 cursor-pointer"
              >
                Bảng tin
              </TabsTrigger>
              <TabsTrigger value="notification" className="cursor-pointer">
                Thông báo
              </TabsTrigger>
              <TabsTrigger value="member" className="cursor-pointer">
                Mọi người
              </TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <div
                className=" text-white p-6 flex justify-between items-start h-[240px]  rounded-2xl"
                style={{
                  background: gradientBackgroundFromString(
                    groupDetail.id || ""
                  ),
                }}
              >
                <div>
                  <h1 className="text-3xl font-bold">{groupDetail.name}</h1>
                  <p className="text-lg">{groupDetail.userName}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                {/* Class code */}
                <div className="w-[150px] p-4 bg-white border rounded shadow-sm h-fit shrink-0">
                  <h3 className="text-sm text-gray-600 mb-1">Class Code</h3>
                  <div
                    className="flex text-xl font-mono text-blue-600 cursor-pointer items-center transition-transform active:scale-95"
                    onClick={() => {
                      navigator.clipboard.writeText(groupDetail.code);
                      toast.success("Đã sao chép");
                    }}
                  >
                    {groupDetail.code}
                    <div className="ml-2">
                      <Copy />
                    </div>
                  </div>
                </div>

                {/* Announcement + Activity */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-white border rounded shadow-sm">
                    <Avatar className="h-10 w-10">
                      {imageUser ? (
                        <AvatarImage src={imageUser} />
                      ) : (
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getInitials(groupDetail.userName) ||
                            groupDetail.image}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Input
                      placeholder="Thông báo gì đó đến lớp của bạn..."
                      className="flex-1 cursor-pointer border-0"
                      readOnly
                      onClick={() => setSelectTabs("notification")}
                    />
                  </div>
                  {notificationGroups.length === 0 ? (
                    <div className="text-center text-gray-500">
                      Hiện tại chưa có thông báo nào
                    </div>
                  ) : (
                    notificationGroups.map((notify, index) => (
                      <div
                        key={index}
                        className="bg-white border rounded-xl shadow-sm overflow-hidden cursor-pointer"
                      >
                        {/* Header */}
                        <div>
                          <div className="p-4 flex space-x-3">
                            <Avatar className="h-10 w-10">
                              {imageUser ? (
                                <AvatarImage src={imageUser} />
                              ) : (
                                <AvatarFallback className="bg-blue-500 text-white">
                                  {getInitials(groupDetail.userName) ||
                                    groupDetail.image}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold">
                                {groupDetail.userName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {dayjs(notify.createdAt).format("DD [thg] M")}
                              </p>
                            </div>
                          </div>
                          <div className="pl-4 pb-4">
                            <p className="mt-2 text-base font-semibold">
                              {notify.title}
                            </p>
                            <p className="mt-2">{notify.content}</p>
                          </div>
                        </div>

                        {/* Files nếu có */}
                        {notify?.fileNotifications?.length > 0 && (
                          <div className="px-4 pb-4">
                            {notify.fileNotifications.map((file, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-3 mb-3 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
                              >
                                <FileText className="text-blue-600" />
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {file.displayName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Tệp đính kèm
                                  </p>
                                </div>
                                <a
                                  href={file.fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline text-sm"
                                >
                                  Tải xuống
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="border-t pt-5">
                          {comments[notify.id]?.length > 0 && (
                            <div className="px-4 pb-2 space-y-2">
                              {comments[notify.id].map(
                                (comment) => (
                                  console.log(comment),
                                  (
                                    <div
                                      key={comment.id}
                                      className="flex items-start space-x-3"
                                    >
                                      <div className="pt-3">
                                        <Avatar className="h-8 w-8">
                                          {comment.image ? (
                                            <AvatarImage
                                              src={comment.image}
                                              alt="avatar"
                                            />
                                          ) : null}
                                          <AvatarFallback className="bg-blue-500 text-white">
                                            {getInitials(comment.sender)}
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                      <div>
                                        <div className="rounded-xl py-2 flex-1">
                                          <div className="flex items-center space-x-2">
                                            <div className="text-sm font-medium">
                                              {comment.sender}
                                            </div>
                                            <div className="text-xs text-gray-500 ">
                                              {dayjs(comment.timestamp).format(
                                                "HH:mm - DD/MM/YYYY"
                                              )}
                                            </div>
                                          </div>

                                          <div className="text-sm text-gray-700">
                                            {comment.content}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )
                              )}
                            </div>
                          )}

                          {/* Ô nhập phản hồi */}
                          <div className="px-4 pb-4 flex items-center gap-2 mt-2 ">
                            <Avatar>
                              {imageUser ? (
                                <AvatarImage src={imageUser} alt="avatar" />
                              ) : null}
                              <AvatarFallback className="bg-blue-600 text-white">
                                {getInitials(
                                  userDetail.firstName +
                                    " " +
                                    userDetail.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <Input
                              placeholder="Thêm nhận xét trong lớp học"
                              value={commentInputs[notify.id] || ""}
                              onChange={(e) =>
                                handleCommentChange(notify.id, e.target.value)
                              }
                              // onKeyDown={(e) => {
                              //   if (e.key === "Enter" && !e.shiftKey) {
                              //     e.preventDefault();
                              //     handleSendComment(notify.id);
                              //   }
                              // }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              className="bg-white text-black cursor-pointer hover:bg-gray-100"
                              disabled={
                                isSending || !commentInputs[notify.id]?.trim()
                              }
                              onClick={() => handleSendComment(notify.id)}
                            >
                              <SendHorizontal />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notification">
              <div className="p-6  min-h-screen">
                {/* Nút Create */}
                <div className="mb-6 ">
                  <button
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white  py-3 px-6 rounded-full shadow-md text-lg flex items-center gap-2"
                    onClick={() => setOpenModalCreate(true)}
                  >
                    <span className="font-light">＋</span>
                    Tạo thông báo
                  </button>
                  {openModalCreate && (
                    <LecturerCreateGroupNotification
                      open={openModalCreate}
                      onClose={() => setOpenModalCreate(false)}
                      onSuccess={fetchListNotificationGroup}
                    />
                  )}
                </div>

                {/* Thẻ thông báo */}
                {notificationGroups.length === 0 ? (
                  <></>
                ) : (
                  notificationGroups.map((notificationGroup) => (
                    <motion.div
                      // layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      key={notificationGroup.id}
                      className="mb-4"
                    >
                      <div
                        key={notificationGroup.id}
                        className="bg-white shadow rounded-xl p-4 mb-4 flex items-center justify-between hover:border hover:border-gray-200 transition-all duration-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpand(notificationGroup, e);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                            <NotepadText size={22} />
                          </div>

                          {/* Nội dung */}
                          <div className="text-sm font-normal">
                            {notificationGroup.title}
                          </div>
                        </div>

                        {/* Ngày và menu */}
                        <div className="text-sm text-gray-500 flex items-center gap-4">
                          <span>
                            {dayjs(notificationGroup.createdAt).format(
                              "DD/MM/YYYY"
                            )}
                          </span>
                          {/* <MoreVertical className="cursor-pointer" /> */}
                          <DropdownMenu asChild>
                            <DropdownMenuTrigger
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectNotificationGroup(notificationGroup);
                                  setOpenModalUpdate(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" /> Chỉnh sửa
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectNotificationGroup(notificationGroup);
                                  setOpenModalDelete(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedId === notificationGroup.id && (
                          <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-50 border-t border-gray-200 rounded-b-xl px-6 py-4"
                          >
                            {isLoadingDetail ? (
                              <p className="text-sm text-gray-500">
                                Đang tải chi tiết...
                              </p>
                            ) : (
                              <>
                                <p className="text-sm text-gray-800 mb-2">
                                  Nội dung:
                                  {detailNotify.content || "Không có nội dung"}
                                </p>

                                {detailNotify.fileNotifications?.length > 0 && (
                                  <div className="space-y-2">
                                    {detailNotify.fileNotifications.map(
                                      (file, index) => (
                                        <div
                                          key={index}
                                          className="border rounded-lg p-3 flex items-center space-x-4 hover:bg-gray-100 transition-colors"
                                        >
                                          <FileText className="text-blue-600" />
                                          <div className="flex-1">
                                            {/* <p className="font-medium">
                                              {file.displayName || "Không tên"}
                                            </p> */}
                                            <p className="text-sm text-gray-500">
                                              Tệp đính kèm
                                            </p>
                                          </div>
                                          <a
                                            href={file.fileName}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline text-sm"
                                          >
                                            Tải xuống
                                          </a>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="member">
              <div className="max-w-3xl  py-8 px-4">
                {/* Tab Header */}

                {/* Teachers */}
                <div className="mb-6">
                  <h3 className="text-3xl font-medium mb-2">Giảng viên</h3>

                  <div
                    className="flex items-center space-x-3 py-2"
                    key={groupDetail.userName}
                  >
                    <Avatar className="h-10 w-10">
                      {imageUser ? (
                        <AvatarImage
                          src={imageUser}
                          alt={groupDetail.userName}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getInitials(groupDetail.userName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-md font-medium">
                      {groupDetail.userName}
                    </span>
                  </div>
                </div>

                {/* Classmates */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-3xl font-medium">Sinh viên</h3>
                    <span className="text-sm text-gray-500">
                      {members.length} sinh viên
                    </span>
                  </div>
                  <div className="divide-y">
                    {members.map(
                      (member) => (
                        console.log(member),
                        (
                          <div
                            key={member.fullName}
                            className="flex justify-between items-center space-x-3 py-2"
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-10 w-10">
                                {member.image ? (
                                  <AvatarImage src={member.image} />
                                ) : (
                                  <AvatarFallback className="bg-gray-400 text-white">
                                    {getInitials(member.fullName) ||
                                      member.image}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span className="text-sm">{member.fullName}</span>
                            </div>
                            <div className="">
                              <DropdownMenu asChild>
                                <DropdownMenuTrigger
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 cursor-pointer"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    className="text-red-600 cursor-pointer"
                                    onClick={() => {
                                      setSelectedMember(member);
                                      setOpenModalDeleteStudentOut(true);
                                    }}
                                  >
                                    <LogOut className=" h-4 w-4" /> Xoá khỏi
                                    nhóm
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {openModalDelete && (
          <DeleteNotificationGroup
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            onSuccess={() => fetchListNotificationGroup()}
            notify={selectNotificationGroup}
          />
        )}
        {openModalUpdate && (
          <UpdateNotificationGroup
            open={openModalUpdate}
            onClose={() => setOpenModalUpdate(false)}
            onSuccess={() => fetchListNotificationGroup()}
            notify={selectNotificationGroup}
          />
        )}
        {openModalDeleteStudentOut && (
          <DeleteStudentOut
            onOpen={openModalDeleteStudentOut}
            onClose={() => setOpenModalDeleteStudentOut(false)}
            member={selectedMember}
            author={userId}
            group={groupDetail}
            onSuccess={() => fetchDetailGroup()}
          />
        )}
      </div>
    </motion.div>
  );
};
export default DetailGroupLecturer;
