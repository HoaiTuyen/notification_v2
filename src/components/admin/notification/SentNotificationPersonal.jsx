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
  Calendar,
  FileText,
  Trash2,
} from "lucide-react";
import {
  handleListNotification,
  handleSearchNotification,
  handleListNotificationPersonal,
} from "../../../controller/NotificationController";
import { handleListNotificationType } from "../../../controller/NotificationTypeController";
import { Pagination, Spin } from "antd";
import dayjs from "dayjs";
import DeleteNotification from "./DeleteNotification";
import useDebounce from "../../../hooks/useDebounce";
import UpdateNotification from "./UpdateNotification";
import Reports from "./reports/Reports";
import { jwtDecode } from "jwt-decode";
const SentNotificationsPersonal = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const { userId } = jwtDecode(token);

  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
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
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [openReport, setOpenReport] = useState(false);
  const [forceReload, setForceReload] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchListNotification = async (page = 1) => {
    try {
      setLoading(true);
      const keyword = debouncedSearchTerm.trim();
      const isKeywordEmpty = keyword === "";
      const isTypeAll = selectType === "all";

      let response;

      if (isKeywordEmpty && isTypeAll) {
        response = await handleListNotificationPersonal(
          userId,
          page - 1,
          pagination.pageSize
        );
      } else {
        const keywordParam = keyword;
        const typeParam = isTypeAll ? "" : selectType;

        response = await handleSearchNotification(
          keywordParam,
          typeParam,
          page - 1,
          pagination.pageSize
        );
        console.log(response);
      }

      if (response?.data) {
        setDataNotify(response.data.notifications);
        setPagination({
          current: page,
          pageSize: response.data.pageSize,
          total: response.data.totalElements,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });

        setTotalSent(response.data.totalElements);
      } else {
        setDataNotify([]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
          totalElements: 0,
        });
        setTotalSent(0);
      }
    } catch (e) {
      toast.error("Đã xảy ra lỗi khi tải thông báo");
    } finally {
      setLoading(false);
    }
  };
  const fetchNotifyType = async () => {
    const listNotifyType = await handleListNotificationType();
    if (listNotifyType?.data) {
      setType(listNotifyType.data.notificationTypes);
    }
  };
  useEffect(() => {
    setSearchParams({
      search: debouncedSearchTerm,
      type: selectType,
      page: pageFromUrl,
    });
  }, [debouncedSearchTerm, selectType, pageFromUrl]);

  useEffect(() => {
    fetchListNotification(pageFromUrl);
    fetchNotifyType();
  }, [pageFromUrl, debouncedSearchTerm, selectType, forceReload]);
  useEffect(() => {
    if (selectNotify?.id && dataNotify.length > 0) {
      const updated = dataNotify.find((n) => n.id === selectNotify.id);
      if (updated) {
        console.log("🔁 Cập nhật lại selectNotify sau khi BE trả về:", updated);
        setSelectNotify(updated);
      }
    }
  }, [dataNotify]);

  const handleViewDetail = (id, e) => {
    e.stopPropagation();

    navigate(
      `/admin/sent-notification-personal/${id}?search=${debouncedSearchTerm}&type=${selectType}&page=${pagination.current}`
    );
  };
  const handleWapper = (id, e) => {
    e.stopPropagation();

    navigate(
      `/admin/sent-notification-personal/${id}?search=${debouncedSearchTerm}&type=${selectType}&page=${pagination.current}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-wull w-full bg-white p-0 overflow-auto">
        <div className="space-y-6 p-8 overflow-x-auto max-h-[700px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Thông báo đã gửi</h1>
            </div>
            <Button
              variant="outline"
              className="ml-2 cursor-pointer hover:bg-gray-100"
              onClick={() => setOpenReport(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
            {openReport && (
              <Reports open={openReport} onClose={() => setOpenReport(false)} />
            )}
          </div>

          {/* Statistics */}

          {/* Filters */}
          {/* <Card>
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
          </Card> */}

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
                {loading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Spin size="large" />
                  </div>
                ) : dataNotify.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có thông báo nào
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
                              <h3 className="font-semibold line-clamp-2 overflow-hidden">
                                {notification.title}
                              </h3>
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

                          <div className="flex items-center gap-2 ml-4">
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
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
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

                {dataNotify.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Không tìm thấy thông báo nào phù hợp với bộ lọc</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {openModalUpdate && (
            <UpdateNotification
              open={openModalUpdate}
              onClose={() => setOpenModalUpdate(false)}
              onSuccess={async () => {
                await fetchListNotification(pageFromUrl); // ✅ gọi lại dữ liệu mới
                setOpenModalUpdate(false);
              }}
              notify={selectNotify}
            />
          )}
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              showSizeChanger={false}
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
            onSuccess={async () => {
              let targetPage = pagination.current;

              // Logic tính toán trang đích sau khi xóa
              // Nếu chỉ còn 1 phần tử trên trang hiện tại và không phải là trang 1,
              // hoặc nếu tổng số phần tử là 1 (trước khi xóa)
              if (
                pagination.totalElements === 1 || // Nếu chỉ còn 1 phần tử tổng thể và bạn xóa nó
                (pagination.totalElements > 1 && // Hoặc nếu có nhiều hơn 1 phần tử
                  dataNotify.length === 1 && // và chỉ còn 1 phần tử trên trang hiện tại
                  pagination.current > 1) // và bạn không ở trang đầu tiên
              ) {
                targetPage = pagination.current - 1;
              }

              // Đảm bảo targetPage không nhỏ hơn 1
              if (targetPage < 1) {
                targetPage = 1;
              }

              // Cập nhật URL.
              // Điều này sẽ kích hoạt useEffect lắng nghe pageFromUrl
              // và sau đó gọi fetchListNotification với trang mới.
              setSearchParams({
                search: searchTerm.trim(),
                type: selectType,
                page: targetPage.toString(),
              });

              setForceReload((prev) => !prev);
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
export default SentNotificationsPersonal;
