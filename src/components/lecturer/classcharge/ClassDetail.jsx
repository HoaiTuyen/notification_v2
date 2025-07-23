import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Pagination, Spin } from "antd";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  ArrowLeft,
  MailIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleListStudentByClass } from "../../../controller/ClassController";
import { jwtDecode } from "jwt-decode";
import { handleGetDetailUser } from "../../../controller/AccountController";
import { handleListClassOfTeacher } from "../../../controller/TeacherController";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DetailStudentClassCharge from "./DetailStudentClassCharge";
const ClassDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  // const searchFromUrl = searchParams.get("search") || "";
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectStudent, setSelectStudent] = useState(null);
  const navigate = useNavigate();
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const fetchStudent = async (page = 1) => {
    try {
      setLoading(true);
      const req = await handleListStudentByClass(
        classId,
        page - 1,
        pagination.pageSize
      );

      if (req?.data && req?.status === 200) {
        setStudents(req.data.students);
        setPagination({
          current: page,
          pageSize: req.data.pageSize,
          total: req.data.totalElements,
          totalPages: req.data.totalPages,
          totalElements: req.data.totalElements,
        });
      } else {
        setStudents([]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
          totalElements: 0,
        });
      }
    } catch (err) {
      console.error("Lỗi khi fetch sinh viên:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent(pageFromUrl);
  }, [pageFromUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="w-full bg-white overflow-y-auto max-h-[700px] p-10">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4 ">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate("/giang-vien/class-charge")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5" />
                  {[...new Set(students.map((item) => item.className))].map(
                    (className) => (
                      <span key={className} className="font-medium mr-2">
                        Lớp: {className}
                      </span>
                    )
                  )}
                </CardTitle>
                <CardDescription>
                  {[
                    ...new Set(students.map((item) => item.departmentName)),
                  ].map((departmentName) => (
                    <span key={departmentName} className="font-medium mr-2">
                      Khoa: {departmentName}
                    </span>
                  ))}
                </CardDescription>
              </div>
              <div className="p-2 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Tổng sinh viên:</span>
                  <span className="text-lg font-bold">
                    {pagination.totalElements}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Danh sách sinh viên</h4>
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setOpenDetail(true);
                    setSelectStudent(student);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={student.avatar || "/placeholder.svg"}
                          alt={`${student.firstName} ${student.lastName}`}
                        />
                        <AvatarFallback>
                          {`${student.firstName} ${student.lastName}`
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="pl-4">
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        MSSV: {student.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4  w-4 text-muted-foreground" />
                        <span className="text-sm">{student.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {openDetail && (
        <DetailStudentClassCharge
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          student={selectStudent}
        />
      )}
      <div className="flex justify-center mt-4">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page) => {
            const params = new URLSearchParams({
              page: page.toString(),
            });
            setSearchParams(params);
          }}
        />
      </div>
    </div>
  );
};

export default ClassDetail;
