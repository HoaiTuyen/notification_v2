import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleDeleteNotification } from "../../../controller/NotificationTypeController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteNotification = ({ onOpen, onClose, notification, onSuccess }) => {
  const { setLoading } = useLoading();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await handleDeleteNotification(notification.id);
      if (response?.status === 204) {
        toast.success(response.message || "Xóa loại thông báo thành công");
        onSuccess();
        onClose();
      } else {
        toast.error(response?.message || "Xóa loại thông báo thất bại");
      }
    } catch (error) {
      console.error("Error deleting notification type:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa loại thông báo này?
          </DialogDescription>
        </DialogHeader>
        {notification && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã loại thông báo: {notification.id}
            </p>
            <p className="font-medium">
              Tên loại thông báo: {notification.name}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="cursor-pointer"
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteNotification;
