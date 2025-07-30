import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleDeleteAcademic } from "../../../controller/AcademicController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteAcademic = ({ onOpen, onClose, academic, onSuccess }) => {
  console.log(academic);
  const { setLoading } = useLoading();
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await handleDeleteAcademic(academic.id);
      if (response?.status === 204) {
        toast.success("Xóa niên khoá thành công");
        onSuccess();
        onClose();
      } else {
        toast.error(response?.message || "Xóa niên khoá thất bại");
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
            Bạn có chắc chắn muốn xóa niên khoá này?
          </DialogDescription>
        </DialogHeader>
        {academic && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mã niên khoá: {academic.id}
            </p>
            <p className="font-medium">Tên niên khoá: {academic.name}</p>
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
            Xóa niên khoá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteAcademic;
