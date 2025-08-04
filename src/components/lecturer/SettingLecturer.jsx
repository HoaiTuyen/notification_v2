import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Info,
  Camera,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Spin } from "antd";
import {
  handleUploadImage,
  handleGetDetailUser,
} from "../../controller/AccountController";
import {
  handleUpdateTeacher,
  handleTeacherDetail,
} from "../../controller/TeacherController";
import { useLoading } from "../../context/LoadingProvider";
const TeacherProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [userImage, setUserImage] = useState("");
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const [initialProfileData, setInitialProfileData] = useState(null); // Lưu dữ liệu ban đầu
  const [initialUserImage, setInitialUserImage] = useState(null);
  const [infoCheck, setInfoCheck] = useState(false);
  const { setLoading } = useLoading();
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result); // Set the preview image
      };
      reader.readAsDataURL(selectedFile); // Preview the image
    }
  };

  // Handles the image upload
  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await handleUploadImage(userId, formData);

      if (res?.data) {
        setUserImage(res.data.image); // Update image preview
        toast.success("Ảnh đại diện đã được cập nhật.");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải ảnh lên.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await handleImageUpload();
    try {
      await handleUpdateTeacher(profileData);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      toast.error(error || "Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);

      setIsEditing(false);
    }
  };
  const handleCancel = () => {
    // Khi nhấn hủy, phục hồi lại dữ liệu ban đầu
    setProfileData(initialProfileData);
    setUserImage(initialUserImage);
    setIsEditing(false);
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const data = jwtDecode(token);

      const req = await handleGetDetailUser(data.userId);
      if (req?.data) {
        const teacherDetail = await handleTeacherDetail(req.data.teacherId);

        // const userData = req.data;
        setUserId(req.data.id);
        setUserImage(req.data.image);
        setInitialUserImage(req.data.image); // Lưu ảnh ban đầu
        setProfileData(teacherDetail.data);
        setInitialProfileData(teacherDetail.data);
      } else {
        setInfoCheck(true);
      }
    } catch (e) {
      console.error("Lỗi khi fetch dữ liệu:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  if (infoCheck) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="flex flex-col items-center text-gray-500 text-lg">
          <Info className="w-8 h-8 mb-2" />
          <p className="font-medium">Không tìm thấy thông tin</p>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="h-full w-full bg-white p-0">
      <div className="space-y-6 p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
          </TabsList> */}

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={userImage} />
                      <AvatarFallback>No Image</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 cursor-pointer"
                        onClick={() => inputRef.current.click()}
                      >
                        <Camera className="w-4 h-4 mr-1" />
                        <span>Thay đổi ảnh</span>
                      </Button>
                    )}
                    {isEditing && (
                      <p className="text-sm text-red-600 mt-1">
                        Lưu ý: Chỉ chấp nhận ảnh dưới 5MB.
                      </p>
                    )}

                    <input
                      ref={inputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      MSGV: {profileData.id || "Trống"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ</Label>
                    <Input
                      id="fullName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Tên</Label>
                    <Input
                      id="fullName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 max-w-[200px]">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        readOnly
                        className="pl-10 text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 max-w-[200px]">
                    <Label htmlFor="phone">Trạng thái</Label>
                    <div className="relative">
                      <BriefcaseBusiness className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value="Đang công tác"
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        disabled
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select
                      value={profileData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NAM">Nam</SelectItem>
                        <SelectItem value="NỮ">Nữ</SelectItem>
                        <SelectItem value="KHÁC">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherProfile;
