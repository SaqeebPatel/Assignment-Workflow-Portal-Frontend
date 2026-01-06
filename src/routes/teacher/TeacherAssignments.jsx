import { useState, useMemo } from "react";
import {
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Search,
  Filter,
  BookOpen,
  Calendar,
  FileText,
  Loader2,
  AlertTriangle,
  X,
  Target,
  CheckCircle2,
} from "lucide-react";
import {
  useGetAssignmentsQuery,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} from "../../services/assignmentApiSlice";
import AddAssignmentModal from "../../components/teacher/AddAssignmentModal";
import EditAssignmentModal from "../../components/teacher/EditAssignmentModal";
import QuestionsPreviewModal from "../../components/teacher/QuestionsPreviewModal";
import Pagination from "../../utils/Pagination";

const ITEMS_PER_PAGE = 3; // 3x3 grid

const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-textPrimary">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-textSecondary mt-2">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-textPrimary hover:bg-background transition-colors text-sm sm:text-base font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm sm:text-base font-semibold"
          >
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TeacherAssignments() {
  const {
    data: assignments = [],
    isLoading,
    refetch,
  } = useGetAssignmentsQuery();

  const [deleteAssignment] = useDeleteAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [assignments, search, statusFilter]);

  // Reset to page 1 when filters change
  useState(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Pagination
  const { paginatedAssignments, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedAssignments: filteredAssignments.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE),
    };
  }, [filteredAssignments, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    refetch();
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingAssignment(null);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setIsEditModalOpen(true);
  };

  const handleViewQuestions = (assignment) => {
    setSelectedAssignment(assignment);
    setShowQuestionsModal(true);
  };

  const handleDeleteClick = (assignment) => {
    setConfirmModal({
      open: true,
      title: "Delete Assignment",
      message: `Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteAssignment(assignment._id).unwrap();
          refetch();
        } catch {
          alert("Error deleting assignment");
        } finally {
          setConfirmModal({ open: false });
        }
      },
    });
  };

  const handleTogglePublishClick = (assignment) => {
    const newStatus = assignment.status === "published" ? "draft" : "published";

    setConfirmModal({
      open: true,
      title:
        assignment.status === "published"
          ? "Unpublish Assignment"
          : "Publish Assignment",
      message: `Are you sure you want to ${
        assignment.status === "published" ? "unpublish" : "publish"
      } "${assignment.title}"?`,
      onConfirm: async () => {
        try {
          await updateAssignment({
            id: assignment._id,
            status: newStatus,
          }).unwrap();
          refetch();
        } catch {
          alert("Error updating status");
        } finally {
          setConfirmModal({ open: false });
        }
      },
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: FileText,
      },
      published: {
        bg: "bg-success/10",
        text: "text-success",
        icon: CheckCircle2,
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: Target,
      },
    };

    const style = styles[status] || styles.draft;
    const Icon = style.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Assignments Management
            </h1>
            <p className="text-sm sm:text-base text-textSecondary mt-1">
              {filteredAssignments.length} assignment
              {filteredAssignments.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Assignment
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mb-3" />
          <p className="text-textSecondary text-sm sm:text-base">
            Loading assignments...
          </p>
        </div>
      ) : paginatedAssignments.length > 0 ? (
        <>
          {/* Assignment Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {paginatedAssignments.map((a) => {
              const isDeleteDisabled = a.status === "published";

              return (
                <div
                  key={a._id}
                  className="group bg-card rounded-xl sm:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Gradient Top Bar */}
                  <div className="h-1.5 bg-primary"></div>

                  <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-textPrimary line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      {getStatusBadge(a.status)}
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-textSecondary line-clamp-2 min-h-[2.5rem]">
                      {a.description || "No description provided"}
                    </p>

                    {/* Due Date */}
                    {a.dueDate && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm bg-background px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-textSecondary font-medium">
                          Due:{" "}
                        </span>
                        <span className="text-textPrimary font-semibold">
                          {new Date(a.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Questions Count */}
                    {a.questions?.length > 0 && (
                      <button
                        onClick={() => handleViewQuestions(a)}
                        className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        {a.questions.length} Question
                        {a.questions.length !== 1 ? "s" : ""}
                      </button>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleTogglePublishClick(a)}
                        className={`flex-1 p-2.5 rounded-lg transition-all ${
                          a.status === "published"
                            ? "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20"
                            : "text-success hover:text-success/80 bg-success/10 hover:bg-success/20"
                        }`}
                        title={
                          a.status === "published" ? "Unpublish" : "Publish"
                        }
                      >
                        {a.status === "published" ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                        )}
                      </button>

                      <button
                        onClick={() => handleEdit(a)}
                        className="flex-1 p-2.5 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>

                      <button
                        disabled={isDeleteDisabled}
                        onClick={() => !isDeleteDisabled && handleDeleteClick(a)}
                        className={`flex-1 p-2.5 rounded-lg transition-all ${
                          isDeleteDisabled
                            ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-50"
                            : "text-error hover:text-error/80 bg-error/10 hover:bg-error/20"
                        }`}
                        title={isDeleteDisabled ? "Cannot delete published assignment" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        /* Empty State */
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-md border border-gray-200 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-2">
            No assignments found
          </h3>
          <p className="text-sm sm:text-base text-textSecondary max-w-md mx-auto mb-6">
            {search || statusFilter
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first assignment."}
          </p>
          {!search && !statusFilter && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-white rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Assignment
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddAssignmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditAssignmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        assignment={editingAssignment}
        onSuccess={handleSuccess}
      />

      <QuestionsPreviewModal
        isOpen={showQuestionsModal}
        onClose={() => setShowQuestionsModal(false)}
        questions={selectedAssignment?.questions || []}
        assignmentTitle={selectedAssignment?.title || ""}
      />

      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ open: false })}
      />
    </div>
  );
}
