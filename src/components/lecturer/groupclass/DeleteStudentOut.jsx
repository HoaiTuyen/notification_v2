import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleKickMember } from "../../../controller/GroupController";
import { toast } from "react-toastify";

const DeleteStudentOut = ({
  onOpen,
  onClose,
  member,
  author,
  group,
  onSuccess,
}) => {
  const handleKick = async () => {
    const response = await handleKickMember(group.id, author, member.userId);
    console.log(response);
    if (response?.status === 200) {
      toast.success(response.message || "Xoá thành viên thành công");
      onSuccess();
      onClose();
    } else {
      toast.error(response?.message || "Xoá thành viên thất bại");
    }
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xoá thành viên</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xoá thành viên này?
          </DialogDescription>
        </DialogHeader>
        {group && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">Thành viên:</p>
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
            onClick={handleKick}
          >
            Xoá thành viên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteStudentOut;
