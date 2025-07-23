// components/reports/ReportDialog.jsx
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  FileSpreadsheet,
  FileText,
  Eye,
  Loader2,
  RefreshCw,
  Calendar,
  Icon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ReportPreview from "./PreviewReports";
import {
  handleListNotificationReport,
  handleDownloadReportExcel,
} from "../../../../controller/NotificationController";
import dayjs from "dayjs";
const ReportDialog = ({ open, onClose }) => {
  const [selectedReportType, setSelectedReportType] = useState("notifications");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hasPreviewed, setHasPreviewed] = useState(false);

  const handlePreviewClick = async () => {
    setIsLoading(true);
    try {
      const response = await handleListNotificationReport(dateFrom, dateTo);
      if (response?.data) {
        setReportData({
          notifications: response.data,
          totalCount: response.data.length,
          dateRange: { from: dateFrom, to: dateTo },
        });
        setShowPreview(true);
        setHasPreviewed(false);
      }
    } catch (err) {
      console.error("Lỗi fetch báo cáo:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // const handleExportReport = async () => {
  //   setIsExporting(true);
  //   try {
  //     const fromFormatted = dayjs(dateFrom).format("DD-MM-YYYY");
  //     const toFormatted = dayjs(dateTo).format("DD-MM-YYYY");
  //     const res = await handleDownloadReportExcel(fromFormatted, toFormatted);

  //     console.log(res);

  //     // const blob = new Blob([res.data], {
  //     //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     // });

  //     // const url = window.URL.createObjectURL(blob);
  //     // const a = document.createElement("a");
  //     // a.href = url;
  //     // a.download = `bao-cao-thong-bao-${fromFormatted}_to_${toFormatted}.xlsx`;
  //     // document.body.appendChild(a);
  //     // a.click();
  //     // a.remove();
  //   } catch (err) {
  //     console.error("Tải Excel lỗi:", err);
  //     alert("Không thể tải file Excel");
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const fromFormatted = dayjs(dateFrom).format("DD-MM-YYYY");
      const toFormatted = dayjs(dateTo).format("DD-MM-YYYY");

      const response = await handleDownloadReportExcel(
        fromFormatted,
        toFormatted
      );

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bao-cao-thong-bao-${fromFormatted}_to_${toFormatted}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Tải Excel lỗi:", err);
      alert("Không thể tải file Excel");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Báo cáo</DialogTitle>
        </DialogHeader>

        <DialogContent className="space-y-4">
          <Card className="m-3">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-blue-500`}>
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Báo cáo thông báo</CardTitle>
                  <CardDescription>
                    Thống kê thông báo theo thời gian
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Chọn ngày */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Từ ngày</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">Đến ngày</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handlePreviewClick()}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tạo báo cáo...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Xem trước báo cáo
                    </>
                  )}
                </Button>
              </div>

              {showPreview && (
                <>
                  <ReportPreview
                    open={showPreview}
                    onClose={() => {
                      setShowPreview(false);
                      setHasPreviewed(true);
                    }}
                    reportData={reportData}
                  />
                </>
              )}
              {hasPreviewed && reportData && (
                <div className="flex justify-end mt-4 px-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport("excel")}
                    disabled={isExporting}
                    className="cursor-pointer"
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                    )}
                    Tải Excel
                  </Button>
                </div>
              )}

              {/* {showPreview && reportData && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Xem trước báo cáo</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReport("excel")}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                        )}
                        Excel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReport("pdf")}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2" />
                        )}
                        PDF
                      </Button>
                    </div>
                  </div>
                </>
              )} */}
            </CardContent>
          </Card>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};
export default ReportDialog;
