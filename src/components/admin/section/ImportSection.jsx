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
  handleCreateClassSectionExcel,
  handleGetListClassSectionExcel,
} from "../../../controller/SectionController";
import { toast } from "react-toastify";
import PreviewModalSection from "./SectionPreview";
import * as XLSX from "xlsx";

const generateSampleExcel = () => {
  const sampleData = [
    ["STT", "Tên lớp", "Mô tả"],
    ["1", "D21_TH12", "Niên khoá 2021 - 2025"],
    ["2", "D21_TH13", "Niên khoá 2021 - 2025"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách lớp");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
const ImportSection = ({ open, onClose, onSuccess }) => {
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
      const res = await handleGetListClassSectionExcel(formData);
      console.log(res);

      const sections = res.data.sections || [];
      const errs = res.data.rowErrors || [];

      const sectionsWithErrors = sections.map((section) => {
        const matchingError = errs.find((err) => err.rowIndex === section.stt);
        return {
          ...section,
          error: matchingError?.message || null,
        };
      });
      // setPreviewData(students || []);
      setPreviewData(sectionsWithErrors);
      setErrors(errs || []);

      if (!sections.length && !errs.length) {
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
      const res = await handleCreateClassSectionExcel(data);
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
      <Spin spinning={loading} className="fixed inset-0 z-50 bg-black/50">
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nhập danh sách môn học</DialogTitle>
            <DialogDescription>
              Nhập danh sách môn học từ file CSV hoặc Excel
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
                Lưu ý: File nhập vào cần có các cột: STT, Mã môn học, tên môn
                học, số tín chỉ
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
              <PreviewModalSection
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

export default ImportSection;
