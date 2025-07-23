import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleDeleteSemester } from "../../../controller/SemesterController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteSemester = ({ onOpen, onClose, semester, onSuccess }) => {
  const { setLoading } = useLoading();

  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteSemester(semester.id);
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
            Bạn có chắc chắn muốn xóa học kỳ này?
          </DialogDescription>
        </DialogHeader>
        {semester && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã học kỳ: {semester.id}
            </p>
            <p className="font-medium">Tên học kỳ: {semester.nameSemester}</p>
            <p className="font-medium">Năm học: {semester.academicYear}</p>
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
export default DeleteSemester;
