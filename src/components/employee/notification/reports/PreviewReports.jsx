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
  console.log(reportData);
  if (!reportData || !reportData.notifications) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] overflow-x-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Xem trước báo cáo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Separator />
          <div className="max-h-[500px] overflow-auto border rounded-md">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-2 text-left">STT</th>
                  <th className="border px-4 py-2 text-left">Tiêu đề</th>
                  <th className="border px-4 py-2 text-left">Nội dung</th>
                  <th className="border px-4 py-2 text-left">Người tạo</th>
                  <th className="border px-4 py-2 text-left">File</th>
                  <th className="border px-4 py-2 text-left">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {reportData.notifications.map((n, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="border px-4 py-2">{i + 1}</td>
                    <td className="border px-4 py-2 font-medium">{n.title}</td>
                    <td className="border px-4 py-2 text-muted-foreground">
                      {n.content || ""}
                    </td>
                    <td className="border px-4 py-2">
                      {n.username ? (
                        <Badge variant="secondary" className="text-xs">
                          {n.username}
                        </Badge>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="border px-4 py-2">
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
                    <td className="border px-4 py-2 text-muted-foreground">
                      {dayjs(n.date).format("DD-MM-YYYY") || ""}
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
