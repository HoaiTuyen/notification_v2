import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PreviewModalSubject = ({ open, onClose, data = [] }) => {
  const subjectList = Array.isArray(data) ? data : [];
  console.log(subjectList);
  const hasErrors = subjectList.some((subject) => !!subject.error);
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="!max-w-7xl  w-screen h-[90vh] rounded-lg p-6">
        {/* Thay max-w-full thành max-w-5xl */}
        <DialogHeader>
          <DialogTitle>Xem trước danh sách môn học</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-auto mt-4 rounded-lg border">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10 shadow">
                <tr>
                  <th className="border p-2">STT</th>
                  <th className="border p-2">Mã môn học</th>
                  <th className="border p-2">Tên môn học</th>
                  <th className="border p-2">Số tín chỉ</th>
                  {hasErrors && (
                    <th className="border p-2 text-red-600">Lỗi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {subjectList.map((subject, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border p-2 text-center align-middle">
                      {subject.stt}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {subject.id}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {subject.name}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {subject.credit}
                    </td>

                    {hasErrors && (
                      <td className="border p-2 text-red-600 italic">
                        {subject.error || ""}
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

export default PreviewModalSubject;
