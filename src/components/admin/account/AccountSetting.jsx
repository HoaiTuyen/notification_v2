import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  handleGetDetailUser,
  handleUploadImage,
} from "../../../controller/AccountController";
import { useLoading } from "../../../context/LoadingProvider";
import ChangePasswordForm from "../ChangePass";

const ProfilePage = () => {
  const { setLoading } = useLoading();
  const [profileData, setProfileData] = useState({});
  const [userImage, setUserImage] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [file, setFile] = useState(null);
  const [showImageHint, setShowImageHint] = useState(false);

  const inputRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const userId = jwtDecode(token).userId;

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const res = await handleGetDetailUser(userId);
      if (res?.data) {
        const userData = res.data;
        setUserImage(res.data.image);
        setProfileData(userData.student || userData.teacher || {});
      }
    } catch (error) {
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh trước khi tải lên.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await handleUploadImage(userId, formData);
      if (res?.status === 204) {
        // Có thể res.data không tồn tại khi status là 204
        await fetchUserDetail(); // Reload lại hình ảnh mới
        toast.success(res?.message || "Ảnh đại diện đã được cập nhật.");
        setFile(null);
        setTempImage(null);
        if (inputRef.current) inputRef.current.value = null;
      }
    } catch (error) {
      toast.error(error?.message || "Lỗi khi tải ảnh lên.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (selectedFile.size > maxSizeBytes) {
      toast.error(`Chỉ chấp nhận ảnh ≤ ${maxSizeMB}MB.`);
      // Reset input để cho phép chọn lại cùng file
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setTempImage(URL.createObjectURL(selectedFile));
  };

  return (
    <div className="h-full w-full bg-white p-0 overflow-auto">
      <div className="space-y-6 p-10">
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Ảnh đại diện</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={tempImage || userImage || "No Image"}
                      alt={profileData.firstName || "No Image"}
                    />
                    <AvatarFallback>
                      {profileData.lastName?.[0] || "No Image"}
                    </AvatarFallback>
                  </Avatar>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowImageHint(true);
                      inputRef.current?.click();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Thay đổi ảnh
                  </Button>
                  {showImageHint && (
                    <p className="text-sm text-red-500 text-center">
                      * Lưu ý: Ảnh tải lên phải nhỏ hơn hoặc bằng 5MB
                    </p>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {file && (
                    <div className="flex gap-3">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleImageUpload}
                      >
                        Lưu ảnh
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTempImage(null);
                          setFile(null);
                          if (inputRef.current) inputRef.current.value = null;
                        }}
                      >
                        Đặt lại ảnh
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="password" className="pt-4">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
