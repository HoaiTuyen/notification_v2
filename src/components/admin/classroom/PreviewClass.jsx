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
  const classesList = Array.isArray(data) ? data : [];
  console.log(classesList);
  const hasErrors = classesList.some((classroom) => !!classroom.error);
  console.log(hasErrors);

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
                  <th className="border p-2">Mã lớp</th>
                  <th className="border p-2">Tên lớp</th>
                  <th className="border p-2">Mô tả</th>
                  {hasErrors && (
                    <th className="border p-2 text-red-600">Lỗi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {classesList.map((classroom, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border p-2 text-center align-middle">
                      {classroom.stt}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {classroom.id}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {classroom.name}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {classroom.description}
                    </td>

                    {hasErrors && (
                      <td className="border p-2 text-red-600 italic">
                        {classroom.error || ""}
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
