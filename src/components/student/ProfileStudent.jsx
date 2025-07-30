import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Spin } from "antd";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  User,
  School,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  handleGetDetailUser,
  handleUploadImage,
} from "../../controller/AccountController";
import {
  handleUpdateStudent,
  handleStudentDetail,
} from "../../controller/StudentController";
import { useLoading } from "../../context/LoadingProvider";
const StudentProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [userId, setUserId] = useState("");
  const [userImage, setUserImage] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const data = jwtDecode(token);
      const userId = data.userId;
      setUserId(userId);
      const req = await handleGetDetailUser(userId);

      if (req?.data) {
        setUserImage(req.data.image);
        const studentDetail = await handleStudentDetail(req.data.studentId);
        setProfileData(studentDetail.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetail();
    };
    fetchData();
  }, []);
  const handleImageUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh trước khi tải lên.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await handleUploadImage(userId, formData);

      if (res?.data) {
        setUserImage(res.data.image); // Update image preview
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

  const handleSave = async () => {
    try {
      setLoading(true);
      if (file) {
        await handleImageUpload();
      }
      const res = await handleUpdateStudent(profileData);
      if (res?.data || res?.status === 204) {
        toast.success("Thông tin cá nhân đã được cập nhật.");
      } else {
        toast.error(res.message || "Lỗi khi cập nhật thông tin.");
      }

      setIsEditing(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }
  function filterStudents(status) {
    switch (status) {
      case "ĐANG_HỌC":
        return {
          label: "Đang học",
          className: "bg-green-100 text-green-800 mt-2",
        };
      case "BẢO_LƯU":
        return {
          label: "Bảo lưu",
          className: "bg-yellow-100 text-yellow-800 mt-2",
        };
      case "ĐÃ_TỐT_NGHIỆP":
        return {
          label: "Đã tốt nghiệp",
          className: "bg-blue-100 text-blue-800 mt-2",
        };
      case "THÔI_HỌC":
        return { label: "Thôi học", className: "bg-red-100 text-red-800 mt-2" };

      default:
        break;
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full w-full bg-white p-0 overflow-auto">
        <div className="space-y-6 p-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Thông tin cá nhân
              </h2>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={
                isEditing
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                </>
              ) : (
                "Chỉnh sửa"
              )}
            </Button>
          </div>

          <Tabs defaultValue="personal" className="space-y-4">
            {/* <TabsList>
              <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
            </TabsList> */}

            <TabsContent
              value="personal"
              className="space-y-4 overflow-y-auto max-h-[600px]"
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
                        // alt={profileData.firstName}
                      />
                      <AvatarFallback>{profileData.lastName}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
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
                        {/* {file && (
                          <div className="flex">
                            <Button
                              className="mr-2"
                              variant="outline"
                              size="sm"
                              onClick={handleSave}
                            >
                              Lưu ảnh
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={handleCancel}
                            >
                              Hủy
                            </Button>
                          </div>
                        )} */}
                      </>
                    )}
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Khoa: {profileData.departmentName}
                      </p>
                      {profileData?.status &&
                      filterStudents(profileData.status) ? (
                        <Badge
                          variant="success"
                          className={
                            filterStudents(profileData.status).className
                          }
                        >
                          {filterStudents(profileData.status).label}
                        </Badge>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Thông tin chi tiết</CardTitle>
                    <CardDescription>
                      Thông tin cá nhân và liên hệ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Mã sinh viên</Label>
                        <Input id="studentId" value={profileData.id} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                email: e.target.value,
                              })
                            }
                            disabled
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              firstName: e.target.value,
                            })
                          }
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Tên</Label>
                        <Input
                          id="firstName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              lastName: e.target.value,
                            })
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                dateOfBirth: e.target.value,
                              })
                            }
                            readOnly
                            className="pl-8 text-gray-400"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <Select
                          value={profileData.gender}
                          onValueChange={(value) =>
                            setProfileData({ ...profileData, gender: value })
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
                      <div className="space-y-2">
                        <Label htmlFor="address">Lớp</Label>
                        <div className="relative">
                          <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            value={
                              profileData?.className
                                ? profileData?.className
                                : "Trống"
                            }
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                className: e.target.value,
                              })
                            }
                            disabled
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Tài khoản</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            value={profileData?.userName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                userName: e.target.value,
                              })
                            }
                            disabled
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfilePage;
