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
import { handleDeleteNotificationGroup } from "../../../../controller/NotificationGroupController";
import { useLoading } from "../../../../context/LoadingProvider";
const DeleteNotificationGroup = ({ onOpen, onClose, notify, onSuccess }) => {
  const { setLoading } = useLoading();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await handleDeleteNotificationGroup(notify.id);
      setLoading(false);
      if (response?.status === 204) {
        toast.success(response.message || "Xóa thông báo nhóm thành công");
        onSuccess();
        onClose();
      } else {
        toast.error(response?.message || "Xóa thông báo nhóm thất bại");
      }
    } catch (e) {
      setLoading(false);
      toast.warning("Không thể xoá thông báo");
    }
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa thông báo nhóm này?
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
            Xóa thông báo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteNotificationGroup;
