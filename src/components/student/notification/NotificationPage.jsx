import { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Search,
  Filter,
  BookMarkedIcon as MarkAsUnread,
  Clock,
  Mail,
  MailOpen,
} from "lucide-react";
import { Pagination } from "antd";
import dayjs from "dayjs";

import {
  handleListNotification,
  handleSearchNotification,
} from "../../../controller/NotificationController";
import { handleListNotificationType } from "../../../controller/NotificationTypeController";
import useDebounce from "../../../hooks/useDebounce";
import { motion } from "framer-motion";
import { Spin } from "antd";
import { toast } from "react-toastify";
const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const typeFromUrl = searchParams.get("type") || "all";

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedType, setSelectedType] = useState(typeFromUrl);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [notifications, setNotifications] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);

  const [pagination, setPagination] = useState({
    current: pageFromUrl,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();

  const handleViewDetail = (id, e) => {
    e.stopPropagation();
    navigate(
      `/sinh-vien/notification/${id}?search=${debouncedSearchTerm}&type=${selectedType}&page=${pagination.current}`
    );
  };

  const fetchNotifications = async (page = 1) => {
    try {
      const type = selectedType === "all" ? null : selectedType;
      const keyword = debouncedSearchTerm.trim();
      let res;
      setLoading(true);
      if (keyword) {
        res = await handleSearchNotification(
          keyword,
          type,
          page - 1,
          pagination.pageSize
        );
        console.log(res);
      } else {
        res = await handleListNotification(
          "desc",
          page - 1,
          pagination.pageSize,
          type
        );
        console.log(res);
      }

      if (res?.data) {
        setNotifications(res.data.notifications || []);
        setPagination({
          current: page,
          pageSize: res.data.pageSize,
          total: res.data.totalElements,
        });
      }
    } catch (e) {
      toast.error(e.response.data.message || "Lỗi khi tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationTypes = async () => {
    try {
      setLoading(true);
      const res = await handleListNotificationType();
      setLoading(false);
      setNotificationTypes(res?.data?.notificationTypes || []);
    } catch (e) {
      toast.error(e.response.data.message || "Lỗi khi tải loại thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentType = searchParams.get("type") || "all";
    const currentPage = searchParams.get("page") || "1";

    if (currentSearch !== debouncedSearchTerm || currentType !== selectedType) {
      setSearchParams({
        search: debouncedSearchTerm,
        type: selectedType,
        page: "1", // reset trang khi lọc thay đổi
      });
    }
  }, [debouncedSearchTerm, selectedType]);

  // Fetch lại dữ liệu khi URL param thay đổi
  useEffect(() => {
    fetchNotifications(pageFromUrl);
    fetchNotificationTypes();
  }, [searchParams]);

  const NotificationCard = ({ notification }) => (
    <Card className="p-0">
      <CardHeader className="pt-5">
        <div className="flex items-center justify-between gap-2 pb-0">
          {/* LEFT: Title + Badge + Date */}
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle
              className="text-base cursor-pointer hover:text-blue-500 max-w-[700px] truncate"
              onClick={(e) => {
                handleViewDetail(notification.id, e);
              }}
            >
              {notification.title}
            </CardTitle>

            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {dayjs(notification.createdAt).format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent />
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="framer-motion-page"
    >
      <div className="framer-motion-content bg-white p-0">
        <div className="space-y-6 px-10 pt-10 overflow-x-auto max-h-[730px]">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Thông báo</h2>
              <p className="text-muted-foreground">
                Theo dõi các thông báo từ giảng viên và nhóm học tập
              </p>
            </div>
          </div>

          {/* Bộ lọc */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Bộ lọc thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm thông báo..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value)}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    {notificationTypes.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
            </TabsList>

            <TabsContent
              value="all"
              className="space-y-4 border-1 p-5 rounded-2xl overflow-x-auto max-h-[500px]"
            >
              {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-white">
                  <Spin size="large" />
                </div>
              ) : notifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Không có thông báo
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Không tìm thấy thông báo nào phù hợp với bộ lọc hiện tại.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>

          {pagination.total > pagination.pageSize && (
            <div className="flex justify-center mt-4">
              <Pagination
                current={pagination.current}
                showSizeChanger={false}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page) => {
                  setSearchParams({
                    search: debouncedSearchTerm,
                    type: selectedType,
                    page: page.toString(),
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </motion.div>
  );
};

export default NotificationsPage;
