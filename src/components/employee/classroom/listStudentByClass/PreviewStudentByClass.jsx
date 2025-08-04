import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PreviewModalClass = ({ open, onClose, data = [] }) => {
  const studentList = Array.isArray(data) ? data : [];
  console.log(studentList);
  const hasErrors = studentList.some((student) => !!student.error);
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="!max-w-7xl  w-screen h-[90vh] rounded-lg p-6">
        {/* Thay max-w-full thành max-w-5xl */}
        <DialogHeader>
          <DialogTitle>Xem trước danh sách sinh viên thuộc lớp</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-auto mt-4 rounded-lg border">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10 shadow">
                <tr>
                  <th className="border p-2">STT</th>
                  <th className="border p-2">Mã SV</th>
                  <th className="border p-2">Họ</th>
                  <th className="border p-2">Tên</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Ngày sinh</th>
                  <th className="border p-2">Giới tính</th>
                  <th className="border p-2">Trạng thái</th>
                  <th className="border p-2">Tên lớp</th>
                  {hasErrors && (
                    <th className="border p-2 text-red-600">Lỗi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {studentList.map((student, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border p-2">{student.stt}</td>
                    <td className="border p-2">{student.studentId}</td>
                    <td className="border p-2">{student.firstName}</td>
                    <td className="border p-2">{student.lastName}</td>
                    <td className="border p-2">{student.email}</td>
                    <td className="border p-2">{student.dateOfBirth}</td>
                    <td className="border p-2">{student.gender}</td>
                    <td className="border p-2">{student.status}</td>
                    <td className="border p-2">{student.classId}</td>

                    {hasErrors && (
                      <td className="border p-2 text-red-600 italic">
                        {student.error || ""}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModalClass;
