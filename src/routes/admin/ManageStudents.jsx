import React, { useState, useMemo } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../services/userApiSlice";

import Button from "../../utils/Button";
import Card from "../../utils/Card";
import Modal from "../../utils/Modal";

export default function ManageStudents() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  const itemsPerPage = 10;

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const filteredStudents = useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data
      .filter((user) => user.role === "student")
      .filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (student.rollNo &&
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (student.className &&
            student.className.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [usersData, searchTerm]);

  const totalPages = usersData?.totalPages || 1;

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">
            Student Management
          </h1>
          <p className="text-textSecondary mt-1">
            Manage students in the system
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold"
        >
          + Add Student
        </Button>
      </div>

      {error && (
        <div className="bg-error/10 text-error p-4 rounded-lg mb-4 border border-error/20">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-accent/10 text-accent p-4 rounded-lg mb-4 border border-accent/20">
          {success}
        </div>
      )}

      <div className="mb-6">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search students by name, email, roll number, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <Card
        title={`Students (${filteredStudents.length})`}
        description="All students in the system"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-textSecondary">Loading students...</span>
          </div>
        ) : filteredStudents.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Academic Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-textPrimary">
                              {student.name}
                            </div>
                            <div className="text-sm text-textSecondary">
                              ID: {student._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-textPrimary">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-textPrimary">
                          {student.rollNo && <div>Roll: {student.rollNo}</div>}
                          {student.className && (
                            <div>Class: {student.className}</div>
                          )}
                          {!student.rollNo && !student.className && (
                            <span className="text-textSecondary">
                              Not specified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(student)}
                            className="text-error hover:text-error/80 bg-error/10 hover:bg-error/20 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                <div className="text-sm text-textSecondary">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, usersData?.total || 0)}{" "}
                  of {usersData?.total || 0} students
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === page
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-textSecondary mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-textPrimary mb-2">
              {searchTerm ? "No students found" : "No students yet"}
            </h3>
            <p className="text-textSecondary mb-4">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Get started by adding your first student."}
            </p>
            {!searchTerm && (
              <Button
                onClick={openCreateModal}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
              >
                Add Student
              </Button>
            )}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">
            {isEditing ? "Edit Student" : "Add New Student"}
          </h2>

          {error && (
            <div className="bg-error/10 text-error p-4 rounded-lg mb-4 border border-error/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                placeholder="Enter student's full name"
                required
                disabled={isCreating || isUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={studentData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                placeholder="Enter email address"
                required
                disabled={isCreating || isUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">
                Password {isEditing ? "(leave empty to keep current)" : "*"}
              </label>
              <input
                type="password"
                name="password"
                value={studentData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
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
              <label className="block text-sm font-medium text-textPrimary mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNo"
                value={studentData.rollNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                placeholder="Enter roll number (optional)"
                disabled={isCreating || isUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">
                Class
              </label>
              <input
                type="text"
                name="className"
                value={studentData.className}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                placeholder="Enter class name (optional)"
                disabled={isCreating || isUpdating}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-textSecondary hover:bg-textSecondary/90 text-white px-4 py-2 rounded-lg"
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className={`px-6 py-2 text-white font-bold rounded-lg ${
                  isCreating || isUpdating
                    ? "bg-textSecondary cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
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
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-textPrimary mb-4">
            Delete Student
          </h2>
          <p className="text-textSecondary mb-6">
            Are you sure you want to delete{" "}
            <strong>{deleteConfirm?.name}</strong>? This action cannot be undone
            and will remove all associated data.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setDeleteConfirm(null)}
              className="bg-textSecondary hover:bg-textSecondary/90 text-white px-4 py-2 rounded-lg"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(deleteConfirm._id)}
              disabled={isDeleting}
              className={`px-4 py-2 text-white font-bold rounded-lg ${
                isDeleting
                  ? "bg-textSecondary cursor-not-allowed"
                  : "bg-error hover:bg-error/90"
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
