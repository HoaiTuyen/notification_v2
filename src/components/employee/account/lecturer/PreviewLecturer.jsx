import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PreviewLecturer = ({ open, onClose, data = [] }) => {
  const accountsList = Array.isArray(data) ? data : [];
  const hasErrors = accountsList.some((account) => !!account.error);
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="!max-w-7xl  w-screen h-[90vh] rounded-lg p-6">
        <DialogHeader>
          <DialogTitle>Xem trước danh sách tài khoản giảng viên</DialogTitle>
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
                  <th className="border p-2">Tên đăng nhập</th>
                  <th className="border p-2">Mật khẩu</th>
                  {hasErrors && (
                    <th className="border p-2 text-red-600">Lỗi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {accountsList.map((account, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border p-2">{account.stt}</td>
                    <td className="border p-2">{account.id}</td>
                    <td className="border p-2">{account.firstName}</td>
                    <td className="border p-2">{account.lastName}</td>
                    <td className="border p-2">{account.email}</td>
                    <td className="border p-2">{account.dateOfBirth}</td>
                    <td className="border p-2">{account.gender}</td>
                    <td className="border p-2">{account.status}</td>
                    <td className="border p-2">{account.username}</td>
                    <td className="border p-2">{account.password}</td>
                    {hasErrors && (
                      <td className="border p-2 text-red-600 italic">
                        {account.error || ""}
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

export default PreviewLecturer;
