import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { handleGetDetailUser } from "../../../controller/AccountController";

const DetailAccount = ({ open, onClose, accountId }) => {
  const [account, setAccount] = useState(null);

  const fetchAccountDetail = useCallback(async () => {
    if (!accountId) return;
    try {
      const response = await handleGetDetailUser(accountId);
      console.log(response);

      if (response.status === 200) {
        setAccount(response.data);
      } else {
        toast.error(response.message || "Không thể tải chi tiết tài khoản");
      }
    } catch (error) {
      console.error("Error fetching account detail:", error);
    }
  }, [accountId]);

  useEffect(() => {
    if (open && accountId) {
      fetchAccountDetail();
    }
    return () => {
      setAccount(null);
    };
  }, [open, accountId, fetchAccountDetail]);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);

    return parts
      .map((part) =>
        part[0]
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      )
      .join("");
  };
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết tài khoản</DialogTitle>
        </DialogHeader>

        {account ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-20 h-20">
                <AvatarImage src={account.image} alt="avatar" />
                <AvatarFallback>{getInitials(account.fullName)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="mb-2">ID</Label>
                <Input value={account.id} disabled />
              </div>
              <div>
                <Label className="mb-2">Username</Label>
                <Input value={account.username} disabled />
              </div>
              {account.role != "ADMIN" && account.role != "EMPLOYEE" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">
                      {account.studentId ? "MSSV" : "MSGV"}
                    </Label>
                    <Input
                      value={account.studentId || account.teacherId}
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="mb-2">Họ và Tên</Label>
                    <Input value={account.fullName} disabled />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Trạng thái</Label>
                  <Input value={account.status} disabled />
                </div>
                <div>
                  <Label className="mb-2">Vai trò</Label>
                  <Input value={account.role} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Ngày tạo</Label>
                  <Input
                    value={new Date(account.createdAt).toLocaleString()}
                    disabled
                  />
                </div>
                <div>
                  <Label className="mb-2">Ngày cập nhật</Label>
                  <Input
                    value={new Date(account.updatedAt).toLocaleString()}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm">Đang tải...</div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={onClose}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailAccount;
