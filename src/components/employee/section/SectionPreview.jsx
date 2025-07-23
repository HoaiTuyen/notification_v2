import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PreviewModalSection = ({ open, onClose, data = [] }) => {
  const sectionsList = Array.isArray(data) ? data : [];
  console.log(sectionsList);
  const hasErrors = sectionsList.some((section) => !!section.error);
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
            <table className="min-w-[1200px] text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10 shadow">
                <tr>
                  <th className="border p-2">STT</th>
                  <th className="border p-2">Mã môn học</th>
                  <th className="border p-2">Tên môn học</th>
                  <th className="border p-2">NMH</th>
                  <th className="border p-2">Mã học kỳ</th>
                  <th className="border p-2">Thứ</th>
                  <th className="border p-2">Tiết bắt đầu</th>
                  <th className="border p-2">Tiết kết thúc</th>
                  <th className="border p-2">Phòng học</th>
                  <th className="border p-2">Mã giảng viên</th>
                  <th className="border p-2">Giảng viên</th>
                  <th className="border p-2">Ngày bắt đầu</th>
                  <th className="border p-2">Ngày kết thúc</th>
                  {hasErrors && (
                    <th className="border p-2 text-red-600">Lỗi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sectionsList.map((section, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border p-2 text-center align-middle">
                      {section.stt}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.subjectId}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.subjectName}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.groupId}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.semesterId}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.day}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.startPeriod}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.endPeriod}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.roomName}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.teacherId}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.teacherName}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.startDate}
                    </td>
                    <td className="border p-2 text-center align-middle">
                      {section.endDate}
                    </td>

                    {hasErrors && (
                      <td className="border p-2 text-red-600 italic">
                        {section.error || ""}
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

export default PreviewModalSection;
