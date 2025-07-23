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
  console.log(notify);
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await handleDeleteNotification(notify.id);
      if (response?.status === 204) {
        toast.success(response.message || "Xóa thông báo thành công");
        await onSuccess();
        onClose();
      } else {
        toast.error("Không thể xoá thông báo");
      }
    } catch (e) {
      console.log(e?.message || "Xóa thông báo thất bại");
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
            Bạn có chắc chắn muốn xóa thông báo này?
          </DialogDescription>
        </DialogHeader>
        {notify && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã thông báo: {notify.id}
            </p>
            <p className="font-medium">Thông báo: {notify.title}</p>
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
