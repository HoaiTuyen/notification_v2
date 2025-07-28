import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Drawer, Grid, Dropdown } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  BookOutlined,
  NotificationOutlined,
  SettingOutlined,
  BorderTopOutlined,
} from "@ant-design/icons";
import {
  BookOpen,
  Users,
  Bell,
  User,
  Key,
  LogOut,
  Home,
  MessageSquare,
  GraduationCap,
  Calendar,
  FileText,
} from "lucide-react";
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import { handleLogout } from "@/controller/AuthController";
import { handleGetDetailUser } from "../../controller/AccountController";

import { handleTeacherDetail } from "../../controller/TeacherController";
import { handleStudentDetail } from "../../controller/StudentController";
import { jwtDecode } from "jwt-decode";
const LecturerDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleLogoutUser = () => {
    handleLogout(navigate);
    toast.success("Đăng xuất thành công");
  };

  const items = [
    { key: "home", icon: <HomeOutlined />, label: "Trang chủ" },
    {
      key: "profile",
      icon: <User size={16} />,
      label: "Thông tin cá nhân",
    },
    {
      key: "subject-charge",
      icon: <BookOpen size={16} />,
      label: "Môn học phụ trách",
    },
    {
      key: "class-charge",
      icon: <GraduationCap size={16} />,
      label: "Lớp học phụ trách",
    },
    {
      key: "group-class",
      icon: <Users size={16} />,
      label: "Nhóm học tập",
    },
    // {
    //   key: "notification",
    //   icon: <MessageSquare size={16} />,
    //   label: "Tạo thông báo",
    //   title: "",
    // },
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
        BorderTopOutlined: "1px solid #e5e7eb",
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
        navigate(`/giang-vien/${e.key}`);
      }}
      items={items}
      style={{ height: "100%", borderRight: "1px solid #e5e7eb" }}
    />
  );
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
      if (req?.data && req?.status === 200) {
        const userData = req.data;
        setUserImage(userData.image);
        if (userData.studentId) {
          const studentDetail = await handleStudentDetail(userData.studentId);
          setUserInfo(studentDetail.data);
        } else if (userData.teacherId) {
          const teacherDetail = await handleTeacherDetail(userData.teacherId);
          setUserInfo(teacherDetail.data);
        } else {
          console.error("No user data found in response");
        }
      } else {
        console.error("Invalid response from server:", req);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    fetchUserDetail();
  }, []);
  return (
    <Layout
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
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

                  {
                    key: "logout",
                    label: "Đăng xuất",
                    icon: <LogOut size={16} />,
                    style: { color: "red", fontWeight: "bold" },
                  },
                ]}
                onClick={(e) => {
                  if (e.key === "logout") handleLogoutUser();
                }}
              />
            }
            trigger={["click"]}
          >
            <div
              style={{
                cursor: "pointer",
                paddingRight: "25px",
              }}
            >
              <Avatar
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0", // Màu nền khi không có ảnh
                }}
                src={userImage || <UserOutlined size={16} />}
              />
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
          style={{ height: "100vh" }}
        >
          {SidebarMenu}
        </Drawer>

        {/* NỘI DUNG */}
        <Content
          style={{
            height: "100%",
            overflowY: "auto",
            backgroundColor: "#fff",
            padding: 0,
          }}
        >
          {/* {selectedTab === "notification" && <CreateNotification />} */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LecturerDashboard;
