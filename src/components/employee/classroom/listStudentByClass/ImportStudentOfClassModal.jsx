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
  handleCreateStudentByClassExcel,
  handleGetListStudentByClassExcel,
} from "../../../../controller/ClassController";
import { toast } from "react-toastify";
import PreviewStudentByClass from "./PreviewStudentByClass";
import { useLoading } from "../../../../context/LoadingProvider";
import * as XLSX from "xlsx";
const generateSampleExcel = () => {
  const sampleData = [
    [
      "STT",
      "Mã số sinh viên",
      "Họ",
      "Tên",
      "Email",
      "Ngày sinh",
      "Giới tính",
      "Trạng thái",
      "Tên lớp",
    ],
    [
      "1",
      "DH52110001",
      "Nguyễn Văn",
      "A",
      "a@example.com",
      "01/01/2000",
      "Nam",
      "ĐANG_HỌC",
      "D22_TH01",
    ],
    [
      "2",
      "DH52110002",
      "Trần Thị",
      "B",
      "b@example.com",
      "02/02/2000",
      "Nữ",
      "ĐANG_HỌC",
      "D22_TH01",
    ],
    [
      "3",
      "DH52110003",
      "Lê Văn",
      "C",
      "c@example.com",
      "03/03/2000",
      "Nam",
      "ĐANG_HỌC",
      "D22_TH02",
    ],
    [
      "4",
      "DH52110004",
      "Phạm Thị",
      "D",
      "d@example.com",
      "04/04/2000",
      "Nữ",
      "ĐANG_HỌC",
      "D22_TH02",
    ],
    [
      "5",
      "DH52110005",
      "Hoàng Văn",
      "E",
      "e@example.com",
      "05/05/2000",
      "Nam",
      "ĐANG_HỌC",
      "D22_TH03",
    ],
    [
      "6",
      "DH52110006",
      "Đỗ Thị",
      "F",
      "f@example.com",
      "06/06/2000",
      "Nữ",
      "ĐANG_HỌC",
      "D22_TH03",
    ],
    [
      "7",
      "DH52110007",
      "Bùi Văn",
      "G",
      "g@example.com",
      "07/07/2000",
      "Nam",
      "ĐANG_HỌC",
      "D22_TP01",
    ],
    [
      "8",
      "DH52110008",
      "Vũ Thị",
      "H",
      "h@example.com",
      "08/08/2000",
      "Nữ",
      "ĐANG_HỌC",
      "D22_TP01",
    ],
    [
      "9",
      "DH52110009",
      "Đặng Văn",
      "I",
      "i@example.com",
      "09/09/2000",
      "Nam",
      "ĐANG_HỌC",
      "D22_TP02",
    ],
    [
      "10",
      "DH52110010",
      "Ngô Thị",
      "K",
      "k@example.com",
      "10/10/2000",
      "Nữ",
      "ĐANG_HỌC",
      "D22_TP02",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách môn học");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
const ImportStudentOfClassModal = ({ open, onClose, onSuccess }) => {
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
      const res = await handleGetListStudentByClassExcel(formData);
      console.log(res);

      const students = res.data.classes || [];
      const errs = res.data.errors || [];

      const studentsWithErrors = students.map((student) => {
        const matchingError = errs.find((err) => err.rowIndex === student.stt);
        return {
          ...student,
          error: matchingError?.message || null,
        };
      });
      // setPreviewData(students || []);
      setPreviewData(studentsWithErrors);
      setErrors(errs || []);

      if (!students.length && !errs.length) {
        toast.error(res.message || "File không chứa dữ liệu hợp lệ.");
      }
      setShowPreviewModal(true);
    } catch (error) {
      toast.error(error || "Không thể xử lý file. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateSubject = async (data) => {
    try {
      const res = await handleCreateStudentByClassExcel(data);
      console.log(res);

      if (res?.data || res?.status === 201) {
        onSuccess();
        toast.success(res.message || "Thêm danh sách lớp thành công!");
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
          <DialogTitle>Nhập danh sách sinh viên thuộc lớp</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1"></p>
            <Button
              className="cursor-pointer"
              onClick={() => inputRef.current?.click()}
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
              <Button onClick={handleReview} disabled={!file}>
                Xem trước dữ liệu
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Lưu ý: File nhập vào cần có các cột:STT, Mã SV, Họ và tên, Email ,
              Ngày sinh, Giới tính, Trạng thái, Tên lớp
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
            <PreviewStudentByClass
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
            onClick={() => handleCreateSubject(previewData)}
          >
            Nhập danh sách
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudentOfClassModal;
