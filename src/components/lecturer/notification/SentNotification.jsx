import { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  MessageSquare,
} from "lucide-react";
import {
  handleListNotification,
  handleSearchNotification,
} from "../../../controller/NotificationController";
import { handleListNotificationType } from "../../../controller/NotificationTypeController";
import { Pagination } from "antd";
import dayjs from "dayjs";
import DeleteNotification from "./DeleteNotification";
import useDebounce from "../../../hooks/useDebounce";
import UpdateNotification from "./UpdateNotification";
const LecturerSentNotifications = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const typeFromUrl = searchParams.get("type") || "all";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [type, setType] = useState([]);
  const [selectType, setSelectType] = useState(typeFromUrl);
  const [dataNotify, setDataNotify] = useState([]);
  const [openModalDelete, setModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [selectNotify, setSelectNotify] = useState([]);
  const [totalSent, setTotalSent] = useState(0);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const fetchTotalNotifications = async () => {
    const res = await handleListNotification("desc", 0, 1); // chỉ lấy 1 bản ghi
    if (res?.data?.totalElements !== undefined) {
      setTotalSent(res.data.totalElements);
    }
  };
  const fetchNotifications = async (page = 1) => {
    const type = selectType === "all" ? null : selectType;
    const keyword = debouncedSearchTerm.trim();
    let res;

    if (keyword) {
      res = await handleSearchNotification(
        keyword,
        page - 1,
        pagination.pageSize,
        type
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
      setDataNotify(res.data.notifications || []);
      setPagination({
        current: page,
        pageSize: res.data.pageSize,
        total: res.data.totalElements,
      });
    }
  };

  const fetchNotifyType = async () => {
    const listNotifyType = await handleListNotificationType();
    if (listNotifyType?.data) {
      setType(listNotifyType.data.notificationTypes);
    }
  };
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentType = searchParams.get("type") || "all";
    const currentPage = searchParams.get("page") || "1";

    if (currentSearch !== debouncedSearchTerm || currentType !== selectType) {
      setSearchParams({
        search: debouncedSearchTerm,
        type: selectType,
        page: "1",
      });
    }
  }, [debouncedSearchTerm, selectType]);

  // Fetch lại dữ liệu khi URL param thay đổi
  useEffect(() => {
    fetchNotifications(pageFromUrl);
  }, [searchParams]);
  useEffect(() => {
    fetchNotifyType();
    fetchTotalNotifications();
  }, []);
  const handleViewDetail = (id, e) => {
    e.stopPropagation();

    navigate(
      `/giang-vien/sentNotification/${id}?search=${debouncedSearchTerm}&type=${selectType}&page=${pagination.current}`
    );
  };
  const handleWapper = (id, e) => {
    e.stopPropagation();

    navigate(
      `/giang-vien/sentNotification/${id}?search=${debouncedSearchTerm}&type=${selectType}&page=${pagination.current}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen w-full bg-white p-0 ">
        <div className="space-y-6 p-8 overflow-x-auto max-h-[700px]">
          <div>
            <h1 className="text-3xl font-bold">Thông báo đã gửi</h1>
            <p className="text-muted-foreground">
              Quản lý và theo dõi các thông báo bạn đã gửi
            </p>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng thông báo
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSent}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Bộ lọc và tìm kiếm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm thông báo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select
                  value={selectType}
                  onValueChange={(value) => setSelectType(value)}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    {type.length === 0 ? (
                      <SelectItem>Trống</SelectItem>
                    ) : (
                      type.map((item) => (
                        <SelectItem value={item.name}>{item.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card className="overflow-x-auto max-h-[800px]">
            <CardHeader>
              <CardTitle>Danh sách thông báo</CardTitle>
              <CardDescription>
                Hiển thị {pagination.totalElements} thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto max-h-[400px]">
              <div className="space-y-4 cursor-pointer">
                {dataNotify.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Không tìm thấy thông báo nào phù hợp với bộ lọc</p>
                  </div>
                ) : (
                  dataNotify.map((notification) => {
                    return (
                      <div
                        key={notification.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        onClick={(e) => handleWapper(notification.id, e)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold hover:text-blue-600">
                                {notification.title}
                              </h3>
                              {notification.notificationType && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {notification.notificationType}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {dayjs(notification.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4 cursor-pointer">
                            <Button
                              className="cursor-pointer"
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(notification.id, e);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              className="cursor-pointer"
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectNotify(notification);
                                setOpenModalUpdate(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectNotify(notification);
                                setModalDelete(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
          {openModalUpdate && (
            <UpdateNotification
              open={openModalUpdate}
              onClose={() => setOpenModalUpdate(false)}
              onSuccess={() => fetchNotifications(pageFromUrl)}
              notify={selectNotify}
            />
          )}
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page) => {
                const params = new URLSearchParams({
                  search: debouncedSearchTerm,
                  type: selectType,
                  page: page.toString(),
                });
                setSearchParams(params);
              }}
            />
          </div>
        </div>
        {openModalDelete && (
          <DeleteNotification
            onOpen={openModalDelete}
            onSuccess={() => {
              fetchNotifications(pageFromUrl);
              fetchTotalNotifications();
            }}
            onClose={() => setModalDelete(false)}
            notify={selectNotify}
          />
        )}
        <Outlet />
      </div>
    </motion.div>
  );
};
export default LecturerSentNotifications;
