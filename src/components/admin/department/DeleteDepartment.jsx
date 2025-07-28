import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleDeleteDepartment } from "../../../controller/DepartmentController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteDepartment = ({ onOpen, onClose, department, onSuccess }) => {
  const { setLoading } = useLoading();
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await handleDeleteDepartment(department.id);
      if (response?.status === 204) {
        toast.success("Xóa khoa thành công");
        onSuccess();
        onClose();
      } else {
        toast.error(response?.message || "Xóa khoa thất bại");
      }
    } catch (error) {
      console.log(error);
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
            Bạn có chắc chắn muốn xóa khoa này?
          </DialogDescription>
        </DialogHeader>
        {department && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã khoa: {department.id}
            </p>
            <p className="font-medium">Tên khoa: {department.name}</p>
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
            Xóa khoa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteDepartment;
