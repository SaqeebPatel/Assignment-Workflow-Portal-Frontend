import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  ChevronDown,
  FileText,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Award,
  Loader2,
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useGetMySubmissionResultsStudentQuery } from "../../services/submissionApiSlice";
import Pagination from "../../utils/Pagination";

const ITEMS_PER_PAGE = 2; // Items per page

const SubmitAssignment = () => {
  const { data, isLoading, error } = useGetMySubmissionResultsStudentQuery();
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const assignments = data?.assignments || [];

  // Pagination logic with useMemo for performance
  const { paginatedAssignments, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedAssignments: assignments.slice(startIndex, endIndex),
      totalPages: Math.ceil(assignments.length / ITEMS_PER_PAGE),
    };
  }, [assignments, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedAssignment(null); // Close expanded cards on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAssignment = (assignmentId) => {
    setExpandedAssignment(
      expandedAssignment === assignmentId ? null : assignmentId
    );
  };

  const getStatusBadge = (reviewed, dueDate) => {
    const isPastDue = new Date(dueDate) < new Date();

    if (reviewed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-success to-accent text-white shadow-sm">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reviewed</span>
        </span>
      );
    }
    if (isPastDue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
          <Clock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pending Review</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Submitted</span>
      </span>
    );
  };

  const calculateTotalMarks = (questions) => {
    return questions.reduce(
      (total, question) => total + (question.marks || 0),
      0
    );
  };

  const calculatePercentage = (obtained, total) => {
    return total > 0 ? ((obtained / total) * 100).toFixed(1) : 0;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 75) return "text-success";
    if (percentage >= 50) return "text-primary";
    return "text-error";
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 75) return "bg-success/10";
    if (percentage >= 50) return "bg-primary/10";
    return "bg-error/10";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mb-4" />
        <p className="text-textSecondary text-sm sm:text-base">
          Loading your submissions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-error/10 border-l-4 border-error p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-error font-semibold">Error loading submissions</p>
            <p className="text-error/80 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with gradient */}
        <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-textPrimary flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                My Submissions
              </h1>
              <p className="text-sm sm:text-base text-textSecondary mt-2">
                Track your assignment submissions and grades
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-primary/10 px-4 py-3 rounded-lg">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <div>
                <p className="text-xs text-textSecondary font-medium">
                  Total Submitted
                </p>
                <p className="text-xl sm:text-2xl font-bold text-primary">
                  {data?.totalAssignments || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {paginatedAssignments.length > 0 ? (
          <>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {paginatedAssignments.map((assignment) => {
                const isExpanded = expandedAssignment === assignment.assignmentId;
                const totalMarks = calculateTotalMarks(assignment.questions);
                const percentage = calculatePercentage(
                  assignment.marksObtained,
                  totalMarks
                );

                return (
                  <div
                    key={assignment.assignmentId}
                    className="bg-card rounded-xl sm:rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30"
                  >
                    {/* Top gradient accent */}
                    <div className="h-1.5 bg-primary"></div>

                    <div
                      className="p-4 sm:p-5 lg:p-6 cursor-pointer"
                      onClick={() => toggleAssignment(assignment.assignmentId)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <h2 className="text-lg sm:text-xl font-bold text-textPrimary line-clamp-1 flex-1">
                              {assignment.title}
                            </h2>
                            {getStatusBadge(
                              assignment.reviewed,
                              assignment.dueDate
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-textSecondary mb-3 sm:mb-4 line-clamp-2">
                            {assignment.description}
                          </p>

                          {/* Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 text-xs sm:text-sm bg-background px-3 py-2 rounded-lg">
                              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                              <div>
                                <span className="text-textSecondary font-medium">
                                  Due:{" "}
                                </span>
                                <span className="text-textPrimary font-semibold">
                                  {new Date(
                                    assignment.dueDate
                                  ).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs sm:text-sm bg-background px-3 py-2 rounded-lg">
                              <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                              <div>
                                <span className="text-textSecondary font-medium">
                                  Submitted:{" "}
                                </span>
                                <span className="text-textPrimary font-semibold">
                                  {new Date(
                                    assignment.submittedAt
                                  ).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Score Card */}
                        <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
                          <div
                            className={`${
                              assignment.reviewed
                                ? getScoreBgColor(percentage)
                                : "bg-gray-100"
                            } rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[120px] sm:min-w-[140px]`}
                          >
                            {assignment.reviewed ? (
                              <>
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-textSecondary" />
                                  <span className="text-xs font-medium text-textSecondary">
                                    Score
                                  </span>
                                </div>
                                <div
                                  className={`text-2xl sm:text-3xl font-bold ${getScoreColor(
                                    percentage
                                  )}`}
                                >
                                  {assignment.marksObtained}
                                  <span className="text-base sm:text-lg text-textSecondary">
                                    /{totalMarks}
                                  </span>
                                </div>
                                <div
                                  className={`text-xs sm:text-sm font-semibold mt-1 ${getScoreColor(
                                    percentage
                                  )}`}
                                >
                                  {percentage}%
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-textSecondary" />
                                  <span className="text-xs font-medium text-textSecondary">
                                    Total
                                  </span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-textPrimary">
                                  {totalMarks}
                                </div>
                                <div className="text-xs text-textSecondary mt-1">
                                  Marks
                                </div>
                              </>
                            )}
                          </div>

                          <button className="lg:mt-2">
                            <ChevronDown
                              className={`w-5 h-5 text-primary transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-background p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
                        {/* Teacher Feedback */}
                        {assignment.reviewed && assignment.teacherNote && (
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-primary p-3 sm:p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs sm:text-sm font-bold text-textPrimary mb-1">
                                  Teacher's Feedback
                                </p>
                                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                                  {assignment.teacherNote}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Questions Section */}
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-textPrimary mb-3 sm:mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            {assignment.reviewed
                              ? "Questions & Answers"
                              : "Your Submitted Answers"}
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            {assignment.questions.map((question, index) => (
                              <div
                                key={question.questionId}
                                className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200 hover:border-primary/30 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <h4 className="text-xs sm:text-sm font-semibold text-textPrimary flex-1">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold mr-2">
                                      {index + 1}
                                    </span>
                                    {question.questionText}
                                  </h4>
                                  <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                                    <Award className="w-3 h-3" />
                                    {question.marks}
                                  </span>
                                </div>

                                {/* Student Answer */}
                                <div className="mb-3">
                                  <p className="text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1.5">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Your Answer:
                                  </p>
                                  <p className="text-xs sm:text-sm text-textPrimary bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {question.studentAnswer}
                                  </p>
                                </div>

                                {/* Correct Answer */}
                                {assignment.reviewed &&
                                  question.correctAnswer && (
                                    <div>
                                      <p className="text-xs font-semibold text-success mb-1.5 flex items-center gap-1.5">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Correct Answer:
                                      </p>
                                      <p className="text-xs sm:text-sm text-textPrimary bg-success/5 p-3 rounded-lg border border-success/20">
                                        {question.correctAnswer}
                                      </p>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-card to-primary/5 border border-gray-200 rounded-xl p-4 sm:p-5">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="text-center p-3 bg-background rounded-lg">
                              <p className="text-xs text-textSecondary font-medium mb-1">
                                Questions
                              </p>
                              <p className="text-lg sm:text-xl font-bold text-textPrimary">
                                {assignment.questions.length}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-background rounded-lg">
                              <p className="text-xs text-textSecondary font-medium mb-1">
                                Total Marks
                              </p>
                              <p className="text-lg sm:text-xl font-bold text-textPrimary">
                                {totalMarks}
                              </p>
                            </div>
                            {assignment.reviewed && (
                              <>
                                <div className="text-center p-3 bg-background rounded-lg">
                                  <p className="text-xs text-textSecondary font-medium mb-1">
                                    Obtained
                                  </p>
                                  <p
                                    className={`text-lg sm:text-xl font-bold ${getScoreColor(
                                      percentage
                                    )}`}
                                  >
                                    {assignment.marksObtained}
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-background rounded-lg">
                                  <p className="text-xs text-textSecondary font-medium mb-1 flex items-center justify-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Score
                                  </p>
                                  <p
                                    className={`text-lg sm:text-xl font-bold ${getScoreColor(
                                      percentage
                                    )}`}
                                  >
                                    {percentage}%
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Pending Review Notice */}
                        {!assignment.reviewed && (
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-primary p-3 sm:p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-textPrimary mb-1">
                                  Awaiting Review
                                </p>
                                <p className="text-xs sm:text-sm text-textSecondary">
                                  Your assignment has been submitted and is
                                  awaiting teacher review. Scores and feedback
                                  will be visible once the review is complete.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-2">
              No Submissions Yet
            </h3>
            <p className="text-sm sm:text-base text-textSecondary max-w-md mx-auto">
              You haven't submitted any assignments yet. Start working on your
              assignments to see them here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitAssignment;
