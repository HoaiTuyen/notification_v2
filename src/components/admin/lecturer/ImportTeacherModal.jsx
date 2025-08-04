// ImportStudentModal.jsx
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Spin } from "antd";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  handleCreateTeacherExcel,
  handleGetListTeacherExcel,
} from "../../../controller/TeacherController";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const generateSampleExcel = () => {
  const sampleData = [
    [
      "STT",
      "Mã GV",
      "Họ",
      "Tên",
      "Email",
      "Ngày sinh",
      "Giới tính",
      "Trạng thái",
    ],
    [
      "1",
      "THCH_F3000",
      "Lê Minh",
      "Bình",
      "lebinh@stu.edu.vn",
      "19/01/1975",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "2",
      "THCH_F3001",
      "Trần Thị",
      "Bình",
      "tranbinh@stu.edu.vn",
      "20/10/1988",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "3",
      "THCH_F3002",
      "Bùi Minh",
      "Chi",
      "buichi@stu.edu.vn",
      "15/09/1991",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "4",
      "THCH_F3003",
      "Bùi Xuân",
      "Trang",
      "buitrang@stu.edu.vn",
      "11/07/1975",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "5",
      "THCH_F3004",
      "Trần Xuân",
      "Chi",
      "tranchi@stu.edu.vn",
      "28/05/1991",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "6",
      "THCH_F3005",
      "Đỗ Xuân",
      "Quân",
      "doquan@stu.edu.vn",
      "10/08/1986",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "7",
      "THCH_F3006",
      "Đỗ Xuân",
      "Hùng",
      "dohung@stu.edu.vn",
      "21/09/1974",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "8",
      "THCH_F3007",
      "Hoàng Xuân",
      "Dũng",
      "hoangdung@stu.edu.vn",
      "06/12/1972",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "9",
      "THCH_F3008",
      "Đặng Thanh",
      "Dũng",
      "dangdung@stu.edu.vn",
      "16/02/1970",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "10",
      "THCH_F3009",
      "Phạm Hữu",
      "Linh",
      "phamlinh@stu.edu.vn",
      "25/10/1976",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách giảng viên");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
import PreviewTeacher from "./PreviewTeacher";
const ImportTeacherModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    e.target.value = null;
  };
  const handleReview = async () => {
    if (!file) {
      toast.warn("Vui lòng chọn file trước khi xem trước.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await handleGetListTeacherExcel(formData);
      console.log(res);

      const teachers = res.data.teachers || [];

      const errs = res.data.rowErrors || [];

      const teachersWithErrors = teachers.map((teacher) => {
        const matchingError = errs.find((err) => err.rowIndex === teacher.stt);
        return {
          ...teacher,
          error: matchingError?.message || null,
        };
      });
      console.log(teachersWithErrors);

      // setPreviewData(students || []);
      setPreviewData(teachersWithErrors);
      setErrors(errs || []);

      if (!teachers.length && !errs.length) {
        toast.error(res.message || "File không chứa dữ liệu hợp lệ.");
      }
      setShowPreviewModal(true);
    } catch (error) {
      toast.error(error || "Không thể xử lý file. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateStudent = async (data) => {
    console.log(data);

    try {
      const res = await handleCreateTeacherExcel(data);

      if (res?.data || res?.status === 201) {
        onSuccess();
        toast.success(res.message || "Lưu thành công!");
        onClose();
      } else {
        toast.error(res.message);
        setPreviewData([]);
      }
    } catch (error) {
      console.log(error);

      toast.error("Lỗi khi lưu vào hệ thống!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nhập danh sách giảng viên</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1"></p>
            <Button
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer"
            >
              Chọn file
            </Button>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              ref={inputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Chỉ hỗ trợ định dạng: Excel (.xlsx)
            </p>
            {file && (
              <div className="mt-2 text-sm text-center text-muted-foreground">
                Đã chọn: <strong>{file.name}</strong>
              </div>
            )}
            <div className="mt-4">
              <Button
                className="cursor-pointer"
                onClick={handleReview}
                disabled={!file}
              >
                Xem trước dữ liệu
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Lưu ý: File nhập vào cần có các cột: STT, Mã GV, Họ và tên, Email
              , Ngày sinh, Giới tính, Trạng thái
            </p>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => generateSampleExcel()}
              className="bg-green-500 hover:bg-green-600 cursor-pointer"
            >
              Tải file mẫu
            </Button>
          </div>
          {showPreviewModal && (
            <PreviewTeacher
              open={showPreviewModal}
              onClose={() => setShowPreviewModal(false)}
              data={previewData}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onClose()}
          >
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            disabled={errors.length > 0 || previewData.length === 0}
            onClick={() => handleCreateStudent(previewData)}
          >
            Nhập danh sách
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTeacherModal;
