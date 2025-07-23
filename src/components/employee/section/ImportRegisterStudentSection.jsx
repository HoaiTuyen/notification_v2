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
import { toast } from "react-toastify";
import PreviewModalRegisterStudent from "./PreviewRegisterStudent";
import * as XLSX from "xlsx";
import {
  handleCreateRegisterStudentExcel,
  handleGetListRegisterStudentExcel,
} from "../../../controller/SectionController";
import { useLoading } from "../../../context/LoadingProvider";
const generateSampleExcel = () => {
  const sampleData = [
    ["STT", "Tên lớp", "Mô tả"],
    ["1", "D21_TH12", "Niên khoá 2021 - 2025"],
    ["2", "D21_TH13", "Niên khoá 2021 - 2025"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách đăng ký");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
const ImportRegisterStudentSection = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { setLoading } = useLoading();
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
      const res = await handleGetListRegisterStudentExcel(formData);

      const students = res.data.students || [];
      const errs = res.data.errors || [];
      console.log(errs);
      const studentsWithErrors = students.map((student) => {
        const matchingError = errs.find(
          (err) => String(err.rowIndex) === String(student.stt)
        );
        console.log("STT:", student.stt, "Error:", matchingError);

        return {
          ...student,
          error: matchingError?.message || null,
        };
      });
      console.log(studentsWithErrors);

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
      const res = await handleCreateRegisterStudentExcel(data);
      console.log(res);

      if (res?.data || res?.status === 201) {
        onSuccess();
        toast.success(res.message || "Thêm danh sách đăng ký thành công!");
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
      <Spin spinning={loading} className="fixed inset-0 z-50 bg-black/50">
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nhập danh sách đăng ký</DialogTitle>
            <DialogDescription>
              Nhập danh sách đăng ký từ file CSV hoặc Excel
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1"></p>
              <Button
                onClick={() => inputRef.current?.click()}
                disabled={loading}
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
                <Button onClick={handleReview} disabled={!file || loading}>
                  {loading ? "Đang xử lý..." : "Xem trước dữ liệu"}
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Lưu ý: File nhập vào cần có các cột:
              </p>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => generateSampleExcel()}
                className="bg-green-500 hover:bg-green-600"
              >
                Tải file mẫu
              </Button>
            </div>
            {showPreviewModal && (
              <PreviewModalRegisterStudent
                open={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                data={previewData}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onClose()}>
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={errors.length > 0 || previewData.length === 0}
              onClick={() => handleCreateSubject(previewData)}
            >
              Nhập danh sách
            </Button>
          </DialogFooter>
        </DialogContent>
      </Spin>
    </Dialog>
  );
};

export default ImportRegisterStudentSection;
