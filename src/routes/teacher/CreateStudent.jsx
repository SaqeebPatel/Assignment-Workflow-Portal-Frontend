import React, { useState } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../services/userApiSlice";
import Button from "../../utils/Button";
import Card from "../../utils/Card";
import Modal from "../../utils/Modal";
import { 
  UserPlus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Users as UsersIcon,
  Mail,
  GraduationCap,
  IdCard
} from "lucide-react";

export default function CreateStudent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    className: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const {
    data: users,
    refetch,
    isLoading: isLoadingUsers,
  } = useGetUsersQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isEditing && selectedStudent) {
        await updateUser({
          id: selectedStudent._id,
          ...studentData,
          password: studentData.password || undefined,
        }).unwrap();
        setSuccess("Student updated successfully!");
      } else {
        await createUser(studentData).unwrap();
        setSuccess("Student created successfully!");
      }

      setModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      setError(
        err?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} student`
      );
    }
  };

  const resetForm = () => {
    setStudentData({
      name: "",
      email: "",
      password: "",
      rollNo: "",
      className: "",
      role: "student",
    });
    setIsEditing(false);
    setSelectedStudent(null);
    setError("");
    setSuccess("");
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setStudentData({
      name: student.name,
      email: student.email,
      password: "",
      rollNo: student.rollNo || "",
      className: student.className || "",
      role: "student",
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    try {
      await deleteUser(studentId).unwrap();
      setSuccess("Student deleted successfully!");
      refetch();
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete student");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const students = users?.filter((user) => user.role === "student") || [];

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Student Management
        </h1>
        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Student
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-lg mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-3 sm:p-4 rounded-lg mb-4 text-sm sm:text-base">
          {success}
        </div>
      )}

      <Card
        title={`Students (${students.length})`}
        description="Manage your students"
      >
        {isLoadingUsers ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Loading students...</p>
          </div>
        ) : students.length > 0 ? (
          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {student._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.rollNo && (
                            <div className="flex items-center gap-2">
                              <IdCard className="w-4 h-4 text-gray-400" />
                              Roll: {student.rollNo}
                            </div>
                          )}
                          {student.className && (
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              Class: {student.className}
                            </div>
                          )}
                          {!student.rollNo && !student.className && (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1.5"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(student)}
                            className="text-error hover:text-error/80 bg-error/10 hover:bg-error/20 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View - Shown on small and medium screens */}
            <div className="lg:hidden space-y-4">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-base sm:text-lg">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {student.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          ID: {student._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-500 block">
                          Email:
                        </span>
                        <span className="text-xs sm:text-sm text-gray-900 break-all">
                          {student.email}
                        </span>
                      </div>
                    </div>
                    {student.rollNo && (
                      <div className="flex items-start gap-2">
                        <IdCard className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-500 block">
                            Roll No:
                          </span>
                          <span className="text-xs sm:text-sm text-gray-900">
                            {student.rollNo}
                          </span>
                        </div>
                      </div>
                    )}
                    {student.className && (
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-500 block">
                            Class:
                          </span>
                          <span className="text-xs sm:text-sm text-gray-900">
                            {student.className}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(student)}
                      className="flex-1 text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(student)}
                      className="flex-1 text-error hover:text-error/80 bg-error/10 hover:bg-error/20 px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-gray-400 mb-4">
              <UsersIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No students yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Get started by adding your first student.
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-w-md mx-auto px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            {isEditing ? "Edit Student" : "Add New Student"}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-lg mb-4 text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter student's full name"
                required
                disabled={isCreating || isUpdating}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={studentData.email}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter email address"
                required
                disabled={isCreating || isUpdating}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password {isEditing ? "(leave empty to keep current)" : "*"}
              </label>
              <input
                type="password"
                name="password"
                value={studentData.password}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder={
                  isEditing
                    ? "Leave empty to keep current password"
                    : "Enter password"
                }
                required={!isEditing}
                disabled={isCreating || isUpdating}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNo"
                value={studentData.rollNo}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter roll number (optional)"
                disabled={isCreating || isUpdating}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <input
                type="text"
                name="className"
                value={studentData.className}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter class name (optional)"
                disabled={isCreating || isUpdating}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
              <Button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-textSecondary hover:bg-textSecondary/90 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className={`px-4 sm:px-6 py-2 text-white font-bold rounded-lg text-sm sm:text-base w-full sm:w-auto inline-flex items-center justify-center gap-2 ${
                  isCreating || isUpdating
                    ? "bg-textSecondary cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isCreating
                  ? "Creating..."
                  : isUpdating
                  ? "Updating..."
                  : isEditing
                  ? "Update Student"
                  : "Create Student"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <div className="max-w-md mx-auto px-4 sm:px-0">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Delete Student
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Are you sure you want to delete{" "}
            <strong>{deleteConfirm?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <Button
              onClick={() => setDeleteConfirm(null)}
              className="bg-textSecondary hover:bg-textSecondary/90 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(deleteConfirm._id)}
              disabled={isDeleting}
              className={`px-4 py-2 text-white font-bold rounded-lg text-sm sm:text-base w-full sm:w-auto inline-flex items-center justify-center gap-2 ${
                isDeleting
                  ? "bg-textSecondary cursor-not-allowed"
                  : "bg-error hover:bg-error/90"
              }`}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
