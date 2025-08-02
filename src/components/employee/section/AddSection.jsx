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
const DialogCreateSection = ({ open, onClose, onSuccess }) => {
  const [subjectOptions, setDataSubject] = useState([]);
  const [teacherOptions, setDataTeacher] = useState([]);
  const [semesterOptions, setDataSemester] = useState([]);
  const [form, setForm] = useState({
    subjectId: "",
    teacherId: "",
    semesterId: "",
    groupId: "",
    startDate: "",
    endDate: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();

    // Validate cơ bản
    if (!form.subjectId || !form.teacherId || !form.semesterId) {
      toast.error("Vui lòng chọn đầy đủ môn học, giảng viên và học kỳ.");
      return;
    }

    const groupId = form.groupId.trim();
    const groupNumber = Number(groupId);

    if (!groupId) {
      toast.error("Vui lòng nhập mã nhóm.");
      return;
    }

    if (!/^\d+$/.test(groupId)) {
      toast.error("Mã nhóm chỉ được chứa số.");
      return;
    }

    if (groupNumber < 1 || groupNumber > 15) {
      toast.error("Mã nhóm phải từ 1 đến 15.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast.error("Vui lòng nhập ngày bắt đầu và kết thúc.");
      return;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error("Ngày bắt đầu không được sau ngày kết thúc.");
      return;
    }

    if (form.courseSchedules.length === 0) {
      toast.error("Vui lòng thêm ít nhất một lịch học.");
      return;
    }

    for (let i = 0; i < form.courseSchedules.length; i++) {
      const s = form.courseSchedules[i];
      if (!s.room || !s.room.trim()) {
        toast.error(`Lịch học ${i + 1}: Vui lòng nhập tên phòng.`);
        return;
      }

      if (s.day < 2 || s.day > 7) {
        toast.error(`Lịch học ${i + 1}: Thứ phải từ 2 đến 7.`);
        return;
      }

      if (s.startPeriod < 1 || s.endPeriod < 1) {
        toast.error(`Lịch học ${i + 1}: Tiết phải ≥ 1.`);
        return;
      }

      if (s.startPeriod >= s.endPeriod) {
        toast.error(
          `Lịch học ${i + 1}: Tiết bắt đầu phải nhỏ hơn tiết kết thúc.`
        );
        return;
      }
    }

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
      if (res?.data && res?.status === 201) {
        toast.success(res.message || "Thêm lớp học phần thành công!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Thêm lớp học phần thất bại!");
      }
    } catch (e) {
      toast.error(e.message || "Thêm lớp học phần thất bại!");
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
      <DialogContent
        className="sm:max-w-[600px] overflow-y-auto max-h-[750px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Tạo lớp học phần</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <Label>
                Môn học <span className="text-red-500">(*)</span>
              </Label>
              <Select
                options={subjectOptions}
                value={subjectOptions.find(
                  (opt) => opt.value === form.subjectId
                )}
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
              <Label>
                Giảng viên <span className="text-red-500">(*)</span>
              </Label>
              <Select
                options={teacherOptions}
                value={teacherOptions.find(
                  (opt) => opt.value === form.teacherId
                )}
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
              <Label>
                Học kỳ <span className="text-red-500">(*)</span>
              </Label>
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
              <Label>
                Nhóm <span className="text-red-500">(*)</span>
              </Label>
              <Input
                value={form.groupId}
                onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                pattern="^\d{1,2}$"
                title="Mã nhóm chỉ bao gồm số từ 1 đến 15"
                placeholder="Nhập mã nhóm"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Ngày bắt đầu <span className="text-red-500">(*)</span>
                </label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Ngày kết thúc <span className="text-red-500">(*)</span>
                </label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label>
                Lịch học <span className="text-red-500">(*)</span>
              </Label>

              {form.courseSchedules.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 mb-3 border p-3 rounded-md"
                >
                  <div className="flex flex-wrap gap-2 items-end">
                    <div className="flex flex-col gap-1">
                      <Label>
                        Phòng <span className="text-red-500">(*)</span>
                      </Label>
                      <Input
                        placeholder="Phòng"
                        value={item.room}
                        onChange={(e) =>
                          updateSchedule(index, "room", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>
                        Thứ <span className="text-red-500">(*)</span>
                      </Label>
                      <Input
                        type="number"
                        min={2}
                        max={7}
                        value={item.day}
                        onChange={(e) =>
                          updateSchedule(index, "day", Number(e.target.value))
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>
                        Tiết bắt đầu <span className="text-red-500">(*)</span>
                      </Label>
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
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>
                        Tiết kết thúc <span className="text-red-500">(*)</span>
                      </Label>
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
                        required
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
              className="cursor-pointer"
              variant="outline"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              type="submit"
            >
              Tạo lớp học phần
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateSection;
