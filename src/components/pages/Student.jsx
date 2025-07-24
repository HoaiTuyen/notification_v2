import React, { useEffect, useState, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWebSocket from "../../config/Websorket";
import { handleLogout } from "@/controller/AuthController";
import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Drawer, Grid, Dropdown } from "antd";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Dropdown as AntdDropdown } from "antd";

import {
  Bell,
  User,
  LogOut,
  Group,
  Users,
  BookOpen,
  BellRing,
  Key,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

import {
  handleGetDetailUser,
  handleUnreadCountNotificationUser,
} from "../../controller/AccountController";

import { handleStudentDetail } from "../../controller/StudentController";
import { handleListGroupByStudent } from "../../controller/AccountController";
import { handleDetailGroup } from "../../controller/GroupController";
import { handleListNotificationByStudent } from "../../controller/AccountController";
import NotificationDropdown from "./NotificationDropdown";
const Student = () => {
  const { stompClient, connected, error } = useWebSocket();
  const token = localStorage.getItem("access_token");
  const data = jwtDecode(token);
  const userId = data.userId;
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  // const [notificationCount, setNotificationCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationList, setNotificationList] = useState([]);

  const [groupStudents, setGroupStudents] = useState([]);
  console.log(groupStudents);
  const [userImage, setUserImage] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [apiNotificationPage, setApiNotificationPage] = useState(0);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const fetchListGroupById = async () => {
    const req = await handleListGroupByStudent(userId);

    if (Array.isArray(req.data) && req.status === 200) {
      const groupIds = req.data.map((group) => group.groupId);
      setGroupStudents(groupIds); // mảng ID: [101, 102, 103, 104]
    }
  };
  const fetchUnreadCount = async () => {
    try {
      const req = await handleUnreadCountNotificationUser(userId);
      console.log(req);
      if (req?.status === 200 || req?.data) {
        setUnreadCount(req.data);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };
  useEffect(() => {
    fetchListGroupById();
    fetchUnreadCount();
  }, [userId]);

  useEffect(() => {
    let subscriptions = [];
    if (connected && stompClient.current && groupStudents.length > 0) {
      const generalSub = stompClient.current.subscribe(
        "/user/queue/notification",
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          parsedMessage.type = "ChungToanTruong";

          console.log("Received general notification:", parsedMessage);

          setNotificationList((prev) => {
            if (prev.some((item) => item.id === parsedMessage.id)) return prev;
            return [{ ...parsedMessage, isRead: false }, ...prev];
          });
          setUnreadCount((prev) => prev + 1);
        }
      );

      const groupSub = stompClient.current.subscribe(
        "/user/queue/group",
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          parsedMessage.type = "ChungToanTruong";

          console.log(parsedMessage);
          setNotificationList((prev) => {
            if (prev.some((item) => item.id === parsedMessage.id)) return prev;
            return [{ ...parsedMessage, isRead: false }, ...prev];
          });

          setUnreadCount((prev) => prev + 1);
        }
      );

      const scheduleSub = stompClient.current.subscribe(
        "/user/queue/schedule",
        (message) => {
          console.log(message.body);
          const parsedMessage = {
            id: new Date().getTime(),
            title: message.body,
            isRead: false,
          };
          console.log(parsedMessage);

          setNotificationList((prev) => {
            if (prev.some((item) => item.title === parsedMessage.title))
              return prev;
            return [parsedMessage, ...prev];
          });

          setUnreadCount((prev) => prev + 1);
        }
      );

      const personalSub = stompClient.current.subscribe(
        "/user/queue/personal",
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log("Received personal notification:", parsedMessage);
          parsedMessage.type = "ChungToanTruong";

          setNotificationList((prev) => {
            if (prev.some((item) => item.id === parsedMessage.id)) return prev;
            return [{ ...parsedMessage, isRead: false }, ...prev];
          });
          setUnreadCount((prev) => prev + 1);
        }
      );
      const chatMessageSub = stompClient.current.subscribe(
        `/notification/chat_message/${groupStudents}`,
        (message) => {
          const parsed = JSON.parse(message.body);
          console.log(parsed);
          const newMsg = {
            id: parsed.messageId,
            sender: parsed.fullName,
            content: parsed.message,
            timestamp: parsed.createdAt,
            avatar: parsed.avatarUrl,
            userId: parsed.userId,
            type: "CHAT_MESSAGE",
            isTeacher: parsed.isTeacher || false,
          };
          console.log(newMsg);

          setNotificationList((prev) => {
            if (prev.some((item) => item.id === newMsg.id)) return prev;
            return [{ ...newMsg, isRead: false }, ...prev];
          });
          setUnreadCount((prev) => prev + 1);
        }
      );
      subscriptions = [
        generalSub,
        scheduleSub,
        personalSub,
        groupSub,
        chatMessageSub,
      ];
    }

    return () => {
      subscriptions.forEach((sub) => {
        if (sub && typeof sub.unsubscribe === "function") {
          sub.unsubscribe();
        }
      });
    };
  }, [connected, stompClient]);

  const handleLogoutUser = () => {
    handleLogout(navigate);
    toast.success("Đăng xuất thành công");
  };

  const fetchUserDetail = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const data = jwtDecode(token);
      if (!data || !data.userId) {
        console.error("Invalid token or missing userId");
        return;
      }
      const req = await handleGetDetailUser(data.userId);
      console.log(req);
      if (req?.data) {
        if (req.data.studentId) {
          setUserImage(req.data.image);
          const detailStudent = await handleStudentDetail(req.data.studentId);
          setUserInfo(detailStudent.data);
        } else {
          setUserInfo([]);
          console.error("No user data found in response");
        }
      } else {
        console.error("Invalid response from server:", req);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchInitialNotifications = async () => {
    try {
      const res = await handleListNotificationByStudent(userId, 0, 5);
      if (res?.data?.responses) {
        const notifications = res.data.responses;
        setNotificationList(notifications.slice(0, 5));
        setApiNotificationPage(1);
        setHasMoreNotifications(res.data.totalPages > 1);
      }
    } catch (error) {
      console.error("Lỗi fetch thông báo:", error);
    }
  };

  const loadMoreNotifications = async () => {
    const nextPage = apiNotificationPage + 1;

    try {
      const res = await handleListNotificationByStudent(userId, nextPage, 5);

      if (res?.data?.responses?.length > 0) {
        setNotificationList((prev) => [
          ...prev,
          ...res.data.responses.filter(
            (newItem) => !prev.some((oldItem) => oldItem.id === newItem.id)
          ),
        ]);

        setApiNotificationPage(nextPage);
        setHasMoreNotifications(nextPage < res.data.totalPages);
      } else {
        setHasMoreNotifications(false);
      }
    } catch (err) {
      console.error("Lỗi load thêm thông báo:", err);
    }
  };

  const items = [
    { key: "home", icon: <HomeOutlined />, label: "Trang chủ" },
    {
      key: "profile",
      icon: <User size={16} />,
      label: "Thông tin cá nhân",
    },
    {
      key: "subject",
      icon: <BookOpen size={16} />,
      label: "Môn học của tôi",
    },
    {
      key: "notification",
      icon: <Bell size={16} />,
      label: "Thông báo",
    },
    {
      key: "group-study",
      icon: <Group size={16} />,
      label: "Nhóm học tập",
    },
    {
      key: "change-password",
      icon: <Key size={16} />,
      label: "Thay đổi mật khẩu",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOut size={16} />,
      style: {
        color: "red",
        fontWeight: "bold",
      },
    },
  ];
  const SidebarMenu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedTab]}
      onClick={(e) => {
        setSelectedTab(e.key);
        setDrawerVisible(false);
        if (e.key === "logout") {
          handleLogoutUser();
          return;
        }
        navigate(`/sinh-vien/${e.key}`);
      }}
      items={items}
      style={{ height: "100%", borderRight: "1px solid #e5e7eb" }}
    />
  );
  useEffect(() => {
    fetchUserDetail();
    fetchInitialNotifications();
  }, []);

  return (
    <Layout style={{ minHeight: "150vh", width: "100vw" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <div className="sm:w-full sm:max-w-sm">
          <img
            className="h-10 w-auto"
            src="/img/logo1.png"
            alt="Your Company"
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {isMobile && (
            <Button
              icon={<MenuUnfoldOutlined />}
              onClick={() => setDrawerVisible(true)}
            />
          )}
          <Dropdown
            open={notificationDropdownOpen}
            dropdownRender={() => (
              <NotificationDropdown
                notificationList={notificationList}
                setNotificationList={setNotificationList}
                setNotificationCount={setUnreadCount}
                loadMore={loadMoreNotifications}
                hasMore={hasMoreNotifications}
                onClose={() => setNotificationDropdownOpen(false)}
              />
            )}
            trigger={["click"]}
            placement="bottomRight"
            overlayStyle={{
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              zIndex: 999,
              backgroundColor: "#fff",
            }}
            onOpenChange={(open) => {
              setNotificationDropdownOpen(open);
              if (open) {
                setUnreadCount(unreadCount);
              }
            }}
          >
            <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer group">
              <Bell className="text-gray-800" size={25} />
              {unreadCount > 0 && (
                <span className="absolute top-[2px] right-[5px] bg-red-600 text-white text-[10px] font-semibold rounded-full h-[16px] min-w-[16px] flex items-center justify-center shadow-md">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </Dropdown>

          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    key: "userInfo",
                    label: (
                      <div style={{ padding: "", textAlign: "start" }}>
                        <div style={{ fontWeight: "bold" }}>
                          {userInfo.firstName} {userInfo.lastName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {userInfo.email}
                        </div>
                      </div>
                    ),
                  },
                  // {
                  //   key: "settings",
                  //   label: "Cài đặt",
                  //   icon: <SettingOutlined />,
                  // },
                  {
                    key: "logout",
                    label: "Đăng xuất",
                    icon: <LogOut size={16} />,
                    style: {
                      color: "red",
                      fontWeight: "bold",
                      cursor: "pointer",
                    },
                  },
                ]}
                onClick={(e) => {
                  if (e.key === "logout") handleLogoutUser();
                }}
              />
            }
            trigger={["click"]}
          >
            <div style={{ cursor: "pointer", paddingRight: "25px" }}>
              {/* <Avatar icon={<UserOutlined />} /> */}
              <Avatar className="w-10 h-10  shadow-sm ring-1 ring-gray-200">
                <AvatarImage src={userImage || "No image"} alt="Logo" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {!isMobile && (
          <Sider width={250} theme="light" style={{ height: "100vh" }}>
            {SidebarMenu}
          </Sider>
        )}

        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
          style={{ height: "100vh", backgroundColor: "#fff" }}
        >
          {SidebarMenu}
        </Drawer>

        {/* NỘI DUNG */}
        <Content
          style={{
            padding: 0,

            overflow: "auto",
            backgroundColor: "#fff",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Student;
