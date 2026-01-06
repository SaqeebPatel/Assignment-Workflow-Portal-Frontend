import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import { useCreateAssignmentMutation } from "../../services/assignmentApiSlice";

const SafeErrorMessage = ({ name }) => {
  const { errors, touched } = useFormikContext();

  const getError = (path) => {
    const keys = path.split(".");
    let error = errors;
    for (const key of keys) {
      if (error && typeof error === "object") {
        if (Array.isArray(error)) {
          const idx = parseInt(key);
          error = error[idx];
        } else {
          error = error[key];
        }
      } else {
        return undefined;
      }
    }
    return error;
  };

  const error = getError(name);
  const isTouched = touched[name];

  if (!error || !isTouched) return null;

  return (
    <div className="mt-1 text-xs text-red-500">
      {typeof error === "string" ? error : JSON.stringify(error)}
    </div>
  );
};

const AssignmentSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().min(
    10,
    "Description must be at least 10 characters"
  ),
  dueDate: Yup.date().required("Due date is required").nullable(),
  status: Yup.string()
    .oneOf(["draft", "published", "completed"])
    .required("Status is required"),
  questions: Yup.array()
    .of(
      Yup.object({
        question: Yup.string().required("Question text required"),
        answer: Yup.string().required("Correct answer required"),
        marks: Yup.number().min(1).max(10).default(1),
      })
    )
    .min(1, "At least one question required"),
});

export default function AddAssignmentModal({ isOpen, onClose, onSuccess }) {
  const [createAssignment] = useCreateAssignmentMutation();

  const validateForm = (values) => {
    try {
      AssignmentSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      return newErrors;
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        status: "draft",
        questions: values.questions.map((q) => ({
          question: q.question,
          answer: q.answer,
          marks: q.marks || 1,
        })),
      };

      console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

      await createAssignment(payload).unwrap();
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("API ERROR ", err);
      alert(err?.data?.message || "Error adding assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-card p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-4 border-b border-gray-200 pb-3">
                  <Dialog.Title className="text-xl font-semibold text-textPrimary">
                    Add New Assignment
                  </Dialog.Title>
                  <p className="mt-1 text-sm text-textSecondary">
                    Fill in the details below to create a new assignment for
                    your students.
                  </p>
                </div>

                <Formik
                  initialValues={{
                    title: "",
                    description: "",
                    dueDate: "",
                    status: "draft",
                    questions: [{ question: "", answer: "", marks: 1 }],
                  }}
                  validate={validateForm}
                  onSubmit={handleSubmit}
                >
                  {({
                    isSubmitting,
                    values,
                    setFieldValue,
                    setFieldTouched,
                    errors,
                    touched,
                  }) => (
                    <Form className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-textPrimary">
                            Title *
                          </label>
                          <Field
                            name="title"
                            type="text"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="Enter assignment title"
                          />
                          <SafeErrorMessage name="title" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-textPrimary">
                            Status *
                          </label>
                          <Field
                            name="status"
                            as="select"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="completed">Completed</option>
                          </Field>
                          <SafeErrorMessage name="status" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-textPrimary">
                          Description *
                        </label>
                        <Field
                          name="description"
                          as="textarea"
                          rows={3}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          placeholder="Briefly describe the assignment"
                        />
                        <SafeErrorMessage name="description" />
                      </div>

                      <div className="max-w-xs">
                        <label className="block text-sm font-medium text-textPrimary">
                          Due Date *
                        </label>
                        <Field
                          name="dueDate"
                          type="date"
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                        <SafeErrorMessage name="dueDate" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <label className="block text-sm font-medium text-textPrimary">
                              Questions *
                            </label>
                            <p className="text-xs text-textSecondary">
                              Add questions with correct answers for
                              auto-grading.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue("questions", [
                                ...values.questions,
                                { question: "", answer: "", marks: 1 },
                              ])
                            }
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            + Add Question
                          </button>
                        </div>

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                          {values.questions.map((q, idx) => (
                            <div
                              key={idx}
                              className="rounded-md border border-gray-200 bg-gray-50 p-3"
                            >
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <label className="block text-xs font-medium text-textSecondary">
                                      Question {idx + 1} *
                                    </label>
                                    <Field
                                      name={`questions.${idx}.question`}
                                      as="textarea"
                                      rows={2}
                                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
                                      placeholder="Enter question text"
                                    />
                                    <SafeErrorMessage
                                      name={`questions.${idx}.question`}
                                    />
                                  </div>

                                  <div className="flex flex-col items-end gap-2 pt-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-textSecondary">
                                        Marks
                                      </span>
                                      <Field
                                        name={`questions.${idx}.marks`}
                                        type="number"
                                        min="1"
                                        max="10"
                                        className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
                                        placeholder="1"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-textSecondary">
                                    Correct Answer *
                                  </label>
                                  <Field
                                    name={`questions.${idx}.answer`}
                                    type="text"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
                                    placeholder="Enter exact answer (case-sensitive)"
                                  />
                                  <SafeErrorMessage
                                    name={`questions.${idx}.answer`}
                                  />
                                  <p className="mt-1 text-xs text-textSecondary">
                                    Students must match this exactly for full
                                    marks
                                  </p>
                                </div>
                              </div>

                              {values.questions.length > 1 && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newQuestions =
                                        values.questions.filter(
                                          (_, i) => i !== idx
                                        );
                                      setFieldValue("questions", newQuestions);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-600 w-full text-left"
                                  >
                                    Remove Question
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <SafeErrorMessage name="questions" />
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
                        <button
                          type="button"
                          onClick={onClose}
                          disabled={isSubmitting}
                          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/80 transition disabled:opacity-50"
                        >
                          {isSubmitting ? "Adding..." : "Add Assignment"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
