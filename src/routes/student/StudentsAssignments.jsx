import { useState, Fragment, useMemo, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useGetAssignmentForStudentQuery } from "../../services/assignmentApiSlice";
import { useSubmitAssignmentMutation } from "../../services/submissionApiSlice";
import Pagination from "../../utils/Pagination"; 
import {
  Search,
  FileText,
  Calendar,
  Award,
  CheckCircle2,
  Send,
  X,
  Clock,
  BookOpen,
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react";

const ITEMS_PER_PAGE = 6; 

export default function StudentsAssignments() {
  const { data: assignments = [], isLoading } =
    useGetAssignmentForStudentQuery();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [submitAssignment] = useSubmitAssignmentMutation();

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return Array.isArray(assignments)
      ? assignments.filter((a) => {
          const matchSearch = a.title
            ?.toLowerCase()
            .includes(search.toLowerCase());
          const matchStatus = statusFilter ? a.status === statusFilter : true;
          return matchSearch && matchStatus;
        })
      : [];
  }, [assignments, search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const { paginatedAssignments, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedAssignments: filteredAssignments.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE)
    };
  }, [filteredAssignments, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    const initialAnswers = {};
    assignment.questions?.forEach((q, idx) => {
      initialAnswers[idx] = "";
    });
    setAnswers(initialAnswers);
    setSubmitError("");
  };

  const handleCloseSubmitModal = () => {
    setSelectedAssignment(null);
    setAnswers({});
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const answersArray = selectedAssignment.questions.map(
        (_, idx) => answers[idx] || ""
      );

      await submitAssignment({
        assignmentId: selectedAssignment._id,
        answers: answersArray,
      }).unwrap();

      handleCloseSubmitModal();
    } catch (err) {
      setSubmitError(
        err?.data?.message || "Failed to submit assignment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary flex items-center gap-2">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            My Assignments
          </h1>
          <p className="text-sm sm:text-base text-textSecondary mt-1">
            {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search assignments by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mb-3" />
          <p className="text-textSecondary text-base sm:text-lg">Loading assignments...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-4">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-textPrimary mb-2">
            No assignments found
          </h3>
          <p className="text-sm sm:text-base text-textSecondary max-w-md mx-auto">
            {search
              ? "Try adjusting your search terms."
              : "You're all caught up! No assignments are available right now."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {paginatedAssignments.map((a) => {
              const totalQuestions = a.questions?.length || 0;
              const overdueStatus = isOverdue(a.dueDate);

              return (
                <div
                  key={a._id}
                  className="group bg-card rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="h-2 bg-primary"></div>
                  
                  <div className="p-4 sm:p-5 lg:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-textPrimary text-base sm:text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                      </div>
                      {a.isSubmitted && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-success bg-success/10 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Done</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-textSecondary line-clamp-2 min-h-[2.5rem]">
                      {a.description || "No description provided"}
                    </p>

                    <div className={`flex items-center gap-2 text-xs sm:text-sm px-3 py-2 rounded-lg ${
                      overdueStatus 
                        ? 'bg-error/10 text-error' 
                        : 'bg-background text-textSecondary'
                    }`}>
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">
                        {overdueStatus ? 'Overdue: ' : 'Due: '}
                      </span>
                      <span className="font-semibold">
                        {a.dueDate
                          ? new Date(a.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : "No due date"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-textSecondary">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-textPrimary">{totalQuestions}</span>
                          {' '}{totalQuestions === 1 ? "Question" : "Questions"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-textSecondary">
                        <Award className="w-4 h-4 text-accent" />
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-textPrimary">{a.totalMarks}</span>
                          {' '}Marks
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      {a.status === "published" ? (
                        a.isSubmitted ? (
                          <button
                            type="button"
                            disabled
                            className="w-full text-xs sm:text-sm font-semibold text-white bg-textSecondary/60 px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Already Submitted
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenSubmitModal(a)}
                            className="w-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary/90 hover:shadow-lg px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
                          >
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            Submit Assignment
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full text-xs sm:text-sm font-semibold text-textSecondary bg-background px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          Not Published
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Transition show={!!selectedAssignment} as={Fragment}>
        <Dialog onClose={handleCloseSubmitModal} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl overflow-hidden rounded-xl sm:rounded-2xl bg-card shadow-2xl">
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-primary to-gray-300 px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Dialog.Title className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Submit Assignment
                        </Dialog.Title>
                        <p className="text-xs sm:text-sm text-black/90 mt-1 line-clamp-1">
                          {selectedAssignment?.title}
                        </p>
                      </div>
                      <button
                        onClick={handleCloseSubmitModal}
                        className="flex-shrink-0 text-black hover:text-red-600 hover:bg-white/20 p-1.5 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[60vh] sm:max-h-96 overflow-y-auto">
                    {submitError && (
                      <div className="rounded-lg bg-error/10 p-3 sm:p-4 text-sm border border-error/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                        <p className="text-error flex-1">{submitError}</p>
                      </div>
                    )}

                    {selectedAssignment?.questions?.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-textSecondary mx-auto mb-3" />
                        <p className="text-textSecondary">
                          No questions in this assignment.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 sm:space-y-5">
                        {selectedAssignment?.questions?.map((q, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-primary/30 transition-colors bg-background/50"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <h4 className="font-semibold text-sm sm:text-base text-textPrimary flex-1">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold mr-2">
                                  {idx + 1}
                                </span>
                                {q.question}
                              </h4>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full flex-shrink-0 self-start">
                                <Award className="w-3 h-3" />
                                {q.marks} marks
                              </span>
                            </div>
                            <textarea
                              value={answers[idx] || ""}
                              onChange={(e) =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [idx]: e.target.value,
                                }))
                              }
                              placeholder="Write your answer here..."
                              rows={3}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-200 bg-background/50 px-4 sm:px-6 py-3 sm:py-4">
                    <button
                      type="button"
                      onClick={handleCloseSubmitModal}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-sm font-semibold text-textPrimary bg-card border border-gray-300 rounded-lg hover:bg-background disabled:opacity-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 transition-all inline-flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Assignment
                        </>
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
