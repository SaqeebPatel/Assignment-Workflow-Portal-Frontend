import { useState, useMemo } from "react";
import {
  Edit2,
  Save,
  Clock,
  Award,
  MessageSquare,
  CheckCircle2,
  XCircle,
  BookOpen,
  User,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  FileText,
  Target,
  X,
} from "lucide-react";
import {
  useGetAssignmentSubmissionsQuery,
  useReviewSubmissionMutation,
} from "../../services/submissionApiSlice";
import Pagination from "../../utils/Pagination";

const ITEMS_PER_PAGE = 1; // Items per page

export default function AssignmentsReview() {
  const [editingReview, setEditingReview] = useState(null);
  const [reviewMarks, setReviewMarks] = useState({});
  const [reviewNotes, setReviewNotes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, refetch } = useGetAssignmentSubmissionsQuery();
  const [reviewSubmission, { isLoading: isSaving }] = useReviewSubmissionMutation();

  const submissions = data?.submissions || [];

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const studentName = submission.studentId?.name?.toLowerCase() || "";
      const matchesSearch = studentName.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "reviewed" && submission.reviewed) ||
        (statusFilter === "pending" && !submission.reviewed);
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  // Pagination
  const { paginatedSubmissions, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedSubmissions: filteredSubmissions.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE),
    };
  }, [filteredSubmissions, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setEditingReview(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getQuestionsForSubmission = (submission) =>
    submission.assignmentId?.questions || [];

  const isAnswerCorrect = (questionIdx, submission) => {
    const studentAnswer = submission.answers?.[questionIdx.toString()];
    const questions = getQuestionsForSubmission(submission);
    const correctAnswer = questions[questionIdx]?.answer;

    if (!studentAnswer || !correctAnswer) return false;

    const normalize = (str) => String(str).trim().toLowerCase();
    return normalize(studentAnswer) === normalize(correctAnswer);
  };

  const handleSaveReview = async (submission) => {
    try {
      await reviewSubmission({
        submissionId: submission._id,
        marksObtained: parseInt(reviewMarks[submission._id]) || 0,
        teacherNote: reviewNotes[submission._id] || "",
        reviewed: true,
      }).unwrap();
      refetch();
      setEditingReview(null);
      setReviewMarks({});
      setReviewNotes({});
    } catch (err) {
      alert("Failed to save review");
    }
  };

  const calculateStats = () => {
    const totalMarks = submissions.reduce((sum, s) => sum + (s.totalMarks || 0), 0);
    const obtainedMarks = submissions.reduce((sum, s) => sum + (s.marksObtained || 0), 0);
    const reviewed = submissions.filter((s) => s.reviewed).length;
    return { totalMarks, obtainedMarks, reviewed };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mb-4" />
        <p className="text-textSecondary text-sm sm:text-base">
          Loading submissions...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-2 flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Submissions Review
            </h1>
            <p className="text-sm sm:text-base text-textSecondary">
              Review and grade student submissions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-textPrimary">
                {submissions.length}
              </div>
              <div className="text-xs text-textSecondary">Total</div>
            </div>

            <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-success">
                {stats.reviewed}
              </div>
              <div className="text-xs text-textSecondary">Reviewed</div>
            </div>

            <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-4 h-4 text-accent" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-textPrimary">
                {stats.obtainedMarks}/{stats.totalMarks}
              </div>
              <div className="text-xs text-textSecondary">Marks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="relative">
            <Target className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none bg-white"
            >
              <option value="all">All Submissions</option>
              <option value="reviewed">Reviewed</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {paginatedSubmissions.length > 0 ? (
        <>
          <div className="space-y-4 sm:space-y-5">
            {paginatedSubmissions.map((submission) => {
              const student = submission.studentId;
              const answersObj = submission.answers || {};
              const isEditing = editingReview === submission._id;

              return (
                <div
                  key={submission._id}
                  className="bg-card rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200"
                >
                  {/* Top Gradient */}
                  <div className="h-1.5 bg-primary"></div>

                  {/* Student Header */}
                  <div className="bg-gradient-to-r from-background to-gray-50 p-4 sm:p-5 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-base sm:text-lg">
                            {student?.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-textPrimary text-base sm:text-lg">
                            {student?.name || "Unknown Student"}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-textSecondary">
                            <Mail className="w-3 h-3" />
                            {student?.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-textSecondary mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`px-4 py-2 rounded-lg text-center ${
                            submission.reviewed
                              ? "bg-success/10 text-success"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <div className="text-xl sm:text-2xl font-bold">
                            {submission.marksObtained || 0}/{submission.totalMarks || 0}
                          </div>
                          <div className="text-xs font-medium">
                            {submission.reviewed ? "Reviewed" : "Pending"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Title */}
                  <div className="px-4 sm:px-5 py-3 bg-background border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-textPrimary text-sm sm:text-base">
                        {submission.assignmentId?.title || "Untitled Assignment"}
                      </h3>
                    </div>
                  </div>

                  {/* Questions & Answers */}
                  <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                    {getQuestionsForSubmission(submission).map((question, qIdx) => {
                      const studentAnswer = answersObj[qIdx.toString()];
                      const isCorrect = isAnswerCorrect(qIdx, submission);

                      return (
                        <div
                          key={question._id || qIdx}
                          className="bg-background rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                                {qIdx + 1}
                              </span>
                              <div className="flex-1">
                                <h4 className="font-semibold text-textPrimary text-sm sm:text-base leading-tight">
                                  {question.question}
                                </h4>
                                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold mt-1">
                                  <Award className="w-3 h-3" />
                                  {question.marks || 1} marks
                                </span>
                              </div>
                            </div>

                            <span
                              className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isCorrect
                                  ? "bg-success text-white"
                                  : "bg-error/10 text-error"
                              }`}
                            >
                              {isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  Correct
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Wrong
                                </>
                              )}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-textSecondary uppercase mb-1.5">
                                Student Answer:
                              </p>
                              <div
                                className={`p-3 rounded-lg text-sm border ${
                                  isCorrect
                                    ? "bg-success/5 border-success/20"
                                    : "bg-error/5 border-error/20"
                                }`}
                              >
                                {Array.isArray(studentAnswer)
                                  ? studentAnswer.join(", ")
                                  : studentAnswer || (
                                      <em className="text-textSecondary">No answer</em>
                                    )}
                              </div>
                            </div>

                            {question.answer && (
                              <div>
                                <p className="text-xs font-semibold text-success uppercase mb-1.5">
                                  Correct Answer:
                                </p>
                                <div className="p-3 rounded-lg text-sm bg-success/5 border border-success/20">
                                  {Array.isArray(question.answer)
                                    ? question.answer.join(", ")
                                    : question.answer}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Review Section */}
                  <div className="p-4 sm:p-5 lg:p-6 bg-background border-t border-gray-200">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-textPrimary mb-2 flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-primary" />
                              Final Marks
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={submission.totalMarks}
                              value={
                                reviewMarks[submission._id] ??
                                submission.marksObtained ??
                                0
                              }
                              onChange={(e) =>
                                setReviewMarks({
                                  ...reviewMarks,
                                  [submission._id]: e.target.value,
                                })
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base sm:text-lg font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-textPrimary mb-2 flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-primary" />
                              Teacher Note
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Write feedback..."
                              value={
                                reviewNotes[submission._id] ??
                                submission.teacherNote ??
                                ""
                              }
                              onChange={(e) =>
                                setReviewNotes({
                                  ...reviewNotes,
                                  [submission._id]: e.target.value,
                                })
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                          <button
                            onClick={() => {
                              setEditingReview(null);
                              setReviewMarks({});
                              setReviewNotes({});
                            }}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-textSecondary text-white hover:bg-textSecondary/90 transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveReview(submission)}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save Review
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          {submission.teacherNote ? (
                            <div className="bg-primary/10 border border-primary/20 p-3 sm:p-4 rounded-lg">
                              <div className="font-semibold text-textPrimary text-xs sm:text-sm mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Teacher Feedback
                              </div>
                              <p className="text-sm text-textSecondary italic">
                                "{submission.teacherNote}"
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-textSecondary italic">
                              No feedback provided yet
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => setEditingReview(submission._id)}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                          {submission.reviewed ? "Edit Review" : "Add Review"}
                        </button>
                      </div>
                    )}
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
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-md border-2 border-dashed border-gray-200 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-4">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-2">
            No Submissions Found
          </h3>
          <p className="text-sm sm:text-base text-textSecondary max-w-md mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Students haven't submitted any assignments yet."}
          </p>
        </div>
      )}
    </div>
  );
}
