import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PreviewModalClassByDepartment = ({ open, onClose, data = [] }) => {
  const classList = Array.isArray(data) ? data : [];
  console.log(classList);

  const hasErrors = classList.some((student) => !!student.error);
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="!max-w-7xl  w-screen h-[90vh] rounded-lg p-6">
        {/* Thay max-w-full thành max-w-5xl */}
        <DialogHeader>
          <DialogTitle>Xem trước danh sách lớp học</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-auto mt-4 rounded-lg border">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10 shadow">
                <tr>
                  <th className="border p-2">STT</th>
                  <th className="border p-2">Mã lớp</th>
                  <th className="border p-2">Tên lớp</th>
                  <th className="border p-2">Mô tả</th>
                  <th className="border p-2">Mã khoa</th>
                  <th className="border p-2">Tên khoa</th>
                  {hasErrors && (
                    <th className="border p-2 text-red-600">Lỗi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {classList.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border p-2">{item.stt}</td>
                    <td className="border p-2">{item.classId}</td>
                    <td className="border p-2">{item.className}</td>
                    <td className="border p-2">{item.description}</td>
                    <td className="border p-2">{item.departmentId}</td>
                    <td className="border p-2">{item.departmentName}</td>

                    {hasErrors && (
                      <td className="border p-2 text-red-600 italic">
                        {item.error || ""}
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

export default PreviewModalClassByDepartment;
