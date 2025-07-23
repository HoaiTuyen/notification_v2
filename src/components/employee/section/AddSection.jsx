import { useEffect, useState } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Plus, Trash2 } from "lucide-react";
import { handleListSubject } from "../../../controller/SubjectController";
import { handleListTeacher } from "../../../controller/TeacherController";
import { handleListSemester } from "../../../controller/SemesterController";
import { handleCreateClassSection } from "../../../controller/SectionController";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/LoadingProvider";
const DialogCreateSection = ({ open, onClose, onSuccess }) => {
  const { setLoading } = useLoading();
  const [subjectOptions, setDataSubject] = useState([]);
  const [teacherOptions, setDataTeacher] = useState([]);
  const [semesterOptions, setDataSemester] = useState([]);
  const [form, setForm] = useState({
    subjectId: "",
    teacherId: "",
    semesterId: "",
    groupId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    courseSchedules: [],
  });

  const addSchedule = () => {
    setForm((prev) => ({
      ...prev,
      courseSchedules: [
        ...prev.courseSchedules,
        { room: "", day: 2, startPeriod: 1, endPeriod: 1 },
      ],
    }));
  };

  const updateSchedule = (index, field, value) => {
    const updated = [...form.courseSchedules];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, courseSchedules: updated }));
  };

  const removeSchedule = (index) => {
    const updated = [...form.courseSchedules];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, courseSchedules: updated }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        validDateRange: true,
        courseSchedules: form.courseSchedules.map((c) => ({
          ...c,
          validPeriodRange: true,
        })),
      };
      const res = await handleCreateClassSection(payload);
      console.log(res);
      if (res?.data && res?.status === 201) {
        toast.success(res.message || "Thêm lớp học phần thành công!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Thêm lớp học phần thất bại!");
      }
    } catch (e) {
      toast.error(e.message || "Thêm lớp học phần thất bại!");
    } finally {
      setLoading(false);
    }
  };
  const fetchSubject = async () => {
    const pageSize = 10;
    let allSubjects = [];
    let page = 0;
    let totalPages = 1;

    try {
      do {
        const res = await handleListSubject(page, pageSize);

        if (res?.data?.subjects) {
          allSubjects = [...allSubjects, ...res.data.subjects];
          totalPages = res.data.totalPages;
          page++;
        } else {
          break; // stop if bad data
        }
      } while (page < totalPages);
      const subjectOptions = allSubjects.map((subject) => ({
        value: subject.id,
        label: `${subject.id} - ${subject.name}`,
      }));

      setDataSubject(subjectOptions);
    } catch (error) {
      toast.error(error.message || "Lỗi khi fetch all subjects!");
      return [];
    }
  };
  const fetchTeacher = async () => {
    const pageSize = 10;
    let allTeachers = [];
    let page = 0;
    let totalPages = 1;

    try {
      do {
        const res = await handleListTeacher(page, pageSize);

        if (res?.data?.teachers) {
          allTeachers = [...allTeachers, ...res.data.teachers];
          totalPages = res.data.totalPages;
          page++;
        } else {
          break; // stop if bad data
        }
      } while (page < totalPages);
      const teacherOptions = allTeachers.map((teacher) => ({
        value: teacher.id,
        label: `${teacher.id} - ${teacher.firstName} ${teacher.lastName}`,
      }));

      setDataTeacher(teacherOptions);
    } catch (error) {
      toast.error(error.message || "Lỗi khi fetch all subjects!");
    }
  };

  const fetchSemester = async () => {
    const pageSize = 10;
    let allSemesters = [];
    let page = 0;
    let totalPages = 1;

    try {
      do {
        const res = await handleListSemester("desc", page, pageSize);

        if (res?.data?.semesters) {
          allSemesters = [...allSemesters, ...res.data.semesters];
          totalPages = res.data.totalPages;
          page++;
        } else {
          break; // stop if bad data
        }
      } while (page < totalPages);
      const semesterOptions = allSemesters.map((semester) => ({
        value: semester.id,
        label: `${semester.nameSemester} - ${semester.academicYear}`,
      }));

      setDataSemester(semesterOptions);
    } catch (error) {
      console.error("Lỗi khi fetch all subjects:", error);
      return [];
    }
  };
  useEffect(() => {
    fetchSubject();
    fetchTeacher();
    fetchSemester();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[750px]">
        <DialogHeader>
          <DialogTitle>Tạo lớp học phần</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Môn học</Label>
            <Select
              options={subjectOptions}
              value={subjectOptions.find((opt) => opt.value === form.subjectId)}
              onChange={(selected) => {
                setForm({
                  ...form,
                  subjectId: selected?.value || "",
                  subjectName: selected?.label || "",
                });
              }}
              placeholder="Chọn môn học"
              isClearable
              isSearchable
            />
          </div>
          <div>
            <Label>Giảng viên</Label>
            <Select
              options={teacherOptions}
              value={teacherOptions.find((opt) => opt.value === form.teacherId)}
              onChange={(selected) => {
                setForm({
                  ...form,
                  teacherId: selected?.value || "",
                  teacherName: selected?.label || "",
                });
              }}
              placeholder="Chọn giảng viên"
              isClearable
              isSearchable
            />
          </div>
          <div>
            <Label>Học kỳ</Label>
            <Select
              options={semesterOptions}
              value={semesterOptions.find(
                (opt) => opt.value === form.semesterId
              )}
              onChange={(selected) => {
                setForm({
                  ...form,
                  semesterId: selected?.value || "",
                  semesterName: selected?.label || "",
                });
              }}
              placeholder="Chọn học kỳ"
              isClearable
              isSearchable
            />
          </div>
          <div>
            <Label>Nhóm</Label>
            <Input
              value={form.groupId}
              onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              placeholder="Nhập mã nhóm"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <Label>Lịch học</Label>
            {/* {form.courseSchedules.map((item, index) => (
              <div key={index} className="flex gap-2 items-end mb-2">
                <Input
                  placeholder="Phòng"
                  value={item.room}
                  onChange={(e) =>
                    updateSchedule(index, "room", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Thứ"
                  value={item.day}
                  onChange={(e) =>
                    updateSchedule(index, "day", Number(e.target.value))
                  }
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Tiết bắt đầu"
                  value={item.startPeriod}
                  onChange={(e) =>
                    updateSchedule(index, "startPeriod", Number(e.target.value))
                  }
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="Tiết kết thúc"
                  value={item.endPeriod}
                  onChange={(e) =>
                    updateSchedule(index, "endPeriod", Number(e.target.value))
                  }
                  className="w-24"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSchedule(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))} */}
            {form.courseSchedules.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 mb-3 border p-3 rounded-md"
              >
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex flex-col gap-1">
                    <Label>Phòng</Label>
                    <Input
                      placeholder="Phòng"
                      value={item.room}
                      onChange={(e) =>
                        updateSchedule(index, "room", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label>Thứ</Label>
                    <Input
                      type="number"
                      min={2}
                      max={8}
                      value={item.day}
                      onChange={(e) =>
                        updateSchedule(index, "day", Number(e.target.value))
                      }
                      className="w-20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label>Tiết bắt đầu</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.startPeriod}
                      onChange={(e) =>
                        updateSchedule(
                          index,
                          "startPeriod",
                          Number(e.target.value)
                        )
                      }
                      className="w-24"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label>Tiết kết thúc</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.endPeriod}
                      onChange={(e) =>
                        updateSchedule(
                          index,
                          "endPeriod",
                          Number(e.target.value)
                        )
                      }
                      className="w-24"
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="self-end mb-1 cursor-pointer"
                    onClick={() => removeSchedule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Hiển thị rõ lịch học đã chọn */}
                <p className="text-sm text-muted-foreground pl-1 pt-1">
                  📅 {`Thứ ${item.day}`} | ⏰{" "}
                  {`Tiết ${item.startPeriod} đến ${item.endPeriod}`}
                </p>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="mt-2 cursor-pointer"
              onClick={addSchedule}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm lịch học
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="cursor-pointer">
            Tạo lớp học phần
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateSection;
