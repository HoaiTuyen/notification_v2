import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleDeleteGroup } from "../../../controller/GroupController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteGroup = ({ onOpen, onClose, group, onSuccess }) => {
  console.log(group);

  const { setLoading } = useLoading();

  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteGroup(group.id);
    if (response?.status === 204) {
      toast.success(response.message || "Xóa khoa thành công");
      onSuccess();
      onClose();
    } else {
      toast.error(response?.message || "Xóa khoa thất bại");
    }
    setLoading(false);
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa nhóm học tập này?
          </DialogDescription>
        </DialogHeader>
        {group && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">Mã nhóm: {group.id}</p>
            <p className="font-medium">Tên nhóm: {group.name}</p>
          </div>
        )}
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteGroup;
