import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDashboard from "./AdminDashboard";
import ManageTeachers from "./ManageTeachers";
import ManageStudents from "./ManageStudents";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout>
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<ManageTeachers />} />
          <Route path="students" element={<ManageStudents />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}
