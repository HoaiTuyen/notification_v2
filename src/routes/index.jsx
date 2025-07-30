import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../components/auth/Login";
import Admin from "../components/pages/Admin";
import NotFound from "../components/pages/NotFound";
import Lecturer from "../components/pages/Lecturer";
import Student from "../components/pages/Student";
import EmployeeDashboard from "../components/pages/Employee";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ClassRoom from "../components/admin/classroom/ClassRoom";
import ListStudentOfClass from "../components/admin/classroom/liststudentbyclass/ListStudentOfClass";
import Account from "../components/admin/account/admin/Account";
import Department from "../components/admin/department/Department";
import StudentAdmin from "../components/admin/student/Student";
import Group from "../components/admin/group/Group";
import HomeAdmin from "../components/admin/home/Home";
import LecturerAdmin from "../components/admin/lecturer/Lecturer";
import Subject from "../components/admin/subject/Subject";
import Semester from "../components/admin/semester/Semester";
import NotificationType from "../components/admin/notificationtype/NotificationType";
import ListClassOfDepartment from "../components/admin/department/listclassbydepartment/ListClassByDepartment";
import AdminProfilePage from "../components/admin/account/AccountSetting";
import EmployeeAccount from "../components/admin/account/employee/AccountEmployee";
import LecturerAccount from "../components/admin/account/lecturer/LecturerAccount";
import StudentAccount from "../components/admin/account/student/StudentAccount";
import StudyModuleAdmin from "../components/admin/section/StudyModule";
import AdminCreateNotification from "../components/admin/notification/CreateNotification";
import AdminCreateNotificationStudent from "../components/admin/notification/CreateNotificationStudent";
import SentNotifications from "../components/admin/notification/SentNotification";
import AdminNotificationDetail from "../components/admin/notification/DetailNotification";
import Academic from "../components/admin/academic/Academic";
import SentNotificationsPersonal from "../components/admin/notification/SentNotificationPersonal";
import AdminNotificationDetailPersonal from "../components/admin/notification/DetailNotificationPersonal";
//student
import NotificationsPage from "../components/student/notification/NotificationPage";
import StudentProfilePage from "../components/student/ProfileStudent";
import GroupStudyStudent from "../components/student/group/GroupStudy";
import StudentNotificationDetail from "../components/student/notification/DetailNotification";
import DetailGroupStudent from "../components/student/group/DetailGroup";
import HomePageStudent from "../components/student/home/HomePageStudent";
import StudentSubject from "../components/student/subject/StudentSubject";
import ChangePasswordPage from "../components/student/ChangePassword";
import NotificationsPersonal from "../components/student/notification/NotificationPersonal";
//Lecturer
import TeacherProfile from "../components/lecturer/SettingLecturer";
import LecturerCreateNotification from "../components/lecturer/notification/CreateNotification";
import SubjectCharge from "../components/lecturer/subjectcharge/SubjectCharge";
import GroupClassTeacher from "../components/lecturer/groupclass/GroupClass";
import DetailGroupLecturer from "../components/lecturer/groupclass/DetailGroup";
import LecturerNotificationDetail from "../components/lecturer/notification/DetailNotification";
import LecturerSentNotifications from "../components/lecturer/notification/SentNotification";
import HomeLecturerPage from "../components/lecturer/home/HomeLecturerPage";
import ClassCharge from "../components/lecturer/classcharge/ClassCharge";
import ClassDetail from "../components/lecturer/classcharge/ClassDetail";
//Employee
import EmployeeCreateNotification from "../components/employee/notification/CreateNotification";
import EmployeeSentNotifications from "../components/employee/notification/SentNotification";
import EmployeeNotificationDetail from "../components/employee/notification/DetailNotification";
import EmployeeProfilePage from "../components/employee/ProfileEmployee";
import EmployeeStudentAccount from "../components/employee/account/student/EmployeeStudentAccount";
import EmployeeLecturerAccount from "../components/employee/account/lecturer/EmployeeLecturerAccount";
import EmployeeClassName from "../components/employee/classroom/EmployeeClassRoom";
import EmployeeListStudentOfClass from "../components/employee/classroom/listStudentByClass/ListStudentOfClass";
import EmployeeSemester from "../components/employee/semester/EmployeeSemester";
import EmployeeSubject from "../components/employee/subject/EmployeeSubject";
import EmployeeCreateNotificationStudent from "../components/employee/notification/CreateNotificationStudent";
import StudyModule from "../components/employee/section/StudyModule";
import HomePageEmployee from "../components/employee/home/HomePageEmployee";
import DepartmentEmployee from "../components/employee/department/Department";
import StudentEmployee from "../components/employee/student/Student";
import LecturerEmployee from "../components/employee/lecturer/Lecturer";
import ChangePasswordLecturer from "../components/lecturer/ChangePassword";
import ChangePasswordEmployee from "../components/employee/ChangePassword";
import EmployeeListClassOfDepartment from "../components/employee/department/listClassByDepartment/ListClassByDepartment";
function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeAdmin />} />
            <Route path="account-admin" element={<Account />} />
            <Route path="account-employee" element={<EmployeeAccount />} />
            <Route path="account-teacher" element={<LecturerAccount />} />
            <Route path="account-student" element={<StudentAccount />} />
            <Route path="department">
              <Route index element={<Department />} />
              <Route
                path=":departmentId/class"
                element={<ListClassOfDepartment />}
              ></Route>
            </Route>
            <Route path="subject" element={<Subject />} />
            <Route path="semester" element={<Semester />} />
            <Route path="group" element={<Group />} />
            <Route path="notification-type" element={<NotificationType />} />
            <Route path="student-admin" element={<StudentAdmin />} />
            <Route path="lecturer-admin" element={<LecturerAdmin />} />
            <Route path="class">
              <Route index element={<ClassRoom />} />
              <Route
                path=":classId/students"
                element={<ListStudentOfClass />}
              />
            </Route>

            <Route path="register-class" element={<StudyModuleAdmin />} />

            <Route path="setting" element={<AdminProfilePage />} />
            <Route
              path="notification-all"
              element={<AdminCreateNotification />}
            />
            <Route
              path="notification-student"
              element={<AdminCreateNotificationStudent />}
            />
            <Route
              path="sent-notification-all"
              element={<SentNotifications />}
            />
            <Route
              path="sent-notification-personal"
              element={<SentNotificationsPersonal />}
            />
            <Route
              path="sent-notification-all/:notificationId"
              element={<AdminNotificationDetail />}
            />
            <Route
              path="sent-notification-personal/:notificationId"
              element={<AdminNotificationDetailPersonal />}
            />
            <Route path="academic" element={<Academic />} />
          </Route>
          <Route
            path="/giang-vien"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <Lecturer />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeLecturerPage />} />

            <Route path="profile" element={<TeacherProfile />} />
            <Route path="subject-charge" element={<SubjectCharge />} />
            <Route path="class-charge" element={<ClassCharge />} />
            <Route path="class-charge/:classId" element={<ClassDetail />} />
            <Route
              path="notification"
              element={<LecturerCreateNotification />}
            />
            <Route path="group-class" element={<GroupClassTeacher />} />
            <Route
              path="group-class/:groupId"
              element={<DetailGroupLecturer />}
            />
            <Route
              path="sentNotification"
              element={<LecturerSentNotifications />}
            />
            <Route
              path="sentNotification/:notificationId"
              element={<LecturerNotificationDetail />}
            />
            <Route
              path="change-password"
              element={<ChangePasswordLecturer />}
            />
          </Route>

          <Route
            path="/nhan-vien"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomePageEmployee />} />
            <Route path="profile" element={<EmployeeProfilePage />} />
            <Route
              path="notification-all"
              element={<EmployeeCreateNotification />}
            />
            <Route
              path="notification-student"
              element={<EmployeeCreateNotificationStudent />}
            />
            <Route
              path="sent-notification-all"
              element={<EmployeeSentNotifications />}
            />
            <Route
              path="sent-notification/:notificationId"
              element={<EmployeeNotificationDetail />}
            />
            <Route path="study-module" element={<StudyModule />} />
            <Route
              path="employee-account-student"
              element={<EmployeeStudentAccount />}
            />
            <Route
              path="employee-account-teacher"
              element={<EmployeeLecturerAccount />}
            />
            <Route path="class">
              <Route index element={<EmployeeClassName />} />
              <Route
                path=":classId/students"
                element={<EmployeeListStudentOfClass />}
              />
            </Route>
            <Route path="semester" element={<EmployeeSemester />} />
            <Route path="subject" element={<EmployeeSubject />} />
            <Route path="department" element={<DepartmentEmployee />} />
            <Route
              path="department/:departmentId/class"
              element={<EmployeeListClassOfDepartment />}
            />
            <Route path="student-employee" element={<StudentEmployee />} />
            <Route path="lecturer-employee" element={<LecturerEmployee />} />
            <Route
              path="change-password"
              element={<ChangePasswordEmployee />}
            />
          </Route>

          <Route
            path="/sinh-vien"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <Student />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" />}></Route>
            <Route path="home" element={<HomePageStudent />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="subject" element={<StudentSubject />} />
            <Route path="notification-all" element={<NotificationsPage />} />
            <Route
              path="notification/:notificationId"
              element={<StudentNotificationDetail />}
            />
            <Route path="group-study" element={<GroupStudyStudent />} />
            <Route
              path="group-study/:groupStudyId"
              element={<DetailGroupStudent />}
            />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route
              path="notification-personal"
              element={<NotificationsPersonal />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
export default AppRoutes;
