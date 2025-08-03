import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import useWebSocket from "@/config/Websorket";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  EllipsisVertical,
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
import {
  handleSendMessage,
  handleListMessage,
  handleRevokeMessage,
  handleUpdateMessage,
} from "../../../controller/MessageController";

const DetailGroupStudent = () => {
  const { connected, stompClient, error } = useWebSocket();
  const scrollRef = useRef(null);
  const pageRef = useRef(0);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { groupStudyId } = useParams();
  const token = localStorage.getItem("access_token");
  const { userId } = jwtDecode(token);
  const [expandedComments, setExpandedComments] = useState({});

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current && scrollRef.current) {
      // Method 1: Scroll the container to bottom
      const container = scrollRef.current;
      container.scrollTop = container.scrollHeight;

      // Method 2: Also use scrollIntoView as backup
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior,
          block: "end",
          inline: "nearest",
        });
      }, 50);
    }
  };
  useEffect(() => {
    if (!connected || !stompClient.current || !groupStudyId) return;

    const sub = stompClient.current.subscribe(
      `/notification/chat_message/${groupStudyId}`,
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
        //   if (prev.some((m) => m.id === newMsg.id)) return prev;

        //   return [...prev, newMsg];
        // });
        setMessages((prev) => {
          const existingIndex = prev.findIndex((m) => m.id === newMsg.id);
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = newMsg;
            return updated;
          }
          return [...prev, newMsg];
        });
      }
    );
    // const groupMessage = stompClient.current.subscribe(
    //   `/notification/chat_message/${groupStudyId}`,
    //   (message) => {
    //     const parsed = JSON.parse(message.body);

    //   }
    // );

    return () => sub.unsubscribe();
  }, [connected, stompClient.current, groupStudyId]);
  const [imageUser, setImageUser] = useState("");
  const [initialLoaded, setInitialLoaded] = useState(false);

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
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
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

      if (
        listReplyNotificationGroup?.data ||
        listReplyNotificationGroup?.status === 200
      ) {
        setComments((prev) => ({
          ...prev,
          [notificationId]: listReplyNotificationGroup.data.map((c) => ({
            id: `${c.userId + c.createdAt}`,
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
      const res = await handleListMessage(groupStudyId, pageRef.current, 6);
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
  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSendMessageGroup();
  //   }
  // };

  const handleSendMessageGroup = async () => {
    const message = newMessage.trim();
    if (message === "") return;

    setNewMessage(""); // ✅ Clear input ngay
    try {
      await handleSendMessage(groupStudyId, message);
      // ✅ Không cần thêm tin nhắn vào UI — WebSocket sẽ tự xử lý
    } catch (err) {
      toast.error("Gửi tin nhắn thất bại");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageGroup();
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendComment = async (id) => {
    try {
      const content = commentInputs[id]?.trim();

      if (!content) return;

      await handleCreateReplyNotificationGroup(userId, id, content);

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

      if (el.scrollTop <= 1) {
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
      requestAnimationFrame(async () => {
        if (messages.length === 0 && hasMore) {
          await fetchMessages();
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
    if (activeTab === "chat" && groupStudyId) {
      setHasMore(true);
      setInitialLoaded(false);
      pageRef.current = 0;
      setMessages([]);
      handleListMessage(groupStudyId, 0, 6).then((res) => {
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
            status: m.status,
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
  }, [activeTab, groupStudyId]);
  useEffect(() => {
    if (activeTab !== "chat") return;

    const el = scrollRef.current;
    if (!el) return;

    // Cuộn tới đáy
    el.scrollTop = el.scrollHeight;
  }, [messages.length, activeTab]);
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
      className=" bg-gray-50 border-t border-gray-200 rounded-b-xl "
    >
      <div className="h-full w-full bg-white p-10 overflow-auto pb-24">
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
        <div className="h-full">
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
              <TabsTrigger value="chat" className="cursor-pointer">
                Nhắn tin
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
              <Card className="flex flex-col h-full">
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
                <CardContent className="flex-1 p-0 h-full">
                  <div
                    className="max-h-[450px] overflow-y-auto p-4"
                    ref={scrollRef}
                  >
                    <div className="space-y-4">
                      {isFetching && (
                        <div className="flex justify-center my-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      )}

                      {messages.map((message, index) => {
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
                                        className={`flex ${
                                          isOwnMessage
                                            ? "justify-start"
                                            : "justify-end"
                                        } items-center gap-2`}
                                      >
                                        {!isOwnMessage &&
                                          message.status === "DA_CHINH_SUA" && (
                                            <span className="text-xs italic text-gray-500">
                                              (đã chỉnh sửa)
                                            </span>
                                          )}
                                        <p className="text-xs text-gray-500">
                                          {dayjs(message.timestamp).format(
                                            "HH:mm"
                                          )}
                                        </p>
                                        {isOwnMessage &&
                                          message.status === "DA_CHINH_SUA" && (
                                            <span className="text-xs italic text-gray-500">
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
      </div>
    </motion.div>
  );
};
export default DetailGroupStudent;
