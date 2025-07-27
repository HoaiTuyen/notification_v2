import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { handleChangePassword } from "../../controller/AccountController";
import { jwtDecode } from "jwt-decode";
import { useLoading } from "../../context/LoadingProvider";

const ChangePasswordForm = () => {
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
      if (response.status === 200) {
        toast.success(response.message || "Đổi mật khẩu thành công");
        setUser({
          id: userId,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
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
            {showPasswords.current ? <EyeOff /> : <Eye />}
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
            onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
            placeholder="Nhập mật khẩu mới"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => togglePasswordVisibility("new")}
          >
            {showPasswords.new ? <EyeOff /> : <Eye />}
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
            {showPasswords.confirm ? <EyeOff /> : <Eye />}
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

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
