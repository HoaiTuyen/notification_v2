import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, BellRing } from "lucide-react";
import dayjs from "dayjs";
import isTodayPlugin from "dayjs/plugin/isToday";
dayjs.extend(isTodayPlugin);
import { jwtDecode } from "jwt-decode";
import { handleDetailGroup } from "../../controller/GroupController";
import {
  handleMakeNotificationRead,
  handleMakeAllNotificationRead,
} from "../../controller/AccountController";
import { Spin } from "antd";
const NotificationDropdown = ({
  notificationList,
  setNotificationList,
  setNotificationCount,
  loadMore,
  hasMore,
  onClose,
}) => {
  console.log(notificationList);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groupTeacherMap, setGroupTeacherMap] = useState({});

  const token = localStorage.getItem("access_token");
  const userId = jwtDecode(token).userId;

  useEffect(() => {
    setLoading(true);
    const fetchTeacherNames = async () => {
      const groupIds = notificationList
        .filter((n) => n.groupId)
        .map((n) => n.groupId);
      console.log(groupIds);
      const uniqueIds = [...new Set(groupIds)];
      console.log(uniqueIds);
      const newIds = uniqueIds.filter((id) => !groupTeacherMap[id]);
      if (!newIds.length) {
        setLoading(false);
        return;
      }
      try {
        const results = await Promise.all(
          newIds.map(async (id) => {
            const res = await handleDetailGroup(id);
            console.log(res);
            return { id, userName: res?.data?.userName || "GV" };
          })
        );

        setGroupTeacherMap((prev) => ({
          ...prev,
          ...Object.fromEntries(
            results.map(({ id, userName }) => [id, userName])
          ),
        }));
      } catch (err) {
        console.error("Lỗi lấy thông tin nhóm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherNames();
  }, [notificationList]);

  const handleNotificationClick = async (item) => {
    console.log(item);
    const groupId = !!item.groupId;
    let link = groupId
      ? `/sinh-vien/group-study/${item.groupId}`
      : `/sinh-vien/notification/${item.id}`;
    if (item.type === "NHOM_HOC_TAP") {
      link = `/sinh-vien/group-study/${item.groupId}`;
    }
    if (!item.isRead) {
      const res = await handleMakeNotificationRead(userId, item.id, item.type);

      setNotificationList((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setNotificationCount((prev) => Math.max(0, prev - 1));
    }
    navigate(link);
    onClose();
  };
  const handleClickAllNotificationRead = async () => {
    const res = await handleMakeAllNotificationRead(userId);
    onClose();
    if (res.status === 200) {
      setNotificationList((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setNotificationCount(0);
    }
  };

  const sortedList = [...notificationList].sort(
    (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
  );

  const latestNotifications = sortedList.slice(0, 3);
  const latestIds = latestNotifications.map((n) => n.id);
  const olderNotifications = sortedList.filter(
    (n) => !latestIds.includes(n.id)
  );
  const hasUnread = notificationList.some((n) => !n.isRead);
  const renderNotificationItem = (item) => {
    const groupId = !!item.groupId || !!item.studyGroupId;

    const isTitleOnly = !item.type;
    const isChat = item.type === "CHAT_MESSAGE";
    const typeIcon = groupId ? <Users size={15} /> : <BellRing size={15} />;
    const getInitials = (name) => {
      if (!name) return "";
      const parts = name.trim().split(" ");
      return parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };
    const removeDuplicateLines = (text) => {
      if (typeof text !== "string") return "";

      const seen = new Set();
      return text
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          if (seen.has(trimmed)) return false;
          seen.add(trimmed);
          return true;
        })
        .join("\n");
    };

    return (
      <div
        key={item.id || item.content}
        onClick={() => handleNotificationClick(item)}
        className="flex items-start gap-3 px-4 py-3 cursor-pointer transition group mb-1 rounded-md hover:bg-gray-100"
      >
        {/* Avatar */}
        {groupId ? (
          <Avatar className="w-12 h-12 rounded-full bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden transition-transform hover:scale-105">
            <AvatarFallback className="bg-blue-500 text-white text-base font-semibold flex items-center justify-center">
              {getInitials(groupTeacherMap[item.groupId || item.studyGroupId])}
            </AvatarFallback>
          </Avatar>
        ) : item.avatar ? (
          <Avatar className="w-12 h-12 rounded-full bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden transition-transform hover:scale-105">
            <AvatarImage
              src={item.avatar}
              alt="Logo"
              className="object-contain w-full h-full scale-150"
            />
          </Avatar>
        ) : (
          <Avatar className="w-12 h-12 rounded-full bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden transition-transform hover:scale-105">
            <AvatarImage
              src="/img/logo.png"
              alt="Logo"
              className="object-contain w-full h-full scale-150"
            />
            <AvatarFallback className="bg-blue-100 text-blue-800 text-base font-semibold flex items-center justify-center">
              LOGO
            </AvatarFallback>
          </Avatar>
        )}

        {/* Nội dung */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex items-start gap-1 text-sm text-gray-900">
              <span
                className={
                  isTitleOnly
                    ? "block whitespace-pre-line font-medium" // hiện đầy đủ, xuống dòng nếu có \n
                    : "block max-w-[280px] truncate overflow-hidden whitespace-nowrap font-medium" // hiện ngắn gọn, có ...
                }
                title={item.title}
              >
                {removeDuplicateLines(item.title) ||
                  `${item.sender} đã gửi: ${item.content}`}
              </span>
              <div className="flex items-center gap-1 shrink-0 mt-[2px]">
                <span className="text-xl shrink-0 mt-[2px]">{typeIcon}</span>
                {!item?.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {item.notificationType && (
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-slate-200	text-slate-800">
                {item.notificationType}
              </span>
            )}

            {item.departmentName && (
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                {item.departmentName}
              </span>
            )}
            {item.groupName && (
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                {item.groupName}
              </span>
            )}

            {!item.notificationType &&
              !item.departmentName &&
              !item.groupName &&
              item.type !== "CHAT_MESSAGE" && (
                <span className="tex-xs max-w-[280px] font-light truncate overflow-hidden whitespace-nowrap">
                  {item.content}
                </span>
              )}
          </div>
          {isChat && (
            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              {item.type === "CHAT_MESSAGE" ? "Tin nhắn" : ""}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-96 w-105 sbg-white rounded-2xl shadow-2xl overflow-y-auto border border-gray-200">
      {loading ? (
        <Spin size="large" />
      ) : notificationList.length === 0 ? (
        <div className="p-6 w-80 text-center text-gray-400">
          <p>Không có thông báo nào</p>
        </div>
      ) : (
        <>
          {latestNotifications.length > 0 && (
            <>
              <div className="flex items-center justify-between px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 sticky top-0 z-10">
                <span>Mới nhất</span>
                {hasUnread && (
                  <button
                    onClick={handleClickAllNotificationRead}
                    className="text-blue-600 hover:underline text-sm font-normal cursor-pointer"
                  >
                    Đánh dấu tất cả là đã đọc
                  </button>
                )}
              </div>

              {latestNotifications.map(renderNotificationItem)}
            </>
          )}

          {olderNotifications.length > 0 && (
            <>
              <div className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 sticky top-0 z-10">
                Trước đó
              </div>
              {olderNotifications.map(renderNotificationItem)}
            </>
          )}
        </>
      )}

      {hasMore && (
        <div className="text-center py-2">
          <button
            className="border cursor-pointer border-blue-500 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 text-sm transition"
            onClick={loadMore}
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
