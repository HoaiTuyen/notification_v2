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

import { handleDeleteStudent } from "../../../../controller/StudentController";

const DeleteStudentByClass = ({ onOpen, onClose, student, onSuccess }) => {
  const handleDelete = async () => {
    const response = await handleDeleteStudent(student.id);
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
            Bạn có chắc chắn muốn xóa sinh viên khỏi lớp {student.className} ?
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
            Xóa lớp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteStudentByClass;
