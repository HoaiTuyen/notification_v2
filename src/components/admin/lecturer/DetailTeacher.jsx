import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  School,
  Landmark,
  User2,
  CircleCheck,
  User,
  HelpCircle,
  Venus,
  Mars,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
const DetailTeacher = ({ open, onClose, teacher }) => {
  console.log(teacher);
  function filterStatus(status) {
    switch (status) {
      case "ĐANG_CÔNG_TÁC":
        return {
          label: "Đang công tác",
          className: "bg-green-100 text-green-800",
        };
      case "CHUYỂN_CÔNG_TÁC":
        return {
          label: "Chuyển công tác",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "ĐÃ_TỐT_NGHIỆP":
        return {
          label: "Đã tốt nghiệp",
          className: "bg-blue-100 text-blue-800",
        };
      case "THÔI_HỌC":
        return {
          label: "Thôi học",
          className: "bg-red-100 text-red-800",
        };

      default:
        break;
    }
  }
  const renderGender = (gender) => {
    switch (gender) {
      case "NAM":
        return (
          <div className="flex items-center gap-2">
            <Mars className="h-4 w-4 " />
            <span>Nam</span>
          </div>
        );
      case "NỮ":
        return (
          <div className="flex items-center gap-2">
            <Venus className="h-4 w-4 " />
            <span>Nữ</span>
          </div>
        );
      case "KHÁC":
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>Khác</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span>Không rõ</span>
          </div>
        );
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
  const fullName = `${teacher.firstName} ${teacher.lastName}`;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Thông tin giảng viên</DialogTitle>
          <DialogDescription>Chi tiết thông tin cá nhân</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={teacher.avatar} alt="" />
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {teacher.firstName} {teacher.lastName}
              </h3>
              <p className="text-muted-foreground">
                Mã giảng viên: {teacher.id}
              </p>
              {/* {getStatusBadge(selectedStudent.status)} */}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Thông tin cá nhân</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {teacher.email}
                </div>
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  {teacher.departmentName}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dayjs(teacher.dateOfBirth).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-8">
              <div className="space-y-1 text-sm">
                {renderGender(teacher.gender)}

                <div className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4" />
                  <Badge className={filterStatus(teacher.status).className}>
                    {filterStatus(teacher.status).label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  {teacher.userName || "Trống"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailTeacher;
