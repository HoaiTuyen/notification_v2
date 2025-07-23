import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { handleDeleteNotification } from "../../../controller/NotificationController";

import { useLoading } from "../../../context/LoadingProvider";
const DeleteNotification = ({ onOpen, onClose, notify, onSuccess }) => {
  const { setLoading } = useLoading();
  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteNotification(notify.id);
    setLoading(false);
    if (response?.status === 204) {
      onSuccess();
      toast.success(response.message || "Xóa lớp thành công");
      onClose();
    } else {
      toast.error(response?.message || "Xóa lớp thất bại");
    }
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa thông báo này?
          </DialogDescription>
        </DialogHeader>
        {notify && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã thông báo: {notify.id}
            </p>
            <p className="font-medium">Tên thông báo: {notify.title}</p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDelete}
          >
            Xóa thông báo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteNotification;
