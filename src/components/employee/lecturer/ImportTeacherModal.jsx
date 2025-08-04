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
      "THCH_F0001",
      "Nguyễn Văn",
      "A",
      "a@example.com",
      "01/01/2000",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "2",
      "THCH_F0002",
      "Trần Thị",
      "B",
      "b@example.com",
      "02/02/2000",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "3",
      "THCH_F0003",
      "Lê Văn",
      "C",
      "c@example.com",
      "03/03/1985",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "4",
      "THCH_F0004",
      "Phạm Thị",
      "D",
      "d@example.com",
      "04/04/1982",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "5",
      "THCH_F0005",
      "Hoàng Văn",
      "E",
      "e@example.com",
      "05/05/1979",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "6",
      "THCH_F0006",
      "Đỗ Thị",
      "F",
      "f@example.com",
      "06/06/1990",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "7",
      "THCH_F0007",
      "Bùi Văn",
      "G",
      "g@example.com",
      "07/07/1988",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "8",
      "THCH_F0008",
      "Vũ Thị",
      "H",
      "h@example.com",
      "08/08/1983",
      "Nữ",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "9",
      "THCH_F0009",
      "Đặng Văn",
      "I",
      "i@example.com",
      "09/09/1986",
      "Nam",
      "ĐANG_CÔNG_TÁC",
    ],
    [
      "10",
      "THCH_F0010",
      "Ngô Thị",
      "K",
      "k@example.com",
      "10/10/1981",
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
import { useLoading } from "../../../context/LoadingProvider";
const ImportTeacherModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const { setLoading } = useLoading();
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
              accept=".xlsx"
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
                onClick={handleReview}
                className="cursor-pointer"
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
