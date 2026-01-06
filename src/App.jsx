// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import TeacherDashboard from "./routes/TeacherDashboard";
import CreateStudent from "./routes/teacher/CreateStudent";
import SubmittedAssignments from "./routes/teacher/SubmittedAssignments";
import TeacherProfile from "./routes/teacher/Profile";
import SubmitAssignment from "./routes/student/SubmitAssignment";
import StudentProfile from "./routes/student/Profile";
import TeacherAssignments from "./routes/teacher/TeacherAssignments";
import StudentsAssignments from "./routes/student/StudentsAssignments";
import AssignmentsReview from "./routes/teacher/AssignmentsReview";

const LoginPage = lazy(() => import("./routes/LoginPage"));
const StudentDashboard = lazy(() => import("./routes/StudentDashboard"));
const AdminDashboard = lazy(() => import("./routes/admin/AdminDashboard"));
const ManageTeachers = lazy(() => import("./routes/admin/ManageTeachers"));
const ManageStudents = lazy(() => import("./routes/admin/ManageStudents"));
const NotFound = lazy(() => import("./routes/NotFound"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Student Dashboard */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentsAssignments />} />
              <Route path="assignments" element={<StudentsAssignments />} />
              <Route path="submit-assignment" element={<SubmitAssignment />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* Teacher Dashboard */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherAssignments />} />
              <Route path="create-student" element={<CreateStudent />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="profile" element={<TeacherProfile />} />
              <Route
                path="assignments-review"
                element={<AssignmentsReview />}
              />
              <Route
                path="submitted-assignments"
                element={<SubmittedAssignments />}
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="teachers" element={<ManageTeachers />} />
              <Route path="students" element={<ManageStudents />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
