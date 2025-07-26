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
import { handleDeleteClass } from "../../../controller/ClassController";
const DeleteClass = ({ onOpen, onClose, classRoom, onSuccess }) => {
  console.log(classRoom);
  const handleDelete = async () => {
    const response = await handleDeleteClass(classRoom.id);
    if (response?.status === 204) {
      toast.success(response.message || "Xóa lớp thành công");
      onSuccess();
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
            Bạn có chắc chắn muốn xóa lớp này?
          </DialogDescription>
        </DialogHeader>
        {classRoom && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã lớp: {classRoom.id}
            </p>
            <p className="font-medium">Tên lớp: {classRoom.name}</p>
            <p className="font-medium">Niên khoá: {classRoom.description}</p>
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
            Xóa lớp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteClass;
