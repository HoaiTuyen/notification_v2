import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { handleChangePassword } from "../../controller/AccountController";
import { jwtDecode } from "jwt-decode";
import { useLoading } from "../../context/LoadingProvider";
const ChangePasswordDialog = ({ open, onClose }) => {
  const { setLoading } = useLoading();
  const token = localStorage.getItem("access_token");
  const userId = jwtDecode(token).userId;

  const [user, setUser] = useState({
    id: userId,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!user.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }

    if (!user.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (user.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }

    if (!user.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
    } else if (user.newPassword !== user.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    const hasError = Object.values(newErrors).some((val) => val !== "");

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const response = await handleChangePassword(
        user.id,
        user.currentPassword,
        user.newPassword,
        user.confirmPassword
      );
      console.log(response);
      if (response.status === 200) {
        toast.success(response.message || "Đổi mật khẩu thành công");
        setUser({
          id: userId,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setUser({
          id: userId,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose(val)}>
      <DialogTrigger asChild>
        <Button variant="outline">Đổi mật khẩu</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" /> Thay đổi mật khẩu
          </DialogTitle>
          <DialogDescription>
            Cập nhật mật khẩu để bảo mật tài khoản của bạn
          </DialogDescription>
        </DialogHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* {Object.values(errors).some((e) => e) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.values(errors).map(
                      (error, index) => error && <li key={index}>{error}</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )} */}

            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? "text" : "password"}
                  value={user.currentPassword}
                  onChange={(e) =>
                    setUser({ ...user, currentPassword: e.target.value })
                  }
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? "text" : "password"}
                  value={user.newPassword}
                  onChange={(e) =>
                    setUser({ ...user, newPassword: e.target.value })
                  }
                  placeholder="Nhập mật khẩu mới"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={user.confirmPassword}
                  onChange={(e) =>
                    setUser({ ...user, confirmPassword: e.target.value })
                  }
                  placeholder="Nhập lại mật khẩu mới"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Lưu ý bảo mật:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Không chia sẻ mật khẩu với bất kỳ ai</li>
                  <li>Sử dụng mật khẩu mạnh và duy nhất</li>
                  <li>Thay đổi mật khẩu định kỳ</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </Button>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};
export default ChangePasswordDialog;
