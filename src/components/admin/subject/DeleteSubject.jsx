import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleDeleteSubject } from "../../../controller/SubjectController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteSubject = ({ onOpen, onClose, subject, onSuccess }) => {
  const { setLoading } = useLoading();
  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteSubject(subject.id);
    if (response?.status === 204) {
      onSuccess();
      toast.success(response?.message || "Xóa môn học thành công");
      onClose();
    } else {
      toast.error(response?.message || "Xóa môn học thất bại");
    }
    setLoading(false);
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa môn học này?
          </DialogDescription>
        </DialogHeader>
        {subject && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã môn học: {subject.id}
            </p>
            <p className="font-medium">Tên môn học: {subject.name}</p>
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
            Xóa môn học
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteSubject;
