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
  handleCreateSubjectExcel,
  handleGetListSubjectExcel,
} from "../../../controller/SubjectController";
import { toast } from "react-toastify";
import PreviewModalSubject from "./PreviewSubject";
import { useLoading } from "../../../context/LoadingProvider";
import * as XLSX from "xlsx";

const generateSampleExcel = () => {
  const sampleData = [
    ["STT", "Mã môn học", "Tên môn học", "Số tín chỉ"],
    ["1", "GS09821", "Toán cao cấp A1", "3"],
    ["2", "GS87651", "Lập trình web", "3"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách môn học");
  XLSX.writeFile(wb, "file_mau.xlsx");
};

const ImportSubjectModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const { setLoading } = useLoading();
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
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
      const res = await handleGetListSubjectExcel(formData);
      console.log(res);

      const subjects = res.data.subjects || [];
      const errs = res.data.errors || [];

      const subjectsWithErrors = subjects.map((subject) => {
        const matchingError = errs.find((err) => err.rowIndex === subject.stt);
        return {
          ...subject,
          error: matchingError?.message || null,
        };
      });
      // setPreviewData(students || []);
      setPreviewData(subjectsWithErrors);
      setErrors(errs || []);

      if (!subjects.length && !errs.length) {
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
      const res = await handleCreateSubjectExcel(data);
      console.log(res);

      if (res?.data || res?.status === 201) {
        onSuccess();
        toast.success(res.message || "Thêm danh sách môn học thành công!");
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
          <DialogTitle>Nhập danh sách môn học</DialogTitle>
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
              Lưu ý: File nhập vào cần có các cột: STT, Mã môn học, Tên môn học,
              Số tín chỉ
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
            <PreviewModalSubject
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
    </Dialog>
  );
};

export default ImportSubjectModal;
