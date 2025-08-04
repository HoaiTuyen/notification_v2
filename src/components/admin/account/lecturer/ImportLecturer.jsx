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
  handleCreateLecturerAccountExcel,
  handleGetListLecturerAccountExcel,
} from "../../../../controller/AccountController";
import { toast } from "react-toastify";
import PreviewLecturer from "./PreviewLecturer";
import { useLoading } from "../../../../context/LoadingProvider";
import * as XLSX from "xlsx";

const generateSampleExcel = () => {
  const sampleData = [
    [
      "STT",
      "Mã số giảng viên",
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
      "THCH_F0001",
      "Nguyễn",
      "A",
      "exemple@gamil.com",
      "Nam",
      "13/01/2000",
      "ĐANG_CÔNG_TÁC",
      "DH52112031",
      "DH52112031",
    ],
    [
      "2",
      "THCH_F0002",
      "Nguyễn",
      "B",
      "exemple@gamil.com",
      "Nữ",
      "13/01/2000",
      "ĐANG_CÔNG_TÁC",
      "DH52113550",
      "DH52113550",
    ],
    [
      "3",
      "THCH_F0003",
      "Trần",
      "C",
      "gv1@example.com",
      "Nam",
      "12/02/1985",
      "ĐANG_CÔNG_TÁC",
      "DH52113551",
      "DH52113551",
    ],
    [
      "4",
      "THCH_F0004",
      "Lê",
      "D",
      "gv2@example.com",
      "Nữ",
      "25/06/1988",
      "ĐANG_CÔNG_TÁC",
      "DH52113552",
      "DH52113552",
    ],
    [
      "5",
      "THCH_F0005",
      "Phạm",
      "E",
      "gv3@example.com",
      "Nam",
      "08/11/1982",
      "ĐANG_CÔNG_TÁC",
      "DH52113553",
      "DH52113553",
    ],
    [
      "6",
      "THCH_F0006",
      "Hoàng",
      "F",
      "gv4@example.com",
      "Nữ",
      "19/03/1990",
      "ĐANG_CÔNG_TÁC",
      "DH52113554",
      "DH52113554",
    ],
    [
      "7",
      "THCH_F0007",
      "Đỗ",
      "G",
      "gv5@example.com",
      "Nam",
      "30/09/1986",
      "ĐANG_CÔNG_TÁC",
      "DH52113555",
      "DH52113555",
    ],
    [
      "8",
      "THCH_F0008",
      "Bùi",
      "H",
      "gv6@example.com",
      "Nữ",
      "14/07/1991",
      "ĐANG_CÔNG_TÁC",
      "DH52113556",
      "DH52113556",
    ],
    [
      "9",
      "THCH_F0009",
      "Võ",
      "I",
      "gv7@example.com",
      "Nam",
      "02/04/1989",
      "ĐANG_CÔNG_TÁC",
      "DH52113557",
      "DH52113557",
    ],
    [
      "10",
      "THCH_F0010",
      "Đặng",
      "K",
      "gv8@example.com",
      "Nữ",
      "27/12/1987",
      "ĐANG_CÔNG_TÁC",
      "DH52113558",
      "DH52113558",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách tài khoản giảng viên");
  XLSX.writeFile(wb, "file_mau.xlsx");
};
const ImportLecturerModal = ({ open, onClose, onSuccess }) => {
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
      const res = await handleGetListLecturerAccountExcel(formData);
      console.log(res);

      const accounts = res.data.teachers || [];
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
      const res = await handleCreateLecturerAccountExcel(data);
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
          <DialogTitle>Nhập danh sách tài khoản</DialogTitle>
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
              Lưu ý: File nhập vào cần có các cột: STT, Mã GV, Họ, Tên, Email ,
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
            <PreviewLecturer
              open={showPreviewModal}
              onClose={() => setShowPreviewModal(false)}
              data={previewData}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
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

export default ImportLecturerModal;
