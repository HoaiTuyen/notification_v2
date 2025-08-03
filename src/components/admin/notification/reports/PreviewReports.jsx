// components/reports/ReportPreviewDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

const ReportPreviewDialog = ({ open, onClose, reportData }) => {
  if (!reportData || !reportData.notifications) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] overflow-x-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Xem trước báo cáo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Separator />
          <div className="max-h-[500px] overflow-auto border rounded-md">
            <table className="max-h-[500px] overflow-auto table-auto text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-2 text-left w-[200px]">STT</th>
                  <th className="border px-4 py-2 text-left w-[200px]">
                    Tiêu đề
                  </th>
                  <th className="border px-4 py-2 text-left w-[200px]">
                    Nội dung
                  </th>
                  <th className="border px-4 py-2  w-[200px]">Link đính kèm</th>
                  <th className="border px-4 py-2 text-left w-[200px]">
                    Ngày gửi
                  </th>
                  <th className="border px-4 py-2 text-left w-[200px]">
                    Người gửi
                  </th>
                  <th className="border px-4 py-2 text-left w-[200px]">
                    Người nhận
                  </th>
                </tr>
              </thead>

              <tbody>
                {reportData.notifications.map((n, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="border px-4 py-2 w-[100px]">{i + 1}</td>
                    <td className="border px-4 py-2 font-medium w-[100px]">
                      {n.title}
                    </td>
                    <td className="border px-4 py-2 text-muted-foreground w-[100px]">
                      {n.content || ""}
                    </td>
                    <td className="border px-4 py-2 w-[100px]">
                      {n.fileNotifications?.length > 0 ? (
                        <a
                          href={n.fileNotifications[0].fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-xs underline"
                        >
                          {n.fileNotifications[0].displayName || "Xem file"}
                        </a>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="border px-4 py-2 w-[100px] text-muted-foreground">
                      {dayjs(n.date).format("DD-MM-YYYY") || ""}
                    </td>
                    <td className="border px-4 py-2 w-[100px]">
                      {n.username ? (
                        <Badge variant="secondary" className="text-xs">
                          {n.username}
                        </Badge>
                      ) : (
                        ""
                      )}
                    </td>

                    <td className="border px-4 py-2 w-[100px]">
                      {n.receiver ? (
                        <Badge variant="secondary" className="text-xs">
                          {n.receiver}
                        </Badge>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPreviewDialog;
