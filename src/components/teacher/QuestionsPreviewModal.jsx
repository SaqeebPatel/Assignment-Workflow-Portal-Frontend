import { FiX } from "react-icons/fi";

const QuestionsPreviewModal = ({
  isOpen,
  onClose,
  questions = [],
  assignmentTitle = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-lg max-h-[70vh] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-textPrimary">
              Assignment Questions
            </h3>
            <p className="text-sm text-textSecondary">{assignmentTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-200 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[55vh] space-y-4">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-textPrimary">
                    Q{index + 1}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {q.marks || 1} marks
                  </span>
                </div>

                <p className="text-sm font-medium text-textPrimary">
                  {q.question}
                </p>

                {q.answer && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">Answer:</span> {q.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-textSecondary py-8">
              No questions & answers available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPreviewModal;
