import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Plus, Search, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  handleListClassByDepartment,
  handleSearchClassByDepartment,
} from "../../../../controller/DepartmentController";
import { useEffect } from "react";
import { Pagination, Spin } from "antd";
import ImportClassOfDepartmentModal from "./ImportClassByDepartment";
import useDebounce from "../../../../hooks/useDebounce";
const ListClassOfDepartment = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [classByDepartment, setClassByDepartment] = useState([]);
  const [totalClass, setTotalClass] = useState(0);
  const [openUpload, setOpenUpload] = useState(false);
  const [dataDepartment, setDataDepartment] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const { departmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const backUrl =
    location.state?.from || `/admin/department?search=${search}&page=${page}`;

  const fetchListClassByDepartment = async (page = 1) => {
    try {
      setLoading(true);
      let res;
      const keyword = debouncedSearchTerm.trim();
      console.log(keyword);
      if (keyword) {
        res = await handleSearchClassByDepartment(
          departmentId,
          keyword,
          page - 1,
          pagination.pageSize
        );
        console.log(res);
      } else {
        res = await handleListClassByDepartment(
          departmentId,
          page - 1,
          pagination.pageSize
        );
      }

      if (res?.data && res?.status === 200) {
        if (page === 1 && res?.data?.classes) {
          setTotalClass(res.data.totalElements);
        }
        setClassByDepartment(res.data.classes);
        setDataDepartment(res.data);
        setPagination({
          current: page,
          pageSize: res.data.pageSize,
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchListClassByDepartment(pagination.current);
  }, [pagination.current, debouncedSearchTerm]);

  return (
    <div className="h-full w-full bg-white p-10 overflow-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(backUrl)}
              className="cursor-pointer"
            >
              <div className="flex items-center cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
              </div>
            </Button>
            <h2 className="text-2xl font-bold">Danh sách lớp thuộc khoa</h2>
          </div>
          <div>
            {[
              ...new Set(classByDepartment.map((item) => item.departmentName)),
            ].map((departmentName) => (
              <span key={departmentName} className="font-medium mr-2">
                Khoa: {departmentName}
              </span>
            ))}

            <Badge>{dataDepartment.totalElements}</Badge>
          </div>
        </div>

        <Card className="overflow-x-auto max-h-[550px]">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Danh sách lớp thuộc khoa</CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex items-center cursor-pointer"
                  onClick={() => setOpenUpload(true)}
                >
                  <Upload className="mr-2 h-4 w-4" /> Nhập danh sách
                </Button>
                {openUpload && (
                  <ImportClassOfDepartmentModal
                    open={openUpload}
                    onClose={() => setOpenUpload(false)}
                    onSuccess={fetchListClassByDepartment}
                  />
                )}
                {/* <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Thêm lớp
                </Button> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative flex-1 mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm lớp theo tên lớp..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/6">STT</TableHead>
                    <TableHead className="w-1/6">Tên lớp</TableHead>
                    <TableHead className="w-1/6">Mô tả</TableHead>
                    <TableHead className="w-1/6 text-center">
                      Giáo viên phụ trách
                    </TableHead>
                    <TableHead className="w-1/6  text-center">Khoa</TableHead>
                    {/* <TableHead className="w-1/6 text-center">
                      Thao tác
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center h-24 text-muted-foreground"
                      >
                        <Spin size="large" />
                      </TableCell>
                    </TableRow>
                  ) : classByDepartment.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center h-24 text-muted-foreground"
                      >
                        {debouncedSearchTerm
                          ? "Không tìm thấy lớp học phù hợp"
                          : "Chưa có lớp học nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    classByDepartment.map((classes, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {(pagination.current - 1) * pagination.pageSize +
                            index +
                            1}
                        </TableCell>
                        <TableCell>{classes.name}</TableCell>
                        <TableCell>{classes.description}</TableCell>
                        <TableCell className="text-center">
                          {classes.teacherName || "Trống"}
                        </TableCell>
                        <TableCell className="text-center">
                          {classes.departmentName}
                        </TableCell>

                        {/* <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <span className="sr-only">Xóa</span>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {pagination.total >= 10 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ListClassOfDepartment;
