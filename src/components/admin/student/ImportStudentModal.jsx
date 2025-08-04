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
import * as XLSX from "xlsx";
import {
  handleGetListStudentExcel,
  handleCreateStudentExcel,
} from "../../../controller/StudentController";
import { toast } from "react-toastify";
import PreviewModal from "./PreviewStudent";
import { useLoading } from "../../../context/LoadingProvider";
const generateSampleExcel = () => {
  const sampleData = [
    [
      "STT",
      "Mã SV",
      "Họ",
      "Tên",
      "Email",
      "Ngày sinh",
      "Giới tính",
      "Trạng thái",
    ],
    [
      "1",
      "DH52111720",
      "Đặng Xuân",
      "Quân",
      "dh52111720@student.stu.edu.vn",
      "01/12/2004",
      "Nam",
      "ĐANG_HỌC",
    ],
    [
      "2",
      "DH52118197",
      "Hoàng Ngọc",
      "Tú",
      "dh52118197@student.stu.edu.vn",
      "10/03/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "3",
      "DH52113711",
      "Lê Thanh",
      "Chi",
      "dh52113711@student.stu.edu.vn",
      "29/08/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "4",
      "DH52119179",
      "Hoàng Quốc",
      "Quân",
      "dh52119179@student.stu.edu.vn",
      "10/01/2004",
      "Nam",
      "ĐANG_HỌC",
    ],
    [
      "5",
      "DH52118666",
      "Đỗ Xuân",
      "Bình",
      "dh52118666@student.stu.edu.vn",
      "16/05/2004",
      "Nam",
      "ĐANG_HỌC",
    ],
    [
      "6",
      "DH52115047",
      "Đặng Ngọc",
      "Trang",
      "dh52115047@student.stu.edu.vn",
      "04/08/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "7",
      "DH52116819",
      "Phạm Ngọc",
      "Hà",
      "dh52116819@student.stu.edu.vn",
      "11/02/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "8",
      "DH52119554",
      "Trần Thanh",
      "Vy",
      "dh52119554@student.stu.edu.vn",
      "23/08/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "9",
      "DH52115053",
      "Ngô Minh",
      "Vy",
      "dh52115053@student.stu.edu.vn",
      "04/05/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "10",
      "DH52115663",
      "Nguyễn Xuân",
      "Tú",
      "dh52115663@student.stu.edu.vn",
      "14/11/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "11",
      "DH52119670",
      "Ngô Đình",
      "Nam",
      "dh52119670@student.stu.edu.vn",
      "19/07/2004",
      "Nam",
      "ĐANG_HỌC",
    ],
    [
      "12",
      "DH52113058",
      "Vũ Văn",
      "Nam",
      "dh52113058@student.stu.edu.vn",
      "09/01/2004",
      "Nam",
      "ĐANG_HỌC",
    ],
    [
      "13",
      "DH52113359",
      "Đặng Đình",
      "Tú",
      "dh52113359@student.stu.edu.vn",
      "20/03/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "14",
      "DH52114324",
      "Trần Ngọc",
      "Hà",
      "dh52114324@student.stu.edu.vn",
      "03/10/2004",
      "Nữ",
      "ĐANG_HỌC",
    ],
    [
      "15",
      "DH52114009",
      "Phạm Đình",
      "Quân",
      "dh52114009@student.stu.edu.vn",
      "02/05/2004",
      "Nam",
      "ĐANG_HỌC",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách sinh viên");
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
      const res = await handleGetListStudentExcel(formData);
      console.log(res);

      const students = res.data.students || [];
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
  const handleCreateStudent = async (data) => {
    try {
      const res = await handleCreateStudentExcel(data);

      if (res?.data || res?.status === 201) {
        onSuccess();
        toast.success(res?.message || "Lưu thành công!");
        onClose();
      } else {
        toast.error(res?.message || "Lỗi khi lưu vào hệ thống!");
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
          <DialogTitle>Nhập danh sách sinh viên</DialogTitle>
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
              Lưu ý: File nhập vào cần có các cột: Mã SV, Họ và tên, Email ,
              Ngày sinh, Giới tính, Trạng thái
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
            <PreviewModal
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

export default ImportStudentModal;
