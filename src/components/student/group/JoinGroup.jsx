import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Check, X } from "lucide-react";
import { handleJoinStudentInGroup } from "../../../controller/GroupController";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useLoading } from "../../../context/LoadingProvider";
const JoinGroup = ({ open, onClose, onSuccess }) => {
  const token = localStorage.getItem("access_token");
  const data = jwtDecode(token);
  const userId = data.userId;
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    userId: userId,
    code: "",
  });
  const { setLoading } = useLoading();
  const handleSubmitJoin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const joinStudent = await handleJoinStudentInGroup(form);
      setLoading(false);
      if (joinStudent?.status === 200) {
        toast.success(joinStudent.message);
        onSuccess();
        onClose();
      } else {
        toast.error(joinStudent.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const validateForm = (e) => {
    e.preventDefault();
    if (!form?.code) {
      setError("Mã nhóm không được để trống");
      return;
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val == onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <Card className="border-none shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Tham gia nhóm học tập
            </CardTitle>
            <CardDescription className="text-center">
              Nhập mã nhóm để tham gia vào một nhóm học tập
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmitJoin}>
              <div className="space-y-2">
                <Label htmlFor="code">Mã nhóm</Label>
                <div className="flex space-x-2">
                  <Input
                    id="code"
                    placeholder="Nhập mã nhóm (ví dụ: ad99kol)"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    required
                    onBlur={validateForm}
                  />
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    type="submit"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    {error}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
export default JoinGroup;
