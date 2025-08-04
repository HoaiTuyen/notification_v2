import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { handleDeleteStudent } from "../../../controller/StudentController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteStudent = ({ open, onClose, student, onSuccess }) => {
  const { setLoading } = useLoading();

  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteStudent(student.id);
    if (response?.status === 204) {
      toast.success(response?.message || "Xóa sinh viên thành công");
      onSuccess();
      onClose();
    } else {
      toast.error(response?.message || "Xóa sinh viên thất bại");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa sinh viên này?
          </DialogDescription>
        </DialogHeader>
        {student && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã sinh viên: {student.id}
            </p>
            <p className="font-medium">
              Tên sinh viên: {student.firstName} {student.lastName}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteStudent;
