import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleLeaveGroup } from "../../../controller/GroupController";
import { toast } from "react-toastify";

const studentLeaveGroup = ({ onOpen, onClose, userId, group, onSuccess }) => {
  console.log(group);
  const handleLeave = async () => {
    const response = await handleLeaveGroup(userId, group.groupId);
    console.log(response);
    if (response?.status === 200) {
      toast.success(response.message || "Rời nhóm thành công");
      onSuccess();
      onClose();
    } else {
      toast.error(response?.message || "Rời nhóm thất bại");
    }
  };

  return (
    <Dialog open={onOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận rời nhóm</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn rời nhóm học tập này?
          </DialogDescription>
        </DialogHeader>
        {group && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Nhóm học tập: {group.groupName}
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
            onClick={handleLeave}
          >
            Rời nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default studentLeaveGroup;
