import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleDeleteTeacher } from "../../../controller/TeacherController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteTeacher = ({ onOpen, onClose, teacher, onSuccess }) => {
  console.log(teacher);

  const { setLoading } = useLoading();
  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteTeacher(teacher.id);
    if (response?.status === 204) {
      toast.success("Xóa khoa thành công");
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
            Bạn có chắc chắn muốn xóa giảng viên này?
          </DialogDescription>
        </DialogHeader>
        {teacher && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã giảng viên: {teacher.id}
            </p>
            <p className="font-medium">
              Tên giảng viên:{teacher.firstName} {teacher.lastName}
            </p>
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
export default DeleteTeacher;
