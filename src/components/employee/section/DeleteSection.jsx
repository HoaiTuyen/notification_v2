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
import { handleDeleteClassSection } from "../../../controller/SectionController";
import { useLoading } from "../../../context/LoadingProvider";
const DeleteSection = ({ onOpen, onClose, section, onSuccess }) => {
  console.log(section);
  const { setLoading } = useLoading();
  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteClassSection(section);
    console.log(response);
    if (response?.status === 204) {
      toast.success(response.message || "Xóa lớp thành công");
      onSuccess();
      onClose();
    } else {
      toast.error(response?.message || "Xóa lớp thất bại");
    }
    setLoading(false);
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa lớp học phần này?
          </DialogDescription>
        </DialogHeader>

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
export default DeleteSection;
