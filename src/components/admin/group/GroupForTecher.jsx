import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users, MessageSquare } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Group = () => {
  return (
    <div className="min-h-screen w-full bg-white p-0">
      <div className="space-y-6 p-5">
        <div className="flex justify-between items-center">
          <div></div>
          <Dialog>
            <DialogTrigger asChild className="text-right cursor-pointer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-right">
                <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tạo nhóm học tập mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin để tạo một nhóm học tập mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên nhóm</Label>
                  <Input id="name" placeholder="Nhập tên nhóm học tập" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn về nhóm học tập"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="topics">
                    Chủ đề (phân cách bằng dấu phẩy)
                  </Label>
                  <Input
                    id="topics"
                    placeholder="Ví dụ: Toán, Vật lý, Hóa học"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Tạo nhóm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card key="1" className="overflow-hidden">
            <CardHeader className="">
              <CardTitle>Thực hành lâp trình ứn dụng cơ sở dữ liệu</CardTitle>
              <CardDescription>Học gì cũng được</CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge key="1" variant="secondary">
                  Text
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>9 thành viên</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Mã nhóm:</span>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    DH889
                  </code>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:border-gray-300 "
              >
                <Link to="">
                  <MessageSquare className="mr-2 h-4 w-4 text-black" />
                  <div className="text-black">Chat</div>
                </Link>
              </Button>
              <div className="flex space-x-2 ">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hover:border-gray-300 "
                >
                  <Link to="">
                    <div className="text-black">Chi tiết</div>
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="hover:border-gray-300 "
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Group;
