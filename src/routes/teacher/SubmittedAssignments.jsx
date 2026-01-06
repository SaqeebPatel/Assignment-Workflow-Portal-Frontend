import React, { useState, useMemo, useEffect } from "react";
import { useGetAssignmentSubmissionsQuery, useReviewSubmissionMutation } from "../../services/submissionApiSlice";
import Button from "../../utils/Button";
import Card from "../../utils/Card";
import Modal from "../../utils/Modal";
import Pagination from "../../utils/Pagination";
import { 
  Search, 
  Filter, 
  Pencil, 
  Eye,
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  Award,
  MessageSquare,
  BookOpen,
  Target,
  TrendingUp,
  Sparkles
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const SubmittedAssignments = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    marksObtained: 0,
    teacherNote: "",
    reviewed: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: submissionsData, isLoading, refetch } = useGetAssignmentSubmissionsQuery();
  const [reviewSubmission, { isLoading: isReviewing }] = useReviewSubmissionMutation();

  const submissions = useMemo(() => {
    if (!submissionsData?.submissions) return [];

    return submissionsData.submissions
      .filter(sub => sub.isSubmitted)
      .map(sub => ({
        id: sub._id,
        student: sub.studentId,
        assignment: sub.assignmentId,
        marksObtained: sub.marksObtained,
        totalMarks: sub.totalMarks,
        reviewed: sub.reviewed,
        teacherNote: sub.teacherNote,
        submittedAt: sub.createdAt,
        answers: sub.answers
      }));
  }, [submissionsData]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch =
        sub.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "reviewed" && sub.reviewed) ||
        (filterStatus === "pending" && !sub.reviewed);

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, filterStatus]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Pagination
  const { paginatedSubmissions, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedSubmissions: filteredSubmissions.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE)
    };
  }, [filteredSubmissions, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReview = (submission) => {
    setSelectedSubmission(submission);
    setReviewData({
      marksObtained: submission.marksObtained,
      teacherNote: submission.teacherNote || "",
      reviewed: true
    });
    setReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      await reviewSubmission({
        submissionId: selectedSubmission.id,
        ...reviewData
      }).unwrap();

      setReviewModal(false);
      setSelectedSubmission(null);
      refetch();
    } catch (error) {
      console.error("Review failed:", error);
    }
  };

  const getStatusBadge = (submission) => {
    if (submission.reviewed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-success to-accent text-white rounded-full shadow-sm">
          <CheckCircle className="w-3 h-3" />
          <span className="hidden sm:inline">Reviewed</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
          <Clock className="w-3 h-3" />
          <span className="hidden sm:inline">Pending</span>
        </span>
      );
    }
  };

  const getMarksPercentage = (obtained, total) => {
    if (total === 0) return 0;
    return Math.round((obtained / total) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-success';
    if (percentage >= 50) return 'bg-primary';
    return 'bg-error';
  };

  const calculateStats = () => {
    const reviewed = submissions.filter(s => s.reviewed).length;
    const pending = submissions.length - reviewed;
    const totalMarks = submissions.reduce((sum, s) => sum + (s.marksObtained || 0), 0);
    return { reviewed, pending, totalMarks };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mb-3" />
        <span className="text-sm sm:text-base text-textSecondary">Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 bg-background min-h-screen">
      {/* Header Section with Stats */}
      <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-2 flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Submitted Assignments
            </h1>
            <p className="text-sm sm:text-base text-textSecondary">
              Review and grade student submissions
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-textPrimary">
                {submissions.length}
              </div>
              <div className="text-xs text-textSecondary">Total</div>
            </div>

            <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-success">
                {stats.reviewed}
              </div>
              <div className="text-xs text-textSecondary">Reviewed</div>
            </div>

            <div className="bg-background p-3 sm:p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {stats.pending}
              </div>
              <div className="text-xs text-textSecondary">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-2">
              Search Submissions
            </label>
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
              <input
                type="text"
                placeholder="Search by student name, email, or assignment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-2">
              Filter by Status
            </label>
            <div className="relative">
              <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none bg-white"
              >
                <option value="all">All Submissions</option>
                <option value="reviewed">Reviewed Only</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Display */}
      {paginatedSubmissions.length > 0 ? (
        <>
          {/* Desktop Table View - Hidden on mobile/tablet */}
          <div className="hidden lg:block bg-card rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gradient-to-r from-background to-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-textPrimary uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-textPrimary uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-textPrimary uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-textPrimary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-textPrimary uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-textPrimary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedSubmissions.map((submission) => {
                    const percentage = getMarksPercentage(submission.marksObtained, submission.totalMarks);
                    return (
                      <tr key={submission.id} className="hover:bg-background transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {submission.student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-textPrimary">
                                {submission.student.name}
                              </div>
                              <div className="text-xs text-textSecondary flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {submission.student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-textPrimary font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="line-clamp-1">{submission.assignment.title}</span>
                          </div>
                          <div className="text-xs text-textSecondary mt-0.5">
                            {submission.assignment.questions?.length || 0} questions
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-textSecondary" />
                              <span className="text-sm font-bold text-textPrimary">
                                {submission.marksObtained}/{submission.totalMarks}
                              </span>
                              <span className="text-xs text-textSecondary">
                                ({percentage}%)
                              </span>
                            </div>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${getProgressColor(percentage)}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(submission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            onClick={() => handleReview(submission)}
                            className="text-primary hover:text-white bg-primary/10 hover:bg-primary px-4 py-2 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm hover:shadow-md"
                          >
                            {submission.reviewed ? (
                              <>
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                Review
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {paginatedSubmissions.map((submission) => {
              const percentage = getMarksPercentage(submission.marksObtained, submission.totalMarks);
              return (
                <div
                  key={submission.id}
                  className="bg-card border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Gradient Top */}
                  <div className="h-1.5 bg-primary"></div>

                  <div className="p-4">
                    {/* Student Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-white font-bold text-base">
                              {submission.student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-textPrimary truncate">
                            {submission.student.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-textSecondary flex items-center gap-1 truncate mt-0.5">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{submission.student.email}</span>
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(submission)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2.5 mb-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-textSecondary block">
                            Assignment:
                          </span>
                          <span className="text-sm text-textPrimary font-semibold break-words">
                            {submission.assignment.title}
                          </span>
                          <span className="text-xs text-textSecondary block mt-0.5">
                            {submission.assignment.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-xs font-medium text-textSecondary block">
                            Submitted:
                          </span>
                          <span className="text-sm text-textPrimary font-medium">
                            {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Score Progress */}
                      <div className="bg-background p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-textSecondary flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" />
                            Performance
                          </span>
                          <span className="text-sm font-bold text-textPrimary">
                            {submission.marksObtained}/{submission.totalMarks} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${getProgressColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleReview(submission)}
                      className="w-full text-white bg-primary hover:bg-primary/90 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      {submission.reviewed ? (
                        <>
                          <Pencil className="w-4 h-4" />
                          Edit Review
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Review Now
                        </>
                      )}
                    </Button>
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
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters or search criteria."
              : "No assignments have been submitted yet. They will appear here once students submit."}
          </p>
        </div>
      )}

      {/* Review Modal */}
      <Modal open={reviewModal} onClose={() => setReviewModal(false)}>
        <div className="max-w-lg mx-auto px-4 sm:px-0">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-textPrimary">
              {selectedSubmission?.reviewed ? 'Edit Review' : 'Review Submission'}
            </h2>
          </div>

          {selectedSubmission && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-background to-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-textSecondary flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    Student
                  </span>
                  <p className="text-textPrimary font-medium">{selectedSubmission.student.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-textSecondary flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    Assignment
                  </span>
                  <p className="text-textPrimary font-medium line-clamp-2">{selectedSubmission.assignment.title}</p>
                </div>
                <div>
                  <span className="font-semibold text-textSecondary flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Submitted
                  </span>
                  <p className="text-textPrimary font-medium">
                    {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-textSecondary flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5" />
                    Current Score
                  </span>
                  <p className="text-textPrimary font-bold">
                    {selectedSubmission.marksObtained}/{selectedSubmission.totalMarks}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-textPrimary mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Marks Obtained *
              </label>
              <input
                type="number"
                min="0"
                max={selectedSubmission?.totalMarks || 0}
                value={reviewData.marksObtained}
                onChange={(e) => setReviewData({
                  ...reviewData,
                  marksObtained: parseInt(e.target.value) || 0
                })}
                className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-semibold"
                required
              />
              <p className="text-xs text-textSecondary mt-1.5 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Maximum marks: {selectedSubmission?.totalMarks || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-textPrimary mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Teacher Feedback
              </label>
              <textarea
                value={reviewData.teacherNote}
                onChange={(e) => setReviewData({
                  ...reviewData,
                  teacherNote: e.target.value
                })}
                rows={4}
                className="w-full p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                placeholder="Write constructive feedback for the student..."
              />
            </div>

            <div className="flex items-center p-3 bg-background rounded-lg">
              <input
                type="checkbox"
                id="reviewed"
                checked={reviewData.reviewed}
                onChange={(e) => setReviewData({
                  ...reviewData,
                  reviewed: e.target.checked
                })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="reviewed" className="ml-3 text-sm font-medium text-textPrimary flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                Mark as reviewed and notify student
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setReviewModal(false)}
                className="w-full sm:w-auto bg-textSecondary hover:bg-textSecondary/90 text-white px-6 py-2.5 rounded-lg font-semibold"
                disabled={isReviewing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isReviewing}
                className={`w-full sm:w-auto px-6 py-2.5 text-white font-bold rounded-lg inline-flex items-center justify-center gap-2 shadow-lg ${
                  isReviewing
                    ? "bg-textSecondary cursor-not-allowed"
                    : "bg-primary hover:from-primary/90 hover:to-accent/90"
                }`}
              >
                {isReviewing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isReviewing ? "Saving Review..." : "Save Review"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SubmittedAssignments;
