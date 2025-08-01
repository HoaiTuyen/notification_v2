import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Paperclip,
  Smile,
  EllipsisVertical,
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
  handleListNotificationGroupStudent,
} from "../../../controller/GroupController";
import {
  handleListMessage,
  handleSendMessage,
  handleRevokeMessage,
  handleUpdateMessage,
} from "../../../controller/MessageController";
import useWebSocket from "../../../config/Websorket";
import { Badge } from "@/components/ui/badge";
import CreateNotificationPersonal from "./notificationgroup/notificaitonpersonal/CreateNotificationPersonal";
import UpdateNotificationPersonal from "./notificationgroup/notificaitonpersonal/UpdateNotificationPersonal";
import DeleteNotificationPersonal from "./notificationgroup/notificaitonpersonal/DeleteNotificationPersonal";
const DetailGroupLecturer = () => {
  const { connected, stompClient, error } = useWebSocket();

  useEffect(() => {
    if (connected) {
      console.log("Kết nối WebSocket thành công!");
    }
  }, [connected]);
  const scrollRef = useRef(null);
  const pageRef = useRef(0);
  const messagesEndRef = useRef(null);
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
  const [openModalCreatePersonal, setOpenModalCreatePersonal] = useState(false);
  const [dataNotificationStudent, setDataNotificationStudent] = useState([]);
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
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [page, setPage] = useState(0);
  const [expandedComments, setExpandedComments] = useState({}); // { [notificationId]: boolean }
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [openModalDeletePersonal, setOpenModalDeletePersonal] = useState(false);
  const [selectNotificationPersonal, setSelectNotificationPersonal] =
    useState(null);
  const [openModalUpdatePersonal, setOpenModalUpdatePersonal] = useState(false);
  // Auto-scroll to bottom when chat tab is active or messages change

  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
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
      console.log(listNotificationGroup);
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
  const fetchListNotificationStudent = async () => {
    try {
      const listNotificationGroupStudent =
        await handleListNotificationGroupStudent(groupId);
      console.log(listNotificationGroupStudent);
      if (
        listNotificationGroupStudent?.data ||
        listNotificationGroupStudent?.status === 200
      ) {
        setDataNotificationStudent(listNotificationGroupStudent.data);
      } else {
        setDataNotificationStudent([]);
      }
    } catch (e) {
      console.error("Lỗi khi fetch thông báo nhóm học tập:", e);
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
  const fetchMessages = async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    try {
      const res = await handleListMessage(groupId, pageRef.current, 6);
      console.log(res);
      if (res?.data) {
        const newMessages = res.data.messages.map((m) => ({
          id: m.messageId,
          sender: m.fullName,
          message: m.message,
          timestamp: m.createdAt,
          avatar: m.avatarUrl,
          userId: m.userId,
          isTeacher: false,
          status: m.status,
        }));

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNew = newMessages.filter((m) => !existingIds.has(m.id));
          return [...uniqueNew.reverse(), ...prev];
        });
        pageRef.current -= 1;
        setPage(pageRef.current);
        setHasMore(pageRef.current >= 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Lỗi khi lấy tin nhắn:", err);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };
  // const handleSendMessageGroup = async () => {
  //   const content = newMessage.trim();
  //   if (content === "") return;

  //   const tempMessage = {
  //     id: `temp-${Date.now()}`,
  //     sender: `${userDetail?.firstName || ""} ${userDetail?.lastName || ""}`,
  //     content,
  //     timestamp: new Date().toISOString(),
  //     avatar: imageUser,
  //     isTeacher: userDetail?.role === "TEACHER",
  //     status: "",
  //     userId,
  //   };
  //   setMessages((prev) => [...prev, tempMessage]); // 👉 thêm ngay vào UI
  //   setNewMessage("");
  //   try {
  //     await handleSendMessage(groupId, content);
  //     // WebSocket sẽ update lại tin chính xác sau
  //   } catch (err) {
  //     toast.error("Gửi tin nhắn thất bại");
  //   }
  // };
  const handleSendMessageGroup = async () => {
    const message = newMessage.trim();
    if (message === "") return;

    setNewMessage(""); // ✅ Clear input ngay
    try {
      await handleSendMessage(groupId, message);
      // ✅ Không cần thêm tin nhắn vào UI — WebSocket sẽ tự xử lý
    } catch (err) {
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };
  const handleSendComment = async (id) => {
    try {
      const content = commentInputs[id]?.trim();
      if (!content) return;
      console.log(content);
      console.log(id);
      console.log(userId);

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
  const handleRevokeMessageGroup = async (messageId, userId) => {
    console.log(messageId);
    console.log(userId);
    try {
      const response = await handleRevokeMessage(messageId, userId);
      console.log(response);

      if (response?.status === 204) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status: "DA_THU_HOI",
                  message: "Tin nhắn đã được thu hồi",
                }
              : msg
          )
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleEditMessage = async (messageId, newMessage, userId) => {
    try {
      if (newMessage.trim() === "") return;

      const response = await handleUpdateMessage(messageId, newMessage, userId);
      console.log(response);

      if (response?.status === 204) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  message: newMessage,
                  status: "DA_CHINH_SUA",
                }
              : msg
          )
        );
        setEditingMessageId(null);
      } else {
        toast.error("Chỉnh sửa thất bại");
      }
    } catch (e) {
      console.log(e);
      toast.error("Lỗi khi chỉnh sửa tin nhắn");
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
  const toggleExpandComments = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || activeTab !== "chat") return;

    const onScroll = () => {
      if (isFetching || !hasMore) return;

      if (el.scrollTop <= 140) {
        const prevScrollHeight = el.scrollHeight;

        fetchMessages().then(() => {
          setTimeout(() => {
            const newScrollHeight = el.scrollHeight;
            el.scrollTop = newScrollHeight - prevScrollHeight + el.scrollTop;
          }, 50);
        });
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [scrollRef.current, activeTab, isFetching, hasMore]);

  useLayoutEffect(() => {
    if (activeTab === "chat" && !initialLoaded) {
      requestAnimationFrame(() => {
        if (messages.length === 0 && hasMore) {
          fetchMessages(); // Gọi fetchMessages nếu messages rỗng
        } else if (messages.length > 0) {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
        setInitialLoaded(true);
      });
    }
  }, [activeTab, messages, hasMore]);

  useEffect(() => {
    if (activeTab === "chat" && groupId) {
      setHasMore(true);
      setInitialLoaded(false);
      pageRef.current = 0;
      setMessages([]);

      handleListMessage(groupId, 0, 6).then((res) => {
        if (res?.data) {
          const totalPages = res.data.totalPages;
          pageRef.current = totalPages - 1;
          setPage(pageRef.current);

          const newMessages = res.data.messages.map((m) => ({
            id: m.messageId,
            sender: m.fullName,
            message: m.message,
            timestamp: m.createdAt,
            avatar: m.avatarUrl,
            userId: m.userId,
            isTeacher: false,
            status: m.status || "",
          }));

          setMessages(newMessages.reverse());

          setTimeout(() => {
            const el = scrollRef.current;
            if (
              el &&
              el.scrollHeight <= el.clientHeight + 10 &&
              pageRef.current > 0
            ) {
              fetchMessages();
            }
          }, 100);

          setHasMore(pageRef.current > 0);
        }
      });
    }
  }, [activeTab, groupId]); // Thêm groupId vào dependency

  useEffect(() => {
    fetchDetailGroup();
    fetchListNotificationGroup();
    fetchDetailUser();
    fetchListNotificationStudent();
  }, []);

  useEffect(() => {
    if (!connected || !stompClient.current || !groupId) return;

    const sub = stompClient.current.subscribe(
      `/notification/chat_message/${groupId}`,
      (message) => {
        const parsed = JSON.parse(message.body);
        console.log(parsed);
        const newMsg = {
          id: parsed.messageId,
          sender: parsed.fullName,
          message: parsed.message,
          timestamp: parsed.createdAt || new Date().toISOString(),
          avatar: parsed.avatarUrl,
          userId: parsed.userId,
          isTeacher: parsed.isTeacher || false,
          status: parsed.status || "",
        };

        // setMessages((prev) => {
        //   const tempIndex = prev.findIndex(
        //     (m) =>
        //       m.id.startsWith("temp-") &&
        //       m.content === newMsg.content &&
        //       m.userId === newMsg.userId
        //   );

        //   if (prev.some((m) => m.id === newMsg.id)) return prev;

        //   if (tempIndex !== -1) {
        //     const updated = [...prev];
        //     updated[tempIndex] = newMsg;
        //     return updated;
        //   }

        //   return [...prev, newMsg];
        // });
        setMessages((prev) => {
          // Tránh trùng lặp nếu WebSocket gửi lại
          if (prev.some((m) => m.id === newMsg.id)) return prev;

          return [...prev, newMsg];
        });
      }
    );

    return () => sub.unsubscribe();
  }, [connected, stompClient.current, groupId]);

  useEffect(() => {
    if (activeTab !== "chat") return;

    const el = scrollRef.current;
    if (!el) return;

    // Cuộn tới đáy
    el.scrollTop = el.scrollHeight;
  }, [messages.length, activeTab]);

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
      <div className="h-full w-full bg-white overflow-auto p-10">
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
        <div className="h-full pb-10">
          <Tabs
            defaultValue="home"
            className="px-6 pt-8 pb-3"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList>
              <TabsTrigger
                value="home"
                className="data-[state=active]:text-blue-600 cursor-pointer"
              >
                Bảng tin
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="data-[state=active]:text-blue-600 cursor-pointer"
              >
                Nhắn tin
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
                              {!expandedComments[notify.id] ? (
                                <>
                                  <button
                                    onClick={() =>
                                      toggleExpandComments(notify.id)
                                    }
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                  >
                                    {comments[notify.id].length} phản hồi về
                                    thông báo
                                  </button>
                                  {/* Hiển thị 1 phản hồi mới nhất */}
                                  {comments[notify.id]
                                    .slice()
                                    .sort(
                                      (a, b) =>
                                        new Date(b.timestamp) -
                                        new Date(a.timestamp)
                                    )
                                    .slice(0, 1)
                                    .map((comment) => (
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
                                              <div className="text-xs text-gray-500">
                                                {dayjs(
                                                  comment.timestamp
                                                ).format("HH:mm - DD/MM/YYYY")}
                                              </div>
                                            </div>
                                            <div className="text-sm text-gray-700">
                                              {comment.content}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      toggleExpandComments(notify.id)
                                    }
                                    className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                                  >
                                    Ẩn phản hồi
                                  </button>
                                  {/* Hiển thị tất cả phản hồi */}
                                  {comments[notify.id]
                                    .slice()
                                    .sort(
                                      (a, b) =>
                                        new Date(a.timestamp) -
                                        new Date(b.timestamp)
                                    )
                                    .map((comment) => (
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
                                              <div className="text-xs text-gray-500">
                                                {dayjs(
                                                  comment.timestamp
                                                ).format("HH:mm - DD/MM/YYYY")}
                                              </div>
                                            </div>
                                            <div className="text-sm text-gray-700">
                                              {comment.content}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </>
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
              <Tabs defaultValue="group" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="group" className="cursor-pointer">
                    Thông báo chung
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="cursor-pointer">
                    Thông báo riêng cho sinh viên trong nhóm
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="group">
                  <div className="p-6">
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
                                      setSelectNotificationGroup(
                                        notificationGroup
                                      );
                                      setOpenModalUpdate(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" /> Chỉnh sửa
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="text-red-600 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectNotificationGroup(
                                        notificationGroup
                                      );
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
                                      {detailNotify.content ||
                                        "Không có nội dung"}
                                    </p>

                                    {detailNotify.fileNotifications?.length >
                                      0 && (
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

                {/* Tab thông báo riêng */}
                <TabsContent value="personal">
                  <div className="p-6">
                    {/* Nút Create */}
                    <div className="mb-6 ">
                      <button
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white  py-3 px-6 rounded-full shadow-md text-lg flex items-center gap-2"
                        onClick={() => setOpenModalCreatePersonal(true)}
                      >
                        <span className="font-light">＋</span>
                        Tạo thông báo
                      </button>
                      {openModalCreatePersonal && (
                        <CreateNotificationPersonal
                          open={openModalCreatePersonal}
                          onClose={() => setOpenModalCreatePersonal(false)}
                          onSuccess={() => {
                            setOpenModalCreatePersonal(false);
                            fetchListNotificationStudent();
                          }}
                        />
                      )}
                    </div>

                    {/* Thẻ thông báo */}
                    {dataNotificationStudent.length === 0 ? (
                      <></>
                    ) : (
                      dataNotificationStudent.map((notificationStudent) => (
                        <motion.div
                          // layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          key={notificationStudent.id}
                          className="mb-4"
                        >
                          <div
                            key={notificationStudent.id}
                            className="bg-white shadow rounded-xl p-4 mb-4 flex items-center justify-between hover:border hover:border-gray-200 transition-all duration-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleExpand(notificationStudent, e);
                            }}
                          >
                            <div className="flex items-center gap-4">
                              {/* Icon */}
                              <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                                <NotepadText size={22} />
                              </div>

                              {/* Nội dung */}
                              <div className="text-sm font-normal">
                                {notificationStudent.title}
                              </div>
                            </div>

                            {/* Ngày và menu */}
                            <div className="text-sm text-gray-500 flex items-center gap-4">
                              <span>
                                {dayjs(notificationStudent.createdAt).format(
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
                                      setSelectNotificationPersonal(
                                        notificationStudent
                                      );
                                      setOpenModalUpdatePersonal(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" /> Chỉnh sửa
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="text-red-600 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectNotificationPersonal(
                                        notificationStudent
                                      );
                                      setOpenModalDeletePersonal(true);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedId === notificationStudent.id && (
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
                                      {notificationStudent.content ||
                                        "Không có nội dung"}
                                    </p>

                                    {notificationStudent.fileNotifications
                                      ?.length > 0 && (
                                      <div className="space-y-2">
                                        {notificationStudent.fileNotifications.map(
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
              </Tabs>
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
                    {members.map((member) => (
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
                                {getInitials(member.fullName) || member.image}
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
                                <LogOut className=" h-4 w-4" /> Xoá khỏi nhóm
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
                      <Avatar>
                        <AvatarImage
                          src={groupDetail?.avatarUrl}
                          alt={groupDetail?.name}
                        />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getInitials(groupDetail?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {groupDetail?.name}
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
                  <div
                    className="h-[400px] overflow-y-auto p-4"
                    ref={scrollRef}
                  >
                    <div className="space-y-4">
                      {isFetching && (
                        <div className="flex justify-center my-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      {messages.map((message, index) => {
                        console.log(message);
                        const showDate =
                          index === 0 ||
                          !dayjs(messages[index - 1]?.timestamp).isSame(
                            dayjs(message.timestamp),
                            "day"
                          );
                        const isOwnMessage = message?.userId === userId;

                        return (
                          <div key={index}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <Badge variant="secondary" className="text-xs">
                                  {dayjs(message?.timestamp).isValid()
                                    ? dayjs(message?.timestamp).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "Ngày không hợp lệ"}
                                </Badge>
                              </div>
                            )}

                            <div
                              className={`flex ${
                                isOwnMessage ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex ${
                                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                                } items-start space-x-2 max-w-[80%]`}
                              >
                                {!isOwnMessage && (
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

                                <div className={`space-y-1`}>
                                  {!isOwnMessage && (
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
                                    className={`flex items-center ${
                                      isOwnMessage
                                        ? "flex-row"
                                        : "flex-row-reverse"
                                    }`}
                                  >
                                    {isOwnMessage &&
                                      message.status !== "DA_THU_HOI" && (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button>
                                              <EllipsisVertical
                                                size={16}
                                                className="mb-3 mr-2 text-gray-400 cursor-pointer"
                                              />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            <DropdownMenuItem
                                              className="text-red-500 cursor-pointer"
                                              onClick={() =>
                                                handleRevokeMessageGroup(
                                                  message.id,
                                                  message.userId
                                                )
                                              }
                                            >
                                              Thu hồi
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              className="text-black cursor-pointer"
                                              onClick={() => {
                                                setIsEditing(true);
                                                setEditingMessageId(message.id);
                                                setEditingContent(
                                                  message.message
                                                );
                                              }}
                                            >
                                              Chỉnh sửa
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}

                                    <div>
                                      <div
                                        className={`rounded-lg px-3 py-2 ${
                                          isOwnMessage &&
                                          message.status !== "DA_THU_HOI"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-900"
                                        }`}
                                      >
                                        {message.status === "DA_THU_HOI" ? (
                                          <p className="text-sm  border-white  text-gray-500">
                                            {message.message}
                                          </p>
                                        ) : (
                                          <p className="text-sm">
                                            {message.message}
                                          </p>
                                        )}
                                      </div>
                                      <div
                                        className={`flex  ${
                                          isOwnMessage
                                            ? "justify-start"
                                            : "justify-end"
                                        }`}
                                      >
                                        <p className="text-xs text-gray-500">
                                          {dayjs(message.timestamp).format(
                                            "HH:mm"
                                          )}
                                        </p>
                                        {message.status === "DA_CHINH_SUA" && (
                                          <span className="text-xs italic text-gray-500 ml-2">
                                            (đã chỉnh sửa)
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div key={messages.length} ref={messagesEndRef}></div>
                    </div>
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  {isEditing && (
                    <div className="mb-2 text-sm text-gray-600">
                      Đang chỉnh sửa tin nhắn...
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder={
                        isEditing ? "Chỉnh sửa tin nhắn..." : "Nhập tin nhắn..."
                      }
                      value={isEditing ? editingContent : newMessage}
                      onChange={(e) =>
                        isEditing
                          ? setEditingContent(e.target.value)
                          : setNewMessage(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (isEditing) {
                            handleEditMessage(
                              editingMessageId,
                              editingContent,
                              userId
                            );
                            setIsEditing(false);
                            setEditingMessageId(null);
                            setEditingContent("");
                          } else {
                            handleSendMessageGroup();
                          }
                        }
                      }}
                      className="flex-1"
                    />

                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false);
                            setEditingMessageId(null);
                            setEditingContent("");
                          }}
                        >
                          Huỷ
                        </Button>
                        <Button
                          size="sm"
                          disabled={editingContent.trim() === ""}
                          onClick={() => {
                            handleEditMessage(
                              editingMessageId,
                              editingContent,
                              userId
                            );
                            setIsEditing(false);
                            setEditingMessageId(null);
                            setEditingContent("");
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Lưu
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleSendMessageGroup}
                        disabled={newMessage.trim() === ""}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* Modal delete, update, out notification group */}
        {openModalDelete && (
          <DeleteNotificationGroup
            onOpen={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            onSuccess={() => {
              fetchListNotificationGroup();
            }}
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
        {/* Modal delete, update, out notification personal */}
        {openModalDeletePersonal && (
          <DeleteNotificationPersonal
            open={openModalDeletePersonal}
            onClose={() => setOpenModalDeletePersonal(false)}
            onSuccess={() => {
              fetchListNotificationStudent();
              setSelectNotificationPersonal(null);
            }}
            notify={selectNotificationPersonal}
          />
        )}
        {openModalUpdatePersonal && (
          <UpdateNotificationPersonal
            open={openModalUpdatePersonal}
            onClose={() => setOpenModalUpdatePersonal(false)}
            onSuccess={() => {
              fetchListNotificationStudent();
              setSelectNotificationPersonal(null);
            }}
            notify={selectNotificationPersonal}
          />
        )}
      </div>
    </motion.div>
  );
};
export default DetailGroupLecturer;
