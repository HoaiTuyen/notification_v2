import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  handleGetDetailUser,
  handleUploadImage,
} from "../../../controller/AccountController";
import { Spin } from "antd";
import ChangePasswordDialog from "../ChangePass";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [openChangePass, setOpenChangePass] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [userImage, setUserImage] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const fetchUserDetail = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const data = jwtDecode(token);
      const userId = data.userId;
      const req = await handleGetDetailUser(userId);
      if (req?.data) {
        const userData = req.data;
        setUserImage(req.data.image);
        if (userData.student) {
          setProfileData(userData.student);
        } else if (userData.teacher) {
          setProfileData(userData.teacher);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await handleUploadImage(userImage.data.id, formData);
      if (res?.data) {
        setUserImage(res.data.image);
        setTempImage(null);
        toast.success("Ảnh đại diện đã được cập nhật.");
      }
    } catch (error) {
      toast.error(error || "Lỗi khi tải ảnh lên.");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setTempImage(URL.createObjectURL(selectedFile));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white p-0 ">
      <div className="space-y-6 p-10">
        <div className="flex justify-between items-center">
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => setOpenChangePass(true)}
          >
            Đổi mật khẩu
          </Button>
          {openChangePass && (
            <ChangePasswordDialog
              open={openChangePass}
              onClose={() => setOpenChangePass(false)}
            />
          )}
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
          </TabsList>

          <TabsContent
            value="personal"
            className="space-y-4 overflow-x-auto max-h-[600px]"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Ảnh đại diện</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={tempImage || userImage}
                      alt={profileData.firstName}
                    />
                    <AvatarFallback>{profileData.lastName}</AvatarFallback>
                  </Avatar>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Thay đổi ảnh
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />

                  {file && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleImageUpload}
                    >
                      Lưu ảnh
                    </Button>
                  )}

                  <div className="text-center">
                    <h3 className="font-semibold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Mã: {profileData.id}
                    </p>
                    <Badge variant="success" className="mt-2">
                      {profileData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
