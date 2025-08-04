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
  handleCreateClassByDepartmentExcel,
  handleGetListClassByDepartmentExcel,
} from "../../../../controller/DepartmentController";
import { toast } from "react-toastify";
import PreviewModalClassByDepartment from "./PreviewClassByDepartment";
import { useLoading } from "../../../../context/LoadingProvider";
import * as XLSX from "xlsx";
const generateSampleExcel = () => {
  const sampleData = [
    ["STT", "Mã lớp", "Tên lớp", "Mô tả", "Mã khoa", "Tên Khoa"],
    [
      "1",
      "D22_TH01",
      "D22_TH01",
      "Niên khoá 2022 - 2026",
      "CNTT",
      "Công nghệ thông tin",
    ],
    [
      "2",
      "D22_TH02",
      "D22_TH02",
      "Niên khoá 2022 - 2026",
      "CNTT",
      "Công nghệ thông tin",
    ],
    [
      "3",
      "D22_TH03",
      "D22_TH03",
      "Niên khoá 2022 - 2026",
      "CNTT",
      "Công nghệ thông tin",
    ],
    [
      "4",
      "D22_TH04",
      "D22_TH04",
      "Niên khoá 2022 - 2026",
      "CNTT",
      "Công nghệ thông tin",
    ],
    [
      "5",
      "D22_TH05",
      "D22_TH05",
      "Niên khoá 2022 - 2026",
      "CNTT",
      "Công nghệ thông tin",
    ],
    [
      "6",
      "D22_TH06",
      "D22_TH06",
      "Niên khoá 2022 - 2026",
      "CNTT",
      "Công nghệ thông tin",
    ],
    [
      "7",
      "D22_TP01",
      "D22_TP01",
      "Niên khoá 2022 - 2026",
      "CNTP",
      "Công nghệ thực phẩm",
    ],
    [
      "8",
      "D22_TP02",
      "D22_TP02",
      "Niên khoá 2022 - 2026",
      "CNTP",
      "Công nghệ thực phẩm",
    ],
    [
      "9",
      "D22_TP03",
      "D22_TP03",
      "Niên khoá 2022 - 2026",
      "CNTP",
      "Công nghệ thực phẩm",
    ],
    [
      "10",
      "D22_TP04",
      "D22_TP04",
      "Niên khoá 2022 - 2026",
      "CNTP",
      "Công nghệ thực phẩm",
    ],
    [
      "11",
      "D22_TP05",
      "D22_TP05",
      "Niên khoá 2022 - 2026",
      "CNTP",
      "Công nghệ thực phẩm",
    ],
    [
      "12",
      "D22_TP06",
      "D22_TP06",
      "Niên khoá 2022 - 2026",
      "CNTP",
      "Công nghệ thực phẩm",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách môn học");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
const ImportClassOfDepartmentModal = ({ open, onClose, onSuccess }) => {
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
      const res = await handleGetListClassByDepartmentExcel(formData);
      console.log(res);

      const students = res.data.departments || [];
      const errs = res.data.rowErrors || [];

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
      const res = await handleCreateClassByDepartmentExcel(data);
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
          <DialogTitle>Nhập danh sách lớp thuộc khoa</DialogTitle>
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
              Lưu ý: File nhập vào cần có các cột: STT, Mã lớp, Tên lớp, Mô tả,
              Mã khoa, Tên khoa
            </p>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => generateSampleExcel()}
              className="cursor-pointer bg-green-500 hover:bg-green-600"
            >
              Tải file mẫu
            </Button>
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
            <PreviewModalClassByDepartment
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

export default ImportClassOfDepartmentModal;
