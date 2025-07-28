import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Spin } from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  handleAddUser,
  handleUpdateUser,
  handleUploadImage,
} from "../../../../controller/AccountController";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useLoading } from "../../../../context/LoadingProvider";
import { Eye, EyeOff } from "lucide-react";
const AddAccountLecturer = ({ open, onClose, onSuccess, users }) => {
  const { setLoading } = useLoading();
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const checkEdit = !!users?.id;
  const [form, setForm] = useState({
    id: users?.id || "",
    username: users?.username || "",
    password: "",
    status: users?.status || "ACTIVE",
    role: users?.role || "TEACHER",
    image: users?.image || "",
    imageFile: null,
  });
  useEffect(() => {
    if (users?.id) {
      setForm({
        id: users.id || "",
        username: users.username || "",
        password: "",
        status: users.status || "ACTIVE",
        role: users.role || "TEACHER",
        image: users.image || "",
        imageFile: null,
      });

      if (users.image) {
        setImagePreview(users.image);
      }
    } else {
      setForm({
        id: "",
        username: "",
        password: "",
        status: "ACTIVE",
        role: "TEACHER",
        image: "",
        imageFile: null,
      });
      setImagePreview(null);
    }
  }, [users]);
  const validateField = (field, value) => {
    let error = "";

    if (field === "username") {
      if (!value.trim()) error = "Username không được để trống";
      else if (!/^[A-Za-z][A-Za-z0-9]{4,}$/.test(value))
        error = "Phải bắt đầu bằng chữ, ít nhất 5 ký tự";
    }

    if (field === "password" && !checkEdit) {
      if (!value.trim()) error = "Mật khẩu không được để trống";
      else if (value.length < 6) error = "Mật khẩu ít nhất 6 ký tự";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file });
      // Create preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!form.username?.trim()) {
    //   toast.error("Vui lòng nhập username");
    //   return;
    // }

    // if (!checkEdit) {
    //   if (!form.password?.trim()) {
    //     toast.error("Vui lòng nhập mật khẩu");
    //     return;
    //   }

    //   if (form.password.length < 6) {
    //     toast.error("Mật khẩu phải có ít nhất 6 ký tự");
    //     return;
    //   }
    // }
    try {
      setLoading(true);
      let accountId = form.id;

      if (checkEdit) {
        const reqEdit = await handleUpdateUser(form);

        if (reqEdit.status === 204) {
          if (form.imageFile) {
            const imageForm = new FormData();
            imageForm.append("file", form.imageFile);
            await handleUploadImage(accountId, imageForm);
          }
          onSuccess();
          toast.success(reqEdit.message || "Cập nhật tài khoản thành công");
          onClose();
        } else {
          toast.error(reqEdit.message || "Cập nhật tài khoản thất bại 1111");
        }
      } else {
        const response = await handleAddUser(form);
        console.log(response);
        if (response.status === 201) {
          const newAccountId = response.data?.id;

          if (form.imageFile && newAccountId) {
            const imageForm = new FormData();
            imageForm.append("file", form.imageFile);
            await handleUploadImage(newAccountId, imageForm);
          }
          onSuccess();
          toast.success(response.message || "Thêm tài khoản thành công");
          onClose();
        } else {
          toast.error(response.message || "Thêm tài khoản thất bại 1111");
        }
      }
    } catch (error) {
      if (error) {
        toast.error(error.message || "Thêm tài khoản thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent
          className="sm:max-w-[600px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            {checkEdit ? (
              <>
                <DialogTitle>Cập nhật tài khoản</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin của tài khoản
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Tạo tài khoản mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin về tài khoản mới
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid gap-4">
                {checkEdit && (
                  <div className="grid gap-2">
                    <Label htmlFor="id">
                      ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="id"
                      placeholder=""
                      disabled={checkEdit}
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    placeholder=""
                    value={form.username}
                    disabled={checkEdit}
                    onChange={(e) => {
                      setForm({ ...form, username: e.target.value });
                      if (errors.username) {
                        setErrors((prev) => ({ ...prev, username: "" }));
                      }
                    }}
                    onBlur={() => validateField("username", form.username)}
                    required
                    pattern="^[A-Za-z][A-Za-z0-9]{4,}$"
                    title="Username phải bắt đầu bằng chữ, tối thiểu 5 ký tự"
                  />

                  <p className="text-red-500 min-h-[20px] text-sm">
                    {errors.username || "\u00A0"}
                  </p>
                </div>
                {checkEdit ? (
                  <div className="grid gap-2"></div>
                ) : (
                  <div className="grid gap-2 relative">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => {
                          setForm({ ...form, password: e.target.value });
                          if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: "" }));
                          }
                        }}
                        onBlur={() => validateField("password", form.password)}
                        required
                        minLength={6}
                        title="Mật khẩu phải có ít nhất 6 ký tự"
                        className="pr-10"
                      />
                      <div
                        className="absolute right-2 top-2.5 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm min-h-[20px] text-red-500">
                      {errors?.password || "\u00A0"}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* <div className="grid gap-2 ">
                <Label htmlFor="image">Ảnh</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    // <div className="mt-2">
                    //   <img
                    //     src={imagePreview}
                    //     alt="Preview"
                    //     className="w-20 h-20 object-cover rounded"
                    //   />
                    // </div>
                    <Avatar className="rounded-lg">
                      <AvatarImage src={imagePreview} alt={form.username} />
                    </Avatar>
                  )}
                </div>
              </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="">
                    Trạng thái <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value })
                    }
                  >
                    <SelectTrigger id="">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) => setForm({ ...form, role: value })}
                    // disabled={true}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Chọn role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  onClose();
                  setForm({
                    id: "",
                    username: "",
                    password: "",
                    status: "ACTIVE",
                    role: "TEACHER",
                    image: "",
                  });
                  setImagePreview(null);
                }}
              >
                Hủy
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                type="submit"
              >
                {checkEdit ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddAccountLecturer;
