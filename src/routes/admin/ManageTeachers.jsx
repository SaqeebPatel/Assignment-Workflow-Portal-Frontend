import React, { useState, useMemo } from "react";
import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from "../../services/adminApiSlice";
import Button from "../../utils/Button";
import Card from "../../utils/Card";
import Modal from "../../utils/Modal";

export default function ManageTeachers() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    role: "teacher",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const itemsPerPage = 10;

  const {
    data: teachersData,
    isLoading,
    refetch,
  } = useGetTeachersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const filteredTeachers = useMemo(() => {
    if (!teachersData?.data) return [];
    return teachersData.data.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.designation &&
          teacher.designation.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [teachersData, searchTerm]);

  const totalPages = teachersData?.totalPages || 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isEditing && selectedTeacher) {
        await updateTeacher({
          id: selectedTeacher._id,
          ...teacherData,
          password: teacherData.password || undefined,
        }).unwrap();
        setSuccess("Teacher updated successfully!");
      } else {
        await createTeacher(teacherData).unwrap();
        setSuccess("Teacher created successfully!");
      }

      setModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      setError(
        err?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} teacher`
      );
    }
  };

  const resetForm = () => {
    setTeacherData({
      name: "",
      email: "",
      password: "",
      designation: "",
      role: "teacher",
    });
    setIsEditing(false);
    setSelectedTeacher(null);
    setError("");
    setSuccess("");
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setTeacherData({
      name: teacher.name,
      email: teacher.email,
      password: "",
      designation: teacher.designation || "",
      role: "teacher",
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (teacherId) => {
    try {
      await deleteTeacher(teacherId).unwrap();
      setSuccess("Teacher deleted successfully!");
      refetch();
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete teacher");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setTeacherData({
      ...teacherData,
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
            Teacher Management
          </h1>
          <p className="text-textSecondary mt-1">
            Manage teachers in the system
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold"
        >
          + Add Teacher
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
            placeholder="Search teachers by name, email, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <Card
        title={`Teachers (${filteredTeachers.length})`}
        description="All teachers in the system"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-textSecondary">Loading teachers...</span>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Teacher Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {teacher.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-textPrimary">
                              {teacher.name}
                            </div>
                            <div className="text-sm text-textSecondary">
                              ID: {teacher._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-textPrimary">
                          {teacher.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-textPrimary">
                          {teacher.designation || "Not specified"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(teacher)}
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
                  {Math.min(
                    currentPage * itemsPerPage,
                    teachersData?.total || 0
                  )}{" "}
                  of {teachersData?.total || 0} teachers
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
              {searchTerm ? "No teachers found" : "No teachers yet"}
            </h3>
            <p className="text-textSecondary mb-4">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Get started by adding your first teacher."}
            </p>
            {!searchTerm && (
              <Button
                onClick={openCreateModal}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
              >
                Add Teacher
              </Button>
            )}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">
            {isEditing ? "Edit Teacher" : "Add New Teacher"}
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
                value={teacherData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                placeholder="Enter teacher's full name"
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
                value={teacherData.email}
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
                value={teacherData.password}
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
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={teacherData.designation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                placeholder="e.g., Senior Teacher, Subject Head, etc."
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
                  ? "Update Teacher"
                  : "Create Teacher"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-textPrimary mb-4">
            Delete Teacher
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
