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
import { useLoading } from "../../../context/LoadingProvider";

const generateSampleExcel = () => {
  const sampleData = [
    [
      "STT",
      "Mã môn học",
      "NMH (Nhóm môn học)",
      "Mã học kỳ",
      "Thứ",
      "Tiết BĐ",
      "Tiết KT",
      "Phòng học",
      "Mã giảng viên",
      "Giảng viên",
      "Ngày bắt đầu",
      "Ngày kết thúc",
    ],
    [
      "1",
      "GS3000005",
      "Lập trình ứng dụng cơ sở dữ liệu",
      "1",
      "211",
      "2",
      "1",
      "4",
      "C702",
      "DH52110007",
      "Hùng",
      "14/03/2025",
      "30/09/2025",
    ],
    [
      "2",
      "GS3000005",
      "Lập trình ứng dụng cơ sở dữ liệu",
      "2",
      "211",
      "3",
      "1",
      "4",
      "C703",
      "DH52110007",
      "Hùng",
      "14/03/2025",
      "30/09/2025",
    ],
  ];
  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách lớp");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
const ImportSection = ({ open, onClose, onSuccess }) => {
  const { setLoading } = useLoading();
  const [file, setFile] = useState(null);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nhập danh sách lớp học phần</DialogTitle>
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
              Lưu ý: File nhập vào cần có các cột: STT, tên môn học, nhóm môn
              học, mã học kỳ, thứ, tiết bắt đầu, tiết kết thúc, phòng học, mã
              giảng viên, giảng viên, ngày bắt đầu, ngày kết thúc
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
            <PreviewModalSection
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

export default ImportSection;
