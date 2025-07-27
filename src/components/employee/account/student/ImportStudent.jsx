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
  handleCreateStudentAccountExcel,
  handleGetListStudentAccountExcel,
} from "../../../../controller/AccountController";
import { toast } from "react-toastify";
import PreviewStudentAccount from "./PreviewStudent";
import { useLoading } from "../../../../context/LoadingProvider";
import * as XLSX from "xlsx";

const generateSampleExcel = () => {
  const sampleData = [
    [
      "STT",
      "Mã số giangr viên",
      "Họ",
      "Tên",
      "Email",
      "Giới tính",
      "Ngày sinh",
      "Trạng thái",
      "Tên đăng nhập",
      "Mật khẩu",
    ],
    [
      "1",
      "DH52112031",
      "Nguyễn",
      "A",
      "exemple@gamil.com",
      "Nam",
      "13/01/200",
      "ĐANG_HỌC",
      "DH52112031",
      "DH52112031",
    ],
    [
      "2",
      "DH52113550",
      "Nguyễn",
      "B",
      "exemple@gamil.com",
      "Nữ",
      "13/01/200",
      "ĐANG_HỌC",
      "DH52113550",
      "DH52113550",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách tài khoản của sinh viên");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
const ImportStudentModal = ({ open, onClose, onSuccess }) => {
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
      const res = await handleGetListStudentAccountExcel(formData);
      console.log(res);

      const accounts = res.data.students || [];
      const errs = res.data.rowErrors || [];

      const accountsWithErrors = accounts.map((account) => {
        const matchingError = errs.find((err) => err.rowIndex === account.stt);
        return {
          ...account,
          error: matchingError?.message || null,
        };
      });
      // setPreviewData(students || []);
      setPreviewData(accountsWithErrors);
      setErrors(errs || []);

      if (!accounts.length && !errs.length) {
        toast.error(res.message || "File không chứa dữ liệu hợp lệ.");
      }
      setShowPreviewModal(true);
    } catch (error) {
      toast.error(error || "Không thể xử lý file. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateLecturer = async (data) => {
    try {
      const res = await handleCreateStudentAccountExcel(data);
      console.log(res);

      if (res?.data || res?.status === 201) {
        onSuccess();
        toast.success(res.message || "Thêm danh sách tài khoản thành công!");
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
          <DialogTitle>Nhập danh sách tài khoản của sinh viên</DialogTitle>
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
              Lưu ý: File nhập vào cần có các cột: STT, Mã SV, Họ, Tên, Email ,
              Trạng thái, Giới tính, Tên đăng nhập, Mật khẩu
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
            <PreviewStudentAccount
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
            onClick={() => handleCreateLecturer(previewData)}
          >
            Nhập danh sách
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudentModal;
