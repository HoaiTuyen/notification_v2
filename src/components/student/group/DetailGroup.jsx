import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useWebSocket from "@/config/Websorket";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  CalendarDays,
  Paperclip,
  Smile,
  SendHorizontal,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { handleDetailGroup } from "../../../controller/GroupController";
import { gradientBackgroundFromString } from "../../../config/Color";
// import LecturerCreateGroupNotification from "./NotificationGroup/CreateNotification";
import {
  handleListNotificationGroup,
  handleDetailNotificationGroup,
} from "../../../controller/NotificationGroupController";
import { handleGetDetailUser } from "../../../controller/AccountController";
import { handleStudentDetail } from "../../../controller/StudentController";
import { handleTeacherDetail } from "../../../controller/TeacherController";

import {
  handleCreateReplyNotificationGroup,
  handleListReplyNotificationGroup,
} from "../../../controller/GroupController";
const mockMessages = [
  {
    id: "1",
    sender: "GV. Nguyễn Văn Tam",
    content: "Chào các em! Hôm nay chúng ta sẽ học về React hooks.",
    timestamp: "2024-12-20T09:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    isTeacher: true,
  },
  {
    id: "2",
    sender: "Nguyễn Văn A",
    content: "Thầy ơi, em có thể hỏi về useState không ạ?",
    timestamp: "2024-12-20T09:05:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    isTeacher: false,
  },
  {
    id: "3",
    sender: "GV. Nguyễn Văn Tam",
    content: "Được em, em hỏi đi!",
    timestamp: "2024-12-20T09:06:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    isTeacher: true,
  },
  {
    id: "4",
    sender: "Trần Thị B",
    content: "Em cũng muốn hỏi về useEffect ạ!",
    timestamp: "2024-12-20T09:10:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    isTeacher: false,
  },
];
const mockGroupData = {
  id: "1",
  name: "Nhóm Lập trình Web",
  userName: "GV. Nguyễn Văn Tam",
  description: "Nhóm học tập môn Lập trình Web - Lớp IT01",
  members: [
    {
      id: "1",
      fullName: "Nguyễn Văn A",
      role: "Sinh viên",
      image: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    {
      id: "2",
      fullName: "Trần Thị B",
      role: "Sinh viên",
      image: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    {
      id: "3",
      fullName: "Lê Văn C",
      role: "Sinh viên",
      image: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
  ],
};
const DetailGroupStudent = () => {
  const { connected } = useWebSocket();

  useEffect(() => {
    if (connected) {
      console.log("Kết nối WebSocket thành công!");
    }
  }, [connected]);
  const location = useLocation();
  const navigate = useNavigate();
  const { groupStudyId } = useParams();
  const token = localStorage.getItem("access_token");
  const { userId } = jwtDecode(token);
  const [imageUser, setImageUser] = useState("");
  const [groupData, setGroupData] = useState(mockGroupData);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [groupDetail, setGroupDetail] = useState({});
  const [members, setMembers] = useState([]);
  const [notificationGroups, setNotificationGroups] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [commentInputs, setCommentInputs] = useState({}); // { [notificationId]: "Nội dung comment" }
  const [comments, setComments] = useState({}); // { [notificationId]: [{id, content, sender, timestamp}] }
  const [userDetail, setUserDetail] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [imageTeacher, setImageTeacher] = useState("");
  const backUrl = location.state?.from || "/sinh-vien/group-study";
  const fetchDetailGroup = async () => {
    setLoadingPage(true);
    const detailGroup = await handleDetailGroup(groupStudyId);
    console.log(detailGroup);
    if (detailGroup?.data && detailGroup.status === 200) {
      setImageTeacher(detailGroup.data.avatarUrl);
      setGroupDetail(detailGroup.data);
      setMembers(detailGroup.data.members);
      setAuthorized(true);
    } else {
      toast.error(detailGroup.message);
      navigate(backUrl);
    }
    setLoadingPage(false);
  };
  const fetchListNotificationGroup = async () => {
    setLoadingPage(true);
    const listNotificationGroup = await handleListNotificationGroup(
      groupStudyId
    );

    setLoadingPage(false);
    if (listNotificationGroup?.data || listNotificationGroup?.status === 200) {
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
  };
  const fetchDetailUser = async () => {
    try {
      const detailUser = await handleGetDetailUser(userId);
      console.log(detailUser);
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
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");

    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: (messages.length + 1).toString(),
      sender: userDetail.fullName,
      content: newMessage,
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=40&width=40",
      isTeacher: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
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

  useEffect(() => {
    fetchDetailGroup();
    fetchDetailUser();
  }, []);
  useEffect(() => {
    if (authorized) {
      fetchListNotificationGroup();
      const handleRefresh = () => {
        fetchListNotificationGroup();
      };
      window.addEventListener("notification-sent", handleRefresh);
      return () => {
        window.removeEventListener("notification-sent", handleRefresh);
      };
    }
  }, [authorized]);
  if (loadingPage) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authorized) return null;
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-gray-50 border-t border-gray-200 rounded-b-xl "
    >
      <div className="min-h-screen w-full bg-white p-10 overflow-y-auto max-h-screen pb-24">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => navigate(backUrl)}
              >
                <div className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="min-h-screen ">
          <Tabs defaultValue="home" className="px-6 pt-8 pb-3">
            <TabsList>
              <TabsTrigger
                value="home"
                className="data-[state=active]:text-blue-600 cursor-pointer"
              >
                Bảng tin
              </TabsTrigger>
              {/* <TabsTrigger value="chat" className="cursor-pointer">
                Nhắn tin
              </TabsTrigger> */}
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
                {/* <button className="bg-white text-black rounded px-3 py-1 text-sm font-medium shadow">
                    Customize
                  </button> */}
              </div>
              <div className="flex gap-4 mt-6">
                {/* Class code */}
                <div className="w-[200px] p-4 bg-gradient-to-br from-blue-100 to-blue-50 border rounded-xl shadow-sm h-fit shrink-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <CalendarDays className="text-blue-600 w-5 h-5" />
                    <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                      Ngày tạo lớp
                    </h3>
                  </div>
                  <p className="text-xl font-semibold text-gray-800">
                    {dayjs(groupDetail.createdAt).format("DD/MM/YYYY")}
                  </p>
                </div>

                {/* Announcement + Activity */}
                <div className="flex-1 space-y-4">
                  {notificationGroups.length === 0 ? (
                    <></>
                  ) : (
                    notificationGroups.map((notify, index) => (
                      <div
                        key={index}
                        className="bg-white border rounded-xl shadow-sm overflow-hidden cursor-pointer"
                      >
                        <div className="p-4">
                          {/* Header row: Avatar + name + date */}
                          <div className="flex items-start space-x-3 mb-2">
                            <Avatar className="h-10 w-10">
                              {imageTeacher && (
                                <AvatarImage src={imageTeacher} />
                              )}
                              <AvatarFallback className="bg-blue-500 text-white">
                                {getInitials(groupDetail.userName) ||
                                  groupDetail.image}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold">
                                {groupDetail.userName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Đã đăng vào ngày{" "}
                                {dayjs(notify.createdAt).format("DD [thg] M")}
                              </p>
                            </div>
                            {/* <div className="text-gray-400 cursor-pointer">
                                <MoreVertical size={16} />
                              </div> */}
                          </div>

                          {/* Title + Content full width, sát trái */}
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-gray-800">
                              {notify.title}
                            </p>
                            {notify.content && (
                              <p className="text-sm text-gray-600 whitespace-pre-line">
                                {notify.content}
                              </p>
                            )}
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
                        {/* Danh sách phản hồi */}
                        <div className="border-t pt-5">
                          {comments[notify.id]?.length > 0 && (
                            <div className="px-4 pb-2 space-y-2">
                              {comments[notify.id].map((comment) => (
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
                              ))}
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
                    <Avatar>
                      <AvatarImage
                        src={imageTeacher}
                        alt={groupDetail.userName}
                      />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {getInitials(groupDetail.userName)}
                      </AvatarFallback>
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
                    {members.map((member) => (
                      <div
                        key={member.fullName}
                        className="flex items-center space-x-3 py-2"
                      >
                        <Avatar>
                          {member.image && (
                            <AvatarImage
                              src={member.image}
                              alt={member.fullName}
                            />
                          )}
                          <AvatarFallback className="bg-gray-400 text-white">
                            {getInitials(member.fullName) || member.image}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.fullName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="chat">
              <Card className="flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getInitials(groupData.name)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {groupData.name}
                        </h3>
                        {/* <p className="text-sm text-gray-500">
                          {groupData.members.filter((m) => m.isOnline).length}{" "}
                          đang hoạt động
                        </p> */}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[450px] p-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        const showDate =
                          index === 0 ||
                          dayjs(messages[index - 1].timestamp).isSame(
                            dayjs(message.timestamp),
                            "day"
                          );
                        console.log(showDate);

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <Badge variant="secondary" className="text-xs">
                                  {dayjs(message.timestamp).isValid()
                                    ? dayjs(message.timestamp).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "Ngày không hợp lệ"}
                                </Badge>
                              </div>
                            )}

                            <div
                              className={`flex ${
                                message.sender === "Nguyễn Văn A"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex ${
                                  message.sender === "Nguyễn Văn A"
                                    ? "flex-row-reverse"
                                    : "flex-row"
                                } items-start space-x-2 max-w-[80%]`}
                              >
                                {message.sender !== "Nguyễn Văn A" && (
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={message.avatar || "/placeholder.svg"}
                                    />
                                    <AvatarFallback
                                      className={
                                        message.isTeacher
                                          ? "bg-green-500"
                                          : "bg-blue-500"
                                      }
                                    >
                                      {getInitials(message.sender)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`space-y-1 ${
                                    message.sender === "Nguyễn Văn A"
                                      ? "items-end"
                                      : "items-start"
                                  }`}
                                >
                                  {message.sender !== "Nguyễn Văn A" && (
                                    <div className="flex items-center space-x-2">
                                      <p className="text-sm font-medium text-gray-900">
                                        {message.sender}
                                      </p>
                                      {message.isTeacher && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Giáo viên
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  <div
                                    className={`rounded-lg px-3 py-2 ${
                                      message.sender === "Nguyễn Văn A"
                                        ? "bg-blue-600 text-white"
                                        : message.isTeacher
                                        ? "bg-green-100 text-green-900"
                                        : "bg-gray-100 text-gray-900"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {dayjs(message.timestamp).format("HH:mm")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* <div ref={messagesEndRef} /> */}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Nhập tin nhắn..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={newMessage.trim() === ""}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};
export default DetailGroupStudent;
